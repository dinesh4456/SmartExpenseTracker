package com.expensetracker.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.expensetracker.dto.dashboard.DashboardResponse;
import com.expensetracker.dto.dashboard.RecentTransactionResponse;
import com.expensetracker.service.DashboardService;

import org.springframework.web.bind.annotation.RequestParam;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping
    public DashboardResponse getDashboard() {
        return dashboardService.getDashboard();
    }

    @GetMapping("/recent-transactions")
    public List<RecentTransactionResponse> getRecentTransactions(
            @RequestParam(required = false) Integer limit,
            @RequestParam(required = false) Integer days) {
        return dashboardService.getRecentTransactions(limit, days);
    }

}