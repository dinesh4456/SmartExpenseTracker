package com.expensetracker.pdf;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

import org.springframework.stereotype.Service;

import com.expensetracker.entity.Expense;
import com.expensetracker.entity.Income;
import com.lowagie.text.Document;
import com.lowagie.text.Font;
import com.lowagie.text.Paragraph;
import com.lowagie.text.Phrase;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;

@Service
public class PdfExportService {

    // =========================================================
    // EXISTING EXPENSE PDF
    // =========================================================

    public ByteArrayInputStream exportExpenses(
            List<Expense> expenses) {

        Document document =
                new Document();

        ByteArrayOutputStream out =
                new ByteArrayOutputStream();

        try {

            PdfWriter.getInstance(
                    document,
                    out
            );

            document.open();

            Font titleFont =
                    new Font(
                            Font.HELVETICA,
                            18,
                            Font.BOLD
                    );

            Paragraph title =
                    new Paragraph(
                            "Expense Report",
                            titleFont
                    );

            title.setAlignment(
                    Paragraph.ALIGN_CENTER
            );

            document.add(title);

            document.add(
                    new Paragraph(" ")
            );

            PdfPTable table =
                    new PdfPTable(4);

            table.setWidthPercentage(100);

            table.addCell(
                    new PdfPCell(
                            new Phrase("Title")
                    )
            );

            table.addCell(
                    new PdfPCell(
                            new Phrase("Amount")
                    )
            );

            table.addCell(
                    new PdfPCell(
                            new Phrase("Category")
                    )
            );

            table.addCell(
                    new PdfPCell(
                            new Phrase("Date")
                    )
            );

            for (Expense expense : expenses) {

                table.addCell(
                        expense.getTitle() == null
                                ? ""
                                : expense.getTitle()
                );

                table.addCell(
                        expense.getAmount() == null
                                ? "0"
                                : expense.getAmount().toString()
                );

                table.addCell(
                        expense.getCategory() != null
                                ? expense.getCategory().getName()
                                : "-"
                );

                table.addCell(
                        expense.getExpenseDate() != null
                                ? expense.getExpenseDate().toString()
                                : "-"
                );
            }

            document.add(table);

            document.close();

        } catch (Exception e) {

            throw new RuntimeException(
                    "Failed to export PDF",
                    e
            );
        }

        return new ByteArrayInputStream(
                out.toByteArray()
        );
    }

    // =========================================================
    // MONTHLY FINANCIAL PDF
    // =========================================================

