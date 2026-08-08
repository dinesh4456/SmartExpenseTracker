package com.expensetracker.dto;

import lombok.Data;

@Data
public class UserRequestDTO {

    private String fullName;
    private String email;
    private String password;
}