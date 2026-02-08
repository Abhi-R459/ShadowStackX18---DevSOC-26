import { motion } from "framer-motion";
import "../styles/roleDashboard.css";
import { useAuth } from "../context/AuthContext";

export default function CustomerDashboard() {
  const { signOut } = useAuth();
  return (
    <div className="role-page customer">
      <div className="role-header">
        <h1>Customer Dashboard</h1>
        <button className="secondary-btn" onClick={signOut}>
          Logout
        </button>
      </div>

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
