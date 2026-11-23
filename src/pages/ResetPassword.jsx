import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import AuthLayout from "../layout/AuthLayout";
import AuthCard from "../components/auth/AuthCard";
import AuthInput from "../components/auth/AuthInput";
import AuthButton from "../components/auth/AuthButton";

import { resetPassword } from "../services/authService";

function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!token) {
      setError("This reset link is missing its token. Request a new one.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      await resetPassword(token, password);

      setMessage("Password updated successfully. You can now log in.");

      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <AuthLayout>
      <AuthCard>
        <h1>Set a New Password</h1>

        <p>Choose a new password for your account.</p>

        <form onSubmit={handleSubmit}>
          <AuthInput
            label="New Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <AuthInput
            label="Confirm New Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          {error && <p className="error-message">{error}</p>}

          {message && <p className="success-message">{message}</p>}

          <AuthButton text="Set Password" />
        </form>

        <div className="auth-links">
          <Link to="/">Back to Login</Link>
        </div>
      </AuthCard>
    </AuthLayout>
  );
}

export default ResetPassword;