    public ByteArrayInputStream exportMonthlyReport(
            List<Income> incomes,
            List<Expense> expenses,
            Integer month) {

        Document document =
                new Document();

        ByteArrayOutputStream out =
                new ByteArrayOutputStream();

        try {

            PdfWriter.getInstance(
                    document,
                    out
            );

            document.open();

            Font titleFont =
                    new Font(
                            Font.HELVETICA,
                            18,
                            Font.BOLD
                    );

            String titleText;

            if (month == null || month == 0) {

                titleText =
                        "Financial Report - All Months";

            } else {

                titleText =
                        "Financial Report - "
                                + monthName(month);
            }

            Paragraph title =
                    new Paragraph(
                            titleText,
                            titleFont
                    );

            title.setAlignment(
                    Paragraph.ALIGN_CENTER
            );

            document.add(title);

            document.add(
                    new Paragraph(" ")
            );

            /*
             * Table:
             *
             * Date
             * Type
             * Source/Title
             * Category
             * Income
             * Expense
             */

            PdfPTable table =
                    new PdfPTable(6);

            table.setWidthPercentage(100);

            table.setWidths(
                    new float[]{
                            1.3f,
                            1.2f,
                            2.5f,
                            1.7f,
                            1.4f,
                            1.4f
                    }
            );

            table.addCell(
                    new PdfPCell(
                            new Phrase("Date")
                    )
            );

            table.addCell(
                    new PdfPCell(
                            new Phrase("Type")
                    )
            );

            table.addCell(
                    new PdfPCell(
                            new Phrase("Source/Title")
                    )
            );

            table.addCell(
                    new PdfPCell(
                            new Phrase("Category")
                    )
            );

            table.addCell(
                    new PdfPCell(
                            new Phrase("Income")
                    )
            );

            table.addCell(
                    new PdfPCell(
                            new Phrase("Expense")
                    )
            );

            List<ReportRow> rows =
                    new ArrayList<>();

            // -------------------------------------------------
            // INCOME
            // -------------------------------------------------

            for (Income income : incomes) {

                if (income.getIncomeDate() == null) {
                    continue;
                }

                if (month != null
                        && month != 0
                        && income.getIncomeDate()
                                .getMonthValue() != month) {

                    continue;
                }

                rows.add(
                        new ReportRow(
                                income.getIncomeDate(),
                                "Income",
                                income.getSource(),
                                "",
                                income.getAmount()
                        )
                );
            }

            // -------------------------------------------------
            // EXPENSE
            // -------------------------------------------------

            for (Expense expense : expenses) {

                if (expense.getExpenseDate() == null) {
                    continue;
                }

                if (month != null
                        && month != 0
                        && expense.getExpenseDate()
                                .getMonthValue() != month) {

                    continue;
                }

                String category =
                        expense.getCategory() == null
                                ? ""
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

            // -------------------------------------------------
            // SORT BY DATE
            // -------------------------------------------------

            rows.sort(
                    Comparator.comparing(
                            ReportRow::getDate
                    )
            );

            // -------------------------------------------------
            // ADD ROWS
            // -------------------------------------------------

            BigDecimal totalIncome =
                    BigDecimal.ZERO;

            BigDecimal totalExpense =
                    BigDecimal.ZERO;

            for (ReportRow reportRow : rows) {

                table.addCell(
                        reportRow.getDate()
                                .toString()
                );

                table.addCell(
                        reportRow.getType()
                );

                table.addCell(
                        reportRow.getSourceOrTitle() == null
                                ? ""
                                : reportRow.getSourceOrTitle()
                );

                table.addCell(
                        reportRow.getCategory() == null
                                ? ""
                                : reportRow.getCategory()
                );

                if ("Income".equals(
                        reportRow.getType())) {

                    BigDecimal amount =
                            reportRow.getAmount();

                    table.addCell(
                            amount == null
                                    ? "0"
                                    : amount.toString()
                    );

                    table.addCell("0");

                    if (amount != null) {
                        totalIncome =
                                totalIncome.add(amount);
                    }

                } else {

                    table.addCell("0");

                    BigDecimal amount =
                            reportRow.getAmount();

                    table.addCell(
                            amount == null
                                    ? "0"
                                    : amount.toString()
                    );

                    if (amount != null) {
                        totalExpense =
                                totalExpense.add(amount);
                    }
                }
            }

            document.add(table);

            // -------------------------------------------------
            // SUMMARY
            // -------------------------------------------------

            document.add(
                    new Paragraph(" ")
            );

            BigDecimal savings =
                    totalIncome.subtract(
                            totalExpense
                    );

            Font summaryFont =
                    new Font(
                            Font.HELVETICA,
                            12,
                            Font.BOLD
                    );

            document.add(
                    new Paragraph(
                            "Total Income: ₹"
                                    + totalIncome,
                            summaryFont
                    )
            );

            document.add(
                    new Paragraph(
                            "Total Expense: ₹"
                                    + totalExpense,
                            summaryFont
                    )
            );

            document.add(
                    new Paragraph(
                            "Savings: ₹"
                                    + savings,
                            summaryFont
                    )
            );

            document.close();

        } catch (Exception e) {

            throw new RuntimeException(
                    "Failed to export monthly PDF",
                    e
            );
        }

        return new ByteArrayInputStream(
                out.toByteArray()
        );
    }

    // =========================================================
    // MONTH NAME
    // =========================================================

    private String monthName(
            int month) {

        if (month < 1 || month > 12) {

            return "Unknown Month";
        }

        String name =
                java.time.Month
                        .of(month)
                        .name();

        return name.substring(0, 1)
                + name.substring(1)
                        .toLowerCase();
    }

    // =========================================================
    // REPORT ROW
    // =========================================================

    private static class ReportRow {

        private final LocalDate date;
        private final String type;
        private final String sourceOrTitle;
        private final String category;
        private final BigDecimal amount;

        public ReportRow(
                LocalDate date,
                String type,
                String sourceOrTitle,
                String category,
                BigDecimal amount) {

            this.date = date;
            this.type = type;
            this.sourceOrTitle =
                    sourceOrTitle;
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

        public BigDecimal getAmount() {
            return amount;
        }
    }
}