import "./CategoryToolbar.css";

import {
    FaSearch,
    FaFilter
} from "react-icons/fa";

function CategoryToolbar({

    search,

    setSearch,

    type,

    setType

}) {

    return (

        <div className="expense-toolbar">

            <div className="toolbar-search">

                <FaSearch />

                <input
                    type="text"
                    placeholder="Search categories..."
                    value={search}
                    onChange={(e) =>
                        setSearch(e.target.value)
                    }
                />

            </div>

            <div className="toolbar-filter">

                <FaFilter />

                <select
                    value={type}
                    onChange={(e) =>
                        setType(e.target.value)
                    }
                >

                    <option value="">
                        All Types
                    </option>

                    <option value="EXPENSE">
                        Expense
                    </option>

                    <option value="INCOME">
                        Income
                    </option>

                </select>

            </div>

        </div>

    );

}

export default CategoryToolbar;