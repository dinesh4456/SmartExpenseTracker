package com.expensetracker.service.impl;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.Month;
import java.time.format.TextStyle;
import java.util.List;
import java.util.Locale;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.expensetracker.dto.budget.BudgetDetailsResponse;
import com.expensetracker.dto.budget.BudgetRequest;
import com.expensetracker.entity.Budget;
import com.expensetracker.entity.Expense;
import com.expensetracker.entity.Income;
import com.expensetracker.entity.User;
import com.expensetracker.exception.ResourceNotFoundException;
import com.expensetracker.repository.BudgetRepository;
import com.expensetracker.repository.ExpenseRepository;
import com.expensetracker.repository.IncomeRepository;
import com.expensetracker.repository.UserRepository;
import com.expensetracker.security.SecurityUtils;
import com.expensetracker.service.BudgetService;

@Service
@Transactional
public class BudgetServiceImpl implements BudgetService {

    private final BudgetRepository budgetRepository;
    private final ExpenseRepository expenseRepository;
    private final IncomeRepository incomeRepository;
    private final UserRepository userRepository;

    public BudgetServiceImpl(
            BudgetRepository budgetRepository,
            ExpenseRepository expenseRepository,
            IncomeRepository incomeRepository,
            UserRepository userRepository) {

        this.budgetRepository = budgetRepository;
        this.expenseRepository = expenseRepository;
        this.incomeRepository = incomeRepository;
        this.userRepository = userRepository;
    }

    @Override
    public BudgetDetailsResponse getCurrentMonthBudget() {
        LocalDate today = LocalDate.now();
        String monthName = today.getMonth().getDisplayName(TextStyle.FULL, Locale.ENGLISH);
        return getBudgetByMonthAndYear(monthName, today.getYear());
    }

    @Override
    public BudgetDetailsResponse getBudgetByMonthAndYear(String month, Integer year) {

        String email = SecurityUtils.getCurrentUserEmail();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        int monthNum = parseMonthNumber(month);
        String normalizedMonth = Month.of(monthNum).getDisplayName(TextStyle.FULL, Locale.ENGLISH);

        int queryYear = (year != null && year > 0) ? year : LocalDate.now().getYear();

        List<Budget> userBudgets = budgetRepository.findByUser(user);
        Budget budget = userBudgets.stream()
                .filter(b -> b.getYear() != null && b.getYear().equals(queryYear) &&
                        b.getMonth() != null &&
                        (b.getMonth().trim().equalsIgnoreCase(normalizedMonth) ||
                         parseMonthNumber(b.getMonth()) == monthNum))
                .findFirst()
                .orElse(null);

        List<Expense> expenses = expenseRepository.findByUser(user).stream()
                .filter(e -> e.getExpenseDate() != null &&
                        e.getExpenseDate().getYear() == queryYear &&
                        e.getExpenseDate().getMonthValue() == monthNum)
                .toList();

        double spent = expenses.stream()
                .map(Expense::getAmount)
                .filter(a -> a != null)
                .reduce(BigDecimal.ZERO, BigDecimal::add)
                .doubleValue();

        List<Income> incomes = incomeRepository.findByUser(user).stream()
                .filter(i -> i.getIncomeDate() != null &&
                        i.getIncomeDate().getYear() == queryYear &&
                        i.getIncomeDate().getMonthValue() == monthNum)
                .toList();

        double totalIncome = incomes.stream()
                .map(Income::getAmount)
                .filter(a -> a != null)
                .reduce(BigDecimal.ZERO, BigDecimal::add)
                .doubleValue();

        double monthlyBudget = (budget != null && budget.getAmount() != null)
                ? budget.getAmount().doubleValue()
                : 0.0;

        double remaining = Math.max(0.0, monthlyBudget - spent);
        double usedPercentage = (monthlyBudget > 0) ? ((spent / monthlyBudget) * 100.0) : 0.0;
        double overBudgetAmount = (spent > monthlyBudget && monthlyBudget > 0) ? (spent - monthlyBudget) : 0.0;
        boolean isOverBudget = spent > monthlyBudget && monthlyBudget > 0;

        return new BudgetDetailsResponse(
                budget != null ? budget.getId() : null,
                normalizedMonth,
                queryYear,
                monthlyBudget,
                totalIncome,
                spent,
                remaining,
                usedPercentage,
                overBudgetAmount,
                isOverBudget
        );
    }

