import { Navigate } from "react-router-dom";

// Legacy route: redirect to the unified login
export default function CustomerLogin() {
  return <Navigate to="/login" replace />;
}
