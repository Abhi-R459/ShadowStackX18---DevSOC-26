export async function generateSummary(transcripts, ruleResult) {
  if (ruleResult.verified) {
    return "Payment claim verified using financial records. Case can be closed.";
  }

  return "Customer claims payment but no matching transaction found. Escalation required.";
}
