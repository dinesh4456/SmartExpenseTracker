import { useState, useEffect } from "react";
import { FaWallet, FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";
import { getBudgetDetails, saveOrUpdateBudget } from "../../services/budgetService";
import "../dashboard/BudgetProgress.css";

const MONTHS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

function BudgetTrackerCard({ onBudgetSaved }) {

    const today = new Date();
    const currentMonthName = MONTHS[today.getMonth()];
    const currentYear = today.getFullYear();

    const [selectedMonth, setSelectedMonth] = useState(currentMonthName);
    const [selectedYear, setSelectedYear] = useState(currentYear);
    const [amount, setAmount] = useState("");
    const [budgetData, setBudgetData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [validationError, setValidationError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const dynamicYears = Array.from({ length: 6 }, (_, i) => currentYear - 2 + i);

    useEffect(() => {
        loadBudget();
    }, [selectedMonth, selectedYear]);

    const loadBudget = async () => {
        setLoading(true);
        setValidationError("");
        setSuccessMessage("");
        try {
            const data = await getBudgetDetails(selectedMonth, selectedYear);
            setBudgetData(data);
            if (data && data.monthlyBudget > 0) {
                setAmount(data.monthlyBudget.toString());
            } else {
                setAmount("");
            }
        } catch (err) {
            console.error("Error loading budget details:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setValidationError("");
        setSuccessMessage("");

        const numAmount = Number(amount);
        if (!amount || isNaN(numAmount) || numAmount <= 0) {
            setValidationError("Budget amount must be a positive number greater than zero.");
            return;
        }

        setSaving(true);
        try {
            await saveOrUpdateBudget({
                month: selectedMonth,
                year: Number(selectedYear),
                amount: numAmount
            });

            setSuccessMessage(`Budget for ${selectedMonth} ${selectedYear} saved successfully!`);
            await loadBudget();
            if (onBudgetSaved) {
                onBudgetSaved();
            }
        } catch (err) {
            console.error(err);
            setValidationError("Failed to save budget. Please check your inputs.");
        } finally {
            setSaving(false);
        }
    };

    const percentage = Math.min(budgetData?.usedPercentage || 0, 100);

    return (

        <div className="budget-card mb-4" style={{ borderRadius: "24px", padding: "30px" }}>

            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
                <div>
                    <h4 className="fw-bold m-0 text-dark">
                        🎯 Set & Track Monthly Budget
                    </h4>
                    <p className="text-muted small m-0 mt-1">
                        Select a month and year to allocate funds and monitor spending limits
                    </p>
                </div>
                {budgetData && (
                    <span className={`fw-bold fs-6 ${budgetData.isOverBudget ? "text-danger" : "text-primary"}`}>
                        {budgetData.usedPercentage ? budgetData.usedPercentage.toFixed(1) : 0}% Used
                    </span>
                )}
            </div>

            {validationError && (
                <div className="alert alert-danger py-2 px-3 mb-3 small">
                    {validationError}
                </div>
            )}

            {successMessage && (
                <div className="alert alert-success py-2 px-3 mb-3 small d-flex align-items-center gap-2">
                    <FaCheckCircle /> {successMessage}
                </div>
            )}

            {/* FORM CONTROLS */}
            <form onSubmit={handleSave} className="row g-3 align-items-end mb-4">

                <div className="col-md-3 col-sm-6">
                    <label className="form-label fw-semibold small text-secondary">
                        Month Selector
                    </label>
                    <select
                        className="form-select"
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(e.target.value)}
                    >
                        {MONTHS.map((m) => (
                            <option key={m} value={m}>
                                {m}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="col-md-3 col-sm-6">
                    <label className="form-label fw-semibold small text-secondary">
                        Year Selector
                    </label>
                    <select
                        className="form-select"
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(Number(e.target.value))}
                    >
                        {dynamicYears.map((y) => (
                            <option key={y} value={y}>
                                {y}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="col-md-3 col-sm-6">
                    <label className="form-label fw-semibold small text-secondary">
                        Budget Amount (₹)
                    </label>
                    <input
                        type="number"
                        min="1"
                        step="any"
                        className="form-control"
                        placeholder="e.g. 30000"
                        value={amount}
                        onChange={(e) => {
                            setAmount(e.target.value);
                            setValidationError("");
                        }}
                        required
                    />
                </div>

                <div className="col-md-3 col-sm-6">
                    <button
                        type="submit"
                        className="btn btn-primary w-100 py-2 fw-semibold"
                        disabled={saving}
                        style={{
                            background: "linear-gradient(135deg, #2563EB, #4F46E5)",
                            borderRadius: "12px",
                            border: "none"
                        }}
                    >
                        {saving ? "Saving..." : "Save Budget"}
                    </button>
                </div>

            </form>

            {/* PROGRESS BAR */}
            <div className="budget-progress mb-3">
                <div
                    className="budget-fill"
                    style={{
                        width: `${percentage}%`,
                        background: budgetData?.isOverBudget
                            ? "#EF4444"
                            : percentage > 80
                            ? "#F59E0B"
                            : "linear-gradient(90deg, #10B981, #059669)"
                    }}
                ></div>
            </div>

            {/* OVER BUDGET WARNING */}
            {budgetData?.isOverBudget && (
                <div className="alert alert-danger py-2 px-3 mb-4 fw-bold d-flex align-items-center gap-2">
                    <FaExclamationTriangle />
                    <span>Budget Exceeded by ₹{Number(budgetData.overBudgetAmount || 0).toLocaleString()}</span>
                </div>
            )}

            {/* FINANCIAL STATS */}
            <div className="budget-details">

                <div>
                    <small>Monthly Budget</small>
                    <h5>₹{Number(budgetData?.monthlyBudget || 0).toLocaleString()}</h5>
                </div>

                <div>
                    <small>Spent</small>
                    <h5 className="text-danger">₹{Number(budgetData?.spent || 0).toLocaleString()}</h5>
                </div>

                <div>
                    <small>Remaining</small>
                    <h5 className="text-success">₹{Number(budgetData?.remaining || 0).toLocaleString()}</h5>
                </div>

                <div>
                    <small>Budget Used</small>
                    <h5 className={budgetData?.isOverBudget ? "text-danger" : "text-primary"}>
                        {budgetData?.usedPercentage ? budgetData.usedPercentage.toFixed(1) : 0}%
                    </h5>
                </div>

            </div>

        </div>

    );

}

export default BudgetTrackerCard;
