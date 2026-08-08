    import { useState } from "react";

    import { createBudget } from "../../services/budgetService";

    function BudgetForm({ onSuccess }) {

        const [form, setForm] = useState({
            month: "",
            year: "",
            amount: ""
        });

        const handleChange = (e) => {

            setForm({
                ...form,
                [e.target.name]: e.target.value
            });

        };

        const handleSubmit = async (e) => {

            e.preventDefault();

            try {

                const budget = {

                    month: form.month,

                    year: Number(form.year),

                    amount: Number(form.amount)

                };

                await createBudget(budget);

                alert("Budget Added Successfully");

                setForm({
                    month: "",
                    year: "",
                    amount: ""
                });

                onSuccess();

            } catch (error) {

                console.error(error);

                alert("Failed to add budget");

            }

        };

        return (

            <form onSubmit={handleSubmit}>

                <div className="mb-3">

                    <label className="form-label">

                        Month

                    </label>

                    <input
                        className="form-control"
                        name="month"
                        placeholder="Example: July"
                        value={form.month}
                        onChange={handleChange}
                        required
                    />

                </div>

                <div className="mb-3">

                    <label className="form-label">

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

                    <label className="form-label">

                        Budget Amount

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

                        Save Budget

                    </button>

                </div>

            </form>

        );

    }

    export default BudgetForm;