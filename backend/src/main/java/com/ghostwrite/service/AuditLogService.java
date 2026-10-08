package com.ghostwrite.service;

import com.ghostwrite.dto.response.AuditLogResponse;
import com.ghostwrite.entity.AuditLog;
import com.ghostwrite.repository.AuditLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AuditLogService {

    private final AuditLogRepository auditLogRepository;

    public void logAction(String action, String targetReportId, String role, String user, String details) {
        AuditLog log = AuditLog.builder()
                .action(action)
                .targetReportId(targetReportId)
                .performedByRole(role != null ? role : "ANONYMOUS")
                .performedByUser(user != null ? user : "Anonymous")
                .details(details)
                .build();
        auditLogRepository.save(log);
    }

    public List<AuditLogResponse> getRecentLogs() {
        return auditLogRepository.findTop50ByOrderByCreatedAtDesc().stream()
                .map(l -> AuditLogResponse.builder()
                        .id(l.getId())
                        .action(l.getAction())
                        .targetReportId(l.getTargetReportId())
                        .performedByRole(l.getPerformedByRole())
                        .performedByUser(l.getPerformedByUser())
                        .details(l.getDetails())
                        .createdAt(l.getCreatedAt())
                        .build())
                .collect(Collectors.toList());
    }

    public List<AuditLogResponse> getLogsForReport(String reportId) {
        return auditLogRepository.findByTargetReportIdOrderByCreatedAtDesc(reportId).stream()
                .map(l -> AuditLogResponse.builder()
                        .id(l.getId())
                        .action(l.getAction())
                        .targetReportId(l.getTargetReportId())
                        .performedByRole(l.getPerformedByRole())
                        .performedByUser(l.getPerformedByUser())
                        .details(l.getDetails())
                        .createdAt(l.getCreatedAt())
                        .build())
                .collect(Collectors.toList());
    }
}
