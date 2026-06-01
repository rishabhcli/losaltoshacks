import { spawnSync } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

import {
  MOCK_DEMOGRAPHICS,
  MOCK_INSIGHTS,
  MOCK_RECOMMENDATIONS,
  MOCK_SOURCES,
  MOCK_TRENDS,
} from "../src/lib/mockData.ts";

const root = process.cwd();
const errors = [];
const warnings = [];

const sqlFilePaths = [
  "insforge/schema.sql",
  "insforge/masterbuild_schema.sql",
  "insforge/masterbuild_schema_v2.sql",
  "insforge/masterbuild_rls_policies.sql",
  "insforge/migration_fix_agent_unique.sql",
];

const seedContracts = {
  market_trends: {
    file: "market_trends.json",
    source: MOCK_TRENDS,
    required: [
      "trend_id",
      "title",
      "description",
      "industry",
      "category",
      "status",
      "trend_score",
      "mention_count",
      "growth_rate",
      "sentiment_score",
      "top_keywords",
      "detected_at",
    ],
  },
  market_insights: {
    file: "market_insights.json",
    source: MOCK_INSIGHTS,
    required: [
      "insight_id",
      "title",
      "summary",
      "insight_type",
      "industry",
      "generated_at",
      "related_trend_ids",
    ],
  },
  market_recommendations: {
    file: "market_recommendations.json",
    source: MOCK_RECOMMENDATIONS,
    required: [
      "recommendation_id",
      "trend_id",
      "title",
      "description",
      "product_category",
      "target_demographic",
      "confidence_score",
      "estimated_revenue_potential",
      "priority",
      "status",
      "action_plan",
      "created_at",
    ],
  },
  market_sources: {
    file: "market_sources.json",
    source: MOCK_SOURCES,
    required: [
      "source_id",
      "trend_id",
      "platform",
      "mention_count",
      "engagement_rate",
      "sentiment_breakdown",
      "collected_at",
    ],
  },
  market_demographics: {
    file: "market_demographics.json",
    source: MOCK_DEMOGRAPHICS,
    required: [
      "demographic_id",
      "trend_id",
      "age_group",
      "gender",
      "location",
      "affinity_score",
      "engagement_index",
      "purchase_intent",
      "top_interests",
    ],
  },
};

function addError(message, details = {}) {
  errors.push({ message, ...details });
}

function readRequiredFile(relativePath) {
  const absolutePath = resolve(root, relativePath);
  if (!existsSync(absolutePath)) {
    addError("Missing required file.", { file: relativePath });
    return "";
  }

  const contents = readFileSync(absolutePath, "utf8");
  if (!contents.trim()) {
    addError("Required file is empty.", { file: relativePath });
  }
  return contents;
}

const sqlFiles = Object.fromEntries(sqlFilePaths.map((file) => [file, readRequiredFile(file)]));
const allSql = Object.values(sqlFiles).join("\n\n").toLowerCase();

function collectSqlColumns(tableName) {
  const columns = new Set();

  for (const sql of Object.values(sqlFiles)) {
    const createPattern = new RegExp(
      `create\\s+table\\s+if\\s+not\\s+exists\\s+public\\.${tableName}\\s*\\(([\\s\\S]*?)\\n\\);`,
      "i",
    );
    const createMatch = sql.match(createPattern);
    if (createMatch) {
      for (const line of createMatch[1].split(/\r?\n/)) {
        const trimmed = line.trim();
        const match = trimmed.match(/^([a-z_][a-z0-9_]*)\s+/i);
        if (!match) continue;

        const column = match[1].toLowerCase();
        if (["check", "constraint", "foreign", "primary", "unique"].includes(column)) continue;
        columns.add(column);
      }
    }

    const alterPattern = new RegExp(
      `alter\\s+table\\s+public\\.${tableName}\\s+add\\s+column\\s+(?:if\\s+not\\s+exists\\s+)?([a-z_][a-z0-9_]*)`,
      "gi",
    );
    for (const match of sql.matchAll(alterPattern)) {
      columns.add(match[1].toLowerCase());
    }
  }

  return columns;
}

