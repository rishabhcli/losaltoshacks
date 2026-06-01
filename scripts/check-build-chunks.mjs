import fs from "node:fs";
import path from "node:path";

const maxKb = Number.parseFloat(process.argv[2] ?? "500");
const maxBytes = Math.round(maxKb * 1024);
const assetsDir = path.resolve(process.cwd(), "dist", "assets");

if (!Number.isFinite(maxKb) || maxKb <= 0) {
  console.error("Usage: node scripts/check-build-chunks.mjs [max-kb]");
  process.exit(1);
}

if (!fs.existsSync(assetsDir)) {
  console.error("dist/assets does not exist. Run `pnpm build` before checking chunk budgets.");
  process.exit(1);
}

const chunks = fs.readdirSync(assetsDir)
  .filter((file) => file.endsWith(".js"))
  .map((file) => {
    const filePath = path.join(assetsDir, file);
    return {
      file,
      sizeBytes: fs.statSync(filePath).size,
    };
  })
  .sort((a, b) => b.sizeBytes - a.sizeBytes);

const offenders = chunks.filter((chunk) => chunk.sizeBytes > maxBytes);
const formatKb = (bytes) => `${(bytes / 1024).toFixed(2)} kB`;

console.log(`Checked ${chunks.length} JS chunks against ${maxKb} kB max.`);
chunks.slice(0, 8).forEach((chunk) => {
  console.log(`- ${chunk.file}: ${formatKb(chunk.sizeBytes)}`);
});

if (offenders.length > 0) {
  console.error(`Chunk budget failed: ${offenders.length} chunk${offenders.length === 1 ? "" : "s"} over ${maxKb} kB.`);
  offenders.forEach((chunk) => {
    console.error(`- ${chunk.file}: ${formatKb(chunk.sizeBytes)}`);
  });
  process.exit(1);
}

console.log("Chunk budget passed.");
