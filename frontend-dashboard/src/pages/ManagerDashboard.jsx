import { motion } from "framer-motion";
import "../styles/roleDashboard.css";
import { useAuth } from "../context/AuthContext";

export default function ManagerDashboard() {
  const { signOut } = useAuth();
  return (
    <div className="role-page manager">
      <Header title="Manager Dashboard" onLogout={signOut} />

      <div className="grid">
        <Card title="Total Cases" value="128" />
        <Card title="High Risk Cases" value="14" />
        <Card title="Agents Active" value="23" />
      </div>
    </div>
  );
}

function Header({ title, onLogout }) {
  return (
    <div className="role-header">
      <h1>{title}</h1>
      <button className="secondary-btn" onClick={onLogout}>
        Logout
      </button>
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
