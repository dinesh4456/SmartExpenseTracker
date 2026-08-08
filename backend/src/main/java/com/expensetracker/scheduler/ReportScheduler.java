package com.expensetracker.scheduler;

import java.time.LocalDate;
import java.util.List;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.expensetracker.email.EmailService;
import com.expensetracker.entity.User;
import com.expensetracker.repository.UserRepository;

@Component
public class ReportScheduler {

    private final UserRepository userRepository;
    private final EmailService emailService;

    public ReportScheduler(UserRepository userRepository, EmailService emailService) {
        this.userRepository = userRepository;
        this.emailService = emailService;
    }

    /**
     * Automatically sends the monthly financial report with Excel and PDF attachments
     * to all registered users at the end of every month (23:59 on the last day of each month)
     * or at 00:01 on the 1st day of the next month.
     */
    @Scheduled(cron = "0 59 23 L * ?")
    public void sendAutomaticMonthlyReportAtEndOfMonth() {
        LocalDate today = LocalDate.now();
        int year = today.getYear();
        int month = today.getMonthValue();

        List<User> users = userRepository.findAll();
        for (User user : users) {
            try {
                emailService.sendMonthlyExpenseReportToUser(user, year, month);
            } catch (Exception e) {
                System.err.println("Failed to send scheduled monthly report to user: " + user.getEmail() + " - " + e.getMessage());
            }
        }
    }

    /**
     * Fallback scheduler running at 00:05 on the 1st day of each month for the preceding month.
     */
    @Scheduled(cron = "0 5 0 1 * ?")
    public void sendAutomaticMonthlyReportOnFirstDayOfNextMonth() {
        LocalDate previousMonthDate = LocalDate.now().minusMonths(1);
        int year = previousMonthDate.getYear();
        int month = previousMonthDate.getMonthValue();

        List<User> users = userRepository.findAll();
        for (User user : users) {
            try {
                emailService.sendMonthlyExpenseReportToUser(user, year, month);
            } catch (Exception e) {
                System.err.println("Failed to send scheduled monthly report on 1st to user: " + user.getEmail() + " - " + e.getMessage());
            }
        }
    }
}
