import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The winning line, picked in SCREENING.md: the machine speaks in first
// person, flirts with its own vocabulary (a stuck chocolate bar, a coil
// that lets go, the B4 button), and the punch lands on the last beat.
const LINE =
  "I've held this chocolate hostage for three weeks, but one look from you and my coil let go. Press B4, I'm all yours.";

const MAX_CHARS = 200;

// Gate, enforced in code: one line, 1-200 characters, not whitespace-only.
if (LINE.length < 1 || LINE.length > MAX_CHARS) {
  throw new Error(`line must be 1-${MAX_CHARS} characters, got ${LINE.length}`);
}
if (LINE.trim().length === 0) {
  throw new Error("line must not be whitespace-only");
}
if (LINE.includes("\n") || LINE.includes("\r")) {
  throw new Error("line must be exactly one line");
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });

const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, LINE, "utf8");

// Read it back and verify byte-identical output, then re-check the gate
// against the actual file content, not just the constant.
const readBack = readFileSync(outPath, "utf8");
if (readBack !== LINE) {
  throw new Error("verification failed: entry.txt does not match the line");
}
if (readBack.length < 1 || readBack.length > MAX_CHARS) {
  throw new Error(`entry.txt must be 1-${MAX_CHARS} characters, got ${readBack.length}`);
}

const sha256 = createHash("sha256").update(readBack, "utf8").digest("hex");
console.log(`chars: ${LINE.length}`);
console.log(`sha256: ${sha256}`);
console.log(`wrote: ${outPath}`);
