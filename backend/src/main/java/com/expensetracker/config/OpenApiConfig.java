package com.expensetracker.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI expenseTrackerAPI() {

        final String securitySchemeName = "Bearer Authentication";

        return new OpenAPI()

                .info(new Info()

                        .title("💰 Smart Expense Tracker API")

                        .description("""
                                Professional Expense Tracker REST API

                                Features
                                ✔ JWT Authentication
                                ✔ Income Management
                                ✔ Expense Management
                                ✔ Budget Management
                                ✔ Dashboard Analytics
                                ✔ AI Insights
                                ✔ Monthly Reports
                                ✔ Validation
                                ✔ Exception Handling
                                """)

                        .version("1.0.0")

                        .contact(new Contact()
                                .name("Dinesh Sai")
                                .email("dinesh@gmail.com"))

                        .license(new License()
                                .name("MIT License")))

                .addSecurityItem(
                        new SecurityRequirement()
                                .addList(securitySchemeName))

                .components(
                        new Components()
                                .addSecuritySchemes(
                                        securitySchemeName,

                                        new SecurityScheme()

                                                .name(securitySchemeName)

                                                .type(SecurityScheme.Type.HTTP)

                                                .scheme("bearer")

                                                .bearerFormat("JWT")));
    }

}