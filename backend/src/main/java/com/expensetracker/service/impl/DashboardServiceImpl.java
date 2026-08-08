package com.expensetracker.service.impl;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.TextStyle;
import java.util.List;
import java.util.Locale;

import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import com.expensetracker.dto.dashboard.BudgetProgressResponse;
import com.expensetracker.dto.dashboard.DashboardResponse;
import com.expensetracker.dto.dashboard.RecentTransactionResponse;
import com.expensetracker.entity.Budget;
import com.expensetracker.entity.Category;
import com.expensetracker.entity.Expense;
import com.expensetracker.entity.Income;
import com.expensetracker.entity.User;
import com.expensetracker.repository.BudgetRepository;
import com.expensetracker.repository.CategoryRepository;
import com.expensetracker.repository.ExpenseRepository;
import com.expensetracker.repository.IncomeRepository;
import com.expensetracker.repository.UserRepository;
import com.expensetracker.security.SecurityUtils;
import com.expensetracker.service.DashboardService;

@Service
public class DashboardServiceImpl implements DashboardService {

    private final IncomeRepository incomeRepository;

    private final ExpenseRepository expenseRepository;

    private final CategoryRepository categoryRepository;

    private final UserRepository userRepository;

    private final BudgetRepository budgetRepository;

    public DashboardServiceImpl(
            IncomeRepository incomeRepository,
            ExpenseRepository expenseRepository,
            CategoryRepository categoryRepository,
            UserRepository userRepository,
            BudgetRepository budgetRepository) {

        this.incomeRepository = incomeRepository;
        this.expenseRepository = expenseRepository;
        this.categoryRepository = categoryRepository;
        this.userRepository = userRepository;
        this.budgetRepository = budgetRepository;
    }

    @Override
    public DashboardResponse getDashboard() {

        String email = SecurityUtils.getCurrentUserEmail();

        User user = userRepository.findByEmail(email).orElseThrow();

        LocalDate today = LocalDate.now();
        int currentYear = today.getYear();
        int currentMonth = today.getMonthValue();

        List<Income> incomes = incomeRepository.getIncomeByMonth(user, currentYear, currentMonth);

        List<Expense> expenses = expenseRepository.getExpensesByMonth(user, currentYear, currentMonth);

        List<Category> categories = categoryRepository.findByUser(user);

        double totalIncome = incomes.stream()
                .map(Income::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add)
                .doubleValue();

        double totalExpense = expenses.stream()
                .map(Expense::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add)
                .doubleValue();

        return new DashboardResponse(
                totalIncome,
                totalExpense,
                totalIncome - totalExpense,
                (long) categories.size(),
                (long) (incomes.size() + expenses.size()));
    }

    @Override
    public List<RecentTransactionResponse> getRecentTransactions() {
        return getRecentTransactions(5, null);
    }

    @Override
    public List<RecentTransactionResponse> getRecentTransactions(Integer limit, Integer days) {

        String email = SecurityUtils.getCurrentUserEmail();

        User user = userRepository.findByEmail(email).orElseThrow();

        int maxLimit = (limit != null && limit > 0) ? limit : 5;

        List<Expense> expenses;

        if (days != null && days > 0) {
            LocalDate startDate = LocalDate.now().minusDays(days);
            expenses = expenseRepository.findRecentByUserAndDateAfter(user, startDate);
            if (expenses.size() > maxLimit) {
                expenses = expenses.subList(0, maxLimit);
            }
        } else {
            expenses = expenseRepository.findRecentByUser(user, PageRequest.of(0, maxLimit));
        }

        return expenses.stream()
                .map(expense -> new RecentTransactionResponse(
                        (expense.getCategory() != null && expense.getCategory().getName() != null)
                                ? expense.getCategory().getName()
                                : "General",
                        expense.getAmount(),
                        expense.getExpenseDate()))
                .toList();
    }

    @Override
    public BudgetProgressResponse getBudgetProgress() {

        String email = SecurityUtils.getCurrentUserEmail();

        User user = userRepository.findByEmail(email).orElseThrow();

        LocalDate today = LocalDate.now();

        String month = today.getMonth()
                .getDisplayName(TextStyle.FULL, Locale.ENGLISH);

        int year = today.getYear();

        List<Budget> budgets = budgetRepository.findByUser(user);

        Budget currentBudget = budgets.stream()
                .filter(b -> b.getMonth().equalsIgnoreCase(month)
                        && b.getYear() == year)
                .findFirst()
                .orElse(null);

        if (currentBudget == null) {

            return new BudgetProgressResponse(
                    0.0,
                    0.0,
                    0.0,
                    0.0
            );

        }

        double budgetAmount = currentBudget.getAmount().doubleValue();

        double spent = expenseRepository
                .findByUser(user)
                .stream()
                .filter(e ->
                        e.getExpenseDate() != null
                                && e.getExpenseDate().getMonth() == today.getMonth()
                                && e.getExpenseDate().getYear() == year)
                .map(Expense::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add)
                .doubleValue();

        double remaining = budgetAmount - spent;

        double percentage = budgetAmount == 0
                ? 0
                : (spent / budgetAmount) * 100;

        return new BudgetProgressResponse(
                budgetAmount,
                spent,
                remaining,
                percentage
        );
    }

}