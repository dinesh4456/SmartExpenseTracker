import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import { getAIInsights } from "../services/aiInsightService";
import { 
    FaLightbulb, 
    FaArrowUp, 
    FaArrowDown, 
    FaPiggyBank, 
    FaChartPie, 
    FaPercentage, 
    FaSyncAlt 
} from "react-icons/fa";
import "./AIInsights.css";

// Smooth Counting Animation Component
function AnimatedCounter({ value = 0, duration = 1200, prefix = "₹", decimals = 2 }) {
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
        let startTime = null;
        let animationFrameId;
        const target = Number(value) || 0;
        const start = 0;

        const easeOutCubic = (t) => (--t) * t * t + 1;

        const updateCounter = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const elapsed = timestamp - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const current = start + (target - start) * easeOutCubic(progress);

            setDisplayValue(current);

            if (progress < 1) {
                animationFrameId = requestAnimationFrame(updateCounter);
            }
        };

        animationFrameId = requestAnimationFrame(updateCounter);

        return () => {
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }
        };
    }, [value, duration]);

    return (
        <span>
            {prefix}
            {displayValue.toLocaleString("en-IN", {
                minimumFractionDigits: decimals,
                maximumFractionDigits: decimals
            })}
        </span>
    );
}

function AIInsights() {
    const [insight, setInsight] = useState({
        totalIncome: 0,
        totalExpense: 0,
        savings: 0,
        message: "",
        insights: [],
        topCategory: "",
        savingsRate: 0,
        monthComparison: ""
    });
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadInsights();
    }, []);

    const loadInsights = async () => {
        setRefreshing(true);
        setError(null);
        try {
            const data = await getAIInsights();
            setInsight(data || {});
        } catch (err) {
            console.error("Failed to load AI insights:", err);
            setError("Unable to load AI Insights at this moment. Please ensure you have added income or expense records.");
        } finally {
            setLoading(false);
            setTimeout(() => setRefreshing(false), 500);
        }
    };

    return (
        <MainLayout>
            <div className="container-fluid px-0">
                {/* Header */}
                <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
                    <div>
                        <h2 className="fw-bold mb-1 d-flex align-items-center gap-2 text-dark">
                            <span style={{ color: "#4f46e5" }}><FaLightbulb /></span>
                            AI Financial Insights & Suggestions
                        </h2>
                        <p className="text-muted mb-0">
                            Smart financial analysis and personalized recommendations based on your spending patterns.
                        </p>
                    </div>
                    <button 
                        className="btn btn-outline-primary d-flex align-items-center gap-2 rounded-pill px-4 py-2 shadow-sm"
                        onClick={loadInsights}
                        disabled={loading || refreshing}
                        style={{ transition: "all 0.25s ease" }}
                    >
                        <FaSyncAlt className={refreshing ? "fa-spin" : ""} />
                        <span>Refresh Analysis</span>
                    </button>
                </div>

                {loading ? (
                    <div className="text-center py-5">
                        <div className="spinner-border text-primary mb-3" role="status" style={{ width: "3.2rem", height: "3.2rem" }}>
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        <p className="text-muted fw-semibold fs-5">Analyzing your financial trends with AI...</p>
                    </div>
                ) : error ? (
                    <div className="alert alert-warning border-0 shadow-sm p-4 rounded-4 text-center">
                        <h5 className="alert-heading fw-bold mb-2">Notice</h5>
                        <p className="mb-3">{error}</p>
                        <button className="btn btn-primary rounded-pill px-4" onClick={loadInsights}>
                            Try Again
                        </button>
                    </div>
                ) : (
                    <>
                        {/* Animated Metric Overview Cards */}
                        <div className="row g-3 mb-4">
                            {/* Total Income */}
                            <div className="col-12 col-md-4">
                                <div className="card shadow-sm p-3 h-100 ai-metric-card income-card">
                                    <div className="ai-highlight-bar income-bar"></div>
                                    <div className="card-body">
                                        <div className="d-flex align-items-center justify-content-between mb-3">
                                            <span className="text-success fw-bold small text-uppercase letter-spacing">Total Income</span>
                                            <div className="ai-badge-icon income-badge">
                                                <FaArrowUp />
                                            </div>
                                        </div>
                                        <div className="ai-counter-value text-success mb-1">
                                            <AnimatedCounter value={insight.totalIncome} prefix="₹" decimals={2} />
                                        </div>
                                        <small className="text-muted d-block mt-1">Recorded lifetime/monthly income</small>
                                    </div>
                                </div>
                            </div>

                            {/* Total Expense */}
                            <div className="col-12 col-md-4">
                                <div className="card shadow-sm p-3 h-100 ai-metric-card expense-card">
                                    <div className="ai-highlight-bar expense-bar"></div>
                                    <div className="card-body">
                                        <div className="d-flex align-items-center justify-content-between mb-3">
                                            <span className="text-danger fw-bold small text-uppercase letter-spacing">Total Expense</span>
                                            <div className="ai-badge-icon expense-badge">
                                                <FaArrowDown />
                                            </div>
                                        </div>
                                        <div className="ai-counter-value text-danger mb-1">
                                            <AnimatedCounter value={insight.totalExpense} prefix="₹" decimals={2} />
                                        </div>
                                        <small className="text-muted d-block mt-1">Recorded lifetime/monthly expense</small>
                                    </div>
                                </div>
                            </div>

                            {/* Net Savings */}
                            <div className="col-12 col-md-4">
                                <div className="card shadow-sm p-3 h-100 ai-metric-card savings-card">
                                    <div className="ai-highlight-bar savings-bar"></div>
                                    <div className="card-body">
                                        <div className="d-flex align-items-center justify-content-between mb-3">
                                            <span className="text-primary fw-bold small text-uppercase letter-spacing">Net Savings</span>
                                            <div className="ai-badge-icon savings-badge">
                                                <FaPiggyBank />
                                            </div>
                                        </div>
                                        <div className={`ai-counter-value mb-1 ${(insight.savings || 0) >= 0 ? "text-primary" : "text-danger"}`}>
                                            <AnimatedCounter value={insight.savings} prefix="₹" decimals={2} />
                                        </div>
                                        <small className="text-muted d-block mt-1">
                                            {insight.savingsRate ? `Savings Rate: ${insight.savingsRate}%` : "Income minus Expenses"}
                                        </small>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Recommendation Highlight Banner */}
                        <div className="card border-0 shadow-sm rounded-4 mb-4 ai-summary-card">
                            <div className="card-body p-4">
                                <div className="d-flex align-items-center gap-3 mb-3">
                                    <div className="rounded-circle p-3 bg-primary bg-opacity-10 text-primary fs-4 ai-pulse-icon">
                                        <FaLightbulb />
                                    </div>
                                    <div>
                                        <h4 className="fw-bold mb-1 text-dark">Executive AI Summary</h4>
                                        <p className="text-muted mb-0">Overview of your financial health & automated findings</p>
                                    </div>
                                </div>
                                <div className="alert alert-light border rounded-3 p-3 mb-0" style={{ background: "#f8fafc" }}>
                                    <p className="mb-0 fs-6 fw-medium text-dark">
                                        {insight.message || "Your financial data is currently balanced. Keep logging daily expenses to receive more granular suggestions."}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Detailed Suggestions & Insights */}
                        <div className="row g-4">
                            <div className="col-12 col-lg-8">
                                <div className="card border-0 shadow-sm rounded-4 h-100">
                                    <div className="card-header bg-white border-0 pt-4 px-4 pb-0">
                                        <h5 className="fw-bold mb-1 text-dark d-flex align-items-center gap-2">
                                            <span>✨</span> Actionable Financial Tips
                                        </h5>
                                        <p className="text-muted small mb-0">Customized actions to optimize your budget and boost savings</p>
                                    </div>
                                    <div className="card-body p-4">
                                        {insight.insights && insight.insights.length > 0 ? (
                                            <div className="d-flex flex-column gap-3">
                                                {insight.insights.map((item, idx) => (
                                                    <div 
                                                        key={idx} 
                                                        className="d-flex align-items-start gap-3 p-3 rounded-3 ai-tip-item" 
                                                        style={{ background: "#f8fafc" }}
                                                    >
                                                        <span className="badge bg-primary rounded-circle p-2 mt-1">
                                                            {idx + 1}
                                                        </span>
                                                        <div>
                                                            <p className="mb-0 text-dark fw-medium">{item}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-center py-4 text-muted">
                                                <p className="mb-0">No specific warnings at this time. Maintain your healthy spending habits!</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="col-12 col-lg-4">
                                <div className="card border-0 shadow-sm rounded-4 h-100">
                                    <div className="card-header bg-white border-0 pt-4 px-4 pb-0">
                                        <h5 className="fw-bold mb-1 text-dark d-flex align-items-center gap-2">
                                            <FaChartPie className="text-primary" /> Key Metrics
                                        </h5>
                                    </div>
                                    <div className="card-body p-4">
                                        <div className="mb-4">
                                            <span className="text-muted small fw-semibold d-block mb-1">TOP SPENDING AREA</span>
                                            <h5 className="fw-bold text-dark mb-0">
                                                {insight.topCategory || "General Expenses"}
                                            </h5>
                                        </div>

                                        <div className="mb-4">
                                            <span className="text-muted small fw-semibold d-block mb-1">SAVINGS RATIO</span>
                                            <div className="d-flex align-items-center gap-2">
                                                <FaPercentage className="text-primary" />
                                                <h5 className="fw-bold text-dark mb-0">
                                                    {insight.savingsRate != null ? `${insight.savingsRate}%` : "Calculated upon income log"}
                                                </h5>
                                            </div>
                                        </div>

                                        <div>
                                            <span className="text-muted small fw-semibold d-block mb-1">TREND STATUS</span>
                                            <p className="text-muted small mb-0">
                                                {insight.monthComparison || "Consistent spending within historical benchmarks."}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </MainLayout>
    );
}

export default AIInsights;