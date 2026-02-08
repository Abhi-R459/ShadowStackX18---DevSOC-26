import { runIntelligence } from "./fusion.js";

// Lightweight local test harness for the intelligence flow. Run this file
// with node during development to sanity-check behaviour.
const transcripts = [
  "I paid 5000 on Jan 12",
  "EMI still shows unpaid"
];

const documentData = {
  transactions: [{ amount: 5000, date: "2026-01-12" }]
};

async function main() {
  const out = await runIntelligence(transcripts, documentData);
  console.log(out);
}

main().catch(err => console.error(err));
