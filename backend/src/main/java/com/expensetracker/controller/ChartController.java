package com.expensetracker.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.expensetracker.dto.chart.CategoryChartResponse;
import com.expensetracker.dto.chart.ChartDataResponse;
import com.expensetracker.service.ChartService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/charts")
@Tag(
        name = "Chart APIs",
        description = "APIs for dashboard charts"
)
public class ChartController {

    private final ChartService chartService;

    public ChartController(ChartService chartService) {
        this.chartService = chartService;
    }

    @Operation(
            summary = "Monthly Expense Chart",
            description = "Returns monthly expense data for line chart"
    )
    @GetMapping("/monthly-expense")
    public List<ChartDataResponse> getMonthlyExpenseChart() {

        return chartService.getMonthlyExpenseChart();
    }

    @Operation(
            summary = "Category Expense Chart",
            description = "Returns category-wise expense data for pie chart"
    )
    @GetMapping("/category-expense")
    public List<CategoryChartResponse> getCategoryExpenseChart() {

        return chartService.getCategoryExpenseChart();
    }
}