package com.expensetracker.service.impl;

import java.math.BigDecimal;
import java.time.Month;
import java.util.List;

import org.springframework.stereotype.Service;

import com.expensetracker.dto.chart.CategoryChartResponse;
import com.expensetracker.dto.chart.ChartDataResponse;
import com.expensetracker.entity.User;
import com.expensetracker.exception.ResourceNotFoundException;
import com.expensetracker.repository.ExpenseRepository;
import com.expensetracker.repository.UserRepository;
import com.expensetracker.security.SecurityUtils;
import com.expensetracker.service.ChartService;

@Service
public class ChartServiceImpl implements ChartService {

    private final ExpenseRepository expenseRepository;
    private final UserRepository userRepository;

    public ChartServiceImpl(
            ExpenseRepository expenseRepository,
            UserRepository userRepository) {

        this.expenseRepository = expenseRepository;
        this.userRepository = userRepository;
    }

    @Override
    public List<ChartDataResponse> getMonthlyExpenseChart() {

        String email = SecurityUtils.getCurrentUserEmail();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));

        return expenseRepository.getMonthlyExpense(user)
                .stream()
                .map(data -> new ChartDataResponse(
                        Month.of(data.getMonth()).name(),
                        data.getTotalExpense()
                ))
                .toList();
    }

    @Override
    public List<CategoryChartResponse> getCategoryExpenseChart() {

        String email = SecurityUtils.getCurrentUserEmail();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));

        java.time.LocalDate today = java.time.LocalDate.now();
        List<Object[]> rows = expenseRepository.getCategoryWiseExpenseByMonth(user, today.getYear(), today.getMonthValue());
        if (rows == null || rows.isEmpty()) {
            rows = expenseRepository.getCategoryWiseExpense(user);
        }

        return rows.stream()
                .map(row -> new CategoryChartResponse(
                        (String) row[0],
                        (BigDecimal) row[1]
                ))
                .toList();
    }
}