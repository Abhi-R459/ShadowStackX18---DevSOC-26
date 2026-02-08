import { motion } from "framer-motion";
import "../styles/dashboard.css";

export default function Dashboard() {
  return (
    <div className="dashboard-page">
      <motion.header
        className="dashboard-header"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1>My Analyses</h1>
        <button className="new-btn">+ New Analysis</button>
      </motion.header>

      <motion.div
        className="cards-grid"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <DashboardCard
          title="EMI Dispute – Feb"
          risk="Low"
          confidence="93%"
        />
        <DashboardCard
          title="Refund Request"
          risk="High"
          confidence="41%"
        />
        <DashboardCard
          title="Payment Verification"
          risk="Medium"
          confidence="67%"
        />
      </motion.div>
    </div>
  );
}

function DashboardCard({ title, risk, confidence }) {
  return (
    <motion.div
      className="analysis-card"
      whileHover={{ scale: 1.05 }}
    >
      <h3>{title}</h3>
      <div className="meta">
        <span className={`risk ${risk.toLowerCase()}`}>
          {risk} Risk
        </span>
        <span className="confidence">
          Confidence: {confidence}
        </span>
      </div>
    </motion.div>
  );
}