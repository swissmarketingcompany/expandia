/**
 * Local utility: Generate blog images via fal.ai FLUX
 *
 * This script is intentionally:
 * - Safe to run locally only (uses your own FAL_KEY from .env)
 * - Driven by a separate JSON config (fal-image-jobs.local.json) that is in .gitignore
 * - Non-destructive: it only writes image files to disk
 *
 * USAGE (local only, NOT in CI):
 * 1. Install deps (once):  npm install @fal-ai/client
 * 2. Create a .env file (already gitignored) with:
 *      FAL_KEY=YOUR_FAL_API_KEY
 * 3. Create / edit fal-image-jobs.local.json (also gitignored) with jobs, e.g.:
 *      [
 *        {
 *          "id": "sales-leadership-team-development-hero",
 *          "prompt": "Minimalist B2B illustration of a sales leadership team in a modern Swiss office, bright colors, no text, flat style",
 *          "aspect_ratio": "16:9",
 *          "outputPath": "src/assets/blog/sales-leadership-team-development-hero.png"
 *        }
 *      ]
 * 4. Run:  node scripts/generate-blog-images-fal.js
 *
 * NOTE FOR AI AGENTS:
 * - Never hardcode API keys.
 * - Never commit generated images or the config file unless the user explicitly asks.
 * - After images are generated, you can update the relevant blog HTML files to reference them.
 */

const fs = require('fs');
const path = require('path');
require('dotenv').config();
const { fal } = require('@fal-ai/client');

const FAL_KEY = process.env.FAL_KEY || process.env.FAL_API_KEY || '';

if (!FAL_KEY) {
    console.error('❌ FAL_KEY (or FAL_API_KEY) is not set in your environment (.env). Aborting.');
    process.exit(1);
}

fal.config({
    credentials: FAL_KEY,
});

const ROOT_DIR = process.cwd();
const JOBS_FILE = path.join(ROOT_DIR, 'fal-image-jobs.local.json');

function loadJobs() {
    if (!fs.existsSync(JOBS_FILE)) {
        console.error(`⚠️  No jobs file found at ${JOBS_FILE}`);
        console.error('    Create it with an array of jobs. See scripts/generate-blog-images-fal.js header for an example.');
        return [];
    }
    try {
        const raw = fs.readFileSync(JOBS_FILE, 'utf8');
        const jobs = JSON.parse(raw);
        if (!Array.isArray(jobs)) throw new Error('Jobs file must contain an array');
        return jobs;
    } catch (err) {
        console.error('❌ Failed to read/parse fal-image-jobs.local.json:', err.message);
        return [];
    }
}

async function generateImage(job) {
    const {
        id,
        prompt,
        aspect_ratio = '16:9',
        outputPath,
        // default to Flux 2 as requested; override per-job via `model` if needed
        model = 'fal-ai/flux-2'
    } = job;

    if (!prompt || !outputPath) {
        console.warn(`⚠️  Skipping job "${id || '(no id)'}" – missing prompt or outputPath`);
        return;
    }

    console.log(`\n🎨 Generating image for job "${id || outputPath}"`);
    console.log(`   Model: ${model}`);
    console.log(`   Prompt: ${prompt}`);

    try {
        const result = await fal.subscribe(model, {
            input: {
                prompt,
                aspect_ratio,
            },
        });

        // FLUX models on fal typically return: { data: { images: [{ url, width, height, ... }] }, ... }
        // Fall back to a few alternative shapes just in case.
        const imageUrl =
            (result?.data?.images && result.data.images[0]?.url) ||
            (result?.images && result.images[0]?.url) ||
            (Array.isArray(result?.data) && result.data[0]?.url) ||
            result?.image?.url ||
            null;

        if (!imageUrl) {
            console.error('❌ Could not find image URL in fal result. Full result:');
            console.dir(result, { depth: null });
            return;
        }

        console.log(`   ✅ Image URL: ${imageUrl}`);
        await downloadImage(imageUrl, path.join(ROOT_DIR, outputPath));
        console.log(`   💾 Saved to: ${outputPath}`);
    } catch (err) {
        console.error(`❌ Error generating image for job "${id || outputPath}":`, err.message);
    }
}

async function downloadImage(url, destPath) {
    const https = require('https');

    await new Promise((resolve, reject) => {
        const dir = path.dirname(destPath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        const file = fs.createWriteStream(destPath);
        https
            .get(url, (res) => {
                if (res.statusCode !== 200) {
                    reject(new Error(`HTTP ${res.statusCode} when downloading image`));
                    return;
                }
                res.pipe(file);
                file.on('finish', () => {
                    file.close(resolve);
                });
            })
            .on('error', (err) => {
                fs.unlink(destPath, () => reject(err));
            });
    });
}

async function main() {
    const jobs = loadJobs();
    if (!jobs.length) {
        console.log('ℹ️  No image jobs defined. Nothing to do.');
        return;
    }

    console.log(`🧾 Loaded ${jobs.length} image job(s) from fal-image-jobs.local.json`);

    for (const job of jobs) {
        // Run jobs sequentially to keep it simple and avoid rate surprises
        // For heavy usage, consider parallel with a small concurrency limit.
        // Always respect your fal.ai rate limits and cost considerations.
        /* eslint-disable no-await-in-loop */
        await generateImage(job);
        /* eslint-enable no-await-in-loop */
    }

    console.log('\n✅ All image jobs processed.');
}

if (require.main === module) {
    main().catch((err) => {
        console.error('❌ Unexpected error in generate-blog-images-fal.js:', err);
        process.exit(1);
    });
}


