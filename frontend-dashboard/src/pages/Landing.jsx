import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "../styles/auth.css";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="login-page">
      <div className="background-layer"></div>

      <motion.div
        className="login-card"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1>Select Login Type</h1>
        <p className="subtitle">
          Choose how you want to access the system
        </p>

        <motion.button
          className="primary-btn"
          onClick={() => navigate("/login/manager")}
          whileHover={{ scale: 1.05 }}
        >
          Manager Login
        </motion.button>

        <motion.button
          className="primary-btn"
          onClick={() => navigate("/login/agent")}
          whileHover={{ scale: 1.05 }}
          style={{ marginTop: "1rem" }}
        >
          Agent Login
        </motion.button>

        <motion.button
          className="primary-btn"
          onClick={() => navigate("/login/customer")}
          whileHover={{ scale: 1.05 }}
          style={{ marginTop: "1rem" }}
        >
          Customer Login
        </motion.button>
      </motion.div>
    </div>
  );
}