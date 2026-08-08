import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaRobot, FaArrowRight } from "react-icons/fa";

function AnimatedNumber({ value = 0, duration = 1000, prefix = "₹" }) {
    const [display, setDisplay] = useState(0);

    useEffect(() => {
        let start = null;
        let animId;
        const target = Number(value) || 0;

        const easeOut = (t) => 1 - Math.pow(1 - t, 3);

        const frame = (time) => {
            if (!start) start = time;
            const progress = Math.min((time - start) / duration, 1);
            setDisplay(target * easeOut(progress));

            if (progress < 1) {
                animId = requestAnimationFrame(frame);
            }
        };

        animId = requestAnimationFrame(frame);
        return () => animId && cancelAnimationFrame(animId);
    }, [value, duration]);

    return (
        <span>
            {prefix}
            {Math.round(display).toLocaleString("en-IN")}
        </span>
    );
}

function AIInsightCard({ insight }) {
    if (!insight) return null;

    return (
        <div className="card shadow-sm mt-4 border-0 rounded-4 overflow-hidden" style={{ background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)" }}>
            <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center py-3 px-4">
                <span className="d-flex align-items-center gap-2 fw-semibold">
                    <FaRobot className="text-primary" /> AI Financial Advisor
                </span>
                <div className="d-flex align-items-center gap-3">
                    {insight.savingsRate !== undefined && (
                        <span className="badge bg-success rounded-pill px-3 py-2">
                            Savings Rate: {Number(insight.savingsRate).toFixed(1)}%
                        </span>
                    )}
                    <Link to="/ai-insights" className="text-white text-decoration-none small d-flex align-items-center gap-1 opacity-75 hover-opacity-100">
                        View Full Details <FaArrowRight size={12} />
                    </Link>
                </div>
            </div>

            <div className="card-body p-4">
                <div className="row text-center mb-3 g-3">
                    <div className="col-md-4">
                        <div className="p-3 rounded-3" style={{ background: "#ecfdf5" }}>
                            <small className="text-success fw-bold text-uppercase">Total Income</small>
                            <h4 className="text-success fw-bold mb-0 mt-1">
                                <AnimatedNumber value={insight.totalIncome} />
                            </h4>
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div className="p-3 rounded-3" style={{ background: "#fef2f2" }}>
                            <small className="text-danger fw-bold text-uppercase">Total Expense</small>
                            <h4 className="text-danger fw-bold mb-0 mt-1">
                                <AnimatedNumber value={insight.totalExpense} />
                            </h4>
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div className="p-3 rounded-3" style={{ background: "#eef2ff" }}>
                            <small className="text-primary fw-bold text-uppercase">Savings</small>
                            <h4 className={`fw-bold mb-0 mt-1 ${(insight.savings || 0) >= 0 ? "text-primary" : "text-danger"}`}>
                                <AnimatedNumber value={insight.savings} />
                            </h4>
                        </div>
                    </div>
                </div>

                <hr className="my-3 opacity-25" />

                <h6 className="fw-bold text-dark mb-2">AI Highlights & Suggestions</h6>
                <p className="fw-medium text-primary mb-3">
                    {insight.message}
                </p>

                {insight.insights && insight.insights.length > 0 && (
                    <ul className="list-group list-group-flush mt-2">
                        {insight.insights.slice(0, 3).map((item, index) => (
                            <li key={index} className="list-group-item d-flex align-items-start px-0 py-2 border-0 bg-transparent">
                                <span className="me-2 text-success">💡</span>
                                <span className="text-secondary">{item}</span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}

export default AIInsightCard;