import "./ExpenseToolbar.css";
import { useEffect, useState } from "react";
import { FaSearch, FaFilter, FaCalendarAlt, FaCalendar } from "react-icons/fa";
import { getCategories } from "../../services/categoryService";

const MONTHS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

function ExpenseToolbar({
    search,
    setSearch,
    category,
    setCategory,
    month,
    setMonth,
    year,
    setYear
}) {

    const [categories, setCategories] = useState([]);
    const currentYear = new Date().getFullYear();
    const dynamicYears = Array.from({ length: 7 }, (_, i) => currentYear - 3 + i);

    useEffect(() => {
        const load = async () => {
            try {
                const data = await getCategories();
                if (Array.isArray(data)) {
                    setCategories(data);
                }
            } catch (err) {
                console.error("Failed to load categories in toolbar:", err);
            }
        };
        load();
    }, []);

    return (

        <div className="expense-toolbar">

            <div className="toolbar-search">
                <FaSearch />
                <input
                    type="text"
                    placeholder="Search expenses..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <div className="toolbar-filter">
                <FaFilter />
                <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                >
                    <option value="">All Categories</option>
                    {categories.map((c) => (
                        <option key={c.id || c.name} value={c.name}>
                            {c.name}
                        </option>
                    ))}
                    {categories.length === 0 && (
                        <>
                            <option value="Food">Food</option>
                            <option value="Travel">Travel</option>
                            <option value="Bills">Bills</option>
                            <option value="Shopping">Shopping</option>
                        </>
                    )}
                </select>
            </div>

            <div className="toolbar-filter">
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

            <div className="toolbar-filter">
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

export default ExpenseToolbar;