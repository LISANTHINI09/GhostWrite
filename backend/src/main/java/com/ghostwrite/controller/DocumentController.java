package com.ghostwrite.controller;

import com.ghostwrite.service.DocumentExportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/documents")
@RequiredArgsConstructor
public class DocumentController {

    private final DocumentExportService documentExportService;

    @GetMapping(value = "/{reportId}/view", produces = MediaType.TEXT_HTML_VALUE)
    public ResponseEntity<String> viewDocument(@PathVariable String reportId) {
        String html = documentExportService.generateFormalDocumentHtml(reportId);
        return ResponseEntity.ok(html);
    }

    @GetMapping(value = "/{reportId}/download", produces = MediaType.TEXT_HTML_VALUE)
    public ResponseEntity<String> downloadDocument(@PathVariable String reportId) {
        String html = documentExportService.generateFormalDocumentHtml(reportId);
        HttpHeaders headers = new HttpHeaders();
        headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"GhostWrite-Dossier-" + reportId + ".html\"");
        return ResponseEntity.ok().headers(headers).body(html);
    }
}
