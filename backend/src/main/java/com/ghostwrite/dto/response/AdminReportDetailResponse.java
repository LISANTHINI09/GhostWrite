package com.ghostwrite.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminReportDetailResponse {
    private Long id;
    private String reportId;
    private String reporterType;
    private String category;
    private String subcategory;
    private String severity;
    private String priority;
    private String status;
    private String department;
    private String assignedTo;
    private String incidentDate;
    private String location;
    private String relatedAuthority;
    private String additionalNotes;

    // Raw Anonymous Submission
    private String rawDescription;

    // AI Ghostwritten Document
    private String professionalTitle;
    private String executiveSummary;
    private String detailedDescription;
    private String relevantContext;
    private String impact;
    private String requestedAction;
    private String suggestedPriority;
    private String suggestedDepartment;
    private String professionalClosing;
    private String documentStatus;
    private boolean editedByReviewer;

    // AI Analysis
    private String reasoningRationale;
    private Double sentimentScore;
    private String emotionTone;
    private String riskLevel;
    private List<String> extractedKeywords;
    private List<String> riskFlags;
    private Double aiConfidenceScore;

    // Authority Response & Resolution
    private String authorityResponse;
    private String resolutionNotes;

    // Clustering
    private Long clusterId;
    private String clusterCode;
    private String clusterTitle;

    // Timeline & Messages
    private List<ReportHistoryDto> timeline;
    private List<MessageDto> messages;
    private List<AttachmentDto> attachments;

    private boolean confidentialContactExists;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class AttachmentDto {
        private Long id;
        private String originalFilename;
        private String fileType;
        private Long fileSize;
        private String downloadUrl;
    }
}
