package com.expensetracker.dto.report;

import java.math.BigDecimal;

public record MonthlyReportResponse(
        String month,
        BigDecimal totalIncome,
        BigDecimal totalExpense,
        BigDecimal savings
) {
}