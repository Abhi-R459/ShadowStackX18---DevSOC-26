import { validateClaims } from "./rules.js";
import { generateSummary } from "./llm.js";

export async function runIntelligence(transcripts, documentData) {
  const ruleResult = validateClaims(transcripts, documentData);
  const summary = await generateSummary(transcripts, ruleResult);

  return {
    analysisId: Date.now().toString(),
    timestamp: new Date().toISOString(),
    summary,
    riskLevel: ruleResult.riskLevel,
    confidence: documentData.confidence || 0.8,
    suggestedAction: ruleResult.verified
      ? "Close case"
      : "Escalate for manual review"
  };
}
