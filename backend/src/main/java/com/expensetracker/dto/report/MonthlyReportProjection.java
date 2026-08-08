package com.expensetracker.dto.report;

import java.math.BigDecimal;

public interface MonthlyReportProjection {

    Integer getMonth();

    BigDecimal getTotalIncome();

    BigDecimal getTotalExpense();
}