package com.ghostwrite.service;

import com.ghostwrite.dto.request.AnonymousReportSubmitRequest;
import com.ghostwrite.dto.request.GhostWriterGenerateRequest;
import com.ghostwrite.dto.response.AIAnalysisResponse;
import com.ghostwrite.dto.response.AnonymousReportSubmitResponse;
import com.ghostwrite.dto.response.GhostWriterResponse;
import com.ghostwrite.entity.*;
import com.ghostwrite.exception.BadRequestException;
import com.ghostwrite.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class AnonymousReportService {

    private final AnonymousReportRepository reportRepository;
    private final GhostWrittenDocumentRepository documentRepository;
    private final AIAnalysisRepository aiAnalysisRepository;
    private final AnonymousConversationRepository conversationRepository;
    private final ReportStatusHistoryRepository statusHistoryRepository;
    private final ReporterContactRepository reporterContactRepository;
    private final GhostWriterService ghostWriterService;
    private final IssueClusterService issueClusterService;
    private final AuditLogService auditLogService;
    private final NotificationService notificationService;
    private final PasswordEncoder passwordEncoder;

    private static final String CHARACTERS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    private final SecureRandom random = new SecureRandom();

    @Transactional
    public AnonymousReportSubmitResponse submitAnonymousReport(AnonymousReportSubmitRequest request) {
        if (request.getRawDescription() == null || request.getRawDescription().trim().length() < 10) {
            throw new BadRequestException("Issue description must be at least 10 characters long");
        }

        // 1. Generate Report ID & Random Tracking Token
        String reportId = generateReportId();
        String rawTrackingToken = generateTrackingToken();
        String tokenHash = passwordEncoder.encode(rawTrackingToken);

        // 2. Obtain AI Ghostwritten document and analysis
        GhostWriterGenerateRequest gwReq = new GhostWriterGenerateRequest();
        gwReq.setRawDescription(request.getRawDescription());
        gwReq.setCategory(request.getCategory());
        gwReq.setReporterType(request.getReporterType().name());
        gwReq.setLocation(request.getLocation());
        gwReq.setDepartment(request.getAcceptedSuggestedDepartment());
        gwReq.setIncidentDate(request.getIncidentDate());
        gwReq.setAdditionalNotes(request.getAdditionalNotes());

        GhostWriterResponse gwResponse = ghostWriterService.generate(gwReq);
        AIAnalysisResponse aiAnalysisResponse = ghostWriterService.analyze(request.getRawDescription(), request.getCategory());

        // Priority calculation
        ReportPriority priority = ReportPriority.P3;
        try {
            if (aiAnalysisResponse.getPredictedPriority() != null) {
                priority = ReportPriority.valueOf(aiAnalysisResponse.getPredictedPriority().toUpperCase());
            }
        } catch (Exception ignored) {}

        String targetDepartment = aiAnalysisResponse.getRecommendedDepartment();
        if (request.getAcceptedSuggestedDepartment() != null && !request.getAcceptedSuggestedDepartment().isBlank()) {
            targetDepartment = request.getAcceptedSuggestedDepartment();
        }

        // 3. Create AnonymousReport entity (NO personal identity attached)
        AnonymousReport report = AnonymousReport.builder()
                .reportId(reportId)
                .trackingTokenHash(tokenHash)
                .reporterType(request.getReporterType())
                .category(request.getCategory())
                .subcategory(aiAnalysisResponse.getPredictedSubcategory())
                .severity(request.getSeverity() != null ? request.getSeverity() : ReportSeverity.MEDIUM)
                .priority(priority)
                .status(ReportStatus.SUBMITTED)
                .department(targetDepartment)
                .rawDescription(request.getRawDescription())
                .incidentDate(request.getIncidentDate())
                .location(request.getLocation())
                .relatedAuthority(request.getRelatedAuthority())
                .additionalNotes(request.getAdditionalNotes())
                .isConfidentialContactProvided(
                        (request.getVoluntaryContactEmail() != null && !request.getVoluntaryContactEmail().isBlank()) ||
                        (request.getVoluntaryContactPhone() != null && !request.getVoluntaryContactPhone().isBlank())
                )
                .build();

        AnonymousReport savedReport = reportRepository.save(report);

        // 4. Create GhostWrittenDocument
        String title = (request.getAcceptedProfessionalTitle() != null && !request.getAcceptedProfessionalTitle().isBlank())
                ? request.getAcceptedProfessionalTitle() : gwResponse.getProfessionalTitle();
        String summary = (request.getAcceptedExecutiveSummary() != null && !request.getAcceptedExecutiveSummary().isBlank())
                ? request.getAcceptedExecutiveSummary() : gwResponse.getExecutiveSummary();
        String detailed = (request.getAcceptedDetailedDescription() != null && !request.getAcceptedDetailedDescription().isBlank())
                ? request.getAcceptedDetailedDescription() : gwResponse.getDetailedDescription();
        String context = (request.getAcceptedRelevantContext() != null && !request.getAcceptedRelevantContext().isBlank())
                ? request.getAcceptedRelevantContext() : gwResponse.getRelevantContext();
        String impact = (request.getAcceptedImpact() != null && !request.getAcceptedImpact().isBlank())
                ? request.getAcceptedImpact() : gwResponse.getImpact();
        String action = (request.getAcceptedRequestedAction() != null && !request.getAcceptedRequestedAction().isBlank())
                ? request.getAcceptedRequestedAction() : gwResponse.getRequestedAction();
        String closing = (request.getAcceptedProfessionalClosing() != null && !request.getAcceptedProfessionalClosing().isBlank())
                ? request.getAcceptedProfessionalClosing() : gwResponse.getProfessionalClosing();

        GhostWrittenDocument doc = GhostWrittenDocument.builder()
                .report(savedReport)
                .professionalTitle(title)
                .executiveSummary(summary)
                .detailedDescription(detailed)
                .relevantContext(context)
                .impact(impact)
                .requestedAction(action)
                .suggestedPriority(gwResponse.getSuggestedPriority())
                .suggestedDepartment(gwResponse.getSuggestedDepartment())
                .professionalClosing(closing)
                .documentStatus("GENERATED")
                .editedByReviewer(false)
                .build();

        documentRepository.save(doc);

        // 5. Create AIAnalysis
        AIAnalysis analysis = AIAnalysis.builder()
                .report(savedReport)
                .predictedCategory(aiAnalysisResponse.getPredictedCategory())
                .predictedSubcategory(aiAnalysisResponse.getPredictedSubcategory())
                .predictedSeverity(aiAnalysisResponse.getPredictedSeverity())
                .predictedPriority(aiAnalysisResponse.getPredictedPriority())
                .recommendedDepartment(aiAnalysisResponse.getRecommendedDepartment())
                .reasoningRationale(aiAnalysisResponse.getReasoningRationale())
                .sentimentScore(aiAnalysisResponse.getSentimentScore())
                .emotionTone(aiAnalysisResponse.getEmotionTone())
                .riskLevel(aiAnalysisResponse.getRiskLevel())
                .extractedKeywords(String.join(",", aiAnalysisResponse.getExtractedKeywords()))
                .riskFlags(String.join(",", aiAnalysisResponse.getRiskFlags()))
                .aiConfidenceScore(aiAnalysisResponse.getAiConfidenceScore())
                .build();

        aiAnalysisRepository.save(analysis);

        // 6. Initialize Anonymous Conversation Thread
        AnonymousConversation conversation = AnonymousConversation.builder()
                .report(savedReport)
                .isLocked(false)
                .build();
        conversationRepository.save(conversation);

        // 7. Initial Status History
        ReportStatusHistory history = ReportStatusHistory.builder()
                .report(savedReport)
                .oldStatus(null)
                .newStatus(ReportStatus.SUBMITTED)
                .changedByRole("ANONYMOUS_REPORTER")
                .remarks("Grievance initially submitted through GhostWrite anonymous portal")
                .build();
        statusHistoryRepository.save(history);

        // 8. Associate Issue Cluster
        try {
            Long clusterId = issueClusterService.associateOrCreateCluster(savedReport, aiAnalysisResponse.getExtractedKeywords());
            savedReport.setClusterId(clusterId);
            reportRepository.save(savedReport);
        } catch (Exception ex) {
            log.warn("Cluster association skipped: {}", ex.getMessage());
        }

        // 9. Store Voluntary Contact separately if provided (privacy isolated)
        if (savedReport.isConfidentialContactProvided()) {
            ReporterContact contact = ReporterContact.builder()
                    .reportId(reportId)
                    .encryptedContactEmail(request.getVoluntaryContactEmail())
                    .encryptedContactPhone(request.getVoluntaryContactPhone())
                    .optionalNote("Stored strictly in isolated vault for administrative outreach if required")
                    .isEncrypted(true)
                    .build();
            reporterContactRepository.save(contact);
        }

        // 10. Audit Log & Notifications
        auditLogService.logAction(
                "REPORT_SUBMITTED",
                reportId,
                "ANONYMOUS_REPORTER",
                "Anonymous",
                "Report " + reportId + " submitted under category " + request.getCategory()
        );

        notificationService.createNotification(
                "ROLE_ADMIN",
                targetDepartment,
                "New Anonymous Report: " + reportId,
                "A new " + savedReport.getSeverity() + " report was submitted regarding " + request.getCategory(),
                reportId,
                "NEW_REPORT"
        );

        return AnonymousReportSubmitResponse.builder()
                .reportId(reportId)
                .trackingToken(rawTrackingToken)
                .category(savedReport.getCategory())
                .severity(savedReport.getSeverity().name())
                .priority(savedReport.getPriority().name())
                .status(savedReport.getStatus().name())
                .message("Your report has been securely registered. Keep your tracking token safe to monitor updates.")
                .submissionTimestamp(LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")))
                .build();
    }

    private String generateReportId() {
        String year = String.valueOf(LocalDateTime.now().getYear());
        StringBuilder sb = new StringBuilder("GW-" + year + "-");
        for (int i = 0; i < 6; i++) {
            sb.append(CHARACTERS.charAt(random.nextInt(CHARACTERS.length())));
        }
        return sb.toString();
    }

    private String generateTrackingToken() {
        StringBuilder sb = new StringBuilder("TK-");
        for (int i = 0; i < 3; i++) {
            for (int j = 0; j < 4; j++) {
                sb.append(CHARACTERS.charAt(random.nextInt(CHARACTERS.length())));
            }
            if (i < 2) sb.append("-");
        }
        return sb.toString();
    }
}
