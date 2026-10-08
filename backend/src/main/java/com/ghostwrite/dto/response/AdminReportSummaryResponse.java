package com.ghostwrite.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminReportSummaryResponse {
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
    private String professionalTitle;
    private String previewDescription;
    private String clusterCode;
    private int messageCount;
    private boolean isEscalated;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
