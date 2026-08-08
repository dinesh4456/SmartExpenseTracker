import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import {
    saveExpense,
    getAllExpenses,
    deleteExpense
} from "../services/expenseService";

function Expense() {

    const [expense, setExpense] = useState({
        title: "",
        amount: "",
        description: "",
        expenseDate: ""
    });

    const [expenseList, setExpenseList] = useState([]);

    useEffect(() => {
        loadExpenses();
    }, []);

    const loadExpenses = async () => {

        try {

            const data = await getAllExpenses();

            setExpenseList(data);

        } catch (error) {

            console.error(error);

        }

    };

    const handleChange = (e) => {

        setExpense({
            ...expense,
            [e.target.name]: e.target.value
        });

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            await saveExpense(expense);

            alert("Expense Saved Successfully");

            await loadExpenses();

            setExpense({
                title: "",
                amount: "",
                description: "",
                expenseDate: ""
            });

        } catch (error) {

            console.error(error);

            alert("Failed to Save Expense");

        }

    };

    const handleDelete = async (id) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this expense?"
        );

        if (!confirmDelete) return;

        try {

            await deleteExpense(id);

            alert("Expense Deleted Successfully");

            loadExpenses();

        } catch (error) {

            console.error(error);

            alert("Failed to Delete Expense");

        }

    };

    return (

        <MainLayout>

            <h2 className="mb-4">Expense</h2>

            <div className="card shadow">

                <div className="card-body">

                    <h5>Add Expense</h5>

                    <form onSubmit={handleSubmit}>

                        <div className="mb-3">

                            <label>Title</label>

                            <input
                                type="text"
                                name="title"
                                className="form-control"
                                value={expense.title}
                                onChange={handleChange}
                                required
                            />

                        </div>

                        <div className="mb-3">

                            <label>Amount</label>

                            <input
                                type="number"
                                name="amount"
                                className="form-control"
                                value={expense.amount}
                                onChange={handleChange}
                                required
                            />

                        </div>

                        <div className="mb-3">

                            <label>Description</label>

                            <textarea
                                name="description"
                                className="form-control"
                                rows="3"
                                value={expense.description}
                                onChange={handleChange}
                            ></textarea>

                        </div>

                        <div className="mb-3">

                            <label>Date</label>

                            <input
                                type="date"
                                name="expenseDate"
                                className="form-control"
                                value={expense.expenseDate}
                                onChange={handleChange}
                                required
                            />

                        </div>

                        <button
                            className="btn btn-danger"
                            type="submit"
                        >
                            Save Expense
                        </button>

                    </form>

                </div>

            </div>

            <div className="card shadow mt-4">

                <div className="card-body">

                    <h5>Expense History</h5>

                    <table className="table table-bordered table-striped">

                        <thead>

                            <tr>

                                <th>Title</th>

                                <th>Amount</th>

                                <th>Description</th>

                                <th>Date</th>

                                <th>Action</th>

                            </tr>

                        </thead>

                        <tbody>

                            {

                                expenseList.length > 0 ?

                                    expenseList.map((item) => (

                                        <tr key={item.id}>

                                            <td>{item.title}</td>

                                            <td>₹{item.amount}</td>

                                            <td>{item.description}</td>

                                            <td>{item.expenseDate}</td>

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

                                        <td colSpan="5" className="text-center">

                                            No Expense Records Found

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

export default Expense;