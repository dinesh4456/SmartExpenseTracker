import { Link } from "react-router-dom";
import { FaHome, FaExclamationTriangle } from "react-icons/fa";

function NotFound() {
    return (
        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
                color: "#fff",
                padding: "20px",
                textAlign: "center"
            }}
        >
            <div
                style={{
                    maxWidth: "500px",
                    padding: "40px",
                    borderRadius: "16px",
                    background: "rgba(255, 255, 255, 0.05)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.4)"
                }}
            >
                <div style={{ fontSize: "64px", color: "#f59e0b", marginBottom: "16px" }}>
                    <FaExclamationTriangle />
                </div>
                <h1 style={{ fontSize: "3rem", fontWeight: "700", marginBottom: "8px" }}>404</h1>
                <h3 style={{ fontSize: "1.5rem", fontWeight: "600", marginBottom: "16px", color: "#e2e8f0" }}>
                    Page Not Found
                </h3>
                <p style={{ color: "#94a3b8", marginBottom: "28px", lineHeight: "1.6" }}>
                    The page you are looking for doesn't exist or has been moved.
                </p>
                <Link
                    to="/dashboard"
                    style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "8px",
                        padding: "12px 28px",
                        backgroundColor: "#4f46e5",
                        color: "#fff",
                        textDecoration: "none",
                        borderRadius: "8px",
                        fontWeight: "600",
                        transition: "all 0.2s ease"
                    }}
                >
                    <FaHome /> Back to Dashboard
                </Link>
            </div>
        </div>
    );
}

export default NotFound;
