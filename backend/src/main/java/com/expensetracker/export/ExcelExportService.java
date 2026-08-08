package com.expensetracker.export;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import com.expensetracker.entity.Expense;
import com.expensetracker.entity.Income;

@Service
public class ExcelExportService {

    public ByteArrayInputStream exportExpenses(
            List<Expense> expenses) {

        try (Workbook workbook = new XSSFWorkbook();
             ByteArrayOutputStream out = new ByteArrayOutputStream()) {

            Sheet sheet = workbook.createSheet("Expenses");

            Row header = sheet.createRow(0);

            header.createCell(0).setCellValue("Title");
            header.createCell(1).setCellValue("Amount");
            header.createCell(2).setCellValue("Description");
            header.createCell(3).setCellValue("Date");
            header.createCell(4).setCellValue("Category");

            int rowIndex = 1;

            for (Expense expense : expenses) {

                Row row = sheet.createRow(rowIndex++);

                row.createCell(0).setCellValue(
                        expense.getTitle());

                row.createCell(1).setCellValue(
                        expense.getAmount().doubleValue());

                row.createCell(2).setCellValue(
                        expense.getDescription() == null
                                ? ""
                                : expense.getDescription());

                row.createCell(3).setCellValue(
                        expense.getExpenseDate() == null
                                ? ""
                                : expense.getExpenseDate().toString());

                row.createCell(4).setCellValue(
                        expense.getCategory() == null
                                ? ""
                                : expense.getCategory().getName());
            }

            autoSizeColumns(sheet, 5);

            workbook.write(out);

            return new ByteArrayInputStream(
                    out.toByteArray());

        } catch (IOException e) {

            throw new RuntimeException(
                    "Failed to export Excel file.",
                    e);
        }
    }

