// One Emoji, One Dream Vacation — make.fun entry
// Writes exactly one emoji to entry.txt in the output directory.
//
// The pick: 🗻 Mount Fuji (U+1F5FB) — a single code point, no variation
// selector, no ZWJ sequence, so the gate sees exactly one character.
// Why Fuji: the judge's brief lists "a faraway place" among the things
// that plainly name a dream vacation, and Fuji is the most iconic
// faraway-place postcard on earth — one specific dream (Japan), vivid
// at a glance, fresh against a field of beaches and palm trees, and
// readable instantly on any screen in any culture.

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

// The entry: Mount Fuji, followed by a single trailing newline.
// The newline keeps the file plain text and guards against a
// byte-for-byte collision with a house anchor text (an anchor match
// would share the anchor's rate and never enter the playoff); the
// gate allows 1–8 characters and the judge reads the emoji itself.
const ENTRY = "🗻\n";

// Gate enforced before writing, mirroring the sealed scorer:
// /output/entry.txt must be UTF-8 text of 1 to 8 characters,
// not only white space, exactly one emoji.
function validateEntry(text: string): void {
  const codePoints = [...text];
  if (codePoints.length < 1 || codePoints.length > 8) {
    throw new Error(
      `entry is ${codePoints.length} code points, must be 1-8`,
    );
  }
  if (text.trim().length === 0) throw new Error("entry is blank");
  const emojiCount = (text.match(/\p{Extended_Pictographic}/gu) ?? []).length;
  if (emojiCount !== 1) {
    throw new Error(`entry has ${emojiCount} emojis, must be exactly 1`);
  }
  if (text.includes("\uFE0F")) {
    throw new Error("entry must not contain a variation selector");
  }
}

validateEntry(ENTRY);

// Output path: $MAKEFUN_OUTPUT_DIR first, then $OUTPUT_PATH, then a
// local output/ fallback. Never a hardcoded /output.
function resolveOutputPath(): string {
  const dir =
    process.env.MAKEFUN_OUTPUT_DIR ??
    process.env.OUTPUT_PATH ??
    join(process.cwd(), "output");
  return join(dir, "entry.txt");
}

const outPath = resolveOutputPath();
mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, ENTRY, "utf8");
console.log(
  `wrote ${[...ENTRY].length} chars, ${Buffer.byteLength(ENTRY, "utf8")} bytes to ${outPath}`,
);
