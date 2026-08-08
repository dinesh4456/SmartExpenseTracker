package com.expensetracker.dto.dashboard;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class DashboardCompleteResponse {

    private DashboardResponse summary;

    private BudgetProgressResponse budget;

    private List<RecentTransactionResponse> recentTransactions;

}