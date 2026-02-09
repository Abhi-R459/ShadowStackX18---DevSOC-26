import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import Welcome from "./pages/Welcome";
import Landing from "./pages/Landing";

import ManagerLogin from "./pages/ManagerLogin";
import AgentLogin from "./pages/AgentLogin";
import CustomerLogin from "./pages/CustomerLogin";
import Login from "./pages/Login";

import ManagerDashboard from "./pages/manager/ManagerDashboard";
import AgentDashboard from "./pages/agent/AgentDashboard";
import CustomerDashboard from "./pages/customer/CustomerDashboard";

import SignupEmail from "./pages/SignupEmail";
import SignupOTP from "./pages/SignupOTP";

import ForgotEmail from "./pages/ForgotEmail";
import ForgotOTP from "./pages/ForgotOTP";
import ResetPassword from "./pages/ResetPassword";
import VerifyEmail from "./pages/VerifyEmail";
import Unauthorized from "./pages/Unauthorized";
import ProtectedRoute from "./components/auth/ProtectedRoute";

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/enter" element={<Landing />} />

          <Route path="/login" element={<Login />} />
          <Route path="/login/manager" element={<ManagerLogin />} />
          <Route path="/login/agent" element={<AgentLogin />} />
          <Route path="/login/customer" element={<CustomerLogin />} />

          <Route path="/signup" element={<SignupEmail />} />
          <Route path="/signup/verify" element={<SignupOTP />} />

          <Route path="/forgot" element={<ForgotEmail />} />
          <Route path="/forgot/verify" element={<ForgotOTP />} />
          <Route path="/forgot/reset" element={<ResetPassword />} />

          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          <Route
            path="/manager"
            element={
              <ProtectedRoute allowedRoles={["manager"]}>
                <ManagerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/agent"
            element={
              <ProtectedRoute allowedRoles={["agent"]}>
                <AgentDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/customer"
            element={
              <ProtectedRoute allowedRoles={["customer"]}>
                <CustomerDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
