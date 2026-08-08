import React from "react";

import {
    FaEdit,
    FaTrash
} from "react-icons/fa";

function CategoryTable({
    categories,
    onEdit,
    onDelete
}) {

    return (

        <div className="category-table-wrapper">

            <table className="category-table">

                <thead>

                    <tr>

                        <th>Category</th>

                        <th>Type</th>

                        <th>Description</th>

                        <th>Actions</th>

                    </tr>

                </thead>

                <tbody>

                    {categories.length === 0 ? (

                        <tr>

                            <td
                                colSpan="4"
                                className="category-empty"
                            >

                                No Categories Found

                            </td>

                        </tr>

                    ) : (

                        categories.map((category) => (

                            <tr key={category.id}>

                                <td>

                                    <div className="category-name">

                                        <span className="category-icon">
                                            🏷️
                                        </span>

                                        <span>
                                            {category.name}
                                        </span>

                                    </div>

                                </td>

                                <td>

                                    <span
                                        className={`category-type ${
                                            category.type === "INCOME"
                                                ? "income-type"
                                                : "expense-type"
                                        }`}
                                    >

                                        {category.type}

                                    </span>

                                </td>

                                <td>

                                    <span className="category-description">

                                        {category.description || "-"}

                                    </span>

                                </td>

                                <td>

                                    {/* EXACT SAME BUTTON MARKUP AS EXPENSE */}

                                    <button
                                        className="table-btn edit"
                                        onClick={() =>
                                            onEdit(category.id)
                                        }
                                    >

                                        <FaEdit />

                                    </button>

                                    <button
                                        className="table-btn delete"
                                        onClick={() =>
                                            onDelete(category.id)
                                        }
                                    >

                                        <FaTrash />

                                    </button>

                                </td>

                            </tr>

                        ))

                    )}

                </tbody>

            </table>

        </div>

    );

}

export default CategoryTable;