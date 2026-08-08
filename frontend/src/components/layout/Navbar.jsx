import { useContext, useState, useRef, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

import {
    FaBell,
    FaSignOutAlt,
    FaCheckCircle,
    FaChartLine,
    FaLightbulb,
    FaWallet
} from "react-icons/fa";

import "./Navbar.css";

function Navbar() {

    const { logout } = useContext(AuthContext);

    const navigate = useNavigate();

    const [showNotifications, setShowNotifications] = useState(false);
    const [unread, setUnread] = useState(true);

    const notificationRef = useRef(null);

    const handleLogout = () => {

        logout();

        navigate("/");

    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (notificationRef.current && !notificationRef.current.contains(event.target)) {
                setShowNotifications(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const notifications = [
        {
            id: 1,
            title: "Monthly Report Ready",
            desc: "Your monthly financial summary and charts are ready for download.",
            icon: <FaChartLine className="text-primary" />,
            time: "Just now",
            link: "/reports"
        },
        {
            id: 2,
            title: "Smart AI Tip",
            desc: "Personalized savings recommendations are available in AI Insights.",
            icon: <FaLightbulb className="text-warning" />,
            time: "10 mins ago",
            link: "/dashboard"
        },
        {
            id: 3,
            title: "Budget Status",
            desc: "Keep an eye on category limits to maximize your monthly savings.",
            icon: <FaWallet className="text-success" />,
            time: "Today",
            link: "/budget"
        }
    ];

    const today = new Date().toLocaleDateString("en-IN", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
    });

    return (

        <nav className="premium-navbar">

            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    width: "100%"
                }}
            >

                {/* LEFT SIDE */}
                <div
                    className="navbar-left"
                    style={{
                        marginLeft: "0",
                        paddingLeft: "0",
                        alignItems: "flex-start",
                        textAlign: "left",
                        flex: 1
                    }}
                >

                    <h2 className="navbar-title">

                        Dashboard

                    </h2>

                    <small className="navbar-date">

                        {today}

                    </small>

                </div>

                {/* RIGHT SIDE */}
                <div
                    className="navbar-right"
                    ref={notificationRef}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "16px",
                        marginTop: "-10px",
                        flexShrink: 0,
                        position: "relative"
                    }}
                >

                    <button
                        className="icon-btn"
                        onClick={() => {
                            setShowNotifications(!showNotifications);
                            setUnread(false);
                        }}
                        title="Notifications"
                    >

                        <FaBell />

                        {unread && <span className="notification-dot"></span>}

                    </button>

                    {showNotifications && (
                        <div className="notification-dropdown shadow-lg">
                            <div className="notification-header d-flex justify-content-between align-items-center">
                                <h6 className="mb-0 fw-bold">Notifications</h6>
                                <span className="badge bg-primary rounded-pill">3 New</span>
                            </div>
                            <div className="notification-list">
                                {notifications.map((item) => (
                                    <div
                                        key={item.id}
                                        className="notification-item"
                                        onClick={() => {
                                            setShowNotifications(false);
                                            navigate(item.link);
                                        }}
                                    >
                                        <div className="notification-icon-wrapper">
                                            {item.icon}
                                        </div>
                                        <div className="notification-content">
                                            <div className="notification-title">{item.title}</div>
                                            <div className="notification-desc">{item.desc}</div>
                                            <small className="notification-time">{item.time}</small>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="notification-footer text-center">
                                <small
                                    className="text-primary fw-semibold"
                                    style={{ cursor: "pointer" }}
                                    onClick={() => setShowNotifications(false)}
                                >
                                    Close
                                </small>
                            </div>
                        </div>
                    )}

                    <button
                        className="logout-navbar-btn"
                        onClick={handleLogout}
                        title="Logout"
                    >

                        <FaSignOutAlt />

                    </button>

                </div>

            </div>

        </nav>

    );

}

export default Navbar;