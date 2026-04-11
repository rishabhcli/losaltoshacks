import { DecisionArtifact } from "@/types";

// ── Palantir AIP Integration ──────────────────────────────────────────
//
// This module provides the interface for pushing decision artifacts to
// Palantir AIP (Foundry). When PALANTIR_AIP_TOKEN and
// PALANTIR_AIP_ENDPOINT are configured, artifacts are forwarded to the
// Ontology API. Otherwise, artifacts are stored locally in MongoDB only.

export function isPalantirConfigured(): boolean {
  return !!(process.env.PALANTIR_AIP_TOKEN && process.env.PALANTIR_AIP_ENDPOINT);
}

export interface PalantirPushResult {
  pushed: boolean;
  objectRid?: string;
  message: string;
}

/**
 * Push a decision artifact to Palantir AIP Ontology.
 *
 * Uses the Foundry Objects API to create a MarketTrendDecision object.
 * If Palantir is not configured, returns a local-only result.
 */
export async function pushToPalantirAIP(
  artifact: DecisionArtifact,
  decisionId: string
): Promise<PalantirPushResult> {
  if (!isPalantirConfigured()) {
    return {
      pushed: false,
      message: "Palantir AIP not configured. Artifact stored locally.",
    };
  }

  const endpoint = process.env.PALANTIR_AIP_ENDPOINT!;
  const token = process.env.PALANTIR_AIP_TOKEN!;

  try {
    // Palantir Foundry Ontology API: Create object
    const res = await fetch(
      `${endpoint}/api/v2/ontologies/default/objects/MarketTrendDecision`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          primaryKey: decisionId,
          properties: {
            trendName: artifact.properties.trendName,
            signalStrength: artifact.properties.signalStrength,
            audienceSegment: artifact.properties.audienceSegment,
            decisionStatus: artifact.properties.decisionStatus,
            riskFactors: JSON.stringify(artifact.properties.riskFactors),
            recommendedActions: JSON.stringify(
              artifact.properties.recommendedActions
            ),
            evidenceCount: artifact.properties.evidenceChain.length,
            generatedBy: artifact.relationships.generatedBy,
            informsTrend: artifact.relationships.informsTrend,
          },
        }),
      }
    );

    if (!res.ok) {
      const errText = await res.text().catch(() => "Unknown error");
      console.error(`Palantir AIP push failed (${res.status}):`, errText);
      return {
        pushed: false,
        message: `Palantir AIP returned ${res.status}: ${errText.slice(0, 200)}`,
      };
    }

    const data = await res.json();
    return {
      pushed: true,
      objectRid: data.rid || data.primaryKey || decisionId,
      message: "Successfully pushed to Palantir AIP.",
    };
  } catch (error) {
    console.error("Palantir AIP push error:", error);
    return {
      pushed: false,
      message: `Palantir AIP push failed: ${String(error).slice(0, 200)}`,
    };
  }
}

/**
 * Build the Palantir AIP decision artifact schema documentation.
 * Used for display in the UI and for API reference.
 */
export function getArtifactSchema() {
  return {
    objectType: "MarketTrendDecision",
    description:
      "A structured decision artifact representing an actionable market trend signal with evidence chain, audience segmentation, and recommended business actions.",
    properties: {
      trendName: { type: "string", description: "Human-readable trend name" },
      signalStrength: {
        type: "number",
        description: "Composite score 0-1 (normalized across all trends)",
      },
      audienceSegment: {
        type: "string",
        description: "Target demographic from AI analysis",
      },
      recommendedActions: {
        type: "array<DecisionAction>",
        description: "Prioritized business actions",
      },
      evidenceChain: {
        type: "array<Evidence>",
        description: "Source articles with relevance scores",
      },
      riskFactors: {
        type: "array<string>",
        description: "Identified risks that could undermine the trend",
      },
      decisionStatus: {
        type: "enum",
        values: ["proposed", "under_review", "approved", "executed"],
      },
    },
    relationships: {
      derivedFrom: "array<articleId> — source article ObjectIds",
      informsTrend: "trendId — the parent trend this decision addresses",
      generatedBy: "string — system identifier",
    },
  };
}
