package com.expensetracker.service.auth;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.expensetracker.dto.auth.LoginRequest;
import com.expensetracker.dto.auth.LoginResponse;
import com.expensetracker.dto.auth.RegisterRequest;
import com.expensetracker.entity.User;
import com.expensetracker.repository.UserRepository;
import com.expensetracker.security.JwtService;

@Service
public class AuthenticationService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthenticationService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
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

    // FORGOT / RESET PASSWORD
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