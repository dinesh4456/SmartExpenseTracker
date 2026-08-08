package com.expensetracker.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.expensetracker.dto.analytics.ExpenseAnalyticsResponse;
import com.expensetracker.service.ExpenseAnalyticsService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/expense-analytics")
@Tag(
        name = "Expense Analytics APIs",
        description = "APIs for expense statistics and analytics"
)
public class ExpenseAnalyticsController {

    private final ExpenseAnalyticsService expenseAnalyticsService;

    public ExpenseAnalyticsController(
            ExpenseAnalyticsService expenseAnalyticsService) {

        this.expenseAnalyticsService = expenseAnalyticsService;
    }

    @Operation(
            summary = "Expense Analytics",
            description = "Returns total expense, highest expense, average expense and total transactions"
    )
    @GetMapping
    public ExpenseAnalyticsResponse getExpenseAnalytics() {

        return expenseAnalyticsService.getExpenseAnalytics();
    }
}