package com.expensetracker.dto.profile;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProfileResponse {

    private String fullName;

    private String email;

    private String phoneNumber;

    private String role;

    private String profileImage;

    private String token;

    public ProfileResponse(String fullName, String email, String role, String profileImage) {
        this.fullName = fullName;
        this.email = email;
        this.role = role;
        this.profileImage = profileImage;
    }

    public ProfileResponse(String fullName, String email, String phoneNumber, String role, String profileImage) {
        this.fullName = fullName;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.role = role;
        this.profileImage = profileImage;
    }

}