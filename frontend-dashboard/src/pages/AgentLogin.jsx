import { Navigate } from "react-router-dom";

// Legacy route: redirect to the unified login
export default function AgentLogin() {
  return <Navigate to="/login" replace />;
}
