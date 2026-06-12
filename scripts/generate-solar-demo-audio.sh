#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OUTPUT_DIR="$ROOT_DIR/assets/audio/solar-cold-caller"
TMP_DIR="$(mktemp -d)"

trap 'rm -rf "$TMP_DIR"' EXIT

mkdir -p "$OUTPUT_DIR"

render_line() {
    local voice="$1"
    local text="$2"
    local output="$3"
    local text_file="${output%.wav}.txt"

    printf '%s\n' "$text" > "$text_file"
    ffmpeg -v error -y \
        -f lavfi -i "flite=textfile=${text_file}:voice=${voice}" \
        -af "aresample=44100,highpass=f=90,lowpass=f=8000,dynaudnorm=f=150:g=9" \
        -ar 44100 -ac 1 -c:a pcm_s16le "$output"
}

render_pause() {
    local output="$1"

    ffmpeg -v error -y \
        -f lavfi -i "anullsrc=r=44100:cl=mono" \
        -t 0.45 -c:a pcm_s16le "$output"
}

make_scenario() {
    local filename="$1"
    shift

    local scenario_dir="$TMP_DIR/${filename%.mp3}"
    local concat_file="$scenario_dir/segments.txt"
    local index=0

    mkdir -p "$scenario_dir"
    : > "$concat_file"

    while (( "$#" )); do
        local voice="$1"
        local text="$2"
        local line_file="$scenario_dir/line-${index}.wav"
        local pause_file="$scenario_dir/pause-${index}.wav"

        render_line "$voice" "$text" "$line_file"
        render_pause "$pause_file"
        printf "file '%s'\nfile '%s'\n" "$line_file" "$pause_file" >> "$concat_file"

        index=$((index + 1))
        shift 2
    done

    ffmpeg -v error -y \
        -f concat -safe 0 -i "$concat_file" \
        -af "loudnorm=I=-18:LRA=7:TP=-1.5" \
        -c:a libmp3lame -b:a 96k "$OUTPUT_DIR/$filename"
}

make_scenario "scenario-introduction.mp3" \
    slt "Hello, this is Ava, an AI assistant calling for Bright Horizon Solar. This is a demonstration call. Am I speaking with Daniel?" \
    rms "Yes, this is Daniel." \
    slt "Thanks, Daniel. We are reaching out to homeowners who asked to learn about solar options in their area. Is now an okay time for two quick questions?" \
    rms "Sure, go ahead." \
    slt "Great. Do you own the property, and is your average electricity bill above one hundred fifty dollars a month?" \
    rms "Yes to both." \
    slt "Thank you. That may be a fit for a solar consultation. I can explain the next step or help arrange a call with a specialist."

make_scenario "scenario-objection.mp3" \
    slt "Hi, this is Ava, an AI assistant with Bright Horizon Solar. This is a demonstration call about solar options for your property." \
    awb "I am not interested. Solar always sounds too expensive." \
    slt "I understand. I will not pressure you. Is the upfront cost your main concern, or is there another reason?" \
    awb "Mostly the cost. I do not want to commit to anything." \
    slt "That makes sense. The first consultation has no commitment. It only checks whether the property and current bill make solar worth reviewing." \
    awb "Send me some information first." \
    slt "Of course. I will record that you prefer information before a callback, and I will not book an appointment today."

make_scenario "scenario-address-confirmation.mp3" \
    slt "Before I check service availability, I need to confirm the installation address. I have two fourteen Oak Street, Austin, Texas, seven eight seven zero four. Is that correct?" \
    rms "The street is correct, but the ZIP code is seven eight seven four five." \
    slt "Thank you. I have updated it to two fourteen Oak Street, Austin, Texas, seven eight seven four five. Is that the property where you are considering solar?" \
    rms "Yes, that is the one." \
    slt "Perfect. The address is confirmed, and the corrected ZIP code will be included in the consultation notes."

make_scenario "scenario-booking-confirmation.mp3" \
    slt "Your answers indicate that a solar consultation could be useful. I have Tuesday at three P M or Wednesday at ten A M. Which works better?" \
    awb "Tuesday at three works for me." \
    slt "Would you prefer a phone consultation or a video meeting?" \
    awb "A phone call, please." \
    slt "Confirmed. Your phone consultation is booked for Tuesday, June sixteenth at three P M Central Time. A solar specialist will call the number ending in eight eight four one, and a confirmation will be sent after this call." \
    awb "That is correct." \
    slt "Your appointment is booked. Thank you, and have a good day."

printf 'Generated solar demo audio in %s\n' "$OUTPUT_DIR"
