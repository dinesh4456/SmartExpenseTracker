package com.expensetracker.service.impl;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.stereotype.Service;

import com.expensetracker.dto.analytics.ExpenseAnalyticsResponse;
import com.expensetracker.entity.Expense;
import com.expensetracker.entity.User;
import com.expensetracker.exception.ResourceNotFoundException;
import com.expensetracker.repository.ExpenseRepository;
import com.expensetracker.repository.UserRepository;
import com.expensetracker.security.SecurityUtils;
import com.expensetracker.service.ExpenseAnalyticsService;

@Service
public class ExpenseAnalyticsServiceImpl implements ExpenseAnalyticsService {

    private final ExpenseRepository expenseRepository;
    private final UserRepository userRepository;

    public ExpenseAnalyticsServiceImpl(
            ExpenseRepository expenseRepository,
            UserRepository userRepository) {

        this.expenseRepository = expenseRepository;
        this.userRepository = userRepository;
    }

    @Override
    public ExpenseAnalyticsResponse getExpenseAnalytics() {

        String email = SecurityUtils.getCurrentUserEmail();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));

        List<Expense> expenses = expenseRepository.findByUser(user);

        double totalExpense = expenses.stream()
                .map(Expense::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add)
                .doubleValue();

        double highestExpense = expenses.stream()
                .map(Expense::getAmount)
                .max(BigDecimal::compareTo)
                .orElse(BigDecimal.ZERO)
                .doubleValue();

        double averageExpense = expenses.isEmpty()
                ? 0
                : totalExpense / expenses.size();

        long totalTransactions = expenses.size();

        return new ExpenseAnalyticsResponse(
                totalExpense,
                highestExpense,
                averageExpense,
                totalTransactions
        );
    }
}