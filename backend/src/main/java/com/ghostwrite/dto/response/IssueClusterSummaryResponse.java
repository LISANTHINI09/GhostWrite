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
public class IssueClusterSummaryResponse {
    private Long id;
    private String clusterCode;
    private String title;
    private String description;
    private String category;
    private String department;
    private String affectedArea;
    private Integer reportCount;
    private String severity;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
