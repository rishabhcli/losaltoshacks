import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { writeFileAtomic } from "../../server/lib/atomic-file.mjs";

describe("atomic file writes", () => {
  it("replaces content and leaves no temporary sibling", () => {
    const directory = fs.mkdtempSync(path.join(os.tmpdir(), "marketpulse-atomic-"));
    const target = path.join(directory, "artifact.json");

    try {
      writeFileAtomic(target, "first", "utf8");
      writeFileAtomic(target, "second", "utf8");

      expect(fs.readFileSync(target, "utf8")).toBe("second");
      expect(fs.readdirSync(directory)).toEqual(["artifact.json"]);
    } finally {
      fs.rmSync(directory, { recursive: true, force: true });
    }
  });
});
