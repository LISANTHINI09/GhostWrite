package com.ghostwrite.dto.request;

import com.ghostwrite.entity.ReportSeverity;
import com.ghostwrite.entity.ReporterType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class AnonymousReportSubmitRequest {

    @NotNull(message = "Reporter type is required")
    private ReporterType reporterType;

    @NotBlank(message = "Category is required")
    private String category;

    private String subcategory;

    @NotNull(message = "Severity is required")
    private ReportSeverity severity;

    @NotBlank(message = "Issue description is required")
    @Size(min = 10, message = "Issue description must be at least 10 characters")
    private String rawDescription;

    private String incidentDate;
    private String location;
    private String relatedAuthority;
    private String additionalNotes;

    // AI Ghost Written Document fields accepted or edited by reporter
    private String acceptedProfessionalTitle;
    private String acceptedExecutiveSummary;
    private String acceptedDetailedDescription;
    private String acceptedRelevantContext;
    private String acceptedImpact;
    private String acceptedRequestedAction;
    private String acceptedSuggestedPriority;
    private String acceptedSuggestedDepartment;
    private String acceptedProfessionalClosing;

    // Optional voluntary contact (stored strictly in isolated table)
    private String voluntaryContactEmail;
    private String voluntaryContactPhone;
}
