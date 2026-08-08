package com.expensetracker.dto.profile;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProfileUpdateRequest {

    private String fullName;

    private String email;

    private String phoneNumber;

    private String password;

    private String profileImage;

}