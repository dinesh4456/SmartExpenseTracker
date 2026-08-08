import "./ReportsTable.css";

function ReportsTable({ reports = [] }) {

    const reportList = Array.isArray(reports)
        ? reports
        : [];

    return (

        <div className="reports-table-card">

            <table className="table align-middle">

                <thead>

                    <tr>

                        <th>
                            Month
                        </th>

                        <th>
                            Total Income
                        </th>

                        <th>
                            Total Expense
                        </th>

                        <th>
                            Savings
                        </th>

                    </tr>

                </thead>

                <tbody>

                    {reportList.length === 0 ? (

                        <tr>

                            <td
                                colSpan="4"
                                className="reports-empty"
                            >

                                No reports found.

                            </td>

                        </tr>

                    ) : (

                        reportList.map((report, index) => (

                            <tr key={index}>

                                <td>

                                    <span className="report-month">

                                        📅

                                        {report.month}

                                    </span>

                                </td>

                                <td className="report-income">

                                    ₹
                                    {Number(
                                        report.totalIncome || 0
                                    ).toLocaleString()}

                                </td>

                                <td className="report-expense">

                                    ₹
                                    {Number(
                                        report.totalExpense || 0
                                    ).toLocaleString()}

                                </td>

                                <td
                                    className={
                                        Number(report.savings || 0) >= 0
                                            ? "report-savings"
                                            : "report-savings negative"
                                    }
                                >

                                    ₹
                                    {Number(
                                        report.savings || 0
                                    ).toLocaleString()}

                                </td>

                            </tr>

                        ))

                    )}

                </tbody>

            </table>

        </div>

    );

}

export default ReportsTable;