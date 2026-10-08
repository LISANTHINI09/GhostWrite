package com.ghostwrite.dto.request;

import com.ghostwrite.entity.ReportStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ReportStatusUpdateRequest {
    @NotNull(message = "New status is required")
    private ReportStatus status;
    private String remarks;
}
