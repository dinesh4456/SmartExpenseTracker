import { useEffect, useState } from "react";

import {
    createBudget,
    updateBudget
} from "../../services/budgetService";

function BudgetForm({
    onSuccess,
    editBudget
}) {

    const [form, setForm] = useState({

        month: "",

        year: "",

        amount: ""

    });

    useEffect(() => {

        if (editBudget) {

            setForm({

                month: editBudget.month || "",

                year: editBudget.year || "",

                amount: editBudget.amount || ""

            });

        } else {

            setForm({

                month: "",

                year: new Date().getFullYear().toString(),

                amount: ""

            });

        }

    }, [editBudget]);

    const handleChange = (e) => {

        setForm({

            ...form,

            [e.target.name]: e.target.value

        });

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        const numAmount = Number(form.amount);
        if (!form.amount || isNaN(numAmount) || numAmount <= 0) {
            alert("Budget amount must be greater than zero.");
            return;
        }

        const numYear = Number(form.year) || new Date().getFullYear();

        try {

            const budget = {

                month: form.month,

                year: numYear,

                amount: numAmount

            };

            if (editBudget) {

                await updateBudget(
                    editBudget.id,
                    budget
                );

                alert("Budget Updated Successfully");

            } else {

                await createBudget(budget);

                alert("Budget Added Successfully");

            }

            onSuccess();

        } catch (error) {

            console.error("Budget save error:", error);
            const msg = error.response?.data?.message || error.response?.data || "Failed to save budget.";
            alert(typeof msg === "string" ? msg : (editBudget ? "Failed to update budget." : "Failed to add budget."));

        }

    };

    return (

        <form onSubmit={handleSubmit}>

            <div className="mb-3">

                <label className="form-label fw-semibold">

                    Month

                </label>

                <select
                    className="form-select"
                    name="month"
                    value={form.month}
                    onChange={handleChange}
                    required
                >
                    <option value="">Select Month</option>
                    <option value="January">January</option>
                    <option value="February">February</option>
                    <option value="March">March</option>
                    <option value="April">April</option>
                    <option value="May">May</option>
                    <option value="June">June</option>
                    <option value="July">July</option>
                    <option value="August">August</option>
                    <option value="September">September</option>
                    <option value="October">October</option>
                    <option value="November">November</option>
                    <option value="December">December</option>
                </select>

            </div>

            <div className="mb-3">

                <label className="form-label fw-semibold">

                    Year

                </label>

                <input
                    className="form-control"
                    type="number"
                    name="year"
                    placeholder="2026"
                    value={form.year}
                    onChange={handleChange}
                    required
                />

            </div>

            <div className="mb-3">

                <label className="form-label fw-semibold">

                    Budget Amount (₹)

                </label>

                <input
                    className="form-control"
                    type="number"
                    name="amount"
                    placeholder="50000"
                    value={form.amount}
                    onChange={handleChange}
                    required
                />

            </div>

            <div className="text-end">

                <button
                    className="btn btn-success"
                    type="submit"
                >

                    {
                        editBudget
                            ? "Update Budget"
                            : "Save Budget"
                    }

                </button>

            </div>

        </form>

    );

}

export default BudgetForm;