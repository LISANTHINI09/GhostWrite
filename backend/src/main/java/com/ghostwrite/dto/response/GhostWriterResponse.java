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
public class GhostWriterResponse {
    private String professionalTitle;
    private String executiveSummary;
    private String detailedDescription;
    private String relevantContext;
    private String impact;
    private String requestedAction;
    private String suggestedPriority;
    private String suggestedDepartment;
    private String professionalClosing;
    private String priorityReasoning;
    private List<String> extractedKeywords;
    private String estimatedRiskLevel;
}
