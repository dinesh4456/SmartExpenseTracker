import "./ReportSummary.css";

import {
    FaMoneyBillWave,
    FaReceipt,
    FaPiggyBank,
    FaCalendarAlt
} from "react-icons/fa";

function ReportSummary({ reports = [] }) {

    const reportList = Array.isArray(reports)
        ? reports
        : [];

    const totalIncome = reportList.reduce(

        (total, report) =>

            total + Number(report.totalIncome || 0),

        0

    );

    const totalExpense = reportList.reduce(

        (total, report) =>

            total + Number(report.totalExpense || 0),

        0

    );

    const totalSavings =
        totalIncome - totalExpense;

    const monthsCount =
        reportList.length;

    return (

        <div className="report-summary">

            <div className="report-summary-card">

                <div className="report-summary-icon green">

                    <FaMoneyBillWave />

                </div>

                <div>

                    <p>
                        Total Income
                    </p>

                    <h3>
                        ₹{totalIncome.toLocaleString()}
                    </h3>

                </div>

            </div>


            <div className="report-summary-card">

                <div className="report-summary-icon red">

                    <FaReceipt />

                </div>

                <div>

                    <p>
                        Total Expense
                    </p>

                    <h3>
                        ₹{totalExpense.toLocaleString()}
                    </h3>

                </div>

            </div>


            <div className="report-summary-card">

                <div className="report-summary-icon blue">

                    <FaPiggyBank />

                </div>

                <div>

                    <p>
                        Total Savings
                    </p>

                    <h3>
                        ₹{totalSavings.toLocaleString()}
                    </h3>

                </div>

            </div>


            <div className="report-summary-card">

                <div className="report-summary-icon purple">

                    <FaCalendarAlt />

                </div>

                <div>

                    <p>
                        Months Reported
                    </p>

                    <h3>
                        {monthsCount}
                    </h3>

                </div>

            </div>

        </div>

    );

}

export default ReportSummary;