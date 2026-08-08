package com.expensetracker.service;

import java.util.List;

import com.expensetracker.dto.chart.CategoryChartResponse;
import com.expensetracker.dto.chart.ChartDataResponse;

public interface ChartService {

    List<ChartDataResponse> getMonthlyExpenseChart();

    List<CategoryChartResponse> getCategoryExpenseChart();

}