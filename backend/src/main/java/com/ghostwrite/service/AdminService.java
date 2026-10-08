package com.ghostwrite.service;

import com.ghostwrite.dto.request.ReportAssignRequest;
import com.ghostwrite.dto.request.ReportPriorityUpdateRequest;
import com.ghostwrite.dto.request.ReportStatusUpdateRequest;
import com.ghostwrite.dto.response.*;
import com.ghostwrite.entity.*;
import com.ghostwrite.exception.ResourceNotFoundException;
import com.ghostwrite.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final AnonymousReportRepository reportRepository;
    private final GhostWrittenDocumentRepository documentRepository;
    private final AIAnalysisRepository aiAnalysisRepository;
    private final ReportStatusHistoryRepository statusHistoryRepository;
    private final AnonymousConversationRepository conversationRepository;
    private final AnonymousMessageRepository messageRepository;
    private final IssueClusterRepository clusterRepository;
    private final AuditLogService auditLogService;
    private final NotificationService notificationService;

    @Transactional(readOnly = true)
    public AdminDashboardKpis getDashboardKpis() {
        long total = reportRepository.count();
        long newReports = reportRepository.countByStatus(ReportStatus.SUBMITTED) + reportRepository.countByStatus(ReportStatus.AI_PROCESSED);
        long underReview = reportRepository.countByStatus(ReportStatus.UNDER_REVIEW) + reportRepository.countByStatus(ReportStatus.PENDING_REVIEW);
        long inProgress = reportRepository.countByStatus(ReportStatus.IN_PROGRESS) + reportRepository.countByStatus(ReportStatus.ASSIGNED);
        long highPriority = reportRepository.countByPriority(ReportPriority.P2);
        long criticalReports = reportRepository.countByPriority(ReportPriority.P1);
        long resolved = reportRepository.countByStatus(ReportStatus.RESOLVED) + reportRepository.countByStatus(ReportStatus.CLOSED);
        long escalated = reportRepository.countByStatus(ReportStatus.ESCALATED);

        // Compute average resolution hours
        List<AnonymousReport> resolvedList = reportRepository.findByStatus(ReportStatus.RESOLVED);
        double avgHours = 28.5; // default benchmark
        if (!resolvedList.isEmpty()) {
            double totalHours = 0;
            for (AnonymousReport r : resolvedList) {
                totalHours += Duration.between(r.getCreatedAt(), r.getUpdatedAt() != null ? r.getUpdatedAt() : r.getCreatedAt()).toHours();
            }
            avgHours = Math.round((totalHours / resolvedList.size()) * 10.0) / 10.0;
        }

        // Aggregate charts
        Map<String, Long> categoryMap = new LinkedHashMap<>();
        for (Object[] row : reportRepository.countReportsByCategory()) {
            categoryMap.put(String.valueOf(row[0]), (Long) row[1]);
        }

        Map<String, Long> severityMap = new LinkedHashMap<>();
        for (Object[] row : reportRepository.countReportsBySeverity()) {
            severityMap.put(String.valueOf(row[0]), (Long) row[1]);
        }

        Map<String, Long> statusMap = new LinkedHashMap<>();
        for (Object[] row : reportRepository.countReportsByStatus()) {
            statusMap.put(String.valueOf(row[0]), (Long) row[1]);
        }

        Map<String, Long> departmentMap = new LinkedHashMap<>();
        for (Object[] row : reportRepository.countReportsByDepartment()) {
            departmentMap.put(String.valueOf(row[0]), (Long) row[1]);
        }

        Map<String, Long> priorityMap = new LinkedHashMap<>();
        for (Object[] row : reportRepository.countReportsByPriority()) {
            priorityMap.put(String.valueOf(row[0]), (Long) row[1]);
        }

        return AdminDashboardKpis.builder()
                .totalReports(total)
                .newReports(newReports)
                .underReview(underReview)
                .inProgress(inProgress)
                .highPriority(highPriority)
                .criticalReports(criticalReports)
                .resolvedReports(resolved)
                .escalatedReports(escalated)
                .averageResolutionHours(avgHours)
                .anonymousPercentage(100.0)
                .reportsByCategory(categoryMap)
                .reportsBySeverity(severityMap)
                .reportsByStatus(statusMap)
                .reportsByDepartment(departmentMap)
                .reportsByPriority(priorityMap)
                .build();
    }

    @Transactional(readOnly = true)
    public Page<AdminReportSummaryResponse> getFilteredReports(
            String search, ReportStatus status, String category,
            ReportSeverity severity, ReportPriority priority, String department,
            Pageable pageable) {

        String query = (search != null && !search.isBlank()) ? search.trim() : null;

        return reportRepository.findFilteredReports(query, status, category, severity, priority, department, pageable)
                .map(r -> {
                    GhostWrittenDocument doc = documentRepository.findByReportId(r.getId()).orElse(null);
                    String title = doc != null ? doc.getProfessionalTitle() : "Issue Report " + r.getReportId();
                    String preview = r.getRawDescription().length() > 90 ? r.getRawDescription().substring(0, 90) + "..." : r.getRawDescription();

                    String clusterCode = null;
                    if (r.getClusterId() != null) {
                        clusterRepository.findById(r.getClusterId()).ifPresent(c -> {});
                        var cOpt = clusterRepository.findById(r.getClusterId());
                        if (cOpt.isPresent()) clusterCode = cOpt.get().getClusterCode();
                    }

                    return AdminReportSummaryResponse.builder()
                            .id(r.getId())
                            .reportId(r.getReportId())
                            .reporterType(r.getReporterType().name())
                            .category(r.getCategory())
                            .subcategory(r.getSubcategory())
                            .severity(r.getSeverity().name())
                            .priority(r.getPriority().name())
                            .status(r.getStatus().name())
                            .department(r.getDepartment())
                            .assignedTo(r.getAssignedTo())
                            .professionalTitle(title)
                            .previewDescription(preview)
                            .clusterCode(clusterCode)
                            .messageCount(r.getConversation() != null ? r.getConversation().getMessages().size() : 0)
                            .isEscalated(r.getStatus() == ReportStatus.ESCALATED)
                            .createdAt(r.getCreatedAt())
                            .updatedAt(r.getUpdatedAt())
                            .build();
                });
    }

    @Transactional(readOnly = true)
    public AdminReportDetailResponse getReportDetail(String reportId) {
        AnonymousReport report = reportRepository.findByReportId(reportId)
                .orElseThrow(() -> new ResourceNotFoundException("Report not found with ID: " + reportId));

        GhostWrittenDocument doc = documentRepository.findByReportId(report.getId()).orElse(null);
        AIAnalysis analysis = aiAnalysisRepository.findByReportId(report.getId()).orElse(null);

        List<ReportStatusHistory> histories = statusHistoryRepository.findByReportIdOrderByCreatedAtAsc(report.getId());
        List<ReportHistoryDto> timeline = histories.stream().map(h -> ReportHistoryDto.builder()
                .oldStatus(h.getOldStatus() != null ? h.getOldStatus().name() : null)
                .newStatus(h.getNewStatus().name())
                .changedByRole(h.getChangedByRole())
                .remarks(h.getRemarks())
                .timestamp(h.getCreatedAt())
                .build()).collect(Collectors.toList());

        List<MessageDto> messages = Collections.emptyList();
        var convOpt = conversationRepository.findByReportId(report.getId());
        if (convOpt.isPresent()) {
            messages = messageRepository.findByConversationIdOrderByCreatedAtAsc(convOpt.get().getId()).stream()
                    .map(m -> MessageDto.builder()
                            .id(m.getId())
                            .senderType(m.getSenderType())
                            .senderLabel(m.getSenderType() == SenderType.REPORTER ? "Anonymous Reporter" : "Administration")
                            .messageText(m.getMessageText())
                            .createdAt(m.getCreatedAt())
                            .build())
                    .collect(Collectors.toList());
        }

        String clusterCode = null;
        String clusterTitle = null;
        if (report.getClusterId() != null) {
            var cOpt = clusterRepository.findById(report.getClusterId());
            if (cOpt.isPresent()) {
                clusterCode = cOpt.get().getClusterCode();
                clusterTitle = cOpt.get().getTitle();
            }
        }

        List<String> keywords = (analysis != null && analysis.getExtractedKeywords() != null)
                ? Arrays.asList(analysis.getExtractedKeywords().split(",")) : Collections.emptyList();
        List<String> flags = (analysis != null && analysis.getRiskFlags() != null)
                ? Arrays.asList(analysis.getRiskFlags().split(",")) : Collections.emptyList();

        return AdminReportDetailResponse.builder()
                .id(report.getId())
                .reportId(report.getReportId())
                .reporterType(report.getReporterType().name())
                .category(report.getCategory())
                .subcategory(report.getSubcategory())
                .severity(report.getSeverity().name())
                .priority(report.getPriority().name())
                .status(report.getStatus().name())
                .department(report.getDepartment())
                .assignedTo(report.getAssignedTo())
                .incidentDate(report.getIncidentDate())
                .location(report.getLocation())
                .relatedAuthority(report.getRelatedAuthority())
                .additionalNotes(report.getAdditionalNotes())
                .rawDescription(report.getRawDescription())
                .professionalTitle(doc != null ? doc.getProfessionalTitle() : null)
                .executiveSummary(doc != null ? doc.getExecutiveSummary() : null)
                .detailedDescription(doc != null ? doc.getDetailedDescription() : null)
                .relevantContext(doc != null ? doc.getRelevantContext() : null)
                .impact(doc != null ? doc.getImpact() : null)
                .requestedAction(doc != null ? doc.getRequestedAction() : null)
                .suggestedPriority(doc != null ? doc.getSuggestedPriority() : null)
                .suggestedDepartment(doc != null ? doc.getSuggestedDepartment() : null)
                .professionalClosing(doc != null ? doc.getProfessionalClosing() : null)
                .documentStatus(doc != null ? doc.getDocumentStatus() : "PENDING")
                .editedByReviewer(doc != null && doc.isEditedByReviewer())
                .reasoningRationale(analysis != null ? analysis.getReasoningRationale() : null)
                .sentimentScore(analysis != null ? analysis.getSentimentScore() : null)
                .emotionTone(analysis != null ? analysis.getEmotionTone() : null)
                .riskLevel(analysis != null ? analysis.getRiskLevel() : null)
                .extractedKeywords(keywords)
                .riskFlags(flags)
                .aiConfidenceScore(analysis != null ? analysis.getAiConfidenceScore() : 0.90)
                .authorityResponse(report.getAuthorityResponse())
                .resolutionNotes(report.getResolutionNotes())
                .clusterId(report.getClusterId())
                .clusterCode(clusterCode)
                .clusterTitle(clusterTitle)
                .timeline(timeline)
                .messages(messages)
                .attachments(Collections.emptyList())
                .confidentialContactExists(report.isConfidentialContactProvided())
                .createdAt(report.getCreatedAt())
                .updatedAt(report.getUpdatedAt())
                .build();
    }

    @Transactional
    public void updateStatus(String reportId, ReportStatusUpdateRequest request, String adminEmail) {
        AnonymousReport report = reportRepository.findByReportId(reportId)
                .orElseThrow(() -> new ResourceNotFoundException("Report not found: " + reportId));

        ReportStatus oldStatus = report.getStatus();
        report.setStatus(request.getStatus());
        reportRepository.save(report);

        ReportStatusHistory history = ReportStatusHistory.builder()
                .report(report)
                .oldStatus(oldStatus)
                .newStatus(request.getStatus())
                .changedByRole("ROLE_ADMIN")
                .changedByEmail(adminEmail)
                .remarks(request.getRemarks() != null ? request.getRemarks() : "Status updated by Administrator")
                .build();
        statusHistoryRepository.save(history);

        auditLogService.logAction(
                "STATUS_UPDATED",
                reportId,
                "ROLE_ADMIN",
                adminEmail,
                "Changed status from " + oldStatus + " to " + request.getStatus()
        );

        notificationService.createNotification(
                "ROLE_AUTHORITY",
                report.getDepartment(),
                "Status Changed: " + reportId,
                "Report " + reportId + " status updated to " + request.getStatus(),
                reportId,
                "STATUS_CHANGE"
        );
    }

    @Transactional
    public void updatePriority(String reportId, ReportPriorityUpdateRequest request, String adminEmail) {
        AnonymousReport report = reportRepository.findByReportId(reportId)
                .orElseThrow(() -> new ResourceNotFoundException("Report not found: " + reportId));

        ReportPriority old = report.getPriority();
        report.setPriority(request.getPriority());
        reportRepository.save(report);

        auditLogService.logAction(
                "PRIORITY_UPDATED",
                reportId,
                "ROLE_ADMIN",
                adminEmail,
                "Changed priority from " + old + " to " + request.getPriority() + " (" + request.getRemarks() + ")"
        );
    }

    @Transactional
    public void assignReport(String reportId, ReportAssignRequest request, String adminEmail) {
        AnonymousReport report = reportRepository.findByReportId(reportId)
                .orElseThrow(() -> new ResourceNotFoundException("Report not found: " + reportId));

        report.setDepartment(request.getDepartment());
        if (request.getAssignedTo() != null && !request.getAssignedTo().isBlank()) {
            report.setAssignedTo(request.getAssignedTo());
        }
        report.setStatus(ReportStatus.ASSIGNED);
        reportRepository.save(report);

        ReportStatusHistory history = ReportStatusHistory.builder()
                .report(report)
                .oldStatus(report.getStatus())
                .newStatus(ReportStatus.ASSIGNED)
                .changedByRole("ROLE_ADMIN")
                .changedByEmail(adminEmail)
                .remarks("Assigned to department: " + request.getDepartment() + (request.getRemarks() != null ? " - " + request.getRemarks() : ""))
                .build();
        statusHistoryRepository.save(history);

        auditLogService.logAction(
                "REPORT_ASSIGNED",
                reportId,
                "ROLE_ADMIN",
                adminEmail,
                "Assigned to " + request.getDepartment() + " (" + request.getAssignedTo() + ")"
        );

        notificationService.createNotification(
                "ROLE_AUTHORITY",
                request.getDepartment(),
                "New Assignment: " + reportId,
                "Report " + reportId + " has been assigned to your department for investigation.",
                reportId,
                "ASSIGNED"
        );
    }

    @Transactional
    public void escalateReport(String reportId, String remarks, String adminEmail) {
        AnonymousReport report = reportRepository.findByReportId(reportId)
                .orElseThrow(() -> new ResourceNotFoundException("Report not found: " + reportId));

        report.setStatus(ReportStatus.ESCALATED);
        report.setEscalatedAt(LocalDateTime.now());
        reportRepository.save(report);

        ReportStatusHistory history = ReportStatusHistory.builder()
                .report(report)
                .oldStatus(report.getStatus())
                .newStatus(ReportStatus.ESCALATED)
                .changedByRole("ROLE_ADMIN")
                .changedByEmail(adminEmail)
                .remarks("Manually escalated: " + (remarks != null ? remarks : "Expedited executive intervention required"))
                .build();
        statusHistoryRepository.save(history);

        auditLogService.logAction(
                "REPORT_ESCALATED",
                reportId,
                "ROLE_ADMIN",
                adminEmail,
                "Escalated grievance to higher executive authority: " + remarks
        );

        notificationService.createNotification(
                "ROLE_ADMIN",
                null,
                "ESCALATION ALERT: " + reportId,
                "Report " + reportId + " was escalated to executive review: " + remarks,
                reportId,
                "ESCALATION"
        );
    }
}
