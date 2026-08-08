package com.expensetracker.dto.dashboard;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class BudgetProgressResponse {

    private Double monthlyBudget;

    private Double spentAmount;

    private Double remainingAmount;

    private Double progressPercentage;

}