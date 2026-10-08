package com.ghostwrite.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AnonymousReportSubmitResponse {
    private String reportId;
    private String trackingToken;
    private String category;
    private String severity;
    private String priority;
    private String status;
    private String message;
    private String submissionTimestamp;
}
