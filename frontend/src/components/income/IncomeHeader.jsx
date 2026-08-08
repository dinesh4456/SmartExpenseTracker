import "./IncomeHeader.css";

import { FaPlusCircle } from "react-icons/fa";

function IncomeHeader({ onAddIncome }) {

    return (

        <div className="income-header">

            <div>

                <h2>

                    💰 Income

                </h2>

                <p>

                    Track and manage all your income sources.

                </p>

            </div>

            <button

                className="add-income-btn"

                onClick={onAddIncome}

            >

                <FaPlusCircle />

                Add Income

            </button>

        </div>

    );

}

export default IncomeHeader;