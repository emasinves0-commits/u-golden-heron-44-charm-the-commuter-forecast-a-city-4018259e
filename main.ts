import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ENTRY =
  "In Rookhaven today, the wind has been rescheduled to blow from behind you until 9am. Management apologises for the convenience.";
const MAX_LENGTH = 140;

function validate(text: unknown): asserts text is string {
  if (typeof text !== "string") {
    throw new Error("entry must be a string");
  }
  if (text.length === 0) {
    throw new Error("entry is empty");
  }
  if (text.trim().length === 0) {
    throw new Error("entry is whitespace-only");
  }
  if (text.length > MAX_LENGTH) {
    throw new Error(`entry is ${text.length} characters; the limit is ${MAX_LENGTH}`);
  }
  if (text !== text.trim()) {
    throw new Error("entry has leading or trailing whitespace (including newlines)");
  }
  const bad = /[\u0000-\u001f\u007f-\u009f]/.exec(text);
  if (bad) {
    throw new Error(
      `entry contains a control character U+${bad[0].charCodeAt(0).toString(16).padStart(4, "0")} at index ${bad.index}`,
    );
  }
}

validate(ENTRY);
const dir = process.env.MAKEFUN_OUTPUT_DIR || "/output";
mkdirSync(dir, { recursive: true });
const file = join(dir, "entry.txt");
writeFileSync(file, ENTRY); // no trailing newline

// Read back: what is on disk must be exactly the validated entry.
if (readFileSync(file, "utf8") !== ENTRY) {
  throw new Error(`read-back mismatch for ${file}`);
}
