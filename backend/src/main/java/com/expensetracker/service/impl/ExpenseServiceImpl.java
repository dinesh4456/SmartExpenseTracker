package com.expensetracker.service.impl;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.expensetracker.dto.expense.ExpenseFilterResponse;
import com.expensetracker.dto.expense.ExpenseResponse;
import com.expensetracker.entity.Expense;
import com.expensetracker.entity.User;
import com.expensetracker.exception.ResourceNotFoundException;
import com.expensetracker.repository.ExpenseRepository;
import com.expensetracker.repository.UserRepository;
import com.expensetracker.security.SecurityUtils;
import com.expensetracker.service.ExpenseService;

@Service
public class ExpenseServiceImpl implements ExpenseService {

    private final ExpenseRepository expenseRepository;
    private final UserRepository userRepository;

    public ExpenseServiceImpl(
            ExpenseRepository expenseRepository,
            UserRepository userRepository) {

        this.expenseRepository = expenseRepository;
        this.userRepository = userRepository;
    }

    @Override
    public Expense saveExpense(Expense expense) {

        String email = SecurityUtils.getCurrentUserEmail();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));

        expense.setUser(user);

        return expenseRepository.save(expense);
    }

    @Override
    public Page<ExpenseResponse> getAllExpenses(
            int page,
            int size,
            String sortBy) {

        String email = SecurityUtils.getCurrentUserEmail();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));

        Pageable pageable = PageRequest.of(
                page,
                size,
                Sort.by(sortBy).descending());

        return expenseRepository.findByUser(user, pageable)
                .map(expense -> new ExpenseResponse(
                        expense.getId(),
                        expense.getTitle(),
                        expense.getAmount(),
                        expense.getDescription(),
                        expense.getExpenseDate(),
                        expense.getCategory() != null
                                ? expense.getCategory().getName()
                                : null
                ));
    }

    @Override
    public List<ExpenseResponse> searchExpenses(String keyword) {

        String email = SecurityUtils.getCurrentUserEmail();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));

        return expenseRepository
                .findByUserAndTitleContainingIgnoreCase(user, keyword)
                .stream()
                .map(expense -> new ExpenseResponse(
                        expense.getId(),
                        expense.getTitle(),
                        expense.getAmount(),
                        expense.getDescription(),
                        expense.getExpenseDate(),
                        expense.getCategory() != null
                                ? expense.getCategory().getName()
                                : null
                ))
                .toList();
    }

    @Override
    public List<ExpenseFilterResponse> filterExpenses(
            LocalDate startDate,
            LocalDate endDate) {

        String email = SecurityUtils.getCurrentUserEmail();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));

        return expenseRepository
                .findByUserAndExpenseDateBetween(user, startDate, endDate)
                .stream()
                .map(expense -> new ExpenseFilterResponse(
                        expense.getId(),
                        expense.getTitle(),
                        expense.getAmount(),
                        expense.getDescription(),
                        expense.getExpenseDate(),
                        expense.getCategory() != null
                                ? expense.getCategory().getName()
                                : null
                ))
                .toList();
    }

    @Override
    public Expense getExpenseById(Long id) {

        return expenseRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Expense not found with id : " + id));
    }

    @Override
    public Expense updateExpense(Long id, Expense expense) {

        Expense existing = expenseRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Expense not found with id : " + id));

        existing.setTitle(expense.getTitle());
        existing.setAmount(expense.getAmount());
        existing.setDescription(expense.getDescription());
        existing.setExpenseDate(expense.getExpenseDate());
        existing.setCategory(expense.getCategory());

        return expenseRepository.save(existing);
    }

    @Override
    public void deleteExpense(Long id) {

        Expense expense = expenseRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Expense not found with id : " + id));

        expenseRepository.delete(expense);
    }
}