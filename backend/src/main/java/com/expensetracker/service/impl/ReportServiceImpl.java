package com.expensetracker.service.impl;

import java.io.ByteArrayInputStream;
import java.math.BigDecimal;
import java.time.Month;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.expensetracker.dto.report.MonthlyExpenseProjection;
import com.expensetracker.dto.report.MonthlyExpenseResponse;
import com.expensetracker.entity.Expense;
import com.expensetracker.entity.Income;
import com.expensetracker.entity.User;
import com.expensetracker.exception.ResourceNotFoundException;
import com.expensetracker.export.ExcelExportService;
import com.expensetracker.pdf.PdfExportService;
import com.expensetracker.repository.ExpenseRepository;
import com.expensetracker.repository.IncomeRepository;
import com.expensetracker.repository.UserRepository;
import com.expensetracker.security.SecurityUtils;
import com.expensetracker.service.ReportService;

@Service
public class ReportServiceImpl implements ReportService {

    private final ExpenseRepository expenseRepository;
    private final IncomeRepository incomeRepository;
    private final UserRepository userRepository;
    private final ExcelExportService excelExportService;
    private final PdfExportService pdfExportService;

    public ReportServiceImpl(
            ExpenseRepository expenseRepository,
            IncomeRepository incomeRepository,
            UserRepository userRepository,
            ExcelExportService excelExportService,
            PdfExportService pdfExportService) {

        this.expenseRepository = expenseRepository;
        this.incomeRepository = incomeRepository;
        this.userRepository = userRepository;
        this.excelExportService = excelExportService;
        this.pdfExportService = pdfExportService;
    }

    // =========================================================
    // REPORT - ALL YEARS (CURRENT BEHAVIOUR)
    // =========================================================

    @Override
    public List<MonthlyExpenseResponse> getMonthlyReport() {
        return getMonthlyReport(null, null);
    }

    // =========================================================
    // REPORT BY YEAR
    // =========================================================

    @Override
    public List<MonthlyExpenseResponse> getMonthlyReport(Integer year) {
        return getMonthlyReport(year, null);
    }

    // =========================================================
    // REPORT BY YEAR AND MONTH
    // =========================================================

