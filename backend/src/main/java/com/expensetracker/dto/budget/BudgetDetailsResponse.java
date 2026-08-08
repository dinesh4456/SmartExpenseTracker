package com.expensetracker.dto.budget;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class BudgetDetailsResponse {

    private Long id;
    private String month;
    private Integer year;
    private Double monthlyBudget;
    private Double totalIncome;
    private Double spent;
    private Double remaining;
    private Double usedPercentage;
    private Double overBudgetAmount;
    private Boolean isOverBudget;
}
