import "./ExpenseHeader.css";

import { FaPlusCircle } from "react-icons/fa";

function ExpenseHeader({ onAddExpense }) {

    return (

        <div className="expense-header">

            <div>

                <h2>

                    💸 Expenses

                </h2>

                <p>

                    Track, manage and analyze every expense you make.

                </p>

            </div>

            <button

                className="add-expense-btn"

                onClick={onAddExpense}

            >

                <FaPlusCircle />

                Add Expense

            </button>

        </div>

    );

}

export default ExpenseHeader;