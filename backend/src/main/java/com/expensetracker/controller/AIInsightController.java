package com.expensetracker.controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.expensetracker.dto.ai.AIInsightResponse;
import com.expensetracker.service.AIInsightService;

@RestController
@RequestMapping("/api/insights")
public class AIInsightController {

    private final AIInsightService aiInsightService;

    public AIInsightController(AIInsightService aiInsightService) {
        this.aiInsightService = aiInsightService;
    }

    @GetMapping
    public AIInsightResponse getInsights() {
        return aiInsightService.getInsights();
    }

}