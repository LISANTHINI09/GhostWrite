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
public class TrackingReportResponse {
    private String reportId;
    private String reporterType;
    private String category;
    private String subcategory;
    private String severity;
    private String priority;
    private String status;
    private String department;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // AI Ghostwritten document details
    private String professionalTitle;
    private String executiveSummary;
    private String detailedDescription;
    private String impact;
    private String requestedAction;
    private String professionalClosing;

    // Authority Feedback
    private String authorityResponse;
    private String resolutionNotes;

    // Timeline & Conversation
    private List<ReportHistoryDto> timeline;
    private List<MessageDto> messages;
    private int attachmentCount;
    private String clusterCode;
}
