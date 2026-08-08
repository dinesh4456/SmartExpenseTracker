package com.expensetracker.dto.expense;

import java.math.BigDecimal;
import java.time.LocalDate;

public record ExpenseFilterResponse(

        Long id,

        String title,

        BigDecimal amount,

        String description,

        LocalDate expenseDate,

        String categoryName
) {
}