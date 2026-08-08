package com.expensetracker.dto.dashboard;

import java.math.BigDecimal;
import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class RecentTransactionResponse {

    private String category;

    private BigDecimal amount;

    private LocalDate date;

}