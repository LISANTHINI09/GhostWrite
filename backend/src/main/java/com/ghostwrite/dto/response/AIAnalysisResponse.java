package com.ghostwrite.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AIAnalysisResponse {
    private String predictedCategory;
    private String predictedSubcategory;
    private String predictedSeverity;
    private String predictedPriority;
    private String recommendedDepartment;
    private String reasoningRationale;
    private Double sentimentScore;
    private String emotionTone;
    private String riskLevel;
    private Double duplicateConfidence;
    private List<String> extractedKeywords;
    private List<String> riskFlags;
    private Double aiConfidenceScore;
}