    public ByteArrayInputStream exportMonthlyReport(
            List<Income> incomes,
            List<Expense> expenses,
            Integer month) {

        try (Workbook workbook = new XSSFWorkbook();
             ByteArrayOutputStream out = new ByteArrayOutputStream()) {

            Sheet sheet =
                    workbook.createSheet("Monthly Report");

            // Cell Styles
            org.apache.poi.ss.usermodel.CellStyle headerStyle = workbook.createCellStyle();
            org.apache.poi.ss.usermodel.Font headerFont = workbook.createFont();
            headerFont.setBold(true);
            headerStyle.setFont(headerFont);

            org.apache.poi.ss.usermodel.CellStyle boldStyle = workbook.createCellStyle();
            org.apache.poi.ss.usermodel.Font boldFont = workbook.createFont();
            boldFont.setBold(true);
            boldStyle.setFont(boldFont);

            Row header = sheet.createRow(0);

            String[] columns = {"Date", "Type", "Source/Title", "Category", "Income", "Expense", "Savings"};
            for (int i = 0; i < columns.length; i++) {
                org.apache.poi.ss.usermodel.Cell cell = header.createCell(i);
                cell.setCellValue(columns[i]);
                cell.setCellStyle(headerStyle);
            }

            List<ReportRow> rows =
                    new ArrayList<>();

            /*
             * Income records
             */
            for (Income income : incomes) {

                if (income.getIncomeDate() == null) {
                    continue;
                }

                if (month != null
                        && income.getIncomeDate()
                                .getMonthValue() != month) {
                    continue;
                }

                rows.add(
                        new ReportRow(
                                income.getIncomeDate(),
                                "Income",
                                income.getSource(),
                                "Income",
                                income.getAmount()
                        )
                );
            }

            /*
             * Expense records
             */
            for (Expense expense : expenses) {

                if (expense.getExpenseDate() == null) {
                    continue;
                }

                if (month != null
                        && expense.getExpenseDate()
                                .getMonthValue() != month) {
                    continue;
                }

                String category =
                        expense.getCategory() == null
                                ? "General"
                                : expense.getCategory()
                                        .getName();

                rows.add(
                        new ReportRow(
                                expense.getExpenseDate(),
                                "Expense",
                                expense.getTitle(),
                                category,
                                expense.getAmount()
                        )
                );
            }

            /*
             * Sort all transactions by date
             */
            rows.sort(
                    Comparator.comparing(
                            ReportRow::getDate
                    )
            );

            int rowIndex = 1;
            double totalIncome = 0.0;
            double totalExpense = 0.0;

            for (ReportRow reportRow : rows) {

                Row row =
                        sheet.createRow(rowIndex++);

                row.createCell(0)
                        .setCellValue(
                                reportRow.getDate()
                                        .toString());

                row.createCell(1)
                        .setCellValue(
                                reportRow.getType());

                row.createCell(2)
                        .setCellValue(
                                reportRow.getSourceOrTitle() != null ? reportRow.getSourceOrTitle() : "");

                row.createCell(3)
                        .setCellValue(
                                reportRow.getCategory() != null ? reportRow.getCategory() : "");

                if ("Income".equals(
                        reportRow.getType())) {

                    double inc = reportRow.getAmount() != null ? reportRow.getAmount().doubleValue() : 0.0;
                    totalIncome += inc;

                    row.createCell(4).setCellValue(inc);
                    row.createCell(5).setCellValue(0);
                    row.createCell(6).setCellValue(inc);

                } else {

                    double exp = reportRow.getAmount() != null ? reportRow.getAmount().doubleValue() : 0.0;
                    totalExpense += exp;

                    row.createCell(4).setCellValue(0);
                    row.createCell(5).setCellValue(exp);
                    row.createCell(6).setCellValue(-exp);
                }
            }

            // Summary Section
            rowIndex++; // blank row

            double totalSavings = totalIncome - totalExpense;

            Row summaryHeaderRow = sheet.createRow(rowIndex++);
            org.apache.poi.ss.usermodel.Cell sumTitle = summaryHeaderRow.createCell(0);
            sumTitle.setCellValue("MONTHLY FINANCIAL SUMMARY");
            sumTitle.setCellStyle(boldStyle);

            Row incRow = sheet.createRow(rowIndex++);
            incRow.createCell(0).setCellValue("Total Income");
            incRow.createCell(1).setCellValue(totalIncome);

            Row expRow = sheet.createRow(rowIndex++);
            expRow.createCell(0).setCellValue("Total Expense");
            expRow.createCell(1).setCellValue(totalExpense);

            Row savRow = sheet.createRow(rowIndex++);
            org.apache.poi.ss.usermodel.Cell savLabel = savRow.createCell(0);
            savLabel.setCellValue("Total Monthly Savings");
            savLabel.setCellStyle(boldStyle);

            org.apache.poi.ss.usermodel.Cell savVal = savRow.createCell(1);
            savVal.setCellValue(totalSavings);
            savVal.setCellStyle(boldStyle);

            autoSizeColumns(sheet, 7);

            workbook.write(out);

            return new ByteArrayInputStream(
                    out.toByteArray());

        } catch (IOException e) {

            throw new RuntimeException(
                    "Failed to export monthly report.",
                    e);
        }
    }

    private void autoSizeColumns(
            Sheet sheet,
            int columnCount) {

        for (int i = 0;
             i < columnCount;
             i++) {

            sheet.autoSizeColumn(i);
        }
    }

    private static class ReportRow {

        private final LocalDate date;
        private final String type;
        private final String sourceOrTitle;
        private final String category;
        private final java.math.BigDecimal amount;

        public ReportRow(
                LocalDate date,
                String type,
                String sourceOrTitle,
                String category,
                java.math.BigDecimal amount) {

            this.date = date;
            this.type = type;
            this.sourceOrTitle = sourceOrTitle;
            this.category = category;
            this.amount = amount;
        }

        public LocalDate getDate() {
            return date;
        }

        public String getType() {
            return type;
        }

        public String getSourceOrTitle() {
            return sourceOrTitle;
        }

        public String getCategory() {
            return category;
        }

        public java.math.BigDecimal getAmount() {
            return amount;
        }
    }
}