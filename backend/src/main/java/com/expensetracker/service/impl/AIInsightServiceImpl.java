package com.expensetracker.service.impl;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.Month;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.expensetracker.dto.ai.AIInsightResponse;
import com.expensetracker.entity.Expense;
import com.expensetracker.entity.Income;
import com.expensetracker.entity.User;
import com.expensetracker.exception.ResourceNotFoundException;
import com.expensetracker.repository.ExpenseRepository;
import com.expensetracker.repository.IncomeRepository;
import com.expensetracker.repository.UserRepository;
import com.expensetracker.security.SecurityUtils;
import com.expensetracker.service.AIInsightService;

@Service
public class AIInsightServiceImpl implements AIInsightService {

    private final IncomeRepository incomeRepository;
    private final ExpenseRepository expenseRepository;
    private final UserRepository userRepository;

    public AIInsightServiceImpl(
            IncomeRepository incomeRepository,
            ExpenseRepository expenseRepository,
            UserRepository userRepository) {

        this.incomeRepository = incomeRepository;
        this.expenseRepository = expenseRepository;
        this.userRepository = userRepository;
    }

    @Override
    public AIInsightResponse getInsights() {

        String email = SecurityUtils.getCurrentUserEmail();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));

        LocalDate now = LocalDate.now();
        int currentYear = now.getYear();
        int currentMonth = now.getMonthValue();

        List<Income> currentIncomes = incomeRepository.getIncomeByMonth(user, currentYear, currentMonth);
        List<Expense> currentExpenses = expenseRepository.getExpensesByMonth(user, currentYear, currentMonth);

        // Fallback to all-time if current month is completely empty to still provide insightful analysis
        boolean isCurrentMonthEmpty = currentIncomes.isEmpty() && currentExpenses.isEmpty();
        if (isCurrentMonthEmpty) {
            currentIncomes = incomeRepository.findByUser(user);
            currentExpenses = expenseRepository.findByUser(user);
        }

        LocalDate prevMonthDate = now.minusMonths(1);
        List<Income> prevIncomes = incomeRepository.getIncomeByMonth(user, prevMonthDate.getYear(), prevMonthDate.getMonthValue());
        List<Expense> prevExpenses = expenseRepository.getExpensesByMonth(user, prevMonthDate.getYear(), prevMonthDate.getMonthValue());

        double totalIncome = currentIncomes.stream()
                .map(Income::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add)
                .doubleValue();

        double totalExpense = currentExpenses.stream()
                .map(Expense::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add)
                .doubleValue();

        double prevTotalExpense = prevExpenses.stream()
                .map(Expense::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add)
                .doubleValue();

        double savings = totalIncome - totalExpense;
        double savingsRate = totalIncome > 0 ? (savings / totalIncome) * 100 : 0.0;

        List<String> insights = new ArrayList<>();
        String primaryMessage;
        String topCategoryName = "None";
        String monthComparison = "No previous month data available for direct comparison.";

        // 1. Group current expenses by category
        Map<String, Double> categoryTotals = new HashMap<>();
        for (Expense exp : currentExpenses) {
            String catName = (exp.getCategory() != null && exp.getCategory().getName() != null)
                    ? exp.getCategory().getName()
                    : "General";
            double amt = exp.getAmount() != null ? exp.getAmount().doubleValue() : 0.0;
            categoryTotals.put(catName, categoryTotals.getOrDefault(catName, 0.0) + amt);
        }

        // Group previous month expenses by category
        Map<String, Double> prevCategoryTotals = new HashMap<>();
        for (Expense exp : prevExpenses) {
            String catName = (exp.getCategory() != null && exp.getCategory().getName() != null)
                    ? exp.getCategory().getName()
                    : "General";
            double amt = exp.getAmount() != null ? exp.getAmount().doubleValue() : 0.0;
            prevCategoryTotals.put(catName, prevCategoryTotals.getOrDefault(catName, 0.0) + amt);
        }

        // 2. Find Highest Spending Category
        String highestCategory = null;
        double highestAmount = 0.0;
        for (Map.Entry<String, Double> entry : categoryTotals.entrySet()) {
            if (entry.getValue() > highestAmount) {
                highestAmount = entry.getValue();
                highestCategory = entry.getKey();
            }
        }

        if (highestCategory != null) {
            topCategoryName = highestCategory;
            double catPct = totalExpense > 0 ? (highestAmount / totalExpense) * 100 : 0.0;
            insights.add(String.format("Highest spending category this month is '%s' at ₹%,.2f (%.1f%% of total expenses).",
                    highestCategory, highestAmount, catPct));
        }

        // 3. Category comparison with previous month
        for (Map.Entry<String, Double> entry : categoryTotals.entrySet()) {
            String cat = entry.getKey();
            double currAmt = entry.getValue();
            if (prevCategoryTotals.containsKey(cat)) {
                double prevAmt = prevCategoryTotals.get(cat);
                if (prevAmt > 0) {
                    double diffPct = ((currAmt - prevAmt) / prevAmt) * 100;
                    if (diffPct >= 10.0) {
                        insights.add(String.format("%s expenses increased by %.1f%% compared to last month (₹%,.2f vs ₹%,.2f).",
                                cat, diffPct, currAmt, prevAmt));
                    } else if (diffPct <= -10.0) {
                        insights.add(String.format("Great control! %s spending reduced by %.1f%% compared to last month.",
                                cat, Math.abs(diffPct)));
                    }
                }
            }
        }

        // 4. Overall monthly comparison
        if (prevTotalExpense > 0 && totalExpense > 0) {
            double overallDiff = ((totalExpense - prevTotalExpense) / prevTotalExpense) * 100;
            if (overallDiff > 0) {
                monthComparison = String.format("Total expenses are up by %.1f%% compared to last month (₹%,.2f vs ₹%,.2f).",
                        overallDiff, totalExpense, prevTotalExpense);
                insights.add(monthComparison);
            } else if (overallDiff < 0) {
                monthComparison = String.format("Total expenses decreased by %.1f%% compared to last month. Keep up the good work!",
                        Math.abs(overallDiff));
                insights.add(monthComparison);
            } else {
                monthComparison = "Total expenses are consistent with last month.";
                insights.add(monthComparison);
            }
        }

        // 5. Savings and actionable reduction recommendations
        if (savings > 0) {
            insights.add(String.format("You saved ₹%,.2f this month (%.1f%% savings rate).", savings, savingsRate));
        } else if (savings < 0 && totalIncome > 0) {
            insights.add(String.format("You spent ₹%,.2f more than your income this month.", Math.abs(savings)));
        }

        if (highestCategory != null && highestAmount > 0) {
            double potentialSavings = highestAmount * 0.15;
            insights.add(String.format("Personalized recommendation: You can reduce %s expenses by 15%% to save approximately ₹%,.2f next month.",
                    highestCategory.toLowerCase(), potentialSavings));
        }

        // 6. Summary message formulation
        if (totalIncome == 0 && totalExpense == 0) {
            primaryMessage = "No financial activity recorded for this period. Add income and expenses to generate insights!";
            insights.add("Add your daily transactions to unlock automated financial recommendations.");
        } else if (totalIncome == 0) {
            primaryMessage = "Warning! Expenses recorded with zero income logged. Ensure your earnings are tracked.";
        } else {
            double spendingRatio = (totalExpense / totalIncome) * 100;
            if (spendingRatio <= 50) {
                primaryMessage = String.format("Outstanding financial discipline! You saved %.1f%% of your earnings this month.", savingsRate);
            } else if (spendingRatio <= 75) {
                primaryMessage = String.format("Healthy budget management. You are living well within your income (%.1f%% spent).", spendingRatio);
            } else if (spendingRatio <= 100) {
                primaryMessage = String.format("Caution: Your expenses (%.1f%%) are close to your income. Look for areas to trim.", spendingRatio);
            } else {
                primaryMessage = String.format("Alert! You are spending %.1f%% of your income. Consider curbing discretionary costs.", spendingRatio);
            }
        }

        return new AIInsightResponse(
                totalIncome,
                totalExpense,
                savings,
                primaryMessage,
                insights,
                topCategoryName,
                savingsRate,
                monthComparison
        );
    }
}