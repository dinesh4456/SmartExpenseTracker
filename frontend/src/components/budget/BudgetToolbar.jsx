import "./BudgetToolbar.css";

import { FaSearch } from "react-icons/fa";

function BudgetToolbar({

    search,

    setSearch

}) {

    return (

        <div className="budget-toolbar">

            <div className="budget-search">

                <FaSearch />

                <input

                    type="text"

                    placeholder="Search by month..."

                    value={search}

                    onChange={(e) =>

                        setSearch(e.target.value)

                    }

                />

            </div>

        </div>

    );

}

export default BudgetToolbar;