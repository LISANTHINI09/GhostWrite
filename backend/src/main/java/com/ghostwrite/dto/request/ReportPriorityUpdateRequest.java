package com.ghostwrite.dto.request;

import com.ghostwrite.entity.ReportPriority;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ReportPriorityUpdateRequest {
    @NotNull(message = "New priority is required")
    private ReportPriority priority;
    private String remarks;
}
