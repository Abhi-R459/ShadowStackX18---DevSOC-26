// Document Intelligence Layer (Backboard.io wrapper)

export async function extractFinancialData() {
  // In production: call Backboard.io API here
  // For demo: return structured JSON that mimics Backboard output

  return {
    documentType: "bank_statement",
    transactions: [
      { amount: 5000, date: "2026-01-12" }
    ],
    confidence: 0.93
  };
}
