package com.expensetracker.dto.category;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CategoryStatsResponse {

    private long totalCategories;
    private long activeCategories;
    private long usedCategories;
    private long unusedCategories;
    private List<CategoryResponse> categories;
}
