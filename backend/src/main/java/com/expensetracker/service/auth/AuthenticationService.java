package com.expensetracker.service.auth;

import java.security.SecureRandom;
import java.time.LocalDateTime;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.expensetracker.dto.auth.LoginRequest;
import com.expensetracker.dto.auth.LoginResponse;
import com.expensetracker.dto.auth.RegisterRequest;
import com.expensetracker.dto.auth.ResetPasswordWithOtpRequest;
import com.expensetracker.dto.auth.SendOtpRequest;
import com.expensetracker.dto.auth.VerifyOtpRequest;
import com.expensetracker.email.EmailService;
import com.expensetracker.entity.User;
import com.expensetracker.exception.BadRequestException;
import com.expensetracker.exception.ResourceNotFoundException;
import com.expensetracker.repository.UserRepository;
import com.expensetracker.security.JwtService;

@Service
public class AuthenticationService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final EmailService emailService;
    private final SecureRandom secureRandom = new SecureRandom();

    public AuthenticationService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService,
            EmailService emailService) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.emailService = emailService;
    }

    // REGISTER
    public String register(RegisterRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            return "Email already exists!";
        }

        User user = new User();

        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole("USER");

        userRepository.save(user);

        return "User Registered Successfully";
    }

    // LOGIN
    public LoginResponse login(LoginRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElse(null);

        if (user == null) {

            return new LoginResponse(
                    null,
                    "User not found",
                    null
            );

        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {

            return new LoginResponse(
                    null,
                    "Invalid Password",
                    null
            );

        }

        String token = jwtService.generateToken(user.getEmail());

        return new LoginResponse(
                token,
                "Login Successful",
                user.getFullName()
        );

    }

    // SEND OTP FOR PASSWORD RESET
    public String sendPasswordResetOtp(SendOtpRequest request) {
        User user = userRepository.findByEmail(request.getEmail().trim().toLowerCase())
                .orElseThrow(() -> new ResourceNotFoundException("No account registered with email: " + request.getEmail()));

        // Generate 6-digit OTP code
        int otpCode = 100000 + secureRandom.nextInt(900000);
        String otp = String.valueOf(otpCode);

        // Store OTP & set 10 minutes expiry
        user.setResetOtp(otp);
        user.setResetOtpExpiry(LocalDateTime.now().plusMinutes(10));
        userRepository.save(user);

        // Send OTP via email
        emailService.sendPasswordResetOtpEmail(user.getEmail(), user.getFullName(), otp);

        return "OTP sent successfully to " + user.getEmail() + ". Please check your inbox (and spam folder).";
    }

    // VERIFY OTP
    public String verifyOtp(VerifyOtpRequest request) {
        User user = userRepository.findByEmail(request.getEmail().trim().toLowerCase())
                .orElseThrow(() -> new ResourceNotFoundException("No account found with this email address."));

        if (user.getResetOtp() == null || user.getResetOtpExpiry() == null) {
            throw new BadRequestException("No OTP request found for this email. Please request a new OTP.");
        }

        if (LocalDateTime.now().isAfter(user.getResetOtpExpiry())) {
            throw new BadRequestException("OTP has expired. Please request a new OTP.");
        }

        if (!user.getResetOtp().trim().equals(request.getOtp().trim())) {
            throw new BadRequestException("Invalid OTP entered. Please check and try again.");
        }

        return "OTP verified successfully. You can now set your new password.";
    }

    // RESET PASSWORD WITH OTP
    public String resetPasswordWithOtp(ResetPasswordWithOtpRequest request) {
        User user = userRepository.findByEmail(request.getEmail().trim().toLowerCase())
                .orElseThrow(() -> new ResourceNotFoundException("No account found with this email address."));

        if (user.getResetOtp() == null || user.getResetOtpExpiry() == null) {
            throw new BadRequestException("No active OTP session found. Please request a new OTP.");
        }

        if (LocalDateTime.now().isAfter(user.getResetOtpExpiry())) {
            throw new BadRequestException("OTP has expired. Please request a new OTP.");
        }

        if (!user.getResetOtp().trim().equals(request.getOtp().trim())) {
            throw new BadRequestException("Invalid OTP. Password reset failed.");
        }

        if (request.getNewPassword() == null || request.getNewPassword().length() < 6) {
            throw new BadRequestException("New password must be at least 6 characters.");
        }

        // Update password and clear OTP
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        user.setResetOtp(null);
        user.setResetOtpExpiry(null);
        userRepository.save(user);

        return "Password reset successfully! You can now log in with your new password.";
    }

    // LEGACY FORGOT / RESET PASSWORD (Backward compatibility)
    public String forgotPassword(com.expensetracker.dto.auth.ForgotPasswordRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElse(null);

        if (user == null) {
            return "No account found with this email address.";
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        return "Password reset successfully! You can now login with your new password.";
    }

}