package com.ghostwrite.dto.request;

import com.ghostwrite.entity.ReportStatus;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class AuthorityResponseRequest {
    @NotBlank(message = "Response text is required")
    private String responseText;

    private ReportStatus statusUpdate;
    private String remarks;
    private String resolutionNotes;
}
