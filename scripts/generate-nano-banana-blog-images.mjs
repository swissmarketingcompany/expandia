import fs from 'node:fs';
import path from 'node:path';
import { GoogleGenAI } from '@google/genai';

const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
const model = 'gemini-3.1-flash-image-preview';

if (!apiKey) {
  console.error('Missing GEMINI_API_KEY or GOOGLE_API_KEY.');
  process.exit(1);
}

const outputDir = path.join(process.cwd(), 'assets/images');
const ai = new GoogleGenAI({ apiKey });

const jobs = [
  {
    file: 'ai-automation-agency-near-me-hero.png',
    prompt: [
      'Create a premium photorealistic website hero image for an AI automation agency blog post.',
      'Scene: a modern business workshop room with a diverse small team reviewing an AI workflow automation plan on a large glass display.',
      'The display shows clean abstract UI blocks for CRM, email, documents, approvals, and analytics, but no readable text, no fake brand names, no logos.',
      'Style: high-end B2B agency editorial photography, realistic lighting, crisp details, subtle Go Expandia red accents (#cb102c), warm neutral background.',
      'Composition: 16:9, wide hero, left side has mild negative space, right side shows the team and large workflow screen.',
      'Avoid: sci-fi robots, neon cyberpunk, stock-photo cheesiness, garbled text, watermarks, SVG/vector look, cartoon style.',
    ].join(' '),
  },
  {
    file: 'ai-automation-workflow-map.png',
    prompt: [
      'Create a premium photorealistic/realistic UI workspace image for an AI automation agency blog post.',
      'Scene: an elegant operations dashboard on a large monitor showing a workflow from incoming lead/document to AI processing, human approval, and system update.',
      'Use clean interface cards, arrows, charts, and status indicators, but no readable text and no brand logos.',
      'Style: serious enterprise SaaS design, red accent color #cb102c, white panels, subtle shadows, warm office environment.',
      'Composition: 16:9, the dashboard is the main subject, straight-on slight perspective, crisp enough for a web article figure.',
      'Avoid: SVG/vector flat illustration, busy clutter, unreadable fake words, people as main subject, robots, neon.',
    ].join(' '),
  },
  {
    file: 'ai-agent-human-approval.png',
    prompt: [
      'Create a realistic premium image for an AI agent development and human approval workflow.',
      'Scene: close-up of a sleek business operations command center screen with an AI task queue, approval states, audit indicators, and source cards.',
      'The UI should imply human-in-the-loop approval and safe automation, but avoid readable text and avoid fake logos.',
      'Style: enterprise software product photography, realistic monitor glow, white and warm neutral UI, red #cb102c accent, polished but restrained.',
      'Composition: 16:9, screen/dashboard fills most of the image, shallow office background, no cartoon elements.',
      'Avoid: SVG/vector style, sci-fi robot face, neon blue cyberpunk, garbled text, watermark.',
    ].join(' '),
  },
  {
    file: 'ai-automation-roi-dashboard.png',
    prompt: [
      'Create a premium business analytics image for an AI automation ROI section.',
      'Scene: executive dashboard displayed on a laptop and wall screen showing charts for time saved, response speed, exception reduction, and rollout progress.',
      'Use clean charts, cards, and progress visuals with minimal or no readable text. No company logos.',
      'Style: high-end B2B consulting editorial, warm office lighting, Go Expandia red accent #cb102c, professional and realistic.',
      'Composition: 16:9, dashboard is clearly visible, tasteful depth, suitable for a blog article figure.',
      'Avoid: fake numbers as the main focus, garbled labels, SVG/vector look, stock-photo handshake, robots, neon.',
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
