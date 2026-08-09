import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    FaKey,
    FaEnvelope,
    FaLock,
    FaShieldAlt,
    FaArrowLeft,
    FaEye,
    FaEyeSlash,
    FaCheckCircle
} from "react-icons/fa";

import axios from "../api/axiosConfig";
import "./Auth.css";

function ForgotPassword() {
    const navigate = useNavigate();

    // Step state: 1 = Enter Email, 2 = Verify OTP, 3 = Reset Password, 4 = Success
    const [step, setStep] = useState(1);

    // Form inputs
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    // UI states
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [resending, setResending] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    // Resend countdown timer
    const [timer, setTimer] = useState(0);

    useEffect(() => {
        let interval = null;
        if (timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [timer]);

    // Step 1: Send OTP to Email
    const handleSendOtp = async (e) => {
        if (e) e.preventDefault();
        setError("");
        setMessage("");

        const cleanedEmail = email.trim();
        if (!cleanedEmail) {
            setError("Please enter your registered email address.");
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post("/auth/send-otp", {
                email: cleanedEmail
            });

            setMessage(response.data || "OTP verification code sent to your email!");
            setStep(2);
            setTimer(60); // 60s cooldown
        } catch (err) {
            console.error("Send OTP error:", err);
            const msg = err.response?.data?.message || err.response?.data || "Failed to send OTP. Please ensure the email is registered.";
            setError(typeof msg === "string" ? msg : "Failed to send OTP.");
        } finally {
            setLoading(false);
        }
    };

    // Resend OTP
    const handleResendOtp = async () => {
        if (timer > 0 || resending) return;
        setError("");
        setMessage("");
        setResending(true);

        try {
            const response = await axios.post("/auth/send-otp", {
                email: email.trim()
            });
            setMessage(response.data || "A new OTP code has been sent to your email.");
            setTimer(60);
        } catch (err) {
            console.error("Resend OTP error:", err);
            const msg = err.response?.data?.message || err.response?.data || "Failed to resend OTP.";
            setError(typeof msg === "string" ? msg : "Failed to resend OTP.");
        } finally {
            setResending(false);
        }
    };

    // Step 2: Verify OTP
    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");

        const cleanedOtp = otp.trim();
        if (!cleanedOtp || cleanedOtp.length !== 6) {
            setError("Please enter the 6-digit OTP code sent to your email.");
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post("/auth/verify-otp", {
                email: email.trim(),
                otp: cleanedOtp
            });

            setMessage(response.data || "OTP verified successfully!");
            setStep(3);
        } catch (err) {
            console.error("Verify OTP error:", err);
            const msg = err.response?.data?.message || err.response?.data || "Invalid or expired OTP. Please try again.";
            setError(typeof msg === "string" ? msg : "Invalid OTP entered.");
        } finally {
            setLoading(false);
        }
    };

    // Step 3: Reset Password
    const handleResetPassword = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");

        if (!newPassword || newPassword.length < 6) {
            setError("New password must be at least 6 characters long.");
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match. Please re-enter.");
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post("/auth/reset-password", {
                email: email.trim(),
                otp: otp.trim(),
                newPassword: newPassword
            });

            setMessage(response.data || "Password reset successfully!");
            setStep(4);
        } catch (err) {
            console.error("Reset Password error:", err);
            const msg = err.response?.data?.message || err.response?.data || "Failed to reset password. Please try again.";
            setError(typeof msg === "string" ? msg : "Failed to reset password.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-wrapper">
            <div className="auth-card">

                {/* Back Button for Steps 2 & 3 */}
                {step > 1 && step < 4 && (
                    <button
                        type="button"
                        className="auth-back-btn"
                        onClick={() => {
                            setError("");
                            setMessage("");
                            setStep((prev) => prev - 1);
                        }}
                    >
                        <FaArrowLeft /> Back
                    </button>
                )}

                {/* Header */}
                <div className="auth-brand">
                    <div className="auth-logo-icon">
                        {step === 4 ? <FaCheckCircle /> : step === 2 ? <FaShieldAlt /> : <FaKey />}
                    </div>
                    <h3>
                        {step === 1 && "Forgot Password"}
                        {step === 2 && "Enter OTP Code"}
                        {step === 3 && "Set New Password"}
                        {step === 4 && "Password Reset!"}
                    </h3>
                    <p>
                        {step === 1 && "Enter your registered email to receive an OTP code"}
                        {step === 2 && `Enter the 6-digit OTP code sent to ${email}`}
                        {step === 3 && "Create a secure new password for your account"}
                        {step === 4 && "Your password has been successfully updated"}
                    </p>
                </div>

                {/* Step Indicators (Steps 1-3) */}
                {step < 4 && (
                    <div className="auth-steps-indicator">
                        <div className={`auth-step-pill ${step === 1 ? "active" : step > 1 ? "completed" : ""}`}>
                            <span className="auth-step-number">{step > 1 ? "✓" : "1"}</span>
                            <span>Email</span>
                        </div>
                        <div className={`auth-step-pill ${step === 2 ? "active" : step > 2 ? "completed" : ""}`}>
                            <span className="auth-step-number">{step > 2 ? "✓" : "2"}</span>
                            <span>Verify OTP</span>
                        </div>
                        <div className={`auth-step-pill ${step === 3 ? "active" : ""}`}>
                            <span className="auth-step-number">3</span>
                            <span>New Password</span>
                        </div>
                    </div>
                )}

                {/* Feedback Alerts */}
                {error && (
                    <div className="alert alert-danger py-2 mb-3 small" role="alert">
                        {error}
                    </div>
                )}

                {message && step < 4 && (
                    <div className="alert alert-success py-2 mb-3 small" role="alert">
                        {message}
                    </div>
                )}

                {/* STEP 1: Enter Email */}
                {step === 1 && (
                    <form onSubmit={handleSendOtp}>
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
                                    autoFocus
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="auth-btn"
                            disabled={loading || !email.trim()}
                        >
                            {loading ? "Sending OTP Code..." : "Send OTP Code"}
                        </button>
                    </form>
                )}

                {/* STEP 2: Enter OTP Code */}
                {step === 2 && (
                    <form onSubmit={handleVerifyOtp}>
                        <div className="auth-input-group">
                            <label>6-Digit OTP Code</label>
                            <div className="auth-input-wrapper">
                                <input
                                    type="text"
                                    maxLength={6}
                                    className="auth-input auth-otp-input"
                                    placeholder="••••••"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ""))}
                                    required
                                    autoFocus
                                />
                            </div>
                            <div className="auth-resend-row">
                                <span>Didn't receive code?</span>
                                {timer > 0 ? (
                                    <span className="text-muted">Resend in {timer}s</span>
                                ) : (
                                    <button
                                        type="button"
                                        className="auth-resend-btn"
                                        onClick={handleResendOtp}
                                        disabled={resending}
                                    >
                                        {resending ? "Sending..." : "Resend OTP"}
                                    </button>
                                )}
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="auth-btn"
                            disabled={loading || otp.trim().length !== 6}
                        >
                            {loading ? "Verifying..." : "Verify OTP Code"}
                        </button>
                    </form>
                )}

                {/* STEP 3: Enter New Password & Confirm Password */}
                {step === 3 && (
                    <form onSubmit={handleResetPassword}>
                        <div className="auth-input-group">
                            <label>New Password</label>
                            <div className="auth-input-wrapper">
                                <FaLock className="auth-input-icon" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    className="auth-input"
                                    placeholder="Min 6 characters"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                    autoFocus
                                />
                                <button
                                    type="button"
                                    className="auth-input-toggle"
                                    onClick={() => setShowPassword(!showPassword)}
                                    title={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                        </div>

                        <div className="auth-input-group">
                            <label>Confirm New Password</label>
                            <div className="auth-input-wrapper">
                                <FaLock className="auth-input-icon" />
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    className="auth-input"
                                    placeholder="Re-enter new password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    className="auth-input-toggle"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    title={showConfirmPassword ? "Hide password" : "Show password"}
                                >
                                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="auth-btn"
                            disabled={loading || !newPassword || !confirmPassword}
                        >
                            {loading ? "Updating Password..." : "Update Password"}
                        </button>
                    </form>
                )}

                {/* STEP 4: Success Screen */}
                {step === 4 && (
                    <div className="text-center">
                        <div className="alert alert-success py-3 mb-4">
                            <strong>Success!</strong> Your password has been updated securely.
                        </div>
                        <button
                            type="button"
                            className="auth-btn"
                            onClick={() => navigate("/")}
                        >
                            Proceed to Sign In
                        </button>
                    </div>
                )}

                {/* Footer Link */}
                {step !== 4 && (
                    <div className="auth-footer">
                        Remember your password?{" "}
                        <span
                            className="auth-link"
                            onClick={() => navigate("/")}
                        >
                            Sign In
                        </span>
                    </div>
                )}

            </div>
        </div>
    );
}

export default ForgotPassword;
