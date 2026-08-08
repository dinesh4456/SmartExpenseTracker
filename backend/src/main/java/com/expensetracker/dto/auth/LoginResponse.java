package com.expensetracker.dto.auth;

public class LoginResponse {

    private String token;

    private String message;

    private String fullName;

    public LoginResponse() {
    }

    public LoginResponse(
            String token,
            String message,
            String fullName
    ) {

        this.token = token;
        this.message = message;
        this.fullName = fullName;

    }

    public String getToken() {

        return token;

    }

    public void setToken(String token) {

        this.token = token;

    }

    public String getMessage() {

        return message;

    }

    public void setMessage(String message) {

        this.message = message;

    }

    public String getFullName() {

        return fullName;

    }

    public void setFullName(String fullName) {

        this.fullName = fullName;

    }

}