    @Override
    public List<MonthlyExpenseResponse> getMonthlyReport(Integer year, Integer month) {

        String email = SecurityUtils.getCurrentUserEmail();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));

        if (year != null && month != null && month > 0) {
            List<Expense> expenses = expenseRepository.getExpensesByMonth(user, year, month);
            List<Income> incomes = incomeRepository.getIncomeByMonth(user, year, month);

            if (expenses.isEmpty() && incomes.isEmpty()) {
                return Collections.emptyList();
            }

            BigDecimal totalExpense = expenses.stream()
                    .map(Expense::getAmount)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            BigDecimal totalIncome = incomes.stream()
                    .map(Income::getAmount)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            if (totalExpense.compareTo(BigDecimal.ZERO) == 0 && totalIncome.compareTo(BigDecimal.ZERO) == 0) {
                return Collections.emptyList();
            }

            BigDecimal savings = totalIncome.subtract(totalExpense);
            String monthName = Month.of(month).name();
            monthName = monthName.substring(0, 1) + monthName.substring(1).toLowerCase();

            List<MonthlyExpenseResponse> singleResult = new ArrayList<>();
            singleResult.add(new MonthlyExpenseResponse(
                    monthName,
                    totalExpense,
                    totalIncome,
                    savings
            ));
            return singleResult;
        }

        if (year != null && (month == null || month == 0)) {
            return buildMonthlyReport(
                    expenseRepository.getMonthlyExpense(user, year),
                    incomeRepository.getMonthlyIncome(user, year)
            );
        }

        if (year == null && (month != null && month > 0)) {
            List<Expense> expenses = expenseRepository.getExpensesByMonthOnly(user, month);
            List<Income> incomes = incomeRepository.getIncomeByMonthOnly(user, month);

            if (expenses.isEmpty() && incomes.isEmpty()) {
                return Collections.emptyList();
            }

            BigDecimal totalExpense = expenses.stream()
                    .map(Expense::getAmount)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            BigDecimal totalIncome = incomes.stream()
                    .map(Income::getAmount)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            if (totalExpense.compareTo(BigDecimal.ZERO) == 0 && totalIncome.compareTo(BigDecimal.ZERO) == 0) {
                return Collections.emptyList();
            }

            BigDecimal savings = totalIncome.subtract(totalExpense);
            String monthName = Month.of(month).name();
            monthName = monthName.substring(0, 1) + monthName.substring(1).toLowerCase();

            List<MonthlyExpenseResponse> singleResult = new ArrayList<>();
            singleResult.add(new MonthlyExpenseResponse(
                    monthName,
                    totalExpense,
                    totalIncome,
                    savings
            ));
            return singleResult;
        }

        return buildMonthlyReport(
                expenseRepository.getMonthlyExpense(user),
                incomeRepository.getMonthlyIncome(user)
        );
    }

    // =========================================================
    // COMMON REPORT BUILDER
    // =========================================================

    private List<MonthlyExpenseResponse> buildMonthlyReport(
            List<MonthlyExpenseProjection> expenseReports,
            List<Object[]> incomeReports) {

        Map<Integer, BigDecimal> expenseMap =
                new HashMap<>();

        if (expenseReports != null) {
            for (MonthlyExpenseProjection expense : expenseReports) {
                expenseMap.put(
                        expense.getMonth(),
                        expense.getTotalExpense()
                );
            }
        }

        Map<Integer, BigDecimal> incomeMap =
                new HashMap<>();

        if (incomeReports != null) {
            for (Object[] income : incomeReports) {
                Integer month =
                        ((Number) income[0]).intValue();
                BigDecimal amount =
                        (BigDecimal) income[1];
                incomeMap.put(month, amount);
            }
        }

        List<MonthlyExpenseResponse> result =
                new ArrayList<>();

        for (int month = 1; month <= 12; month++) {

            BigDecimal totalIncome =
                    incomeMap.getOrDefault(
                            month,
                            BigDecimal.ZERO);

            BigDecimal totalExpense =
                    expenseMap.getOrDefault(
                            month,
                            BigDecimal.ZERO);

            if (totalIncome.compareTo(BigDecimal.ZERO) == 0
                    &&
                    totalExpense.compareTo(BigDecimal.ZERO) == 0) {

                continue;
            }

            BigDecimal savings =
                    totalIncome.subtract(totalExpense);

            String monthName =
                    Month.of(month).name();

            monthName =
                    monthName.substring(0, 1)
                            +
                            monthName.substring(1)
                                    .toLowerCase();

            result.add(
                    new MonthlyExpenseResponse(
                            monthName,
                            totalExpense,
                            totalIncome,
                            savings
                    )
            );
        }

        return result;
    }

    // =========================================================
    // MONTHLY EXCEL EXPORT
    // =========================================================

    @Override
    public ByteArrayInputStream exportMonthlyReportToExcel(
            Integer year,
            Integer month) {

        String email =
                SecurityUtils.getCurrentUserEmail();

        User user =
                userRepository.findByEmail(email)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "User not found"));

        List<Income> incomes;
        List<Expense> expenses;

        if (year != null && month != null && month > 0) {
            incomes = incomeRepository.getIncomeByMonth(user, year, month);
            expenses = expenseRepository.getExpensesByMonth(user, year, month);
        } else if (year != null) {
            incomes = incomeRepository.getIncomeByYear(user, year);
            expenses = expenseRepository.getExpensesByYear(user, year);
        } else if (month != null && month > 0) {
            incomes = incomeRepository.getIncomeByMonthOnly(user, month);
            expenses = expenseRepository.getExpensesByMonthOnly(user, month);
        } else {
            incomes = incomeRepository.findByUser(user);
            expenses = expenseRepository.findByUser(user);
        }

        return excelExportService.exportMonthlyReport(
                incomes,
                expenses,
                month
        );
    }

    // =========================================================
    // NORMAL EXPENSE EXCEL EXPORT
    // =========================================================

    @Override
    public ByteArrayInputStream exportExpensesToExcel() {

        String email =
                SecurityUtils.getCurrentUserEmail();

        User user =
                userRepository.findByEmail(email)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "User not found"));

        return excelExportService.exportExpenses(
                expenseRepository.findByUser(user)
        );
    }

    // =========================================================
    // NORMAL EXPENSE PDF EXPORT
    // =========================================================

    @Override
    public ByteArrayInputStream exportExpensesToPdf() {

        String email =
                SecurityUtils.getCurrentUserEmail();

        User user =
                userRepository.findByEmail(email)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "User not found"));

        return pdfExportService.exportExpenses(
                expenseRepository.findByUser(user)
        );
    }

    // =========================================================
    // MONTHLY PDF EXPORT
    // =========================================================

    @Override
    public ByteArrayInputStream exportMonthlyReportToPdf(
            Integer year,
            Integer month) {

        String email =
                SecurityUtils.getCurrentUserEmail();

        User user =
                userRepository.findByEmail(email)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "User not found"));

        List<Income> incomes;
        List<Expense> expenses;

        if (year != null && month != null && month > 0) {
            incomes = incomeRepository.getIncomeByMonth(user, year, month);
            expenses = expenseRepository.getExpensesByMonth(user, year, month);
        } else if (year != null) {
            incomes = incomeRepository.getIncomeByYear(user, year);
            expenses = expenseRepository.getExpensesByYear(user, year);
        } else if (month != null && month > 0) {
            incomes = incomeRepository.getIncomeByMonthOnly(user, month);
            expenses = expenseRepository.getExpensesByMonthOnly(user, month);
        } else {
            incomes = incomeRepository.findByUser(user);
            expenses = expenseRepository.findByUser(user);
        }

        return pdfExportService.exportMonthlyReport(
                incomes,
                expenses,
                month
        );
    }

}