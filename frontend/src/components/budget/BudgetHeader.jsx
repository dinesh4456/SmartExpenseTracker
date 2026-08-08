import "./BudgetHeader.css";

import { FaPlusCircle } from "react-icons/fa";

function BudgetHeader({ onAddBudget }) {

    return (

        <div className="budget-header">

            <div>

                <h2>

                    💰 Budget Management

                </h2>

                <p>

                    Plan your monthly spending and stay financially disciplined.

                </p>

            </div>

            <button

                className="add-budget-btn"

                onClick={onAddBudget}

            >

                <FaPlusCircle />

                Add Budget

            </button>

        </div>

    );

}

export default BudgetHeader;