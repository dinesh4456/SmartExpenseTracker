import { useEffect, useState } from "react";
import { FaCalendar, FaCalendarAlt } from "react-icons/fa";

import MainLayout from "../../layouts/MainLayout";

import ReportSummary from "../../components/reports/ReportSummary";
import ReportsTable from "../../components/reports/ReportsTable";

import {
    getMonthlyReport,
    exportMonthlyExcel,
    exportMonthlyPdf
} from "../../services/reportService";

import { sendMonthlyReport } from "../../services/emailService";

import "./Reports.css";

function Reports() {

    const [reports, setReports] = useState([]);

    const [selectedYear, setSelectedYear] = useState("");

    const [selectedMonth, setSelectedMonth] = useState("");

    useEffect(() => {

        loadReports(
            selectedYear,
            selectedMonth
        );

    }, [selectedYear, selectedMonth]);

    const loadReports = async (
        year = "",
        month = ""
    ) => {

        try {

            const data =
                await getMonthlyReport(
                    year,
                    month
                );

            setReports(data);

        } catch (error) {

            console.error(error);

            alert("Failed to load reports.");

        }

    };

    const handleSendEmail = async () => {

        try {

            const message =
                await sendMonthlyReport(
                    selectedYear,
                    selectedMonth
                );

            alert(message);

        } catch (error) {

            console.error(error);

            alert("Failed to send report.");

        }

    };

    const handleExportExcel = () => {

        exportMonthlyExcel(
            selectedYear,
            selectedMonth
        );

    };

    const handleExportPdf = () => {

        exportMonthlyPdf(
            selectedYear,
            selectedMonth
        );

    };

    const currentYear = new Date().getFullYear();
    const dynamicYears = Array.from({ length: 7 }, (_, i) => currentYear - 3 + i);

    return (

        <MainLayout>

            <div className="reports-page" style={{ zoom: "1.0" }}>

                <div className="reports-header">

                    <div className="reports-title-section">

                        <h2>

                            Monthly Expense Report

                        </h2>

                    </div>

                    <div className="reports-controls">

                        <div className="reports-filter-pill">
                            <FaCalendar className="text-primary" />
                            <select
                                className="reports-month-select"
                                value={selectedYear}
                                onChange={(e) => setSelectedYear(e.target.value)}
                            >
                                <option value="">All Years</option>
                                {dynamicYears.map((year) => (
                                    <option key={year} value={year}>
                                        {year}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="reports-filter-pill">
                            <FaCalendarAlt className="text-primary" />
                            <select
                                className="reports-month-select"
                                value={selectedMonth}
                                onChange={(e) => setSelectedMonth(e.target.value)}
                            >
                                <option value="">All Months</option>
                                <option value="1">January</option>
                                <option value="2">February</option>
                                <option value="3">March</option>
                                <option value="4">April</option>
                                <option value="5">May</option>
                                <option value="6">June</option>
                                <option value="7">July</option>
                                <option value="8">August</option>
                                <option value="9">September</option>
                                <option value="10">October</option>
                                <option value="11">November</option>
                                <option value="12">December</option>
                            </select>
                        </div>

                        <button
                            className="report-action-btn send-btn"
                            onClick={handleSendEmail}
                        >

                            📧 Send Report

                        </button>

                        <button
                            className="report-action-btn excel-btn"
                            onClick={handleExportExcel}
                        >

                            Export Excel

                        </button>

                        <button
                            className="report-action-btn pdf-btn"
                            onClick={handleExportPdf}
                        >

                            Export PDF

                        </button>

                    </div>

                </div>
                                <ReportSummary
                    reports={reports}
                />

                <ReportsTable
                    reports={reports}
                />

            </div>

        </MainLayout>

    );

}

export default Reports;