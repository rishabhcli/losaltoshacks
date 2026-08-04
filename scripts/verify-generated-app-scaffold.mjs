import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import {
  materialize,
  normalizeScaffolds,
  pickScaffold,
} from "./materialize-generated-app.mjs";
import { writeFileAtomic } from "../server/lib/atomic-file.mjs";

function usage() {
  return [
    "Usage:",
    "  pnpm generated-app:verify -- --input <portfolio.json> [--venture-id <id> | --app-name <slug>] [--target <dir>] [--force] [--skip-install] [--report-out <file>]",
    "",
    "The verifier writes the scaffold to a target directory, then runs the generated app's verification commands there.",
  ].join("\n");
}

function parseArgs(argv) {
  const args = {
    input: "",
    ventureId: "",
    appName: "",
    target: "",
    reportOut: "",
    force: false,
    skipInstall: false,
    help: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--") {
      continue;
    } else if (arg === "--help" || arg === "-h") {
      args.help = true;
    } else if (arg === "--force") {
      args.force = true;
    } else if (arg === "--skip-install") {
      args.skipInstall = true;
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
    } else if (arg === "--report-out") {
      args.reportOut = argv[index + 1] ?? "";
      index += 1;
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  return args;
}

function compact(value) {
  return String(value ?? "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 500);
}

function commandList(scaffold, skipInstall) {
  const commands = Array.isArray(scaffold.verificationCommands) && scaffold.verificationCommands.length > 0
    ? scaffold.verificationCommands
    : ["pnpm install", "pnpm type-check", "pnpm test", "pnpm build", "pnpm browser-smoke"];

  return skipInstall
    ? commands.filter((command) => !/^pnpm\s+install\b/.test(command))
    : commands;
}

function runCommand(command, cwd) {
  const startedAt = Date.now();
  const result = spawnSync(command, {
    cwd,
    encoding: "utf8",
    shell: true,
    stdio: ["ignore", "pipe", "pipe"],
  });
  const durationMs = Date.now() - startedAt;
  return {
    command,
    ok: result.status === 0,
    status: result.status,
    durationMs,
    stdout: compact(result.stdout),
    stderr: compact(result.stderr),
  };
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

  const payload = JSON.parse(fs.readFileSync(path.resolve(args.input), "utf8"));
  const scaffolds = normalizeScaffolds(payload);
  const scaffold = pickScaffold(scaffolds, args);
  const target = args.target || path.join(os.tmpdir(), `marketpulse-generated-app-${scaffold.appName ?? "app"}-${Date.now()}`);
  const materialized = materialize(scaffold, target, { write: true, force: args.force });
  const commands = commandList(scaffold, args.skipInstall);
  const results = commands.map((command) => runCommand(command, materialized.targetRoot));

  for (const result of results) {
    const marker = result.ok ? "OK" : "FAIL";
    console.log(`${marker} ${result.command} (${result.durationMs}ms)`);
    if (!result.ok) {
      console.log(`stdout: ${result.stdout}`);
      console.log(`stderr: ${result.stderr}`);
      break;
    }
  }

  const failed = results.find((result) => !result.ok);
  const report = {
    scaffoldId: scaffold.id,
    ventureId: scaffold.ventureId,
    appName: scaffold.appName,
    target: materialized.targetRoot,
    fileCount: materialized.plannedFiles.length,
    ok: !failed,
    results,
  };
  const reportJson = JSON.stringify(report, null, 2);
  if (args.reportOut) {
    const reportPath = path.resolve(args.reportOut);
    fs.mkdirSync(path.dirname(reportPath), { recursive: true });
    writeFileAtomic(reportPath, `${reportJson}\n`);
    console.log(`Report: ${reportPath}`);
  }
  console.log(reportJson);

  if (failed) {
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(error?.message ?? error);
  process.exit(1);
});
