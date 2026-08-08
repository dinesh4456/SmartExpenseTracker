package com.expensetracker.dto.report;

import java.math.BigDecimal;

public interface MonthlyExpenseProjection {

    Integer getMonth();

    BigDecimal getTotalExpense();
}