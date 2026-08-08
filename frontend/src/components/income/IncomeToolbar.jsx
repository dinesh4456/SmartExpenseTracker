import "./IncomeToolbar.css";
import { FaSearch, FaCalendarAlt, FaCalendar } from "react-icons/fa";

const MONTHS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

function IncomeToolbar({
    search,
    setSearch,
    month,
    setMonth,
    year,
    setYear
}) {

    const currentYear = new Date().getFullYear();
    const dynamicYears = Array.from({ length: 7 }, (_, i) => currentYear - 3 + i);

    return (

        <div className="income-toolbar">

            <div className="toolbar-search">
                <FaSearch />
                <input
                    type="text"
                    placeholder="Search income source..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <div className="toolbar-date">
                <FaCalendarAlt />
                <select
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                >
                    <option value="">All Months</option>
                    {MONTHS.map((m) => (
                        <option key={m} value={m}>
                            {m}
                        </option>
                    ))}
                </select>
            </div>

            <div className="toolbar-date">
                <FaCalendar />
                <select
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                >
                    <option value="">All Years</option>
                    {dynamicYears.map((y) => (
                        <option key={y} value={y.toString()}>
                            {y}
                        </option>
                    ))}
                </select>
            </div>

        </div>

    );

}

export default IncomeToolbar;