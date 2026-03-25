#!/usr/bin/env python3
import argparse
import concurrent.futures
import json
import re
import time
from pathlib import Path
from typing import Dict, List, Set

import requests
from bs4 import BeautifulSoup, NavigableString


FRENCH_STOPWORDS: Set[str] = {
    "le",
    "la",
    "les",
    "de",
    "des",
    "du",
    "et",
    "en",
    "pour",
    "avec",
    "dans",
    "sur",
    "une",
    "un",
    "est",
    "plus",
    "vous",
    "nous",
    "notre",
    "votre",
    "vos",
    "ces",
    "cette",
    "ce",
    "aux",
    "au",
    "par",
    "qui",
    "que",
    "sans",
    "entre",
    "comme",
    "tout",
    "tous",
    "chaque",
    "mais",
    "donc",
    "car",
    "ainsi",
    "afin",
    "depuis",
    "aujourd'hui",
    "votre",
    "notre",
    "leurs",
    "être",
    "été",
    "fait",
    "faire",
    "dans",
    "chez",
    "avant",
    "après",
}

ENGLISH_MARKERS: Set[str] = {
    "book",
    "call",
    "read",
    "more",
    "learn",
    "home",
    "blog",
    "contact",
    "services",
    "solutions",
    "privacy",
    "policy",
    "terms",
    "cookie",
}

NON_TRANSLATABLE_PARENTS: Set[str] = {
    "script",
    "style",
    "code",
    "pre",
    "svg",
    "noscript",
}

TRANSLATABLE_ATTRS: Set[str] = {
    "title",
    "alt",
    "placeholder",
    "aria-label",
}


def load_cache(path: Path) -> Dict[str, str]:
    if not path.exists():
        return {}
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except Exception:
        return {}


def save_cache(path: Path, cache: Dict[str, str]) -> None:
    path.write_text(
        json.dumps(cache, ensure_ascii=False, indent=2, sort_keys=True),
        encoding="utf-8",
    )


def has_letters(text: str) -> bool:
    return bool(re.search(r"[A-Za-zÀ-ÖØ-öø-ÿ]", text))


def looks_like_path_or_url(text: str) -> bool:
    value = text.strip().lower()
    if not value:
        return True
    if value.startswith(("http://", "https://", "mailto:", "tel:", "/", "./", "../", "#")):
        return True
    if re.search(r"\.(html|css|js|png|jpg|jpeg|svg|webp|gif|ico)([#?].*)?$", value):
        return True
    if "{{" in value or "}}" in value or "${" in value:
        return True
    return False


def likely_french(text: str) -> bool:
    words = re.findall(r"[A-Za-zÀ-ÖØ-öø-ÿ'-]+", text.lower())
    if not words:
        return True
    accents = bool(re.search(r"[àâçéèêëîïôûùüÿœæ]", text.lower()))
    if not accents and any(w in ENGLISH_MARKERS for w in words):
        return False
    hits = sum(1 for w in words if w in FRENCH_STOPWORDS)
    ratio = hits / max(len(words), 1)
    return accents or (hits >= 2 and ratio >= 0.2)


def is_translatable(text: str) -> bool:
    stripped = text.strip()
    if not stripped:
        return False
    if not has_letters(stripped):
        return False
    if looks_like_path_or_url(stripped):
        return False
    if re.fullmatch(r"[A-Z]{2,6}", stripped):
        return False
    return True


def extract_segments(soup: BeautifulSoup) -> Set[str]:
    segments: Set[str] = set()

    for node in soup.find_all(string=True):
        if not isinstance(node, NavigableString):
            continue
        parent = node.parent.name.lower() if node.parent and node.parent.name else ""
        if parent in NON_TRANSLATABLE_PARENTS:
            continue
        text = str(node)
        if is_translatable(text) and not likely_french(text):
            segments.add(text.strip())

    for tag in soup.find_all(True):
        for attr in TRANSLATABLE_ATTRS:
            if attr not in tag.attrs:
                continue
            value = tag.attrs.get(attr)
            if not isinstance(value, str):
                continue
            if is_translatable(value) and not likely_french(value):
                segments.add(value.strip())
        if tag.name == "meta":
            name = (tag.attrs.get("name") or "").lower()
            prop = (tag.attrs.get("property") or "").lower()
            if name in {"description"} or prop in {"og:description", "twitter:description"}:
                content = tag.attrs.get("content")
                if isinstance(content, str) and is_translatable(content) and not likely_french(content):
                    segments.add(content.strip())

    return segments


