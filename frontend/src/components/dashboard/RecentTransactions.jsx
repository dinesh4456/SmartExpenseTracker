import { useEffect, useState } from "react";

import "./RecentTransactions.css";

import {
    FaArrowCircleDown,
    FaCalendarAlt,
    FaTag
} from "react-icons/fa";

import { getRecentTransactions } from "../../services/recentTransactionService";

function RecentTransactions() {

    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    const [filterType, setFilterType] = useState("5"); // "5", "10", "15", "days-5", "days-10", "days-15", "custom"
    const [customDays, setCustomDays] = useState(7);

    useEffect(() => {

        let limit = 5;
        let days = null;

        if (filterType === "5") {
            limit = 5;
        } else if (filterType === "10") {
            limit = 10;
        } else if (filterType === "15") {
            limit = 15;
        } else if (filterType === "days-5") {
            limit = 100;
            days = 5;
        } else if (filterType === "days-10") {
            limit = 100;
            days = 10;
        } else if (filterType === "days-15") {
            limit = 100;
            days = 15;
        } else if (filterType === "custom") {
            limit = 100;
            days = parseInt(customDays, 10) || 1;
        }

        loadTransactions(limit, days);

    }, [filterType, customDays]);

    const loadTransactions = async (limit = 5, days = null) => {

        try {

            setLoading(true);

            const data = await getRecentTransactions(limit, days);

            setTransactions(data);

        } catch (error) {

            console.error(error);

        } finally {

            setLoading(false);

        }

    };

    return (

        <div className="card recent-card">

            <div className="card-body">

                <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">

                    <div>

                        <h4 className="fw-bold mb-1">

                            Recent Transactions

                        </h4>

                        <small className="text-muted">

                            Your latest expense activity

                        </small>

                    </div>

                    <div className="d-flex align-items-center gap-2">

                        <span className="text-muted fw-semibold small">Last:</span>

                        <select
                            className="form-select form-select-sm recent-filter-select"
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                        >
                            <option value="5">5 Transactions</option>
                            <option value="10">10 Transactions</option>
                            <option value="15">15 Transactions</option>
                            <option value="days-5">5 Days</option>
                            <option value="days-10">10 Days</option>
                            <option value="days-15">15 Days</option>
                            <option value="custom">Custom Days</option>
                        </select>

                        {filterType === "custom" && (
                            <input
                                type="number"
                                min="1"
                                max="365"
                                className="form-control form-control-sm custom-days-input"
                                value={customDays}
                                onChange={(e) => setCustomDays(e.target.value)}
                                placeholder="Days"
                                style={{ width: "70px" }}
                            />
                        )}

                    </div>

                </div>

                {

                    loading ?

                        (

                            <div className="text-center py-5">

                                Loading...

                            </div>

                        )

                        :

                        transactions.length === 0 ?

                            (

                                <div className="text-center py-5 text-muted">

                                    No recent transactions found

                                </div>

                            )

                            :

                            transactions.map((item, index) => (

                                <div
                                    key={index}
                                    className="transaction-item d-flex justify-content-between align-items-center"
                                >

                                    <div className="d-flex align-items-center">

                                        <div className="transaction-icon">

                                            <FaArrowCircleDown />

                                        </div>

                                        <div className="ms-3">

                                            <div className="fw-semibold">

                                                <FaTag className="me-2 text-primary"/>

                                                {item.category}

                                            </div>

                                            <small className="text-muted">

                                                <FaCalendarAlt className="me-2"/>

                                                {item.date}

                                            </small>

                                        </div>

                                    </div>

                                    <div className="transaction-amount">

                                        ₹{Number(item.amount).toLocaleString()}

                                    </div>

                                </div>

                            ))

                }

            </div>

        </div>

    );

}

export default RecentTransactions;