// One Emoji, One Dream Vacation — make.fun bounty
// u-grand-elephant-19-one-emoji-one-dream-vacation-62879a35
//
// Writes one dream-vacation line, carried by a single emoji,
// to /output/entry.txt. The gate: 1-120 characters, one non-blank
// line, exactly one emoji.
//
// Entry choice: the 🏝️ Maldives line won over three alternates —
// a Hawaiian volcano dawn (105 chars), an Iceland northern-lights
// cabin (103), and a Mekong lantern drift (102). The Maldives line
// is the most instantly legible "dream vacation": white sand,
// turquoise water to the horizon, and an empty calendar — the
// island emoji does the dreaming, the line does the picturing.

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

const ENTRY =
  "🏝️ Barefoot on a white-sand Maldives atoll, turquoise water to the horizon, nothing on the calendar but sunset.";

// Gate enforced before writing: the competition accepts only UTF-8 text
// of 1-120 characters, a single non-blank line, exactly one emoji.
function validateEntry(text: string): void {
  if (text.trim().length === 0) throw new Error("entry is blank");
  if (text.length < 1 || text.length > 120) {
    throw new Error(`entry is ${text.length} chars, must be 1-120`);
  }
  if (text.includes("\n") || text.includes("\r")) {
    throw new Error("entry must be a single line");
  }
  // Exactly one emoji: count Extended_Pictographic code points, so the
  // variation selector in 🏝️ (U+FE0F) does not count as a second emoji.
  const emojiCount = (text.match(/\p{Extended_Pictographic}/gu) ?? []).length;
  if (emojiCount !== 1) {
    throw new Error(`entry has ${emojiCount} emojis, must be exactly 1`);
  }
}

const OUT = process.env.OUTPUT_PATH ?? "/output/entry.txt";

validateEntry(ENTRY);
mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, ENTRY, "utf8");
console.log(`Wrote ${ENTRY.length} chars to ${OUT}`);
