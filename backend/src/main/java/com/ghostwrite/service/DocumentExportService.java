package com.ghostwrite.service;

import com.ghostwrite.entity.AnonymousReport;
import com.ghostwrite.entity.GhostWrittenDocument;
import com.ghostwrite.exception.ResourceNotFoundException;
import com.ghostwrite.repository.AnonymousReportRepository;
import com.ghostwrite.repository.GhostWrittenDocumentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;

@Service
@RequiredArgsConstructor
public class DocumentExportService {

    private final AnonymousReportRepository reportRepository;
    private final GhostWrittenDocumentRepository documentRepository;

    public String generateFormalDocumentHtml(String reportId) {
        AnonymousReport report = reportRepository.findByReportId(reportId)
                .orElseThrow(() -> new ResourceNotFoundException("Report not found: " + reportId));

        GhostWrittenDocument doc = documentRepository.findByReportId(report.getId())
                .orElseThrow(() -> new ResourceNotFoundException("GhostWritten document not found: " + reportId));

        String dateStr = report.getCreatedAt() != null
                ? report.getCreatedAt().format(DateTimeFormatter.ofPattern("dd MMMM yyyy, HH:mm"))
                : "Official Record Date";

        return """
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <title>Formal Institutional Representation - %s</title>
                    <style>
                        body { font-family: 'Times New Roman', Times, serif; margin: 40px; color: #1a1a1a; line-height: 1.6; background-color: #fafafa; }
                        .container { max-width: 800px; margin: auto; background: #fff; padding: 50px 60px; border: 1px solid #ddd; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
                        .header { border-bottom: 2px solid #0f172a; padding-bottom: 20px; margin-bottom: 25px; text-align: center; }
                        .header h1 { font-size: 22px; margin: 0; text-transform: uppercase; letter-spacing: 1.5px; color: #0f172a; }
                        .header p { margin: 5px 0 0; font-size: 13px; color: #64748b; font-style: italic; }
                        .meta-box { background: #f8fafc; border: 1px solid #e2e8f0; padding: 15px; margin-bottom: 25px; font-size: 13px; display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
                        .section-title { font-size: 14px; text-transform: uppercase; font-weight: bold; border-bottom: 1px solid #cbd5e1; padding-bottom: 4px; margin-top: 25px; margin-bottom: 10px; color: #1e293b; letter-spacing: 0.5px; }
                        .content-body { font-size: 14px; text-align: justify; white-space: pre-line; }
                        .footer { margin-top: 40px; border-top: 1px dashed #cbd5e1; padding-top: 20px; font-size: 12px; color: #64748b; text-align: center; }
                        .badge { display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: bold; background: #e0e7ff; color: #3730a3; }
                        @media print { body { background: #fff; margin: 0; } .container { border: none; box-shadow: none; padding: 20px 0; } }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>INSTITUTIONAL GRIEVANCE & REPRESENTATION DOSSIER</h1>
                            <p>Certified Document Prepared via GhostWrite Autonomous Redressal Protocol</p>
                        </div>
                        <div class="meta-box">
                            <div><strong>Official Docket Reference:</strong> %s</div>
                            <div><strong>Date Filed:</strong> %s</div>
                            <div><strong>Designated Category:</strong> %s (%s)</div>
                            <div><strong>Assigned Priority:</strong> <span class="badge">%s</span></div>
                            <div><strong>Target Department:</strong> %s</div>
                            <div><strong>Reporter Category:</strong> %s (Identity Decoupled)</div>
                        </div>

                        <div class="section-title">I. Formal Subject</div>
                        <p style="font-size: 16px; font-weight: bold; color: #0f172a; margin: 10px 0;">%s</p>

                        <div class="section-title">II. Executive Summary</div>
                        <div class="content-body">%s</div>

                        <div class="section-title">III. Substantive Factual Representation</div>
                        <div class="content-body">%s</div>

                        <div class="section-title">IV. Institutional & Community Impact</div>
                        <div class="content-body">%s</div>

                        <div class="section-title">V. Requested Administrative Action</div>
                        <div class="content-body">%s</div>

                        <div class="section-title">VI. Professional Closing & Endorsement</div>
                        <div class="content-body">%s</div>

                        <div class="footer">
                            <p><strong>CONFIDENTIALITY GUARANTEE:</strong> This dossier was generated under zero-knowledge institutional privacy standards. The filer's personal identity is cryptographically omitted to protect against any retaliatory exposure. Generated under GhostWrite v1.0 Production Platform.</p>
                        </div>
                    </div>
                </body>
                </html>
                """.formatted(
                report.getReportId(),
                report.getReportId(),
                dateStr,
                report.getCategory(),
                report.getSubcategory() != null ? report.getSubcategory() : "General",
                report.getPriority().name(),
                report.getDepartment() != null ? report.getDepartment() : "General Administration",
                report.getReporterType().name(),
                doc.getProfessionalTitle(),
                doc.getExecutiveSummary() != null ? doc.getExecutiveSummary() : "N/A",
                doc.getDetailedDescription() != null ? doc.getDetailedDescription() : report.getRawDescription(),
                doc.getImpact() != null ? doc.getImpact() : "Operational disruption cited.",
                doc.getRequestedAction() != null ? doc.getRequestedAction() : "Direct administrative inspection.",
                doc.getProfessionalClosing() != null ? doc.getProfessionalClosing() : "Respectfully submitted."
        );
    }
}