def translate_text_google(text: str, retries: int = 4) -> str:
    params = [
        ("client", "gtx"),
        ("sl", "auto"),
        ("tl", "fr"),
        ("dt", "t"),
        ("q", text),
    ]
    for attempt in range(retries):
        try:
            response = requests.get(
                "https://translate.googleapis.com/translate_a/single",
                params=params,
                timeout=20,
            )
            response.raise_for_status()
            payload = response.json()
            translated = "".join(part[0] for part in payload[0] if part and part[0])
            return translated if translated.strip() else text
        except Exception:
            if attempt == retries - 1:
                return text
            time.sleep(0.5 * (2 ** attempt))
    return text


def batch_translate_parallel(
    pending: List[str],
    cache: Dict[str, str],
    cache_path: Path,
    max_workers: int = 12,
) -> None:
    total = len(pending)
    done = 0
    save_every = 200

    with concurrent.futures.ThreadPoolExecutor(max_workers=max_workers) as executor:
        future_to_src = {
            executor.submit(translate_text_google, src): src for src in pending
        }
        for future in concurrent.futures.as_completed(future_to_src):
            src = future_to_src[future]
            try:
                dst = future.result()
            except Exception:
                dst = src
            cache[src] = dst if isinstance(dst, str) and dst.strip() else src
            done += 1
            if done // save_every > (done - 1) // save_every:
                save_cache(cache_path, cache)
            if done % 100 == 0 or done == total:
                print(f"TRANSLATED {done}/{total}", flush=True)


def replace_text(text: str, cache: Dict[str, str]) -> str:
    leading = re.match(r"^\s*", text).group(0)
    trailing = re.search(r"\s*$", text).group(0)
    core = text.strip()
    if not core:
        return text
    return f"{leading}{cache.get(core, core)}{trailing}"


def apply_translations(soup: BeautifulSoup, cache: Dict[str, str]) -> int:
    changes = 0

    for node in soup.find_all(string=True):
        if not isinstance(node, NavigableString):
            continue
        parent = node.parent.name.lower() if node.parent and node.parent.name else ""
        if parent in NON_TRANSLATABLE_PARENTS:
            continue
        current = str(node)
        if is_translatable(current):
            core = current.strip()
            if core in cache:
                updated = replace_text(current, cache)
                if updated != current:
                    node.replace_with(updated)
                    changes += 1

    for tag in soup.find_all(True):
        for attr in TRANSLATABLE_ATTRS:
            if attr not in tag.attrs:
                continue
            value = tag.attrs.get(attr)
            if not isinstance(value, str):
                continue
            core = value.strip()
            if core in cache:
                updated = cache[core]
                if updated != value:
                    tag.attrs[attr] = updated
                    changes += 1

        if tag.name == "meta":
            name = (tag.attrs.get("name") or "").lower()
            prop = (tag.attrs.get("property") or "").lower()
            if name in {"description"} or prop in {"og:description", "twitter:description"}:
                content = tag.attrs.get("content")
                if isinstance(content, str):
                    core = content.strip()
                    if core in cache and cache[core] != content:
                        tag.attrs["content"] = cache[core]
                        changes += 1

    return changes


def get_target_files(root: Path) -> List[Path]:
    return sorted(root.rglob("*.html"))


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--root", default="fr", help="Root folder to translate")
    parser.add_argument(
        "--cache",
        default=".fr_translation_cache.json",
        help="JSON cache file",
    )
    parser.add_argument(
        "--workers",
        type=int,
        default=36,
        help="Parallel translation workers",
    )
    args = parser.parse_args()

    root = Path(args.root)
    cache_path = Path(args.cache)
    files = get_target_files(root)
    cache = load_cache(cache_path)
    all_segments: Set[str] = set()
    soups: Dict[Path, BeautifulSoup] = {}

    for file_path in files:
        html = file_path.read_text(encoding="utf-8", errors="ignore")
        soup = BeautifulSoup(html, "lxml")
        soups[file_path] = soup
        all_segments.update(extract_segments(soup))

    pending = sorted(
        [
            segment
            for segment in all_segments
            if segment not in cache
            or (cache.get(segment, "") == segment and not likely_french(segment))
        ]
    )
    print(f"FILES_TO_PROCESS={len(files)}", flush=True)
    print(f"UNIQUE_SEGMENTS={len(all_segments)}", flush=True)
    print(f"PENDING_SEGMENTS={len(pending)}", flush=True)
    if pending:
        batch_translate_parallel(
            pending,
            cache,
            cache_path,
            max_workers=args.workers,
        )
        save_cache(cache_path, cache)

    total_changes = 0
    changed_files = 0
    for file_path, soup in soups.items():
        changes = apply_translations(soup, cache)
        if changes > 0:
            file_path.write_text(str(soup), encoding="utf-8")
            changed_files += 1
            total_changes += changes

    save_cache(cache_path, cache)
    print(f"FILES={len(files)}")
    print(f"CHANGED_FILES={changed_files}")
    print(f"TEXT_REPLACEMENTS={total_changes}")
    print(f"CACHE_SIZE={len(cache)}")


if __name__ == "__main__":
    main()
