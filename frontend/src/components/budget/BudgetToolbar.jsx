import "./BudgetToolbar.css";
import { FaSearch, FaCalendar, FaCalendarAlt } from "react-icons/fa";

const MONTHS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

function BudgetToolbar({
    search,
    setSearch,
    month,
    setMonth,
    year,
    setYear,
    availableYears = []
}) {
    const currentYear = new Date().getFullYear();
    const defaultYears = Array.from({ length: 7 }, (_, i) => currentYear - 3 + i);
    const combinedYears = Array.from(new Set([...defaultYears, ...availableYears]))
        .filter(Boolean)
        .sort((a, b) => b - a);

    return (
        <div className="budget-toolbar">
            <div className="budget-search">
                <FaSearch />
                <input
                    type="text"
                    placeholder="Search budgets..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <div className="budget-filter">
                <FaCalendarAlt />
                <select
                    value={month || ""}
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

            <div className="budget-filter">
                <FaCalendar />
                <select
                    value={year || ""}
                    onChange={(e) => setYear(e.target.value)}
                >
                    <option value="">All Years</option>
                    {combinedYears.map((y) => (
                        <option key={y} value={y.toString()}>
                            {y}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
}

export default BudgetToolbar;