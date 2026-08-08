import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaLock, FaUserPlus } from "react-icons/fa";

import axios from "../api/axiosConfig";
import "./Auth.css";

function Register() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: ""
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError("");
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError("");

        if (!formData.fullName.trim()) {
            setError("Full Name is required.");
            return;
        }

        if (!formData.email.trim()) {
            setError("Email is required.");
            return;
        }

        if (formData.password.length < 6) {
            setError("Password must contain at least 6 characters.");
            return;
        }

        setLoading(true);

        try {

            const response = await axios.post(
                "/auth/register",
                formData
            );

            alert(response.data || "Registration successful! Please login.");
            navigate("/");

        } catch (err) {

            console.error(err);
            const msg = err.response?.data?.message || err.response?.data || "Registration failed.";
            setError(typeof msg === "string" ? msg : "Registration failed.");

        } finally {

            setLoading(false);

        }

    };

    return (

        <div className="auth-wrapper">

            <div className="auth-card">

                <div className="auth-brand">

                    <div className="auth-logo-icon">
                        <FaUserPlus />
                    </div>

                    <h3>Create Account</h3>

                    <p>Start tracking your expenses intelligently</p>

                </div>

                {error && (
                    <div className="alert alert-danger py-2 mb-3 small">
                        {error}
                    </div>
                )}

                <form onSubmit={handleRegister}>

                    <div className="auth-input-group">

                        <label>Full Name</label>

                        <div className="auth-input-wrapper">

                            <FaUser className="auth-input-icon" />

                            <input
                                type="text"
                                name="fullName"
                                className="auth-input"
                                placeholder="Your full name"
                                value={formData.fullName}
                                onChange={handleChange}
                                required
                            />

                        </div>

                    </div>

                    <div className="auth-input-group">

                        <label>Email Address</label>

                        <div className="auth-input-wrapper">

                            <FaEnvelope className="auth-input-icon" />

                            <input
                                type="email"
                                name="email"
                                className="auth-input"
                                placeholder="name@example.com"
                                value={formData.email}
                                onChange={handleChange}
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
                                name="password"
                                className="auth-input"
                                placeholder="At least 6 characters"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />

                        </div>

                    </div>

                    <button
                        type="submit"
                        className="auth-btn"
                        disabled={loading}
                    >
                        {loading ? "Creating Account..." : "Register"}
                    </button>

                </form>

                <div className="auth-footer">

                    Already have an account?{" "}
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

export default Register;