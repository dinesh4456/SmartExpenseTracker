import "./CategoryHeader.css";

import { FaPlusCircle } from "react-icons/fa";

function CategoryHeader({ onAddCategory }) {

    return (

        <div className="expense-header">

            <div>

                <h2>
                    🏷️ Categories
                </h2>

                <p>
                    Create, manage and organize your income and expense categories.
                </p>

            </div>

            <button
                className="add-expense-btn"
                onClick={onAddCategory}
            >

                <FaPlusCircle />

                Add Category

            </button>

        </div>

    );

}

export default CategoryHeader;