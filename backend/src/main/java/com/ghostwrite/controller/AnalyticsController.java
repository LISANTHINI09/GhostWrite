package com.ghostwrite.controller;

import com.ghostwrite.dto.response.AIInsightResponse;
import com.ghostwrite.dto.response.AdminDashboardKpis;
import com.ghostwrite.dto.response.ApiResponse;
import com.ghostwrite.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @GetMapping("/overview")
    public ResponseEntity<ApiResponse<AdminDashboardKpis>> getOverview() {
        return ResponseEntity.ok(ApiResponse.success(analyticsService.getOverviewAnalytics()));
    }

    @GetMapping("/insights")
    public ResponseEntity<ApiResponse<List<AIInsightResponse>>> getAIInsights() {
        return ResponseEntity.ok(ApiResponse.success(analyticsService.getAIInstitutionalInsights()));
    }
}
