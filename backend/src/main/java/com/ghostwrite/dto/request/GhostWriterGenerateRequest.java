package com.ghostwrite.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class GhostWriterGenerateRequest {

    @NotBlank(message = "Raw complaint description is required")
    @Size(min = 10, message = "Please provide at least 10 characters describing the issue")
    private String rawDescription;

    private String category;
    private String reporterType;
    private String location;
    private String department;
    private String incidentDate;
    private String relatedAuthority;
    private String additionalNotes;
}
