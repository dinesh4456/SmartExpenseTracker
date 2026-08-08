package com.expensetracker.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.expensetracker.dto.expense.ExpenseFilterResponse;
import com.expensetracker.dto.expense.ExpenseResponse;
import com.expensetracker.entity.Expense;
import com.expensetracker.service.ExpenseService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/expense")
@Tag(
        name = "Expense APIs",
        description = "APIs for managing user expenses"
)
public class ExpenseController {

    private final ExpenseService expenseService;

    public ExpenseController(ExpenseService expenseService) {
        this.expenseService = expenseService;
    }

    @Operation(
            summary = "Create Expense",
            description = "Creates a new expense for the logged-in user"
    )
    @PostMapping
    public Expense saveExpense(@RequestBody Expense expense) {
        return expenseService.saveExpense(expense);
    }

    @Operation(
            summary = "Get All Expenses",
            description = "Returns paginated expenses with sorting"
    )
    @GetMapping
    public Page<ExpenseResponse> getAllExpenses(

            @RequestParam(defaultValue = "0") int page,

            @RequestParam(defaultValue = "5") int size,

            @RequestParam(defaultValue = "expenseDate") String sortBy) {

        return expenseService.getAllExpenses(page, size, sortBy);
    }

    @Operation(
            summary = "Search Expenses",
            description = "Search expenses using title keyword"
    )
    @GetMapping("/search")
    public List<ExpenseResponse> searchExpenses(

            @RequestParam String keyword) {

        return expenseService.searchExpenses(keyword);
    }

    @Operation(
            summary = "Filter Expenses",
            description = "Returns expenses between start date and end date"
    )
    @GetMapping("/filter")
    public List<ExpenseFilterResponse> filterExpenses(

            @RequestParam
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate startDate,

            @RequestParam
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate endDate) {

        return expenseService.filterExpenses(startDate, endDate);
    }

    @Operation(
            summary = "Get Expense By ID",
            description = "Returns a single expense using its ID"
    )
    @GetMapping("/{id}")
    public Expense getExpense(@PathVariable Long id) {
        return expenseService.getExpenseById(id);
    }

    @Operation(
            summary = "Update Expense",
            description = "Updates an existing expense"
    )
    @PutMapping("/{id}")
    public Expense updateExpense(
            @PathVariable Long id,
            @RequestBody Expense expense) {

        return expenseService.updateExpense(id, expense);
    }

    @Operation(
            summary = "Delete Expense",
            description = "Deletes an expense by its ID"
    )
    @DeleteMapping("/{id}")
    public String deleteExpense(@PathVariable Long id) {

        expenseService.deleteExpense(id);

        return "Expense Deleted Successfully";
    }
}