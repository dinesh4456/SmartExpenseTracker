package com.expensetracker.email;

import java.io.ByteArrayInputStream;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.Month;
import java.util.List;

import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

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

import jakarta.mail.internet.MimeMessage;

@Service
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender mailSender;
    private final ExpenseRepository expenseRepository;
    private final IncomeRepository incomeRepository;
    private final UserRepository userRepository;
    private final ExcelExportService excelExportService;
    private final PdfExportService pdfExportService;

    public EmailServiceImpl(
            JavaMailSender mailSender,
            ExpenseRepository expenseRepository,
            IncomeRepository incomeRepository,
            UserRepository userRepository,
            ExcelExportService excelExportService,
            PdfExportService pdfExportService) {

        this.mailSender = mailSender;
        this.expenseRepository = expenseRepository;
        this.incomeRepository = incomeRepository;
        this.userRepository = userRepository;
        this.excelExportService = excelExportService;
        this.pdfExportService = pdfExportService;
    }

    @Override
    public void sendMonthlyExpenseReport() {
        LocalDate now = LocalDate.now();
        sendMonthlyExpenseReport(now.getYear(), now.getMonthValue());
    }

    @Override
    public void sendMonthlyExpenseReport(Integer year, Integer month) {

        String email = SecurityUtils.getCurrentUserEmail();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));

        int targetYear = (year != null && year > 0) ? year : LocalDate.now().getYear();
        int targetMonth = (month != null && month > 0) ? month : LocalDate.now().getMonthValue();

        sendMonthlyExpenseReportToUser(user, targetYear, targetMonth);
    }

    @Override
    public void sendMonthlyExpenseReportToUser(User user, int year, int month) {

        try {
            List<Income> incomes = incomeRepository.getIncomeByMonth(user, year, month);
            List<Expense> expenses = expenseRepository.getExpensesByMonth(user, year, month);

            BigDecimal totalIncome = incomes.stream()
                    .map(Income::getAmount)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            BigDecimal totalExpense = expenses.stream()
                    .map(Expense::getAmount)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            BigDecimal totalSavings = totalIncome.subtract(totalExpense);

            String monthName = Month.of(month).name();
            monthName = monthName.substring(0, 1) + monthName.substring(1).toLowerCase();

            ByteArrayInputStream excelStream = excelExportService.exportMonthlyReport(incomes, expenses, month);
            byte[] excelBytes = excelStream.readAllBytes();

            ByteArrayInputStream pdfStream = pdfExportService.exportMonthlyReport(incomes, expenses, month);
            byte[] pdfBytes = pdfStream.readAllBytes();

            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setTo(user.getEmail());
            helper.setSubject("Monthly Financial Report - " + monthName + " " + year);

            StringBuilder body = new StringBuilder();
            body.append("Hello ").append(user.getFullName() != null ? user.getFullName() : "User").append(",\n\n");
            body.append("Here is your Monthly Financial Summary for ").append(monthName).append(" ").append(year).append(":\n\n");
            body.append("📊 Monthly Financial Summary:\n");
            body.append("-------------------------------------------\n");
            body.append("• Total Income   : ₹").append(totalIncome).append("\n");
            body.append("• Total Expenses : ₹").append(totalExpense).append("\n");
            body.append("• Total Savings  : ₹").append(totalSavings).append("\n");
            body.append("-------------------------------------------\n\n");
            body.append("Attached are your detailed Excel and PDF reports for ").append(monthName).append(" ").append(year).append(".\n\n");
            body.append("Thank you for using Smart Expense Tracker!\n");

            helper.setText(body.toString());

            helper.addAttachment(
                    "financial-report-" + year + "-" + month + ".xlsx",
                    new ByteArrayResource(excelBytes),
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            );

            helper.addAttachment(
                    "financial-report-" + year + "-" + month + ".pdf",
                    new ByteArrayResource(pdfBytes),
                    "application/pdf"
            );

            mailSender.send(message);

        } catch (Exception e) {
            throw new RuntimeException("Failed to send monthly report email: " + e.getMessage(), e);
        }
    }

}