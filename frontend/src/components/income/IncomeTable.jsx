import "./IncomeTable.css";

import {

    FaEdit,

    FaTrash

} from "react-icons/fa";

function IncomeTable({

    income = [],

    onEdit,

    onDelete

}) {

    const incomeList = Array.isArray(income)

        ? income

        : [];

    return (

        <div className="income-table-card">

            <table className="table align-middle">

                <thead>

                    <tr>

                        <th>Source</th>

                        <th>Date</th>

                        <th>Amount</th>

                        <th width="120">

                            Action

                        </th>

                    </tr>

                </thead>

                <tbody>

                    {

                        incomeList.length === 0 ?

                        (

                            <tr>

                                <td

                                    colSpan="4"

                                    className="text-center py-5"

                                >

                                    No income records found.

                                </td>

                            </tr>

                        )

                        :

                        incomeList.map(item => (

                            <tr key={item.id}>

                                <td>

                                    <span className="income-source">

                                        {item.source}

                                    </span>

                                </td>

                                <td>

                                    {item.incomeDate}

                                </td>

                                <td className="text-success fw-bold">

                                    ₹{Number(item.amount).toLocaleString()}

                                </td>

                                <td>

                                    <button

                                        className="table-btn edit"

                                        onClick={() => onEdit(item.id)}

                                    >

                                        <FaEdit />

                                    </button>

                                    <button

                                        className="table-btn delete"

                                        onClick={() => onDelete(item.id)}

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

export default IncomeTable;