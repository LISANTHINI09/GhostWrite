package com.ghostwrite.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ReportAssignRequest {
    @NotBlank(message = "Department is required")
    private String department;
    private String assignedTo;
    private String remarks;
}
