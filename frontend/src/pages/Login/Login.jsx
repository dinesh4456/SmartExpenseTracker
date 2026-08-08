import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock, FaWallet } from "react-icons/fa";

import { AuthContext } from "../../context/AuthContext";
import axios from "../../api/axiosConfig";
import "../Auth.css";

function Login() {

    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {

            const response = await axios.post("/auth/login", {
                email,
                password
            });

            if (!response.data.token) {
                setError(response.data.message || "Invalid credentials");
                return;
            }

            login(response.data.token);

            localStorage.setItem(
                "userName",
                response.data.fullName || "User"
            );

            navigate("/dashboard");

        } catch (err) {

            console.error(err);
            const msg = err.response?.data?.message || err.response?.data || "Unable to connect to the server.";
            setError(typeof msg === "string" ? msg : "Login failed.");

        } finally {

            setLoading(false);

        }

    };

    return (

        <div className="auth-wrapper">

            <div className="auth-card">

                <div className="auth-brand">

                    <div className="auth-logo-icon">
                        <FaWallet />
                    </div>

                    <h3>Welcome Back</h3>

                    <p>Log in to your Smart Expense Tracker</p>

                </div>

                {error && (
                    <div className="alert alert-danger py-2 mb-3 small">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin}>

                    <div className="auth-input-group">

                        <label>Email Address</label>

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

                        <label>Password</label>

                        <div className="auth-input-wrapper">

                            <FaLock className="auth-input-icon" />

                            <input
                                type="password"
                                className="auth-input"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />

                        </div>

                    </div>

                    <div className="d-flex justify-content-end mb-3">

                        <span
                            className="auth-link small"
                            onClick={() => navigate("/forgot-password")}
                        >
                            Forgot Password?
                        </span>

                    </div>

                    <button
                        type="submit"
                        className="auth-btn"
                        disabled={loading}
                    >
                        {loading ? "Signing in..." : "Sign In"}
                    </button>

                </form>

                <div className="auth-footer">

                    Don't have an account?{" "}
                    <span
                        className="auth-link"
                        onClick={() => navigate("/register")}
                    >
                        Register
                    </span>

                </div>

            </div>

        </div>

    );

}

export default Login;