package com.expensetracker.controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.expensetracker.dto.auth.ForgotPasswordRequest;
import com.expensetracker.dto.auth.LoginRequest;
import com.expensetracker.dto.auth.LoginResponse;
import com.expensetracker.dto.auth.RegisterRequest;
import com.expensetracker.dto.auth.ResetPasswordWithOtpRequest;
import com.expensetracker.dto.auth.SendOtpRequest;
import com.expensetracker.dto.auth.VerifyOtpRequest;
import com.expensetracker.service.auth.AuthenticationService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationService authenticationService;

    public AuthController(AuthenticationService authenticationService) {
        this.authenticationService = authenticationService;
    }

    @PostMapping("/register")
    public String register(@Valid @RequestBody RegisterRequest request) {
        return authenticationService.register(request);
    }

    @PostMapping("/login")
    public LoginResponse login(@Valid @RequestBody LoginRequest request) {
        return authenticationService.login(request);
    }

    @PostMapping("/send-otp")
    public String sendOtp(@Valid @RequestBody SendOtpRequest request) {
        return authenticationService.sendPasswordResetOtp(request);
    }

    @PostMapping("/verify-otp")
    public String verifyOtp(@Valid @RequestBody VerifyOtpRequest request) {
        return authenticationService.verifyOtp(request);
    }

    @PostMapping("/reset-password")
    public String resetPasswordWithOtp(@Valid @RequestBody ResetPasswordWithOtpRequest request) {
        return authenticationService.resetPasswordWithOtp(request);
    }

    // Legacy direct reset endpoint (backward compatibility)
    @PostMapping("/forgot-password")
    public String forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        return authenticationService.forgotPassword(request);
    }
}