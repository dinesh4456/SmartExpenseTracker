import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaKey, FaEnvelope, FaLock } from "react-icons/fa";

import axios from "../api/axiosConfig";
import "./Auth.css";

function ForgotPassword() {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleReset = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");

        if (!email.trim()) {
            setError("Please enter your registered email address.");
            return;
        }

        if (newPassword.length < 6) {
            setError("New password must be at least 6 characters.");
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setLoading(true);

        try {

            const response = await axios.post("/auth/forgot-password", {
                email,
                newPassword
            });

            setMessage(response.data || "Password reset successfully!");
            alert(response.data || "Password reset successfully! Please login with your new password.");
            navigate("/");

        } catch (err) {

            console.error(err);
            const msg = err.response?.data?.message || err.response?.data || "Failed to reset password. Please try again.";
            setError(typeof msg === "string" ? msg : "Failed to reset password.");

        } finally {

            setLoading(false);

        }

    };

    return (

        <div className="auth-wrapper">

            <div className="auth-card">

                <div className="auth-brand">

                    <div className="auth-logo-icon">
                        <FaKey />
                    </div>

                    <h3>Reset Password</h3>

                    <p>Enter your email to set a new password</p>

                </div>

                {error && (
                    <div className="alert alert-danger py-2 mb-3 small">
                        {error}
                    </div>
                )}

                {message && (
                    <div className="alert alert-success py-2 mb-3 small">
                        {message}
                    </div>
                )}

                <form onSubmit={handleReset}>

                    <div className="auth-input-group">

                        <label>Registered Email</label>

                        <div className="auth-input-wrapper">

                            <FaEnvelope className="auth-input-icon" />

                            <input
                                type="email"
                                className="auth-input"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />

                        </div>

                    </div>

                    <div className="auth-input-group">

                        <label>New Password</label>

                        <div className="auth-input-wrapper">

                            <FaLock className="auth-input-icon" />

                            <input
                                type="password"
                                className="auth-input"
                                placeholder="Min 6 characters"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                            />

                        </div>

                    </div>

                    <div className="auth-input-group">

                        <label>Confirm Password</label>

                        <div className="auth-input-wrapper">

                            <FaLock className="auth-input-icon" />

                            <input
                                type="password"
                                className="auth-input"
                                placeholder="Re-enter new password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />

                        </div>

                    </div>

                    <button
                        type="submit"
                        className="auth-btn"
                        disabled={loading}
                    >
                        {loading ? "Resetting Password..." : "Reset Password"}
                    </button>

                </form>

                <div className="auth-footer">

                    Remember your password?{" "}
                    <span
                        className="auth-link"
                        onClick={() => navigate("/")}
                    >
                        Sign In
                    </span>

                </div>

            </div>

        </div>

    );

}

export default ForgotPassword;
