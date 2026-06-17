#!/usr/bin/env python3
import argparse
import csv
import html
import json
import re
import socket
import ssl
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.parse import urljoin, urlparse
from urllib.request import Request, urlopen


NABCEP_REFRESH_URL = "https://directories.nabcep.org/wp-json/facetwp/v1/refresh"
NABCEP_REFERER = "https://directories.nabcep.org/"
USER_AGENT = (
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
    "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125 Safari/537.36"
)
PV_CERT_RE = re.compile(r"\bPV(?:IP|A|IS|DS|CMS|SI)?\b|Photovoltaic", re.I)
EMAIL_RE = re.compile(r"\b[A-Z0-9._%+\-]+@[A-Z0-9.\-]+\.[A-Z]{2,}\b", re.I)
BAD_EMAIL_PARTS = (
    "example.",
    "domain.",
    "email.com",
    "sentry.io",
    "wixpress.com",
    "wordpress.org",
    "schema.org",
)
CONTACT_PATHS = ("", "/contact", "/contact-us", "/about", "/about-us", "/team")


def fetch(url, data=None, timeout=30, attempts=4):
    headers = {"User-Agent": USER_AGENT, "Accept": "text/html,application/json;q=0.9,*/*;q=0.8"}
    if data is not None:
        data = json.dumps(data).encode("utf-8")
        headers["Content-Type"] = "application/json"
        headers["Referer"] = NABCEP_REFERER
    last_error = None
    for attempt in range(1, attempts + 1):
        req = Request(url, data=data, headers=headers)
        try:
            with urlopen(req, timeout=timeout, context=ssl.create_default_context()) as response:
                raw = response.read()
                ctype = response.headers.get("content-type", "")
                return raw, ctype, response.geturl()
        except (HTTPError, URLError, TimeoutError, socket.timeout, ssl.SSLError) as error:
            last_error = error
            if isinstance(error, HTTPError) and error.code not in {408, 425, 429, 500, 502, 503, 504}:
                raise
            if attempt < attempts:
                time.sleep(1.5 * attempt)
    raise last_error


def normalize_website(raw):
    raw = html.unescape((raw or "").strip())
    if not raw or raw == "//":
        return ""
    if raw.startswith("//"):
        raw = "https:" + raw
    if not re.match(r"^https?://", raw, re.I):
        raw = "https://" + raw
    parsed = urlparse(raw)
    if not parsed.netloc:
        return ""
    return f"{parsed.scheme}://{parsed.netloc}{parsed.path}".rstrip("/")


def clean_text(value):
    value = re.sub(r"<[^>]+>", " ", value or "")
    return re.sub(r"\s+", " ", html.unescape(value)).strip()


def nabcep_payload(page):
    return {
        "action": "facetwp_refresh",
        "data": {
            "facets": {
                "certtypes": [],
                "countries": ["usa"],
                "states": [],
                "certification_types": [],
                "searcher": "",
                "location": "",
            },
            "frozen_facets": {},
            "http_params": {"get": [], "uri": "", "url_vars": []},
            "template": "directories",
            "extras": {},
            "soft_refresh": 0,
            "is_bfcache": 1,
            "first_load": 0,
            "paged": page,
        },
    }


def parse_cards(template_html):
    cards = re.findall(r'<div class="card directory-card.*?</div>\s*</div>\s*</div>\s*</div>', template_html, re.S)
    rows = []
    for card in cards:
        name_match = re.search(r'directory-card__name">(.*?)</h5>', card, re.S)
        certs = re.findall(r'<h5 class="mb-0">(.*?)</h5>', card, re.S)
        info_match = re.search(r'<div class="directory-card__info">(.*?)</div>', card, re.S)
        if not info_match:
            continue
        info = info_match.group(1)
        p_values = re.findall(r'<p class="card-text">(.*?)</p>', info, re.S)
        company = clean_text(p_values[0]) if p_values else ""
        website = ""
        if len(p_values) > 1:
            href = re.search(r'href="([^"]+)"', p_values[1])
            website = normalize_website(href.group(1) if href else clean_text(p_values[1]))
        country = ""
        location = ""
        for p in p_values:
            text = clean_text(p)
            if text.startswith("Country:"):
                country = text.replace("Country:", "", 1).strip()
            elif text.startswith("Location:"):
                location = text.replace("Location:", "", 1).strip()
        cert_text = "; ".join(clean_text(c) for c in certs)
        if company and website and PV_CERT_RE.search(cert_text):
            rows.append(
                {
                    "person": clean_text(name_match.group(1)) if name_match else "",
                    "company_name": company,
                    "website": website,
                    "country": country,
                    "location": location,
                    "certifications": cert_text,
                }
            )
    return rows


