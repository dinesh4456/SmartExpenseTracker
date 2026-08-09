import { useEffect, useState } from "react";
import { getBudgetDetails } from "../../services/budgetService";
import "./BudgetProgress.css";

function BudgetProgress({ month, year }) {

    const [budgetData, setBudgetData] = useState({
        monthlyBudget: 0,
        spent: 0,
        remaining: 0,
        usedPercentage: 0,
        overBudgetAmount: 0,
        isOverBudget: false,
        month: ""
    });

    useEffect(() => {
        loadData();
    }, [month, year]);

    const loadData = async () => {
        try {
            const data = await getBudgetDetails(month, year);
            if (data && !Array.isArray(data)) {
                setBudgetData(data);
            } else if (Array.isArray(data) && data.length > 0) {
                const summary = await getBudgetDetails(data[0].month, data[0].year);
                if (summary) setBudgetData(summary);
            }
        } catch (err) {
            console.error("Failed to load budget progress", err);
        }
    };

    const percentage = Math.min(budgetData.usedPercentage || 0, 100);

    return (

        <div className="budget-card">

            <div className="budget-header">

                <div>

                    <h4>

                        🎯 Monthly Budget {budgetData.month ? `(${budgetData.month})` : ""}

                    </h4>

                    <p>

                        Track your current month spending & limits

                    </p>

                </div>

                <span className={budgetData.isOverBudget ? "text-danger fw-bold" : ""}>

                    {budgetData.usedPercentage ? budgetData.usedPercentage.toFixed(1) : 0}% Used

                </span>

            </div>

            <div className="budget-progress">

                <div

                    className="budget-fill"

                    style={{

                        width: `${percentage}%`,
                        background: budgetData.isOverBudget
                            ? "#EF4444"
                            : percentage > 80
                            ? "#F59E0B"
                            : "linear-gradient(90deg, #10B981, #059669)"

                    }}

                ></div>

            </div>

            {budgetData.isOverBudget && (
                <div className="alert alert-danger py-2 px-3 mt-3 mb-0 fw-bold d-flex align-items-center justify-content-between">
                    <span>⚠️ Budget Exceeded by ₹{Number(budgetData.overBudgetAmount || 0).toLocaleString()}</span>
                </div>
            )}

            <div className="budget-details">

                <div>

                    <small>

                        Monthly Budget

                    </small>

                    <h5>

                        ₹{Number(budgetData.monthlyBudget || 0).toLocaleString()}

                    </h5>

                </div>

                <div>

                    <small>

                        Spent

                    </small>

                    <h5 className="text-danger">

                        ₹{Number(budgetData.spent || 0).toLocaleString()}

                    </h5>

                </div>

                <div>

                    <small>

                        Remaining

                    </small>

                    <h5 className="text-success">

                        ₹{Number(budgetData.remaining || 0).toLocaleString()}

                    </h5>

                </div>

            </div>

        </div>

    );

}

export default BudgetProgress;