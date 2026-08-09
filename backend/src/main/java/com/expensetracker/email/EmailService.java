package com.expensetracker.email;

import com.expensetracker.entity.User;

public interface EmailService {

    void sendMonthlyExpenseReport();

    void sendMonthlyExpenseReport(Integer year, Integer month);

    void sendMonthlyExpenseReportToUser(User user, int year, int month);

    void sendPasswordResetOtpEmail(String toEmail, String userName, String otp);

}