    @Override
    public Budget saveOrUpdateBudget(BudgetRequest request) {

        String email = SecurityUtils.getCurrentUserEmail();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        int monthNum = parseMonthNumber(request.getMonth());
        String normalizedMonth = Month.of(monthNum).getDisplayName(TextStyle.FULL, Locale.ENGLISH);

        Budget budget = budgetRepository
                .findByUserAndMonthIgnoreCaseAndYear(user, normalizedMonth, request.getYear())
                .orElse(null);

        if (budget == null) {
            budget = new Budget();
            budget.setUser(user);
            budget.setMonth(normalizedMonth);
            budget.setYear(request.getYear());
        }

        budget.setAmount(request.getAmount());

        return budgetRepository.save(budget);
    }

    @Override
    public Budget saveBudget(Budget budget) {

        String email = SecurityUtils.getCurrentUserEmail();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (budget.getAmount() == null || budget.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Budget amount must be greater than zero.");
        }

        if (budget.getYear() == null || budget.getYear() <= 0) {
            budget.setYear(LocalDate.now().getYear());
        }

        int monthNum = parseMonthNumber(budget.getMonth());
        String normalizedMonth = Month.of(monthNum).getDisplayName(TextStyle.FULL, Locale.ENGLISH);

        Budget existing = budgetRepository
                .findByUserAndMonthIgnoreCaseAndYear(user, normalizedMonth, budget.getYear())
                .orElse(null);

        if (existing != null) {
            existing.setAmount(budget.getAmount());
            return budgetRepository.save(existing);
        }

        budget.setUser(user);
        budget.setMonth(normalizedMonth);
        return budgetRepository.save(budget);
    }

    @Override
    public Budget updateBudget(Long id, Budget updatedBudget) {

        String email = SecurityUtils.getCurrentUserEmail();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (updatedBudget.getAmount() == null || updatedBudget.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Budget amount must be greater than zero.");
        }

        if (updatedBudget.getYear() == null || updatedBudget.getYear() <= 0) {
            updatedBudget.setYear(LocalDate.now().getYear());
        }

        Budget existingBudget = budgetRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Budget not found with id : " + id));

        if (!existingBudget.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized to modify this budget");
        }

        int monthNum = parseMonthNumber(updatedBudget.getMonth());
        String normalizedMonth = Month.of(monthNum).getDisplayName(TextStyle.FULL, Locale.ENGLISH);

        existingBudget.setMonth(normalizedMonth);
        existingBudget.setYear(updatedBudget.getYear());
        existingBudget.setAmount(updatedBudget.getAmount());

        return budgetRepository.save(existingBudget);
    }

    @Override
    public List<Budget> getAllBudgets() {

        String email = SecurityUtils.getCurrentUserEmail();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return budgetRepository.findByUser(user);
    }

    @Override
    public void deleteBudget(Long id) {

        String email = SecurityUtils.getCurrentUserEmail();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Budget budget = budgetRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Budget not found with id : " + id));

        if (!budget.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized to delete this budget");
        }

        budgetRepository.delete(budget);
    }

    private int parseMonthNumber(String monthStr) {
        if (monthStr == null || monthStr.trim().isEmpty()) {
            return LocalDate.now().getMonthValue();
        }

        monthStr = monthStr.trim();
        try {
            int num = Integer.parseInt(monthStr);
            if (num >= 1 && num <= 12) {
                return num;
            }
        } catch (NumberFormatException ignored) {}

        for (Month m : Month.values()) {
            if (m.name().equalsIgnoreCase(monthStr)
                    || m.getDisplayName(TextStyle.FULL, Locale.ENGLISH).equalsIgnoreCase(monthStr)
                    || m.getDisplayName(TextStyle.SHORT, Locale.ENGLISH).equalsIgnoreCase(monthStr)) {
                return m.getValue();
            }
        }

        return LocalDate.now().getMonthValue();
    }
}