def fetch_nabcep_page(page, cache_dir):
    cache_dir.mkdir(parents=True, exist_ok=True)
    cache_path = cache_dir / f"nabcep-page-{page:04d}.json"
    if cache_path.exists() and cache_path.stat().st_size > 100:
        return json.loads(cache_path.read_text(encoding="utf-8"))
    raw, _, _ = fetch(NABCEP_REFRESH_URL, nabcep_payload(page), timeout=45)
    cache_path.write_bytes(raw)
    return json.loads(raw)


def fetch_nabcep_records(cache_dir, max_pages=None, sleep_seconds=0.15):
    first = fetch_nabcep_page(1, cache_dir)
    pager = first.get("settings", {}).get("pager", {})
    total_pages = int(pager.get("total_pages") or 1)
    if max_pages:
        total_pages = min(total_pages, max_pages)
    records = parse_cards(first.get("template", ""))
    for page in range(2, total_pages + 1):
        if sleep_seconds:
            time.sleep(sleep_seconds)
        obj = fetch_nabcep_page(page, cache_dir)
        records.extend(parse_cards(obj.get("template", "")))
        if page % 25 == 0:
            print(f"nabcep_pages={page}/{total_pages} records={len(records)}", flush=True)
    return records


def dedupe_companies(records):
    companies = {}
    for row in records:
        parsed = urlparse(row["website"])
        domain = parsed.netloc.lower().removeprefix("www.")
        key = (re.sub(r"[^a-z0-9]+", "", row["company_name"].lower()), domain)
        current = companies.setdefault(
            key,
            {
                "company_name": row["company_name"],
                "country": "USA",
                "website": row["website"],
                "nabcep_people": set(),
                "nabcep_certifications": set(),
                "nabcep_locations": set(),
                "verification_sources": {NABCEP_REFERER},
            },
        )
        current["nabcep_people"].add(row["person"])
        current["nabcep_certifications"].add(row["certifications"])
        current["nabcep_locations"].add(row["location"])
    return list(companies.values())


def decode_obfuscated(text):
    text = re.sub(r"\s*\[at\]\s*|\s*\(at\)\s*", "@", text, flags=re.I)
    text = re.sub(r"\s*\[dot\]\s*|\s*\(dot\)\s*", ".", text, flags=re.I)
    return html.unescape(text)


def extract_contacts(page_url, body):
    body = decode_obfuscated(body)
    emails = {
        e.strip(".,;:()[]{}<>").lower()
        for e in EMAIL_RE.findall(body)
        if not any(bad in e.lower() for bad in BAD_EMAIL_PARTS)
    }
    linkedin = ""
    for match in re.finditer(r"https?://(?:www\.)?linkedin\.com/(?:company|school)/[^\"'<>\\\s?#]+", body, re.I):
        linkedin = match.group(0).rstrip("/")
        break
    return sorted(emails), linkedin


def crawl_company(company):
    base = company["website"]
    parsed = urlparse(base)
    if not parsed.netloc:
        return company
    urls = []
    for path in CONTACT_PATHS:
        urls.append(urljoin(f"{parsed.scheme}://{parsed.netloc}", path))
    seen = set()
    emails = []
    linkedin = ""
    email_source = ""
    linkedin_source = ""
    verified = False
    for url in urls:
        if url in seen:
            continue
        seen.add(url)
        try:
            raw, ctype, final_url = fetch(url, timeout=6, attempts=1)
        except (HTTPError, URLError, TimeoutError, socket.timeout, ssl.SSLError, ValueError):
            continue
        if "text/html" not in ctype and ctype:
            continue
        try:
            body = raw.decode("utf-8", errors="ignore")
        except Exception:
            continue
        verified = True
        page_emails, page_linkedin = extract_contacts(final_url, body)
        if page_emails and not emails:
            emails = page_emails
            email_source = final_url
        if page_linkedin and not linkedin:
            linkedin = page_linkedin
            linkedin_source = final_url
        if emails and linkedin:
            break
    company["website_verified"] = "yes" if verified else "no"
    company["public_email"] = ";".join(emails[:3])
    company["email_source_url"] = email_source
    company["linkedin_url"] = linkedin
    company["linkedin_source_url"] = linkedin_source
    company["notes"] = "" if verified else "website not reachable during crawl"
    return company


