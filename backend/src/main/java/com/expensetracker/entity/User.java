package com.expensetracker.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "users")
public class User extends BaseEntity {

    @Column(name = "full_name", nullable = false, length = 100)
    private String fullName;

    @Column(nullable = false, unique = true, length = 100)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false, length = 20)
    private String role = "USER";

    @Column(length = 20)
    private String phoneNumber;

    @Column(length = 255)
    private String profileImage;

    @Column(name = "reset_otp", length = 10)
    private String resetOtp;

    @Column(name = "reset_otp_expiry")
    private java.time.LocalDateTime resetOtpExpiry;
}