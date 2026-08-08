import "./BudgetTable.css";

import {
    FaEdit,
    FaTrash
} from "react-icons/fa";

function BudgetTable({
    budgets = [],
    onEdit,
    onDelete
}) {

    return (

        <div className="budget-table-card">

            <table className="table align-middle">

                <thead>

                    <tr>

                        <th>Month</th>

                        <th>Year</th>

                        <th>Budget</th>

                        <th width="130">
                            Action
                        </th>

                    </tr>

                </thead>

                <tbody>

                    {
                        budgets.length === 0

                        ?

                        (

                            <tr>

                                <td
                                    colSpan="4"
                                    className="text-center py-5"
                                >

                                    No Budgets Found.

                                </td>

                            </tr>

                        )

                        :

                        budgets.map(budget => (

                            <tr key={budget.id}>

                                <td>
                                    {budget.month}
                                </td>

                                <td>
                                    {budget.year}
                                </td>

                                <td className="text-primary fw-bold">

                                    ₹{Number(
                                        budget.amount
                                    ).toLocaleString()}

                                </td>

                                <td>

                                    <button
                                        type="button"
                                        className="budget-edit-btn"
                                        onClick={() =>
                                            onEdit(budget)
                                        }
                                        title="Edit Budget"
                                    >

                                        <FaEdit />

                                    </button>

                                    <button
                                        type="button"
                                        className="budget-delete-btn"
                                        onClick={() =>
                                            onDelete(budget.id)
                                        }
                                        title="Delete Budget"
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

export default BudgetTable;