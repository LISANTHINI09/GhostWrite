package com.ghostwrite.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AIInsightResponse {
    private String id;
    private String title;
    private String description;
    private String category;
    private String impactLevel; // HIGH, MEDIUM, LOW
    private String recommendation;
    private String metricStat;
    private String confidenceScore;
}
