package com.expensetracker.dto.report;

import java.math.BigDecimal;

public class MonthlyExpenseResponse {

    private String month;

    private BigDecimal totalExpense;

    private BigDecimal totalIncome;

    private BigDecimal savings;

    public MonthlyExpenseResponse(
            String month,
            BigDecimal totalExpense,
            BigDecimal totalIncome,
            BigDecimal savings) {

        this.month = month;
        this.totalExpense = totalExpense;
        this.totalIncome = totalIncome;
        this.savings = savings;
    }

    public String getMonth() {
        return month;
    }

    public BigDecimal getTotalExpense() {
        return totalExpense;
    }

    public BigDecimal getTotalIncome() {
        return totalIncome;
    }

    public BigDecimal getSavings() {
        return savings;
    }

}