function parseLiveSchemaVerifierContract() {
  const verifier = readRequiredFile("scripts/verify-masterbuild-schema.mjs");
  const checks = [];
  const pattern = /table:\s*"([^"]+)"[\s\S]*?columns:\s*"([^"]+)"/g;

  for (const match of verifier.matchAll(pattern)) {
    checks.push({
      table: match[1],
      columns: match[2].split(",").map((column) => column.trim()).filter(Boolean),
    });
  }

  if (checks.length === 0) {
    addError("Could not parse live schema verifier table contract.", {
      file: "scripts/verify-masterbuild-schema.mjs",
    });
  }

  return checks;
}

function assertSqlContracts() {
  const requiredTables = [
    "market_trends",
    "market_insights",
    "market_recommendations",
    "market_sources",
    "market_demographics",
    "user_preferences",
    "recommendation_feedback",
    "recommendation_decisions",
    "trend_bookmarks",
    "missions",
    "agents",
    "discoveries",
    "logs",
    "signals",
    "control_commands",
    "agent_memory",
    "agent_thoughts",
    "business_plans",
    "builder_outputs",
  ];

  for (const table of requiredTables) {
    if (!allSql.includes(`public.${table}`)) {
      addError("SQL assets do not mention required table.", { table });
    }
  }

  for (const check of parseLiveSchemaVerifierContract()) {
    const columns = collectSqlColumns(check.table);
    if (columns.size === 0) {
      addError("Live schema verifier table is not declared in SQL assets.", { table: check.table });
      continue;
    }

    for (const column of check.columns) {
      if (!columns.has(column.toLowerCase())) {
        addError("Live schema verifier column is missing from SQL assets.", {
          table: check.table,
          column,
        });
      }
    }
  }

  for (const [table, contract] of Object.entries(seedContracts)) {
    const columns = collectSqlColumns(table);
    if (columns.size === 0) {
      addError("Seed table is not declared in SQL assets.", { table });
      continue;
    }

    for (const column of contract.required) {
      if (!columns.has(column)) {
        addError("Seed export column is missing from SQL assets.", {
          table,
          column,
          file: contract.file,
        });
      }
    }
  }

  const rlsSql = sqlFiles["insforge/masterbuild_rls_policies.sql"].toLowerCase();
  for (const table of [
    "missions",
    "agents",
    "discoveries",
    "logs",
    "signals",
    "control_commands",
    "agent_memory",
    "agent_thoughts",
    "business_plans",
    "builder_outputs",
  ]) {
    if (!rlsSql.includes(`alter table public.${table} enable row level security`)) {
      addError("MasterBuild RLS asset does not enable RLS for table.", { table });
    }
    if (!rlsSql.includes(`on public.${table}`)) {
      addError("MasterBuild RLS asset does not declare policies for table.", { table });
    }
  }

  const migrationSql = sqlFiles["insforge/migration_fix_agent_unique.sql"].toLowerCase();
  if (!migrationSql.includes("agents_mission_agent_unique") || !migrationSql.includes("unique (mission_id, agent_id)")) {
    addError("Agent unique-constraint migration does not preserve per-mission agent uniqueness.");
  }
}

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function isFiniteNumber(value) {
  return typeof value === "number" && Number.isFinite(value);
}

function isIntegerAtLeast(value, min) {
  return Number.isInteger(value) && value >= min;
}

function isValidDateString(value) {
  return isNonEmptyString(value) && !Number.isNaN(Date.parse(value));
}

function assertUnique(records, getId, label) {
  const seen = new Set();
  records.forEach((record, index) => {
    const id = getId(record);
    if (!isNonEmptyString(id)) {
      addError("Fixture record has a missing ID.", { fixture: label, index });
      return;
    }
    if (seen.has(id)) {
      addError("Fixture record has a duplicate ID.", { fixture: label, id });
    }
    seen.add(id);
  });
}

function splitTrendIds(value) {
  if (!isNonEmptyString(value)) return [];
  return value.split(",").map((id) => id.trim()).filter(Boolean);
}

function assertFixtureContracts() {
  const trendIds = new Set(MOCK_TRENDS.map((trend) => trend.trendId));
  const trendStatuses = new Set(["emerging", "growing", "peaking", "declining"]);
  const insightTypes = new Set(["kpi", "opportunity", "alert", "summary"]);
  const recommendationPriorities = new Set(["high", "medium", "low"]);
  const recommendationStatuses = new Set(["new", "reviewed", "accepted", "dismissed"]);

  assertUnique(MOCK_TRENDS, (trend) => trend.trendId, "MOCK_TRENDS");
  assertUnique(MOCK_INSIGHTS, (insight) => insight.insightId, "MOCK_INSIGHTS");
  assertUnique(MOCK_RECOMMENDATIONS, (recommendation) => recommendation.recommendationId, "MOCK_RECOMMENDATIONS");
  assertUnique(MOCK_SOURCES, (source) => source.$primaryKey, "MOCK_SOURCES");
  assertUnique(MOCK_DEMOGRAPHICS, (demographic) => demographic.$primaryKey, "MOCK_DEMOGRAPHICS");

  MOCK_TRENDS.forEach((trend, index) => {
    for (const key of ["trendId", "title", "description", "industry", "category", "topKeywords"]) {
      if (!isNonEmptyString(trend[key])) addError("Trend fixture is missing a required string.", { index, key });
    }
    if (trend.$primaryKey !== trend.trendId) addError("Trend primary key must match trendId.", { index, trendId: trend.trendId });
    if (!trendStatuses.has(trend.status)) addError("Trend fixture has invalid status.", { index, status: trend.status });
    if (!isFiniteNumber(trend.trendScore) || trend.trendScore < 0 || trend.trendScore > 100) addError("Trend score must be between 0 and 100.", { index, trendId: trend.trendId });
    if (!isIntegerAtLeast(trend.mentionCount, 0)) addError("Trend mention count must be a nonnegative integer.", { index, trendId: trend.trendId });
    if (!isFiniteNumber(trend.growthRate)) addError("Trend growth rate must be finite.", { index, trendId: trend.trendId });
    if (!isFiniteNumber(trend.sentimentScore) || trend.sentimentScore < -1 || trend.sentimentScore > 1) addError("Trend sentiment score must be between -1 and 1.", { index, trendId: trend.trendId });
    if (!isValidDateString(trend.detectedAt)) addError("Trend detectedAt must be a valid date.", { index, trendId: trend.trendId });
  });

  MOCK_INSIGHTS.forEach((insight, index) => {
    for (const key of ["insightId", "title", "summary", "insightType", "industry", "generatedAt"]) {
      if (!isNonEmptyString(insight[key])) addError("Insight fixture is missing a required string.", { index, key });
    }
    if (!insightTypes.has(insight.insightType)) addError("Insight fixture has invalid type.", { index, insightType: insight.insightType });
    if (!isValidDateString(insight.generatedAt)) addError("Insight generatedAt must be a valid date.", { index, insightId: insight.insightId });
    for (const trendId of splitTrendIds(insight.relatedTrendIds)) {
      if (!trendIds.has(trendId)) addError("Insight references an unknown trend.", { index, insightId: insight.insightId, trendId });
    }
  });

  MOCK_RECOMMENDATIONS.forEach((recommendation, index) => {
    for (const key of ["recommendationId", "trendId", "title", "description", "productCategory", "targetDemographic", "estimatedRevenuePotential", "priority", "status", "actionPlan", "createdAt"]) {
      if (!isNonEmptyString(recommendation[key])) addError("Recommendation fixture is missing a required string.", { index, key });
    }
    if (!trendIds.has(recommendation.trendId)) addError("Recommendation references an unknown trend.", { index, recommendationId: recommendation.recommendationId, trendId: recommendation.trendId });
    if (!isFiniteNumber(recommendation.confidenceScore) || recommendation.confidenceScore < 0 || recommendation.confidenceScore > 1) addError("Recommendation confidence must be between 0 and 1.", { index, recommendationId: recommendation.recommendationId });
    if (!recommendationPriorities.has(recommendation.priority)) addError("Recommendation fixture has invalid priority.", { index, priority: recommendation.priority });
    if (!recommendationStatuses.has(recommendation.status)) addError("Recommendation fixture has invalid status.", { index, status: recommendation.status });
    if (!isValidDateString(recommendation.createdAt)) addError("Recommendation createdAt must be a valid date.", { index, recommendationId: recommendation.recommendationId });
  });

  MOCK_SOURCES.forEach((source, index) => {
    for (const key of ["$primaryKey", "trendId", "platform", "sentimentBreakdown", "collectedAt"]) {
      if (!isNonEmptyString(source[key])) addError("Source fixture is missing a required string.", { index, key });
    }
    if (!trendIds.has(source.trendId)) addError("Source references an unknown trend.", { index, sourceId: source.$primaryKey, trendId: source.trendId });
    if (!isIntegerAtLeast(source.mentionCount, 0)) addError("Source mention count must be a nonnegative integer.", { index, sourceId: source.$primaryKey });
    if (!isFiniteNumber(source.engagementRate) || source.engagementRate < 0) addError("Source engagement rate must be finite and nonnegative.", { index, sourceId: source.$primaryKey });
    if (!isValidDateString(source.collectedAt)) addError("Source collectedAt must be a valid date.", { index, sourceId: source.$primaryKey });
  });

  MOCK_DEMOGRAPHICS.forEach((demographic, index) => {
    for (const key of ["$primaryKey", "trendId", "ageGroup", "gender", "location", "topInterests"]) {
      if (!isNonEmptyString(demographic[key])) addError("Demographic fixture is missing a required string.", { index, key });
    }
    if (!trendIds.has(demographic.trendId)) addError("Demographic references an unknown trend.", { index, demographicId: demographic.$primaryKey, trendId: demographic.trendId });
    if (!isFiniteNumber(demographic.affinityScore) || demographic.affinityScore < 0 || demographic.affinityScore > 1) addError("Demographic affinity score must be between 0 and 1.", { index, demographicId: demographic.$primaryKey });
    if (!isFiniteNumber(demographic.engagementIndex) || demographic.engagementIndex < 0 || demographic.engagementIndex > 10) addError("Demographic engagement index must be between 0 and 10.", { index, demographicId: demographic.$primaryKey });
    if (!isFiniteNumber(demographic.purchaseIntent) || demographic.purchaseIntent < 0 || demographic.purchaseIntent > 1) addError("Demographic purchase intent must be between 0 and 1.", { index, demographicId: demographic.$primaryKey });
  });
}

function assertExportedRows(table, rows, trendIds) {
  const contract = seedContracts[table];
  if (!Array.isArray(rows) || rows.length === 0) {
    addError("Exported seed file must contain a nonempty array.", { table, file: contract.file });
    return;
  }

  if (rows.length !== contract.source.length) {
    addError("Exported seed row count does not match source fixture count.", {
      table,
      expected: contract.source.length,
      actual: rows.length,
    });
  }

  rows.forEach((row, index) => {
    for (const key of contract.required) {
      if (!(key in row)) addError("Exported seed row is missing a required column.", { table, file: contract.file, index, key });
    }
    if ("trend_id" in row && table !== "market_trends" && !trendIds.has(row.trend_id)) {
      addError("Exported seed row references an unknown trend.", { table, file: contract.file, index, trendId: row.trend_id });
    }
    if (table === "market_insights") {
      for (const trendId of splitTrendIds(row.related_trend_ids)) {
        if (!trendIds.has(trendId)) addError("Exported insight row references an unknown trend.", { table, file: contract.file, index, trendId });
      }
    }
  });
}

function assertSeedExport() {
  const outputDir = mkdtempSync(join(tmpdir(), "marketpulse-insforge-seed-"));
  try {
    const result = spawnSync(process.execPath, ["scripts/export-insforge-seed.mjs", outputDir], {
      cwd: root,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    });

    if (result.status !== 0) {
      addError("Seed exporter command failed.", {
        status: result.status,
        stdout: result.stdout.trim(),
        stderr: result.stderr.trim(),
      });
      return { outputDir, files: [] };
    }

    const trendRows = JSON.parse(readFileSync(join(outputDir, seedContracts.market_trends.file), "utf8"));
    const trendIds = new Set(trendRows.map((row) => row.trend_id));
    const files = [];

    for (const [table, contract] of Object.entries(seedContracts)) {
      const filePath = join(outputDir, contract.file);
      if (!existsSync(filePath)) {
        addError("Seed exporter did not write expected file.", { table, file: contract.file });
        continue;
      }

      files.push(contract.file);
      let rows = null;
      try {
        rows = JSON.parse(readFileSync(filePath, "utf8"));
      } catch (error) {
        addError("Seed exporter wrote invalid JSON.", { table, file: contract.file, error: String(error?.message ?? error) });
        continue;
      }
      assertExportedRows(table, rows, trendIds);
    }

    return { outputDir, files };
  } finally {
    rmSync(outputDir, { recursive: true, force: true });
  }
}

assertSqlContracts();
assertFixtureContracts();
const seedExport = assertSeedExport();

const summary = {
  ok: errors.length === 0,
  sql: {
    files: sqlFilePaths,
    liveVerifierChecks: parseLiveSchemaVerifierContract().length,
  },
  fixtures: {
    trends: MOCK_TRENDS.length,
    insights: MOCK_INSIGHTS.length,
    recommendations: MOCK_RECOMMENDATIONS.length,
    sources: MOCK_SOURCES.length,
    demographics: MOCK_DEMOGRAPHICS.length,
  },
  seedExport: {
    files: seedExport.files,
    cleanedTempDir: seedExport.outputDir,
  },
  warnings,
  errors,
};

if (errors.length > 0) {
  console.error(JSON.stringify(summary, null, 2));
  process.exit(1);
}

console.log(JSON.stringify(summary, null, 2));
