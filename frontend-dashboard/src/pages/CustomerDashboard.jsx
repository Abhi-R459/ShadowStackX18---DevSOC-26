import { motion } from "framer-motion";
import "../styles/roleDashboard.css";

export default function CustomerDashboard() {
  return (
    <div className="role-page customer">
      <h1>Customer Dashboard</h1>

      <div className="grid">
        <Card title="My Requests" value="3" />
        <Card title="Resolved" value="2" />
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