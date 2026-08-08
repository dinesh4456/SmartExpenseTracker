package com.expensetracker.service;

import java.util.List;

import com.expensetracker.dto.category.CategoryResponse;
import com.expensetracker.dto.category.CategoryStatsResponse;
import com.expensetracker.entity.Category;

public interface CategoryService {

    Category saveCategory(Category category);

    List<Category> getAllCategories();

    List<CategoryResponse> getAllCategoriesWithStats(String search, String sortBy);

    List<CategoryResponse> getAllCategoriesWithStats(String search, String sortBy, Integer year, Integer month);

    CategoryStatsResponse getCategoryStatsSummary();

    Category getCategoryById(Long id);

    Category updateCategory(Long id, Category category);

    void deleteCategory(Long id);

}