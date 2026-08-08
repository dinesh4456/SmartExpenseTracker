package com.expensetracker.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.expensetracker.email.EmailService;
import com.expensetracker.scheduler.ReportScheduler;

@RestController
@RequestMapping("/api/email")
public class EmailController {

    private final EmailService emailService;
    private final ReportScheduler reportScheduler;

    public EmailController(EmailService emailService, ReportScheduler reportScheduler) {
        this.emailService = emailService;
        this.reportScheduler = reportScheduler;
    }

    @GetMapping("/monthly-report")
    public String sendMonthlyReport(
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) Integer month) {

        emailService.sendMonthlyExpenseReport(year, month);

        return "Monthly Expense Report Sent Successfully.";

    }

    @GetMapping("/trigger-monthly-scheduler")
    public String triggerMonthlyScheduler() {
        reportScheduler.sendAutomaticMonthlyReportAtEndOfMonth();
        return "Automatic Month-End Report Scheduler executed successfully for all registered users.";
    }

}