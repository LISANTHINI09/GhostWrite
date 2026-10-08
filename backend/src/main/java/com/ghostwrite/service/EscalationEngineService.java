package com.ghostwrite.service;

import com.ghostwrite.entity.AnonymousReport;
import com.ghostwrite.entity.ReportPriority;
import com.ghostwrite.entity.ReportStatus;
import com.ghostwrite.entity.ReportStatusHistory;
import com.ghostwrite.repository.AnonymousReportRepository;
import com.ghostwrite.repository.ReportStatusHistoryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class EscalationEngineService {

    private final AnonymousReportRepository reportRepository;
    private final ReportStatusHistoryRepository statusHistoryRepository;
    private final AuditLogService auditLogService;
    private final NotificationService notificationService;

    @Value("${app.escalation.enabled:true}")
    private boolean escalationEnabled;

    @Scheduled(cron = "${app.escalation.cron:0 */15 * * * *}")
    @Transactional
    public void runAutomaticEscalationCheck() {
        if (!escalationEnabled) return;

        LocalDateTime now = LocalDateTime.now();
        List<ReportStatus> activeStatuses = List.of(
                ReportStatus.SUBMITTED,
                ReportStatus.AI_PROCESSED,
                ReportStatus.PENDING_REVIEW,
                ReportStatus.UNDER_REVIEW,
                ReportStatus.ASSIGNED
        );

        // Check Critical / P1 older than 12 hours
        LocalDateTime criticalCutoff = now.minusHours(12);
        List<AnonymousReport> staleReports = reportRepository.findStaleReportsForEscalation(activeStatuses, criticalCutoff);

        int escalatedCount = 0;
        for (AnonymousReport r : staleReports) {
            boolean shouldEscalate = false;
            String reason = "";

            if (r.getPriority() == ReportPriority.P1) {
                shouldEscalate = true;
                reason = "SLA Violation: Critical (P1) report unresolved after 12 hours.";
            } else if (r.getPriority() == ReportPriority.P2 && r.getCreatedAt().isBefore(now.minusHours(24))) {
                shouldEscalate = true;
                reason = "SLA Violation: High priority (P2) report pending review beyond 24 hours.";
            } else if (r.getPriority() == ReportPriority.P3 && r.getCreatedAt().isBefore(now.minusHours(72))) {
                shouldEscalate = true;
                reason = "SLA Violation: Medium priority report unhandled after 72 hours.";
            }

            if (shouldEscalate) {
                ReportStatus old = r.getStatus();
                r.setStatus(ReportStatus.ESCALATED);
                r.setEscalatedAt(now);
                reportRepository.save(r);

                ReportStatusHistory history = ReportStatusHistory.builder()
                        .report(r)
                        .oldStatus(old)
                        .newStatus(ReportStatus.ESCALATED)
                        .changedByRole("SYSTEM_ESCALATION_ENGINE")
                        .remarks(reason)
                        .build();
                statusHistoryRepository.save(history);

                auditLogService.logAction(
                        "AUTO_ESCALATION",
                        r.getReportId(),
                        "SYSTEM",
                        "EscalationEngine",
                        reason
                );

                notificationService.createNotification(
                        "ROLE_ADMIN",
                        r.getDepartment(),
                        "AUTO-ESCALATION: " + r.getReportId(),
                        reason,
                        r.getReportId(),
                        "ESCALATION"
                );

                escalatedCount++;
            }
        }

        if (escalatedCount > 0) {
            log.info("Escalation Engine evaluated active reports: {} auto-escalated.", escalatedCount);
        }
    }
}
