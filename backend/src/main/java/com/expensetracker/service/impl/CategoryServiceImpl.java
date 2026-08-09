package com.expensetracker.service.impl;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.expensetracker.dto.category.CategoryResponse;
import com.expensetracker.dto.category.CategoryStatsResponse;
import com.expensetracker.entity.Category;
import com.expensetracker.entity.Expense;
import com.expensetracker.entity.User;
import com.expensetracker.exception.ResourceNotFoundException;
import com.expensetracker.repository.CategoryRepository;
import com.expensetracker.repository.ExpenseRepository;
import com.expensetracker.repository.UserRepository;
import com.expensetracker.security.SecurityUtils;
import com.expensetracker.service.CategoryService;

@Service
@Transactional
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;
    private final ExpenseRepository expenseRepository;
    private final UserRepository userRepository;

    public CategoryServiceImpl(
            CategoryRepository categoryRepository,
            ExpenseRepository expenseRepository,
            UserRepository userRepository) {

        this.categoryRepository = categoryRepository;
        this.expenseRepository = expenseRepository;
        this.userRepository = userRepository;
    }

    @Override
    public Category saveCategory(Category category) {

        String email = SecurityUtils.getCurrentUserEmail();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        validateCategoryName(category.getName());
        String cleanName = category.getName().trim().replaceAll("\\s+", " ");

        // Case-insensitive duplicate check per user
        if (categoryRepository.findByUserAndNameIgnoreCase(user, cleanName).isPresent()) {
            throw new IllegalArgumentException("Category already exists.");
        }

        category.setName(cleanName);
        category.setUser(user);
        if (category.getType() == null || category.getType().trim().isEmpty()) {
            category.setType("EXPENSE");
        }

        return categoryRepository.save(category);
    }

    @Override
    public List<Category> getAllCategories() {

        String email = SecurityUtils.getCurrentUserEmail();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        seedDefaultCategoriesIfEmpty(user);

        return categoryRepository.findByUserOrderByNameAsc(user);
    }

    @Override
    public List<CategoryResponse> getAllCategoriesWithStats(String search, String sortBy) {
        return getAllCategoriesWithStats(search, sortBy, null, null);
    }

    @Override
    public List<CategoryResponse> getAllCategoriesWithStats(String search, String sortBy, Integer year, Integer month) {

        String email = SecurityUtils.getCurrentUserEmail();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        seedDefaultCategoriesIfEmpty(user);

        List<Category> categories;
        if (search != null && !search.trim().isEmpty()) {
            categories = categoryRepository.findByUserAndNameContainingIgnoreCase(user, search.trim());
        } else {
            categories = categoryRepository.findByUser(user);
        }

        java.time.LocalDate now = java.time.LocalDate.now();
        int targetYear = (year != null && year > 0) ? year : now.getYear();
        int targetMonth = (month != null && month >= 1 && month <= 12) ? month : now.getMonthValue();

        List<Expense> allUserExpenses = expenseRepository.findByUser(user);
        List<Expense> filteredExpenses = allUserExpenses.stream()
                .filter(e -> {
                    if (e.getExpenseDate() == null) return false;
                    boolean matchYear = (year == null && month == null)
                            ? (e.getExpenseDate().getYear() == targetYear)
                            : (year == null || e.getExpenseDate().getYear() == targetYear);
                    boolean matchMonth = (year == null && month == null)
                            ? (e.getExpenseDate().getMonthValue() == targetMonth)
                            : (month == null || e.getExpenseDate().getMonthValue() == targetMonth);
                    return matchYear && matchMonth;
                })
                .collect(Collectors.toList());

        double overallTotalExpense = filteredExpenses.stream()
                .map(Expense::getAmount)
                .filter(a -> a != null)
                .mapToDouble(BigDecimal::doubleValue)
                .sum();

        List<CategoryResponse> responses = new ArrayList<>();
        for (Category cat : categories) {
            List<Expense> catExpenses = filteredExpenses.stream()
                    .filter(e -> e.getCategory() != null && (
                            (e.getCategory().getId() != null && e.getCategory().getId().equals(cat.getId())) ||
                            (e.getCategory().getName() != null && cat.getName() != null &&
                             e.getCategory().getName().trim().equalsIgnoreCase(cat.getName().trim()))
                    ))
                    .collect(Collectors.toList());

            long count = catExpenses.size();
            double total = catExpenses.stream()
                    .map(Expense::getAmount)
                    .filter(a -> a != null)
                    .mapToDouble(BigDecimal::doubleValue)
                    .sum();

            double share = overallTotalExpense > 0 ? ((total / overallTotalExpense) * 100.0) : 0.0;

            responses.add(new CategoryResponse(
                    cat.getId(),
                    cat.getName(),
                    cat.getDescription(),
                    cat.getType(),
                    count,
                    total,
                    share
            ));
        }

        // Apply sorting
        if ("name_desc".equalsIgnoreCase(sortBy) || "za".equalsIgnoreCase(sortBy)) {
            responses.sort((a, b) -> b.getName().compareToIgnoreCase(a.getName()));
        } else if ("newest".equalsIgnoreCase(sortBy)) {
            responses.sort((a, b) -> Long.compare(b.getId() != null ? b.getId() : 0, a.getId() != null ? a.getId() : 0));
        } else if ("oldest".equalsIgnoreCase(sortBy)) {
            responses.sort((a, b) -> Long.compare(a.getId() != null ? a.getId() : 0, b.getId() != null ? b.getId() : 0));
        } else {
            // default A-Z
            responses.sort((a, b) -> a.getName().compareToIgnoreCase(b.getName()));
        }

        return responses;
    }

    @Override
    public CategoryStatsResponse getCategoryStatsSummary() {

        String email = SecurityUtils.getCurrentUserEmail();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        List<CategoryResponse> list = getAllCategoriesWithStats(null, "az");
        long total = list.size();
        long used = list.stream().filter(c -> c.getExpenseCount() > 0).count();
        long unused = total - used;
        long active = total;

        return new CategoryStatsResponse(total, active, used, unused, list);
    }

    @Override
    public Category getCategoryById(Long id) {

        String email = SecurityUtils.getCurrentUserEmail();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id : " + id));

        if (!category.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized to access this category");
        }

        return category;
    }

    @Override
    public Category updateCategory(Long id, Category category) {

        String email = SecurityUtils.getCurrentUserEmail();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Category existing = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id : " + id));

        if (!existing.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized to modify this category");
        }

        validateCategoryName(category.getName());
        String cleanName = category.getName().trim().replaceAll("\\s+", " ");

        // Case-insensitive duplicate check excluding current ID
        if (categoryRepository.findByUserAndNameIgnoreCaseAndIdNot(user, cleanName, id).isPresent()) {
            throw new IllegalArgumentException("Category already exists.");
        }

        existing.setName(cleanName);
        existing.setDescription(category.getDescription());
        if (category.getType() != null && !category.getType().trim().isEmpty()) {
            existing.setType(category.getType());
        }

        return categoryRepository.save(existing);
    }

    @Override
    public void deleteCategory(Long id) {

        String email = SecurityUtils.getCurrentUserEmail();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id : " + id));

        if (!category.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized to delete this category");
        }

        // Prevent deleting if category is used in expenses
        if (expenseRepository.countByCategory(category) > 0) {
            throw new IllegalStateException("Cannot delete category because it is already used in expenses.");
        }

        categoryRepository.delete(category);
    }

    private void seedDefaultCategoriesIfEmpty(User user) {
        List<Category> existing = categoryRepository.findByUser(user);
        if (existing.isEmpty()) {
            String[][] defaults = {
                {"Education", "Tuition fees, books, courses, learning materials", "EXPENSE"},
                {"Transportation", "Fuel, public transit, cab, maintenance", "EXPENSE"},
                {"Utilities & Bills", "Electricity, water, internet, mobile", "EXPENSE"},
                {"Shopping", "Clothing, electronics, household", "EXPENSE"},
                {"Entertainment", "Movies, games, subscriptions", "EXPENSE"},
                {"Health & Medical", "Doctor, pharmacy, insurance", "EXPENSE"},
                {"Other", "Miscellaneous expenses", "EXPENSE"}
            };
            for (String[] def : defaults) {
                Category cat = new Category();
                cat.setName(def[0]);
                cat.setDescription(def[1]);
                cat.setType(def[2]);
                cat.setUser(user);
                categoryRepository.save(cat);
            }
        } else {
            // Automatically migrate existing "Food & Dining" / "Food" to "Education" if present
            for (Category cat : existing) {
                if ("Food & Dining".equalsIgnoreCase(cat.getName()) || "Food".equalsIgnoreCase(cat.getName())) {
                    boolean hasEducation = existing.stream().anyMatch(c -> "Education".equalsIgnoreCase(c.getName()));
                    if (!hasEducation) {
                        cat.setName("Education");
                        cat.setDescription("Tuition fees, books, courses, learning materials");
                        categoryRepository.save(cat);
                    }
                }
            }
        }
    }

    private void validateCategoryName(String name) {
        if (name == null || name.trim().isEmpty()) {
            throw new IllegalArgumentException("Category name cannot be empty.");
        }
        String trimmed = name.trim();
        if (trimmed.length() < 2) {
            throw new IllegalArgumentException("Category name must be at least 2 characters.");
        }
        if (trimmed.length() > 50) {
            throw new IllegalArgumentException("Category name cannot exceed 50 characters.");
        }
    }
}