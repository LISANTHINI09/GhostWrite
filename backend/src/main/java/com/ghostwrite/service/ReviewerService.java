package com.ghostwrite.service;

import com.ghostwrite.dto.request.ReviewerActionRequest;
import com.ghostwrite.dto.response.AdminReportSummaryResponse;
import com.ghostwrite.entity.AnonymousReport;
import com.ghostwrite.entity.GhostWrittenDocument;
import com.ghostwrite.entity.ReportStatus;
import com.ghostwrite.entity.ReportStatusHistory;
import com.ghostwrite.exception.ResourceNotFoundException;
import com.ghostwrite.repository.AnonymousReportRepository;
import com.ghostwrite.repository.GhostWrittenDocumentRepository;
import com.ghostwrite.repository.ReportStatusHistoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ReviewerService {

    private final AnonymousReportRepository reportRepository;
    private final GhostWrittenDocumentRepository documentRepository;
    private final ReportStatusHistoryRepository statusHistoryRepository;
    private final AdminService adminService;
    private final AuditLogService auditLogService;
    private final NotificationService notificationService;

    @Transactional(readOnly = true)
    public Page<AdminReportSummaryResponse> getPendingReviewQueue(Pageable pageable) {
        return adminService.getFilteredReports(null, null, null, null, null, null, pageable);
    }

    @Transactional
    public void processReviewAction(String reportId, ReviewerActionRequest request, String reviewerEmail) {
        AnonymousReport report = reportRepository.findByReportId(reportId)
                .orElseThrow(() -> new ResourceNotFoundException("Report not found: " + reportId));

        GhostWrittenDocument doc = documentRepository.findByReportId(report.getId())
                .orElseThrow(() -> new ResourceNotFoundException("GhostWritten document not found for report: " + reportId));

        ReportStatus oldStatus = report.getStatus();
        String action = request.getAction().toUpperCase();

        switch (action) {
            case "APPROVE" -> {
                doc.setDocumentStatus("APPROVED");
                report.setStatus(ReportStatus.UNDER_REVIEW);
            }
            case "EDIT" -> {
                if (request.getEditedTitle() != null && !request.getEditedTitle().isBlank()) {
                    doc.setProfessionalTitle(request.getEditedTitle());
                }
                if (request.getEditedSummary() != null && !request.getEditedSummary().isBlank()) {
                    doc.setExecutiveSummary(request.getEditedSummary());
                }
                if (request.getEditedDescription() != null && !request.getEditedDescription().isBlank()) {
                    doc.setDetailedDescription(request.getEditedDescription());
                }
                if (request.getEditedAction() != null && !request.getEditedAction().isBlank()) {
                    doc.setRequestedAction(request.getEditedAction());
                }
                doc.setEditedByReviewer(true);
                doc.setDocumentStatus("REVIEWER_EDITED");
                report.setStatus(ReportStatus.UNDER_REVIEW);
            }
            case "REJECT" -> {
                report.setStatus(ReportStatus.REJECTED);
                report.setResolutionNotes("Report rejected during moderator review: " + request.getRemarks());
            }
            case "MARK_DUPLICATE" -> {
                report.setStatus(ReportStatus.DUPLICATE);
                if (request.getClusterId() != null) {
                    report.setClusterId(request.getClusterId());
                }
            }
            case "ESCALATE" -> {
                report.setStatus(ReportStatus.ESCALATED);
            }
        }

        documentRepository.save(doc);
        reportRepository.save(report);

        ReportStatusHistory history = ReportStatusHistory.builder()
                .report(report)
                .oldStatus(oldStatus)
                .newStatus(report.getStatus())
                .changedByRole("ROLE_REVIEWER")
                .changedByEmail(reviewerEmail)
                .remarks("Reviewer performed " + action + ": " + (request.getRemarks() != null ? request.getRemarks() : "Moderation verified"))
                .build();
        statusHistoryRepository.save(history);

        auditLogService.logAction(
                "REVIEWER_ACTION_" + action,
                reportId,
                "ROLE_REVIEWER",
                reviewerEmail,
                "Action: " + action + " on report " + reportId + ". Remarks: " + request.getRemarks()
        );

        notificationService.createNotification(
                "ROLE_ADMIN",
                report.getDepartment(),
                "Reviewer Moderation: " + reportId,
                "Reviewer executed " + action + " on report " + reportId,
                reportId,
                "REVIEW_COMPLETED"
        );
    }
}
