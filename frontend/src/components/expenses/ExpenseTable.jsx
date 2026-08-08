import "./ExpenseTable.css";

import {
    FaEdit,
    FaTrash
} from "react-icons/fa";

function ExpenseTable({

    expenses = [],

    onEdit,

    onDelete

}) {

    const expenseList = Array.isArray(expenses)
        ? expenses
        : [];

    const getCategoryName = (expense) => {
        if (!expense) return "-";
        if (typeof expense.category === "object" && expense.category !== null) {
            return expense.category.name || "-";
        }
        if (typeof expense.category === "string" && expense.category.trim() !== "") {
            return expense.category;
        }
        if (expense.categoryName) {
            return expense.categoryName;
        }
        return "-";
    };

    return (

        <div className="expense-table-card">

            <table className="table align-middle">

                <thead>

                    <tr>

                        <th>Title</th>

                        <th>Category</th>

                        <th>Date</th>

                        <th>Amount</th>

                        <th width="120">

                            Action

                        </th>

                    </tr>

                </thead>

                <tbody>

                    {

                        expenseList.length === 0 ?

                        (

                            <tr>

                                <td
                                    colSpan="5"
                                    className="text-center py-5"
                                >

                                    No expenses available.

                                </td>

                            </tr>

                        )

                        :

                        expenseList.map(expense => (

                            <tr key={expense.id}>

                                <td>

                                    {expense.title}

                                </td>

                                <td>

                                    <span className="expense-badge">

                                        {getCategoryName(expense)}

                                    </span>

                                </td>

                                <td>

                                    {expense.expenseDate}

                                </td>

                                <td className="text-danger fw-bold">

                                    ₹{Number(expense.amount || 0).toLocaleString()}

                                </td>

                                <td>

                                    <button
                                        className="table-btn edit"
                                        onClick={() => onEdit(expense.id ? expense.id : expense)}
                                        title="Edit"
                                    >

                                        <FaEdit />

                                    </button>

                                    <button
                                        className="table-btn delete"
                                        onClick={() => onDelete(expense.id)}
                                        title="Delete"
                                    >

                                        <FaTrash />

                                    </button>

                                </td>

                            </tr>

                        ))

                    }

                </tbody>

            </table>

        </div>

    );

}

export default ExpenseTable;