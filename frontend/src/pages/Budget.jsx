import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import {
    saveBudget,
    getAllBudgets,
    deleteBudget
} from "../services/budgetService";

function Budget() {

    const [budget, setBudget] = useState({
        month: "",
        year: "",
        amount: ""
    });

    const [budgetList, setBudgetList] = useState([]);

    useEffect(() => {
        loadBudgets();
    }, []);

    const loadBudgets = async () => {

        try {

            const data = await getAllBudgets();

            setBudgetList(data);

        } catch (error) {

            console.error(error);

        }

    };

    const handleChange = (e) => {

        setBudget({
            ...budget,
            [e.target.name]: e.target.value
        });

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            await saveBudget(budget);

            alert("Budget Saved Successfully");

            await loadBudgets();

            setBudget({
                month: "",
                year: "",
                amount: ""
            });

        } catch (error) {

            console.error(error);

            alert("Failed to Save Budget");

        }

    };

    const handleDelete = async (id) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this budget?"
        );

        if (!confirmDelete) return;

        try {

            await deleteBudget(id);

            alert("Budget Deleted Successfully");

            loadBudgets();

        } catch (error) {

            console.error(error);

            alert("Failed to Delete Budget");

        }

    };

    return (

        <MainLayout>

            <h2 className="mb-4">Budget Management</h2>

            <div className="card shadow">

                <div className="card-body">

                    <h5>Add Monthly Budget</h5>

                    <form onSubmit={handleSubmit}>

                        <div className="mb-3">

                            <label>Month</label>

                            <input
                                type="text"
                                name="month"
                                className="form-control"
                                placeholder="Example: July"
                                value={budget.month}
                                onChange={handleChange}
                                required
                            />

                        </div>

                        <div className="mb-3">

                            <label>Year</label>

                            <input
                                type="number"
                                name="year"
                                className="form-control"
                                value={budget.year}
                                onChange={handleChange}
                                required
                            />

                        </div>

                        <div className="mb-3">

                            <label>Budget Amount</label>

                            <input
                                type="number"
                                name="amount"
                                className="form-control"
                                value={budget.amount}
                                onChange={handleChange}
                                required
                            />

                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary"
                        >
                            Save Budget
                        </button>

                    </form>

                </div>

            </div>

            <div className="card shadow mt-4">

                <div className="card-body">

                    <h5>Budget History</h5>

                    <table className="table table-bordered table-striped">

                        <thead>

                            <tr>

                                <th>Month</th>

                                <th>Year</th>

                                <th>Amount</th>

                                <th>Action</th>

                            </tr>

                        </thead>

                        <tbody>

                            {

                                budgetList.length > 0 ?

                                    budgetList.map((item) => (

                                        <tr key={item.id}>

                                            <td>{item.month}</td>

                                            <td>{item.year}</td>

                                            <td>₹{item.amount}</td>

                                            <td>

                                                <button
                                                    className="btn btn-danger btn-sm"
                                                    onClick={() => handleDelete(item.id)}
                                                >
                                                    Delete
                                                </button>

                                            </td>

                                        </tr>

                                    ))

                                    :

                                    <tr>

                                        <td
                                            colSpan="4"
                                            className="text-center"
                                        >
                                            No Budget Records Found
                                        </td>

                                    </tr>

                            }

                        </tbody>

                    </table>

                </div>

            </div>

        </MainLayout>

    );

}

export default Budget;