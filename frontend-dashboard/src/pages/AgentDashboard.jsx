import { motion } from "framer-motion";
import "../styles/roleDashboard.css";

export default function AgentDashboard() {
  return (
    <div className="role-page agent">
      <h1>Agent Dashboard</h1>

      <div className="grid">
        <Card title="Assigned Cases" value="17" />
        <Card title="Pending Reviews" value="5" />
      </div>
    </div>
  );
}

function Card({ title, value }) {
  return (
    <motion.div className="role-card" whileHover={{ scale: 1.05 }}>
      <p>{title}</p>
      <h2>{value}</h2>
    </motion.div>
  );
}