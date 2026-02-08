export function validateClaims(transcripts, documentData) {
  let verified = false;

  transcripts.forEach(text => {
    documentData.transactions.forEach(tx => {
      if (
        text.includes(tx.amount.toString()) &&
        text.toLowerCase().includes("paid")
      ) {
        verified = true;
      }
    });
  });

  return {
    verified,
    riskLevel: verified ? "Low" : "High"
  };
}
