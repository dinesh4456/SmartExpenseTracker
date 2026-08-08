package com.expensetracker.dto.ai;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AIInsightResponse {

    private Double totalIncome;

    private Double totalExpense;

    private Double savings;

    private String message;

    private List<String> insights;

    private String topCategory;

    private Double savingsRate;

    private String monthComparison;

    public AIInsightResponse(Double totalIncome, Double totalExpense, Double savings, String message) {
        this.totalIncome = totalIncome;
        this.totalExpense = totalExpense;
        this.savings = savings;
        this.message = message;
    }

}