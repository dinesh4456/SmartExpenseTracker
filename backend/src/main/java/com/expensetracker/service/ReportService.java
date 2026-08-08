package com.expensetracker.service;

import java.io.ByteArrayInputStream;
import java.util.List;

import com.expensetracker.dto.report.MonthlyExpenseResponse;

public interface ReportService {

    /*
     * Monthly Report
     */

    List<MonthlyExpenseResponse> getMonthlyReport();

    /*
     * Monthly Report filtered by Year
     */

    List<MonthlyExpenseResponse> getMonthlyReport(
            Integer year
    );

    /*
     * Monthly Report filtered by Year and Month
     */

    List<MonthlyExpenseResponse> getMonthlyReport(
            Integer year,
            Integer month
    );

    /*
     * Existing Expense Excel
     */

    ByteArrayInputStream exportExpensesToExcel();

    /*
     * Financial Excel
     * (Year + Month)
     */

    ByteArrayInputStream exportMonthlyReportToExcel(
            Integer year,
            Integer month
    );

    /*
     * Existing Expense PDF
     */

    ByteArrayInputStream exportExpensesToPdf();

    /*
     * Financial PDF
     * (Year + Month)
     */

    ByteArrayInputStream exportMonthlyReportToPdf(
            Integer year,
            Integer month
    );

}