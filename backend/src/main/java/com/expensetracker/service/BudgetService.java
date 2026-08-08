package com.expensetracker.service;

import java.util.List;

import com.expensetracker.dto.budget.BudgetDetailsResponse;
import com.expensetracker.dto.budget.BudgetRequest;
import com.expensetracker.entity.Budget;

public interface BudgetService {

    BudgetDetailsResponse getCurrentMonthBudget();

    BudgetDetailsResponse getBudgetByMonthAndYear(String month, Integer year);

    Budget saveOrUpdateBudget(BudgetRequest request);

    Budget saveBudget(Budget budget);

    Budget updateBudget(Long id, Budget budget);

    List<Budget> getAllBudgets();

    void deleteBudget(Long id);

}