def stringify_sets(company):
    out = {}
    for key, value in company.items():
        if isinstance(value, set):
            out[key] = "; ".join(sorted(v for v in value if v))
        else:
            out[key] = value
    out["verification_sources"] = "; ".join(sorted(company["verification_sources"]))
    return out


def write_outputs(companies, out_dir):
    out_dir.mkdir(parents=True, exist_ok=True)
    csv_path = out_dir / "usa.csv"
    evidence_path = out_dir / "usa-evidence.jsonl"
    fields = [
        "company_name",
        "country",
        "website",
        "public_email",
        "linkedin_url",
        "website_verified",
        "email_source_url",
        "linkedin_source_url",
        "nabcep_people",
        "nabcep_certifications",
        "nabcep_locations",
        "verification_sources",
        "notes",
    ]
    rows = [stringify_sets(c) for c in companies]
    rows.sort(key=lambda r: (not bool(r.get("public_email")), not bool(r.get("linkedin_url")), r["company_name"].lower()))
    with csv_path.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=fields)
        writer.writeheader()
        for row in rows:
            writer.writerow({field: row.get(field, "") for field in fields})
    with evidence_path.open("w", encoding="utf-8") as handle:
        for row in rows:
            handle.write(json.dumps(row, ensure_ascii=False) + "\n")
    return csv_path, evidence_path, rows


def existing_crawled(out_dir):
    path = out_dir / "usa-evidence.jsonl"
    if not path.exists():
        return {}
    crawled = {}
    with path.open(encoding="utf-8") as handle:
        for line in handle:
            if not line.strip():
                continue
            row = json.loads(line)
            key = (row.get("company_name", "").lower(), urlparse(row.get("website", "")).netloc.lower())
            crawled[key] = row
    return crawled


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--out-dir", default=str(Path.home() / "Desktop" / "solar panel companies"))
    parser.add_argument("--max-pages", type=int)
    parser.add_argument("--crawl-workers", type=int, default=12)
    parser.add_argument("--limit-companies", type=int)
    args = parser.parse_args()

    print("Fetching NABCEP USA PV records...", flush=True)
    out_dir = Path(args.out_dir)
    records = fetch_nabcep_records(out_dir / "source-cache", max_pages=args.max_pages)
    companies = dedupe_companies(records)
    if args.limit_companies:
        companies = companies[: args.limit_companies]
    print(f"nabcep_records={len(records)} unique_companies={len(companies)}", flush=True)

    prior = existing_crawled(out_dir)
    pending = []
    crawled = []
    for company in companies:
        key = (company.get("company_name", "").lower(), urlparse(company.get("website", "")).netloc.lower())
        if key in prior and prior[key].get("website_verified"):
            restored = dict(company)
            restored.update(
                {
                    "website_verified": prior[key].get("website_verified", ""),
                    "public_email": prior[key].get("public_email", ""),
                    "email_source_url": prior[key].get("email_source_url", ""),
                    "linkedin_url": prior[key].get("linkedin_url", ""),
                    "linkedin_source_url": prior[key].get("linkedin_source_url", ""),
                    "notes": prior[key].get("notes", ""),
                }
            )
            crawled.append(restored)
        else:
            pending.append(company)
    if crawled:
        print(f"resumed_crawled={len(crawled)} pending={len(pending)}", flush=True)

    with ThreadPoolExecutor(max_workers=args.crawl_workers) as executor:
        futures = {executor.submit(crawl_company, company): company for company in pending}
        for index, future in enumerate(as_completed(futures), 1):
            crawled.append(future.result())
            if index % 50 == 0:
                with_email = sum(1 for c in crawled if c.get("public_email"))
                with_linkedin = sum(1 for c in crawled if c.get("linkedin_url"))
                write_outputs(crawled, out_dir)
                print(f"crawled={len(crawled)}/{len(companies)} email={with_email} linkedin={with_linkedin}", flush=True)

    csv_path, evidence_path, rows = write_outputs(crawled, out_dir)
    complete = sum(1 for r in rows if r.get("public_email") and r.get("linkedin_url"))
    print(f"wrote={csv_path}")
    print(f"evidence={evidence_path}")
    print(f"rows={len(rows)} complete_email_and_linkedin={complete}")


if __name__ == "__main__":
    main()
