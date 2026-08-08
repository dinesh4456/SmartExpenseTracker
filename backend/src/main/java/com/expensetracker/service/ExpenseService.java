package com.expensetracker.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.domain.Page;

import com.expensetracker.dto.expense.ExpenseFilterResponse;
import com.expensetracker.dto.expense.ExpenseResponse;
import com.expensetracker.entity.Expense;

public interface ExpenseService {

    Expense saveExpense(Expense expense);

    Page<ExpenseResponse> getAllExpenses(
            int page,
            int size,
            String sortBy);

    List<ExpenseResponse> searchExpenses(String keyword);

    List<ExpenseFilterResponse> filterExpenses(
            LocalDate startDate,
            LocalDate endDate);

    Expense getExpenseById(Long id);

    Expense updateExpense(Long id, Expense expense);

    void deleteExpense(Long id);
}