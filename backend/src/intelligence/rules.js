export function validateClaims(transcripts, documentData) {
  // Simple, explainable rule set for demo purposes.
  // Responsibilities:
  // - Extract entities (amounts, dates) from transcripts.
  // - Classify intent: PAYMENT_CONFIRMED or PAYMENT_DISPUTE.
  // - Verify obligations by matching extracted entities against documentData.
  // - Produce easily readable outputs for auditing.

  const txs = Array.isArray(documentData && documentData.transactions)
    ? documentData.transactions
    : [];

  const paymentVerbs = ["paid", "payment", "received", "credited", "settled"];
  const disputeIndicators = ["still unpaid", "not paid", "dispute", "charged wrong", "incorrect"];

  // Normalize transcripts and prepare extraction containers
  const normalized = Array.isArray(transcripts)
    ? transcripts.map(t => (typeof t === "string" ? t : ""))
    : [];

  const extractedAmounts = [];
  const extractedDates = [];

  // Very small regexes to capture amounts and common date patterns.
  const amountRegex = /\b(?:\$)?(\d{1,3}(?:,\d{3})*(?:\.\d{1,2})?|\d+)(?:\s?(?:usd|dollars))?\b/ig;
  const isoDateRegex = /\b(20\d{2}-\d{2}-\d{2})\b/g; // simple YYYY-MM-DD
  const monthDayYearRegex = /\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)[a-z]*\.?(?:\s+\d{1,2})(?:,?\s*20\d{2})?\b/ig;

  // Flags for intent detection
  let sawPaymentVerb = false;
  let sawDispute = false;

  for (const t of normalized) {
    const lower = t.toLowerCase();

    // Intent cues
    if (paymentVerbs.some(v => lower.includes(v))) sawPaymentVerb = true;
    if (disputeIndicators.some(d => lower.includes(d))) sawDispute = true;

    // Extract amounts
    let m;
    while ((m = amountRegex.exec(t)) !== null) {
      // Normalize number: remove commas and dollar signs
      const raw = m[1] || m[0];
      const numeric = Number(raw.replace(/[,\$\s]/g, ""));
      if (!Number.isNaN(numeric)) extractedAmounts.push(numeric);
    }

    // Extract ISO dates
    let d;
    while ((d = isoDateRegex.exec(t)) !== null) {
      extractedDates.push(d[1]);
    }

    // Extract month names (kept raw for demo; frontend can normalize)
    let md;
    while ((md = monthDayYearRegex.exec(t)) !== null) {
      extractedDates.push(md[0]);
    }
  }

  // Remove duplicates
  const uniqueAmounts = Array.from(new Set(extractedAmounts));
  const uniqueDates = Array.from(new Set(extractedDates));

  // Obligation verification: check if any extracted amount matches a documented transaction.
  let verified = false;
  for (const docTx of txs) {
    if (!docTx || typeof docTx.amount !== "number") continue;
    if (uniqueAmounts.includes(docTx.amount)) {
      verified = true;
      break;
    }
  }

  // Intent classification: prefer explicit dispute cues over payment verbs.
  const detectedIntent = sawDispute && !sawPaymentVerb ? "PAYMENT_DISPUTE" : (verified || sawPaymentVerb ? "PAYMENT_CONFIRMED" : "PAYMENT_DISPUTE");

  // Risk level: low when verified, high otherwise.
  const riskLevel = verified ? "Low" : "High";

  // Simple confidence heuristic: start from document confidence when available.
  const baseConfidence = typeof documentData.confidence === "number" ? documentData.confidence : 0.85;
  const verificationConfidence = verified ? Math.min(0.99, baseConfidence + 0.1) : Math.max(0.4, baseConfidence - 0.2);

  return {
    // verification boolean and human-friendly risk
    verified,
    riskLevel,

    // Intent classification for downstream handling
    detectedIntent,

    // Entities extracted from transcripts
    extractedEntities: {
      amounts: uniqueAmounts,
      dates: uniqueDates
    },

    // Obligation verification details
    obligationVerified: verified,

    // Confidence score for rule-based judgement (0..1)
    verificationConfidence
  };
}
