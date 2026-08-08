package com.expensetracker.dto.analytics;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ExpenseAnalyticsResponse {

    private double totalExpense;

    private double highestExpense;

    private double averageExpense;

    private long totalTransactions;
}