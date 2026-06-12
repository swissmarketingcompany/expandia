#!/usr/bin/env node

import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const API_BASE = 'https://api.elevenlabs.io';
const API_KEY = process.env.ELEVENLABS_API_KEY;
const AGENT_VOICE_ID = process.env.ELEVENLABS_AGENT_VOICE_ID;
const PROSPECT_VOICE_ID = process.env.ELEVENLABS_PROSPECT_VOICE_ID;
const MODEL_ID = process.env.ELEVENLABS_MODEL_ID || 'eleven_v3';
const OUTPUT_FORMAT = 'mp3_44100_128';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outputDir = path.join(rootDir, 'assets/audio/solar-cold-caller');

const scenarios = [
    {
        filename: 'scenario-introduction.mp3',
        turns: [
            ['agent', '[warm and professional] Hello, this is Ava, an AI assistant calling for Bright Horizon Solar. This is a demonstration call. Am I speaking with Daniel?'],
            ['prospect', '[neutral] Yes, this is Daniel.'],
            ['agent', '[friendly] Thanks, Daniel. We are reaching out to homeowners who asked to learn about solar options in their area. Is now an okay time for two quick questions?'],
            ['prospect', '[agreeable] Sure, go ahead.'],
            ['agent', '[clear and conversational] Great. Do you own the property, and is your average electricity bill above one hundred fifty dollars a month?'],
            ['prospect', '[matter-of-fact] Yes to both.'],
            ['agent', '[helpful] Thank you. That may be a fit for a solar consultation. I can explain the next step or help arrange a call with a specialist.'],
        ],
    },
    {
        filename: 'scenario-objection.mp3',
        turns: [
            ['agent', '[warm and professional] Hi, this is Ava, an AI assistant with Bright Horizon Solar. This is a demonstration call about solar options for your property.'],
            ['prospect', '[skeptical] I am not interested. Solar always sounds too expensive.'],
            ['agent', '[calm and understanding] I understand. I will not pressure you. Is the upfront cost your main concern, or is there another reason?'],
            ['prospect', '[guarded] Mostly the cost. I do not want to commit to anything.'],
            ['agent', '[reassuring, not salesy] That makes sense. The first consultation has no commitment. It only checks whether the property and current bill make solar worth reviewing.'],
            ['prospect', '[firm but polite] Send me some information first.'],
            ['agent', '[respectful] Of course. I will record that you prefer information before a callback, and I will not book an appointment today.'],
        ],
    },
    {
        filename: 'scenario-address-confirmation.mp3',
        turns: [
            ['agent', '[clear and careful] Before I check service availability, I need to confirm the installation address. I have 214 Oak Street, Austin, Texas, 78704. Is that correct?'],
            ['prospect', '[correcting politely] The street is correct, but the ZIP code is 78745.'],
            ['agent', '[confirming] Thank you. I have updated it to 214 Oak Street, Austin, Texas, 78745. Is that the property where you are considering solar?'],
            ['prospect', '[neutral] Yes, that is the one.'],
            ['agent', '[positive and concise] Perfect. The address is confirmed, and the corrected ZIP code will be included in the consultation notes.'],
        ],
    },
    {
        filename: 'scenario-booking-confirmation.mp3',
        turns: [
            ['agent', '[helpful and efficient] Your answers indicate that a solar consultation could be useful. I have Tuesday at 3 PM or Wednesday at 10 AM. Which works better?'],
            ['prospect', '[decisive] Tuesday at 3 works for me.'],
            ['agent', '[conversational] Would you prefer a phone consultation or a video meeting?'],
            ['prospect', '[neutral] A phone call, please.'],
            ['agent', '[clear confirmation] Confirmed. Your phone consultation is booked for Tuesday, June 16th at 3 PM Central Time. A solar specialist will call the number ending in 8841, and a confirmation will be sent after this call.'],
            ['prospect', '[confirming] That is correct.'],
            ['agent', '[warm closing] Your appointment is booked. Thank you, and have a good day.'],
        ],
    },
];

function requireApiKey() {
    if (!API_KEY) {
        throw new Error(
            'ELEVENLABS_API_KEY is missing. Set it locally; never commit or paste the key into source files.'
        );
    }
}

async function listVoices() {
    requireApiKey();

    const response = await fetch(`${API_BASE}/v2/voices?page_size=100`, {
        headers: { 'xi-api-key': API_KEY },
    });

    if (!response.ok) {
        throw new Error(`Voice lookup failed (${response.status}): ${await response.text()}`);
    }

    const data = await response.json();
    const voices = (data.voices || []).map((voice) => ({
        name: voice.name,
        voice_id: voice.voice_id,
        category: voice.category,
        accent: voice.labels?.accent || '',
        gender: voice.labels?.gender || '',
        description: voice.description || '',
    }));

    console.table(voices);
}

function requireVoiceIds() {
    const missing = [];
    if (!AGENT_VOICE_ID) missing.push('ELEVENLABS_AGENT_VOICE_ID');
    if (!PROSPECT_VOICE_ID) missing.push('ELEVENLABS_PROSPECT_VOICE_ID');

    if (missing.length) {
        throw new Error(
            `${missing.join(' and ')} ${missing.length === 1 ? 'is' : 'are'} missing. ` +
            'Run this script with --list-voices, then set one voice ID for the AI agent and one for the prospect.'
        );
    }
}

async function generateScenario(scenario) {
    const inputs = scenario.turns.map(([speaker, text]) => ({
        text,
        voice_id: speaker === 'agent' ? AGENT_VOICE_ID : PROSPECT_VOICE_ID,
    }));

    const response = await fetch(
        `${API_BASE}/v1/text-to-dialogue?output_format=${OUTPUT_FORMAT}`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'xi-api-key': API_KEY,
            },
            body: JSON.stringify({
                inputs,
                model_id: MODEL_ID,
                language_code: 'en',
                seed: 20260612,
                apply_text_normalization: 'on',
            }),
        }
    );

    if (!response.ok) {
        throw new Error(
            `${scenario.filename} failed (${response.status}): ${await response.text()}`
        );
    }

    const outputPath = path.join(outputDir, scenario.filename);
    await writeFile(outputPath, Buffer.from(await response.arrayBuffer()));
    console.log(`Generated ${path.relative(rootDir, outputPath)}`);
}

async function main() {
    if (process.argv.includes('--list-voices')) {
        await listVoices();
        return;
    }

    requireApiKey();
    requireVoiceIds();
    await mkdir(outputDir, { recursive: true });

    for (const scenario of scenarios) {
        await generateScenario(scenario);
    }
}

main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
});
