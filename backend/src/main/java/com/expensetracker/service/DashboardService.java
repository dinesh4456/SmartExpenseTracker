package com.expensetracker.service;

import java.util.List;

import com.expensetracker.dto.dashboard.BudgetProgressResponse;
import com.expensetracker.dto.dashboard.DashboardResponse;
import com.expensetracker.dto.dashboard.RecentTransactionResponse;

public interface DashboardService {

    DashboardResponse getDashboard();

    BudgetProgressResponse getBudgetProgress();

    List<RecentTransactionResponse> getRecentTransactions();

    List<RecentTransactionResponse> getRecentTransactions(Integer limit, Integer days);

}