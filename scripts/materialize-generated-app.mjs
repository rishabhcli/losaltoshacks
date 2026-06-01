import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

export function usage() {
  return [
    "Usage:",
    "  pnpm generated-app:materialize -- --input <portfolio.json> [--venture-id <id> | --app-name <slug>] [--target <dir>] [--write] [--force]",
    "",
    "Default mode is a dry run. Add --write to create files. Add --force to overwrite changed files.",
  ].join("\n");
}

export function parseArgs(argv) {
  const args = {
    input: "",
    ventureId: "",
    appName: "",
    target: "",
    write: false,
    force: false,
    help: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--") {
      continue;
    } else if (arg === "--help" || arg === "-h") {
      args.help = true;
    } else if (arg === "--write") {
      args.write = true;
    } else if (arg === "--force") {
      args.force = true;
    } else if (arg === "--input") {
      args.input = argv[index + 1] ?? "";
      index += 1;
    } else if (arg === "--venture-id") {
      args.ventureId = argv[index + 1] ?? "";
      index += 1;
    } else if (arg === "--app-name") {
      args.appName = argv[index + 1] ?? "";
      index += 1;
    } else if (arg === "--target") {
      args.target = argv[index + 1] ?? "";
      index += 1;
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  return args;
}

export function sourceContentSignature(content) {
  let hash = 2166136261;
  for (let index = 0; index < content.length; index += 1) {
    hash ^= content.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return `fnv1a-${(hash >>> 0).toString(16).padStart(8, "0")}`;
}

export function normalizeScaffolds(payload) {
  const direct = Array.isArray(payload?.generatedAppSourceScaffolds)
    ? payload.generatedAppSourceScaffolds
    : [];
  const embedded = Array.isArray(payload?.generatedAppHandoffs)
    ? payload.generatedAppHandoffs.map((handoff) => handoff?.sourceScaffold).filter(Boolean)
    : [];

  return [...direct, ...embedded].filter((scaffold, index, scaffolds) => (
    scaffold &&
    typeof scaffold === "object" &&
    scaffolds.findIndex((candidate) => candidate?.id === scaffold.id) === index
  ));
}

export function pickScaffold(scaffolds, args) {
  const matches = scaffolds.filter((scaffold) => {
    const ventureMatches = !args.ventureId || scaffold.ventureId === args.ventureId || scaffold.id === args.ventureId;
    const appMatches = !args.appName || scaffold.appName === args.appName || scaffold.title === args.appName;
    return ventureMatches && appMatches;
  });

  if (matches.length === 1) return matches[0];
  if (matches.length === 0) {
    throw new Error("No generated app source scaffold matched the provided selector.");
  }
  throw new Error(`Matched ${matches.length} scaffolds. Add --venture-id or --app-name.`);
}

export function safeFilePath(targetRoot, relativePath) {
  if (typeof relativePath !== "string" || relativePath.trim() === "") {
    throw new Error("Source file path must be a non-empty string.");
  }
  if (relativePath.includes("\0") || path.isAbsolute(relativePath)) {
    throw new Error(`Unsafe source file path: ${relativePath}`);
  }
  const normalized = path.normalize(relativePath);
  if (normalized === "." || normalized.startsWith("..") || path.isAbsolute(normalized)) {
    throw new Error(`Unsafe source file path: ${relativePath}`);
  }
  const resolvedRoot = path.resolve(targetRoot);
  const resolvedFile = path.resolve(resolvedRoot, normalized);
  if (resolvedFile !== resolvedRoot && !resolvedFile.startsWith(`${resolvedRoot}${path.sep}`)) {
    throw new Error(`Source file escapes target directory: ${relativePath}`);
  }
  return resolvedFile;
}

export function materialize(scaffold, target, options) {
  if (!Array.isArray(scaffold.sourceFiles) || scaffold.sourceFiles.length === 0) {
    throw new Error("Selected scaffold does not contain sourceFiles.");
  }

  const targetRoot = path.resolve(target || scaffold.localTargetPath || `./generated-apps/${scaffold.appName || "app"}`);
  const plannedFiles = scaffold.sourceFiles.map((file) => {
    if (!file || typeof file !== "object") {
      throw new Error("Every source file must be an object.");
    }
    if (typeof file.content !== "string") {
      throw new Error(`Source file ${file.path ?? "(unknown)"} is missing string content.`);
    }
    const actualSignature = sourceContentSignature(file.content);
    if (file.contentSignature && file.contentSignature !== actualSignature) {
      throw new Error(`Signature mismatch for ${file.path}: expected ${file.contentSignature}, got ${actualSignature}.`);
    }
    return {
      path: file.path,
      fullPath: safeFilePath(targetRoot, file.path),
      content: file.content,
      signature: actualSignature,
    };
  });

  console.log(`Generated app source scaffold: ${scaffold.title ?? scaffold.appName ?? scaffold.id}`);
  console.log(`Target: ${targetRoot}`);
  console.log(`Mode: ${options.write ? "write" : "dry-run"}`);
  console.log(`Files: ${plannedFiles.length}`);

  for (const file of plannedFiles) {
    const exists = fs.existsSync(file.fullPath);
    const current = exists ? fs.readFileSync(file.fullPath, "utf8") : "";
    if (exists && current !== file.content && !options.force) {
      throw new Error(`Refusing to overwrite changed file without --force: ${file.path}`);
    }

    if (options.write) {
      fs.mkdirSync(path.dirname(file.fullPath), { recursive: true });
      if (!exists || current !== file.content) {
        fs.writeFileSync(file.fullPath, file.content);
      }
    }

    const action = options.write ? (exists ? "checked" : "created") : "would-write";
    console.log(`${action} ${file.path} ${file.signature}`);
  }

  console.log(options.write ? "Materialization complete." : "Dry run complete. Add --write to create files.");
  return { targetRoot, plannedFiles };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    console.log(usage());
    return;
  }
  if (!args.input) {
    throw new Error(`Missing --input.\n${usage()}`);
  }

  const raw = fs.readFileSync(path.resolve(args.input), "utf8");
  const payload = JSON.parse(raw);
  const scaffolds = normalizeScaffolds(payload);
  if (scaffolds.length === 0) {
    throw new Error("Input JSON does not contain generatedAppSourceScaffolds or generatedAppHandoffs[].sourceScaffold.");
  }

  const scaffold = pickScaffold(scaffolds, args);
  materialize(scaffold, args.target, { write: args.write, force: args.force });
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(error?.message ?? error);
    process.exit(1);
  });
}
