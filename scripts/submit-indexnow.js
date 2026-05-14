#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const ROOT_DIR = process.cwd();
const DEFAULT_KEY = '9c7ac4682a5245b4afbfe2a9cf1b4f85';
const DEFAULT_KEY_FILE = `${DEFAULT_KEY}.txt`;
const INDEXNOW_ENDPOINT = 'https://api.indexnow.org/IndexNow';

function parseArgs(argv) {
  const args = {
    sitemap: 'sitemap.xml',
    keyFile: DEFAULT_KEY_FILE,
    dryRun: false,
    urls: [],
  };

  for (let i = 2; i < argv.length; i += 1) {
    const token = argv[i];

    if (token === '--sitemap' && argv[i + 1]) {
      args.sitemap = argv[i + 1];
      i += 1;
      continue;
    }

    if (token === '--key-file' && argv[i + 1]) {
      args.keyFile = argv[i + 1];
      i += 1;
      continue;
    }

    if (token === '--url' && argv[i + 1]) {
      args.urls.push(argv[i + 1]);
      i += 1;
      continue;
    }

    if (token === '--dry-run') {
      args.dryRun = true;
      continue;
    }

    throw new Error(`Unknown argument: ${token}`);
  }

  return args;
}

function parseSitemapUrls(xmlPath) {
  const xml = fs.readFileSync(xmlPath, 'utf8');
  const matches = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)];
  return matches.map((m) => m[1].trim()).filter(Boolean);
}

function getKey(keyFilePath) {
  const absolute = path.join(ROOT_DIR, keyFilePath);
  if (!fs.existsSync(absolute)) {
    throw new Error(`Key file not found: ${keyFilePath}`);
  }
  const key = fs.readFileSync(absolute, 'utf8').trim();
  if (!key) {
    throw new Error(`Key file is empty: ${keyFilePath}`);
  }
  return key;
}

function validateHost(urls) {
  if (!urls.length) {
    throw new Error('No URLs to submit.');
  }

  const hosts = new Set(urls.map((url) => new URL(url).host));
  if (hosts.size !== 1) {
    throw new Error(`All URLs must share one host. Found: ${[...hosts].join(', ')}`);
  }

  return [...hosts][0];
}

async function submitIndexNow(payload) {
  const response = await fetch(INDEXNOW_ENDPOINT, {
    method: 'POST',
    headers: {
      'content-type': 'application/json; charset=utf-8',
    },
    body: JSON.stringify(payload),
  });

  return {
    status: response.status,
    body: await response.text(),
  };
}

async function main() {
  const args = parseArgs(process.argv);

  const urls = args.urls.length
    ? args.urls
    : parseSitemapUrls(path.join(ROOT_DIR, args.sitemap));

  const uniqueUrls = [...new Set(urls)];
  const host = validateHost(uniqueUrls);
  const key = getKey(args.keyFile);
  const keyLocation = `https://${host}/${path.basename(args.keyFile)}`;

  const payload = {
    host,
    key,
    keyLocation,
    urlList: uniqueUrls,
  };

  console.log(`IndexNow endpoint: ${INDEXNOW_ENDPOINT}`);
  console.log(`Host: ${host}`);
  console.log(`URLs: ${uniqueUrls.length}`);
  console.log(`Key file: ${args.keyFile}`);
  console.log(`Key location: ${keyLocation}`);

  if (args.dryRun) {
    console.log('\nDry run enabled. Payload preview:');
    console.log(JSON.stringify(payload, null, 2));
    return;
  }

  const result = await submitIndexNow(payload);
  console.log(`\nResponse status: ${result.status}`);
  if (result.body) {
    console.log(`Response body: ${result.body}`);
  }

  if (result.status !== 200) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(`IndexNow submit failed: ${error.message}`);
  process.exitCode = 1;
});
