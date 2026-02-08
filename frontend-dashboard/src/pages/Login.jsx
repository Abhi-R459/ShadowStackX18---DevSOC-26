import { motion } from "framer-motion";
import LoginForm from "../components/auth/LoginForm";
import "../styles/auth.css";

export default function Login() {
  return (
    <div className="login-page">
      <motion.div
        className="background-layer"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
      />

      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{
          duration: 0.8,
          ease: "easeOut"
        }}
      >
        <LoginForm />
      </motion.div>
    </div>
  );
}