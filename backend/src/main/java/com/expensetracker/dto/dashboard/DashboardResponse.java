package com.expensetracker.dto.dashboard;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class DashboardResponse {

    private Double totalIncome;

    private Double totalExpense;

    private Double balance;

    private Long totalCategories;

    private Long totalTransactions;
}