import { NavLink, useNavigate } from "react-router-dom";
import { useContext } from "react";

import {
    FaChartPie,
    FaWallet,
    FaMoneyBillWave,
    FaBullseye,
    FaTags,
    FaFileAlt,
    FaUserCircle,
    FaLightbulb,
    FaSignOutAlt
} from "react-icons/fa";

import { AuthContext } from "../../context/AuthContext";

import "./Sidebar.css";

function Sidebar() {

    const navigate = useNavigate();

    const { logout } = useContext(AuthContext);

    const handleLogout = () => {

        logout();

        navigate("/");

    };

    const menu = [

        {
            title: "Dashboard",
            icon: <FaChartPie />,
            path: "/dashboard"
        },

        {
            title: "Expenses",
            icon: <FaWallet />,
            path: "/expenses"
        },

        {
            title: "Income",
            icon: <FaMoneyBillWave />,
            path: "/income"
        },

        {
            title: "Budget",
            icon: <FaBullseye />,
            path: "/budget"
        },

        {
            title: "Categories",
            icon: <FaTags />,
            path: "/categories"
        },

        {
            title: "AI Insights",
            icon: <FaLightbulb />,
            path: "/ai-insights"
        },

        {
            title: "Reports",
            icon: <FaFileAlt />,
            path: "/reports"
        },

        {
            title: "Profile",
            icon: <FaUserCircle />,
            path: "/profile"
        }

    ];


    return (

        <aside className="sidebar">

            <div>

                <div className="logo">

                    <span style={{ fontSize: "36px" }}>💰</span>

                    <div>

                        <h3>Smart Expense</h3>

                        <small>Finance Manager</small>

                    </div>

                </div>

                <nav>

                    {

                        menu.map((item) => (

                            <NavLink

                                key={item.path}

                                to={item.path}

                                className={({ isActive }) =>

                                    isActive

                                        ? "menu active"

                                        : "menu"

                                }

                            >

                                {item.icon}

                                <span>

                                    {item.title}

                                </span>

                            </NavLink>

                        ))

                    }

                </nav>

            </div>

            <button

                className="logout-btn"

                onClick={handleLogout}

            >

                <FaSignOutAlt />

                <span>

                    Logout

                </span>

            </button>

        </aside>

    );

}

export default Sidebar;