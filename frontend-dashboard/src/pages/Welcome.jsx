import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "../styles/auth.css";

export default function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="login-page">
      <div className="background-layer"></div>

      <motion.div
        className="login-card"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
      >
        <h1>Welcome</h1>

        <p className="subtitle">
          Financial Conversation Intelligence System
        </p>

        <motion.button
          className="primary-btn"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/enter")}
          style={{ marginTop: "1.5rem" }}
        >
          Enter
        </motion.button>
      </motion.div>
    </div>
  );
}