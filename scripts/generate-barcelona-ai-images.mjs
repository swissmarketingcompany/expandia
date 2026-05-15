import fs from 'node:fs';
import path from 'node:path';
import { GoogleGenAI } from '@google/genai';

function loadLocalEnv() {
  for (const fileName of ['.env.local', '.env']) {
    const filePath = path.join(process.cwd(), fileName);
    if (!fs.existsSync(filePath)) continue;

    const lines = fs.readFileSync(filePath, 'utf8').split(/\r?\n/);
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const match = trimmed.match(/^([A-Z0-9_]+)\s*=\s*(.*)$/);
      if (!match) continue;
      const [, key, rawValue] = match;
      if (process.env[key]) continue;
      process.env[key] = rawValue.replace(/^['"]|['"]$/g, '');
    }
  }
}

loadLocalEnv();

const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || process.env.GOOGLE_GENAI_API_KEY;
const model = 'gemini-3.1-flash-image-preview';

if (!apiKey) {
  console.error('Missing GEMINI_API_KEY, GOOGLE_API_KEY, or GOOGLE_GENAI_API_KEY.');
  console.error('Set one locally, then run: npm run generate:barcelona-ai-images');
  process.exit(1);
}

const outputDir = path.join(process.cwd(), 'assets/images');
const ai = new GoogleGenAI({ apiKey });

const jobs = [
  {
    file: 'barcelona-ai-workflow-map.png',
    prompt: [
      'Create a new premium realistic website figure for a Barcelona AI services landing page.',
      'Scene: a clean enterprise workflow map on a large monitor in a modern Barcelona office, with subtle daylight, warm stone textures, and a faint city skyline outside the window.',
      'The interface should imply multilingual customer support, CRM, documents, human approval, and analytics using clean cards and simple icons, but no readable text, no logos, and no fake brand names.',
      'Style: serious B2B SaaS editorial realism, restrained design, white UI panels, subtle Go Expandia red accent #cb102c, professional and not futuristic.',
      'Composition: 16:9, dashboard fills most of the image, enough breathing room for a web article figure.',
      'Avoid: robots, neon cyberpunk, cartoons, fake readable words, watermarks, stock-photo handshake, clutter.',
    ].join(' '),
  },
  {
    file: 'barcelona-ai-team-workshop.png',
    prompt: [
      'Create a new premium photorealistic website image for an AI consulting workshop in Barcelona.',
      'Scene: diverse small business team reviewing an AI implementation roadmap on a glass wall and laptop screens in a bright Barcelona meeting room.',
      'Include subtle Barcelona context through architecture, Mediterranean light, and muted city colors, without using landmarks as the main subject.',
      'The screens show abstract workflow blocks, risk checks, language coverage, and rollout stages, but no readable text, no logos, and no fake brand names.',
      'Style: high-end B2B agency editorial photography, natural daylight, tasteful red #cb102c accents, realistic people and materials.',
      'Composition: 16:9, team on one side, clean workspace and roadmap visible, polished but not staged.',
      'Avoid: cheesy stock photo mood, sci-fi robots, exaggerated holograms, garbled text, watermark.',
    ].join(' '),
  },
  {
    file: 'barcelona-ai-agent-approval.png',
    prompt: [
      'Create a new realistic enterprise software image for a Barcelona AI agent approval workflow.',
      'Scene: close-up of a high-quality operations dashboard showing an AI task queue, source cards, confidence indicators, audit trail, and human approval states.',
      'Use subtle Barcelona office background cues and Mediterranean daylight, but keep the dashboard as the subject.',
      'No readable text, no logos, no fake brand names. The interface should communicate safe AI agent development for business teams.',
      'Style: realistic product photography, refined SaaS UI, white and slate panels, red #cb102c accent, restrained professional look.',
      'Composition: 16:9, monitor/dashboard fills most of the frame with shallow depth of field.',
      'Avoid: robot faces, neon blue cyberpunk, flat vector illustration, clutter, watermark.',
    ].join(' '),
  },
  {
    file: 'barcelona-ai-roi-dashboard.png',
    prompt: [
      'Create a new premium business analytics image for a Barcelona AI automation ROI section.',
      'Scene: executive dashboard on a laptop and large wall display showing abstract charts for time saved, faster response, exception reduction, and rollout progress.',
      'Include subtle Barcelona business environment details, warm daylight, modern meeting table, and clean consulting materials.',
      'Use minimal non-readable UI labels only; no fake readable words, no logos, no brand marks.',
      'Style: realistic B2B consulting editorial image, polished but calm, red #cb102c accents, warm neutral office palette.',
      'Composition: 16:9, dashboard clearly visible, suitable for a landing page mid-article figure.',
      'Avoid: fake numbers as the main focus, neon effects, robots, cartoon style, watermark.',
    ].join(' '),
  },
];

async function generateImage(job) {
  const response = await ai.models.generateContent({
    model,
    contents: job.prompt,
    config: {
      responseModalities: ['Image'],
      imageConfig: {
        aspectRatio: '16:9',
        imageSize: '2K',
        imageOutputOptions: {
          mimeType: 'image/png',
        },
      },
    },
  });

  const parts = response?.candidates?.[0]?.content?.parts || response?.parts || [];
  const imagePart = parts.find((part) => part.inlineData?.data || part.inline_data?.data);

  if (!imagePart) {
    throw new Error(`${job.file}: no image data returned. Response parts: ${JSON.stringify(parts)}`);
  }

  const inlineData = imagePart.inlineData || imagePart.inline_data;
  const buffer = Buffer.from(inlineData.data, 'base64');
  const outputPath = path.join(outputDir, job.file);
  fs.writeFileSync(outputPath, buffer);
  console.log(`Wrote ${outputPath}`);
}

for (const job of jobs) {
  await generateImage(job);
}
