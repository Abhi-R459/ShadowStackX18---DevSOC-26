import { motion } from "framer-motion";
import "../styles/roleDashboard.css";
import { useAuth } from "../context/AuthContext";

export default function AgentDashboard() {
  const { signOut } = useAuth();
  return (
    <div className="role-page agent">
      <div className="role-header">
        <h1>Agent Dashboard</h1>
        <button className="secondary-btn" onClick={signOut}>
          Logout
        </button>
      </div>

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
