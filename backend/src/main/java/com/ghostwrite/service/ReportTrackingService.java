package com.ghostwrite.service;

import com.ghostwrite.dto.response.MessageDto;
import com.ghostwrite.dto.response.ReportHistoryDto;
import com.ghostwrite.dto.response.TrackingReportResponse;
import com.ghostwrite.entity.*;
import com.ghostwrite.exception.InvalidTrackingTokenException;
import com.ghostwrite.exception.ResourceNotFoundException;
import com.ghostwrite.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReportTrackingService {

    private final AnonymousReportRepository reportRepository;
    private final GhostWrittenDocumentRepository documentRepository;
    private final ReportStatusHistoryRepository statusHistoryRepository;
    private final AnonymousConversationRepository conversationRepository;
    private final AnonymousMessageRepository messageRepository;
    private final IssueClusterRepository clusterRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional(readOnly = true)
    public TrackingReportResponse trackReport(String reportId, String trackingToken) {
        AnonymousReport report = reportRepository.findByReportId(reportId)
                .orElseThrow(() -> new ResourceNotFoundException("Report not found with ID: " + reportId));

        // Verify tracking token
        if (trackingToken == null || !passwordEncoder.matches(trackingToken.trim(), report.getTrackingTokenHash())) {
            throw new InvalidTrackingTokenException("Invalid tracking token for report ID: " + reportId);
        }

        GhostWrittenDocument doc = documentRepository.findByReportId(report.getId()).orElse(null);

        // Fetch activity timeline
        List<ReportStatusHistory> histories = statusHistoryRepository.findByReportIdOrderByCreatedAtAsc(report.getId());
        List<ReportHistoryDto> timeline = histories.stream().map(h -> ReportHistoryDto.builder()
                .oldStatus(h.getOldStatus() != null ? h.getOldStatus().name() : null)
                .newStatus(h.getNewStatus().name())
                .changedByRole(h.getChangedByRole())
                .remarks(h.getRemarks())
                .timestamp(h.getCreatedAt())
                .build()).collect(Collectors.toList());

        // Fetch anonymous chat messages
        List<MessageDto> messages = Collections.emptyList();
        var convOpt = conversationRepository.findByReportId(report.getId());
        if (convOpt.isPresent()) {
            messages = messageRepository.findByConversationIdOrderByCreatedAtAsc(convOpt.get().getId()).stream()
                    .map(m -> MessageDto.builder()
                            .id(m.getId())
                            .senderType(m.getSenderType())
                            .senderLabel(m.getSenderType() == SenderType.REPORTER ? "Anonymous Reporter" : "Designated Institutional Authority")
                            .messageText(m.getMessageText())
                            .createdAt(m.getCreatedAt())
                            .build())
                    .collect(Collectors.toList());
        }

        String clusterCode = null;
        if (report.getClusterId() != null) {
            clusterRepository.findById(report.getClusterId()).ifPresent(c -> {});
            var clusterOpt = clusterRepository.findById(report.getClusterId());
            if (clusterOpt.isPresent()) {
                clusterCode = clusterOpt.get().getClusterCode();
            }
        }

        return TrackingReportResponse.builder()
                .reportId(report.getReportId())
                .reporterType(report.getReporterType().name())
                .category(report.getCategory())
                .subcategory(report.getSubcategory())
                .severity(report.getSeverity().name())
                .priority(report.getPriority().name())
                .status(report.getStatus().name())
                .department(report.getDepartment())
                .createdAt(report.getCreatedAt())
                .updatedAt(report.getUpdatedAt())
                .professionalTitle(doc != null ? doc.getProfessionalTitle() : "Confidential Issue Report")
                .executiveSummary(doc != null ? doc.getExecutiveSummary() : "")
                .detailedDescription(doc != null ? doc.getDetailedDescription() : report.getRawDescription())
                .impact(doc != null ? doc.getImpact() : "")
                .requestedAction(doc != null ? doc.getRequestedAction() : "")
                .professionalClosing(doc != null ? doc.getProfessionalClosing() : "")
                .authorityResponse(report.getAuthorityResponse())
                .resolutionNotes(report.getResolutionNotes())
                .timeline(timeline)
                .messages(messages)
                .attachmentCount(report.getAttachments().size())
                .clusterCode(clusterCode)
                .build();
    }
}
