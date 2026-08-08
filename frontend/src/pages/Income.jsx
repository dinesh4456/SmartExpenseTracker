import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import {
    saveIncome,
    getAllIncome,
    updateIncome,
    deleteIncome
} from "../services/incomeService";

function Income() {

    const [income, setIncome] = useState({
        source: "",
        amount: "",
        incomeDate: ""
    });

    const [incomeList, setIncomeList] = useState([]);

    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        loadIncome();
    }, []);

    const loadIncome = async () => {

        try {

            const data = await getAllIncome();

            setIncomeList(data);

        } catch (error) {

            console.error(error);

        }

    };

    const handleChange = (e) => {

        setIncome({
            ...income,
            [e.target.name]: e.target.value
        });

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            if (editingId) {

                await updateIncome(editingId, income);

                alert("Income Updated Successfully");

            } else {

                await saveIncome(income);

                alert("Income Saved Successfully");

            }

            await loadIncome();

            setIncome({
                source: "",
                amount: "",
                incomeDate: ""
            });

            setEditingId(null);

        } catch (error) {

            console.error(error);

            alert("Operation Failed");

        }

    };

    const handleEdit = (item) => {

        setIncome({
            source: item.source,
            amount: item.amount,
            incomeDate: item.incomeDate
        });

        setEditingId(item.id);

    };

    const handleDelete = async (id) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this income?"
        );

        if (!confirmDelete) return;

        try {

            await deleteIncome(id);

            alert("Income Deleted Successfully");

            loadIncome();

        } catch (error) {

            console.error(error);

            alert("Delete Failed");

        }

    };

    const cancelEdit = () => {

        setEditingId(null);

        setIncome({
            source: "",
            amount: "",
            incomeDate: ""
        });

    };

    return (

        <MainLayout>

            <h2 className="mb-4">Income</h2>

            <div className="card shadow">

                <div className="card-body">

                    <h5>

                        {editingId ? "Update Income" : "Add Income"}

                    </h5>

                    <form onSubmit={handleSubmit}>

                        <div className="mb-3">

                            <label>Source</label>

                            <input
                                type="text"
                                name="source"
                                className="form-control"
                                value={income.source}
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
                                value={income.amount}
                                onChange={handleChange}
                                required
                            />

                        </div>

                        <div className="mb-3">

                            <label>Date</label>

                            <input
                                type="date"
                                name="incomeDate"
                                className="form-control"
                                value={income.incomeDate}
                                onChange={handleChange}
                                required
                            />

                        </div>

                        <button
                            className={`btn ${editingId ? "btn-warning" : "btn-success"}`}
                            type="submit"
                        >
                            {editingId ? "Update Income" : "Save Income"}
                        </button>

                        {editingId && (
                            <button
                                type="button"
                                className="btn btn-secondary ms-2"
                                onClick={cancelEdit}
                            >
                                Cancel
                            </button>
                        )}

                    </form>

                </div>

            </div>

            <div className="card shadow mt-4">

                <div className="card-body">

                    <h5>Income History</h5>

                    <table className="table table-bordered table-striped">

                        <thead>

                            <tr>

                                <th>Source</th>
                                <th>Amount</th>
                                <th>Date</th>
                                <th>Actions</th>

                            </tr>

                        </thead>

                        <tbody>

                            {

                                incomeList.length > 0 ?

                                    incomeList.map((item) => (

                                        <tr key={item.id}>

                                            <td>{item.source}</td>

                                            <td>₹{item.amount}</td>

                                            <td>{item.incomeDate}</td>

                                            <td>

                                                <button
                                                    className="btn btn-primary btn-sm me-2"
                                                    onClick={() => handleEdit(item)}
                                                >
                                                    Edit
                                                </button>

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
                                            No Income Records Found
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

export default Income;