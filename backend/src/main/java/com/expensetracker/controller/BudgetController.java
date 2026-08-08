package com.expensetracker.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.expensetracker.dto.budget.BudgetDetailsResponse;
import com.expensetracker.entity.Budget;
import com.expensetracker.service.BudgetService;

@RestController
@CrossOrigin
@RequestMapping({"/api/budget", "/api/budgets"})
public class BudgetController {

    private final BudgetService budgetService;

    public BudgetController(BudgetService budgetService) {
        this.budgetService = budgetService;
    }

    /**
     * GET /api/budget or GET /api/budgets
     */
    @GetMapping
    public Object getBudgets(
            @RequestParam(required = false) String month,
            @RequestParam(required = false) Integer year) {

        if (month != null || year != null) {
            return budgetService.getBudgetByMonthAndYear(month, year);
        }
        return budgetService.getAllBudgets();
    }

    @GetMapping("/summary")
    public BudgetDetailsResponse getBudgetSummary(
            @RequestParam(required = false) String month,
            @RequestParam(required = false) Integer year) {

        if (month != null || year != null) {
            return budgetService.getBudgetByMonthAndYear(month, year);
        }
        return budgetService.getCurrentMonthBudget();
    }

    @GetMapping("/all")
    public List<Budget> getAllBudgets() {
        return budgetService.getAllBudgets();
    }

    @GetMapping("/{id}")
    public Budget getBudgetById(@PathVariable Long id) {
        return budgetService.getAllBudgets().stream()
                .filter(b -> b.getId().equals(id))
                .findFirst()
                .orElse(null);
    }

    /**
     * POST /api/budget or POST /api/budgets
     */
    @PostMapping
    public Budget createOrUpdateBudget(@RequestBody Budget budget) {
        return budgetService.saveBudget(budget);
    }

    @PutMapping("/{id}")
    public Budget updateBudget(@PathVariable Long id, @RequestBody Budget budget) {
        return budgetService.updateBudget(id, budget);
    }

    @DeleteMapping("/{id}")
    public void deleteBudget(@PathVariable Long id) {
        budgetService.deleteBudget(id);
    }
}