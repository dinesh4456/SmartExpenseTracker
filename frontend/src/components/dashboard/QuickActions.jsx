import { useNavigate } from "react-router-dom";

import {
    FaPlusCircle,
    FaWallet,
    FaFileInvoice,
    FaEnvelope
} from "react-icons/fa";

import "./QuickActions.css";

function QuickActions() {

    const navigate = useNavigate();

    const actions = [

        {
            title: "Add Expense",
            subtitle: "Record a new expense",
            icon: <FaWallet />,
            color: "#EF4444",
            onClick: () => navigate("/expenses")
        },

        {
            title: "Add Income",
            subtitle: "Record new income",
            icon: <FaPlusCircle />,
            color: "#10B981",
            onClick: () => navigate("/income")
        },

        {
            title: "View Reports",
            subtitle: "Monthly reports",
            icon: <FaFileInvoice />,
            color: "#2563EB",
            onClick: () => navigate("/reports")
        },

        {
            title: "Email Report",
            subtitle: "Send monthly report",
            icon: <FaEnvelope />,
            color: "#8B5CF6",
            onClick: () => navigate("/reports")
        }

    ];

    return (

        <div className="card border-0 shadow-lg rounded-4">

            <div className="card-body">

                <h4 className="fw-bold mb-4">

                    ⚡ Quick Actions

                </h4>

                <div className="row g-4">

                    {

                        actions.map((item, index) => (

                            <div
                                key={index}
                                className="col-xl-3 col-md-6"
                            >

                                <div
                                    className="quick-action-card"
                                    onClick={item.onClick}
                                >

                                    <div
                                        className="quick-action-icon"
                                        style={{
                                            background: item.color
                                        }}
                                    >

                                        {item.icon}

                                    </div>

                                    <div>
                                        <h5>
                                            {item.title}
                                        </h5>

                                        <p>
                                            {item.subtitle}
                                        </p>
                                    </div>

                                </div>

                            </div>

                        ))

                    }

                </div>

            </div>

        </div>

    );

}

export default QuickActions;