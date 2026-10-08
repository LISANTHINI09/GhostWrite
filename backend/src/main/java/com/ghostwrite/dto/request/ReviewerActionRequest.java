package com.ghostwrite.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ReviewerActionRequest {
    @NotBlank(message = "Action is required")
    private String action; // APPROVE, EDIT, REJECT, ESCALATE, MARK_DUPLICATE

    private String editedTitle;
    private String editedSummary;
    private String editedDescription;
    private String editedAction;
    private Long clusterId;
    private String remarks;
}
