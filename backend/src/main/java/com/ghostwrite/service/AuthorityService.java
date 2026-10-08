package com.ghostwrite.service;

import com.ghostwrite.dto.request.AuthorityResponseRequest;
import com.ghostwrite.dto.response.AdminReportDetailResponse;
import com.ghostwrite.dto.response.AdminReportSummaryResponse;
import com.ghostwrite.entity.AnonymousReport;
import com.ghostwrite.entity.ReportStatus;
import com.ghostwrite.entity.ReportStatusHistory;
import com.ghostwrite.exception.ResourceNotFoundException;
import com.ghostwrite.repository.AnonymousReportRepository;
import com.ghostwrite.repository.ReportStatusHistoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthorityService {

    private final AnonymousReportRepository reportRepository;
    private final ReportStatusHistoryRepository statusHistoryRepository;
    private final AdminService adminService;
    private final AuditLogService auditLogService;
    private final NotificationService notificationService;

    @Transactional(readOnly = true)
    public Page<AdminReportSummaryResponse> getDepartmentReports(String department, Pageable pageable) {
        return adminService.getFilteredReports(null, null, null, null, null, department, pageable);
    }

    @Transactional(readOnly = true)
    public AdminReportDetailResponse getReportDetail(String reportId) {
        return adminService.getReportDetail(reportId);
    }

    @Transactional
    public void submitResponse(String reportId, AuthorityResponseRequest request, String authorityEmail) {
        AnonymousReport report = reportRepository.findByReportId(reportId)
                .orElseThrow(() -> new ResourceNotFoundException("Report not found: " + reportId));

        report.setAuthorityResponse(request.getResponseText());
        if (request.getResolutionNotes() != null && !request.getResolutionNotes().isBlank()) {
            report.setResolutionNotes(request.getResolutionNotes());
        }

        ReportStatus oldStatus = report.getStatus();
        if (request.getStatusUpdate() != null) {
            report.setStatus(request.getStatusUpdate());
        } else {
            report.setStatus(ReportStatus.ACTION_TAKEN);
        }

        reportRepository.save(report);

        ReportStatusHistory history = ReportStatusHistory.builder()
                .report(report)
                .oldStatus(oldStatus)
                .newStatus(report.getStatus())
                .changedByRole("ROLE_AUTHORITY")
                .changedByEmail(authorityEmail)
                .remarks(request.getRemarks() != null ? request.getRemarks() : "Official departmental response issued")
                .build();
        statusHistoryRepository.save(history);

        auditLogService.logAction(
                "AUTHORITY_RESPONSE",
                reportId,
                "ROLE_AUTHORITY",
                authorityEmail,
                "Department issued official response and set status to " + report.getStatus()
        );

        notificationService.createNotification(
                "ROLE_ADMIN",
                report.getDepartment(),
                "Authority Response Filed: " + reportId,
                "The designated authority filed an official response for " + reportId,
                reportId,
                "AUTHORITY_RESPONSE"
        );
    }
}
