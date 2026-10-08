package com.ghostwrite.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminDashboardKpis {
    private long totalReports;
    private long newReports;
    private long underReview;
    private long inProgress;
    private long highPriority;
    private long criticalReports;
    private long resolvedReports;
    private long escalatedReports;
    private double averageResolutionHours;
    private double anonymousPercentage; // 100%

    // Chart datasets
    private Map<String, Long> reportsByCategory;
    private Map<String, Long> reportsBySeverity;
    private Map<String, Long> reportsByStatus;
    private Map<String, Long> reportsByDepartment;
    private Map<String, Long> reportsByPriority;
}
