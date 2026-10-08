package com.ghostwrite.service;

import com.ghostwrite.dto.request.AnonymousMessageRequest;
import com.ghostwrite.dto.response.MessageDto;
import com.ghostwrite.entity.*;
import com.ghostwrite.exception.InvalidTrackingTokenException;
import com.ghostwrite.exception.ResourceNotFoundException;
import com.ghostwrite.repository.AnonymousConversationRepository;
import com.ghostwrite.repository.AnonymousMessageRepository;
import com.ghostwrite.repository.AnonymousReportRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AnonymousMessageService {

    private final AnonymousReportRepository reportRepository;
    private final AnonymousConversationRepository conversationRepository;
    private final AnonymousMessageRepository messageRepository;
    private final PasswordEncoder passwordEncoder;
    private final NotificationService notificationService;
    private final AuditLogService auditLogService;

    @Transactional
    public MessageDto sendMessageAsReporter(String reportId, AnonymousMessageRequest request) {
        AnonymousReport report = reportRepository.findByReportId(reportId)
                .orElseThrow(() -> new ResourceNotFoundException("Report not found: " + reportId));

        if (request.getTrackingToken() == null || !passwordEncoder.matches(request.getTrackingToken().trim(), report.getTrackingTokenHash())) {
            throw new InvalidTrackingTokenException("Invalid tracking token to participate in anonymous conversation");
        }

        AnonymousConversation conversation = conversationRepository.findByReportId(report.getId())
                .orElseGet(() -> conversationRepository.save(AnonymousConversation.builder().report(report).build()));

        AnonymousMessage message = AnonymousMessage.builder()
                .conversation(conversation)
                .senderType(SenderType.REPORTER)
                .messageText(request.getMessageText().trim())
                .isRead(false)
                .build();

        AnonymousMessage saved = messageRepository.save(message);

        notificationService.createNotification(
                "ROLE_AUTHORITY",
                report.getDepartment(),
                "Anonymous Message on " + reportId,
                "The anonymous reporter sent a new clarification message.",
                reportId,
                "NEW_MESSAGE"
        );

        return MessageDto.builder()
                .id(saved.getId())
                .senderType(saved.getSenderType())
                .senderLabel("Anonymous Reporter")
                .messageText(saved.getMessageText())
                .createdAt(saved.getCreatedAt())
                .build();
    }

    @Transactional
    public MessageDto sendMessageAsAuthority(String reportId, String messageText, String authorityEmail, SenderType senderType) {
        AnonymousReport report = reportRepository.findByReportId(reportId)
                .orElseThrow(() -> new ResourceNotFoundException("Report not found: " + reportId));

        AnonymousConversation conversation = conversationRepository.findByReportId(report.getId())
                .orElseGet(() -> conversationRepository.save(AnonymousConversation.builder().report(report).build()));

        AnonymousMessage message = AnonymousMessage.builder()
                .conversation(conversation)
                .senderType(senderType != null ? senderType : SenderType.AUTHORITY)
                .messageText(messageText.trim())
                .isRead(false)
                .build();

        AnonymousMessage saved = messageRepository.save(message);

        auditLogService.logAction(
                "MESSAGE_SENT",
                reportId,
                senderType != null ? senderType.name() : "ROLE_AUTHORITY",
                authorityEmail,
                "Authority sent message to anonymous reporter"
        );

        return MessageDto.builder()
                .id(saved.getId())
                .senderType(saved.getSenderType())
                .senderLabel(senderType == SenderType.ADMIN ? "Institutional Administration" : "Assigned Authority")
                .messageText(saved.getMessageText())
                .createdAt(saved.getCreatedAt())
                .build();
    }

    @Transactional(readOnly = true)
    public List<MessageDto> getMessages(String reportId) {
        AnonymousReport report = reportRepository.findByReportId(reportId)
                .orElseThrow(() -> new ResourceNotFoundException("Report not found: " + reportId));

        var convOpt = conversationRepository.findByReportId(report.getId());
        if (convOpt.isEmpty()) {
            return List.of();
        }

        return messageRepository.findByConversationIdOrderByCreatedAtAsc(convOpt.get().getId()).stream()
                .map(m -> MessageDto.builder()
                        .id(m.getId())
                        .senderType(m.getSenderType())
                        .senderLabel(m.getSenderType() == SenderType.REPORTER ? "Anonymous Reporter" : "Authority (" + (report.getDepartment() != null ? report.getDepartment() : "Administration") + ")")
                        .messageText(m.getMessageText())
                        .createdAt(m.getCreatedAt())
                        .build())
                .collect(Collectors.toList());
    }
}
