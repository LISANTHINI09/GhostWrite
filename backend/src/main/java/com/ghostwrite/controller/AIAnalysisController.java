package com.ghostwrite.controller;

import com.ghostwrite.dto.response.AIAnalysisResponse;
import com.ghostwrite.dto.response.ApiResponse;
import com.ghostwrite.service.GhostWriterService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
public class AIAnalysisController {

    private final GhostWriterService ghostWriterService;

    @PostMapping("/analyze")
    public ResponseEntity<ApiResponse<AIAnalysisResponse>> analyze(@RequestBody AnalysisReq request) {
        AIAnalysisResponse response = ghostWriterService.analyze(request.getRawDescription(), request.getCategory());
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PostMapping("/classify")
    public ResponseEntity<ApiResponse<AIAnalysisResponse>> classify(@RequestBody AnalysisReq request) {
        AIAnalysisResponse response = ghostWriterService.analyze(request.getRawDescription(), request.getCategory());
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PostMapping("/duplicate-check")
    public ResponseEntity<ApiResponse<Map<String, Object>>> checkDuplicate(@RequestBody DuplicateReq request) {
        double similarity = ghostWriterService.calculateSimilarity(request.getText1(), request.getText2());
        boolean isDuplicate = similarity >= 0.45;
        return ResponseEntity.ok(ApiResponse.success(Map.of(
                "similarityScore", Math.round(similarity * 100.0) / 100.0,
                "isPotentialDuplicate", isDuplicate,
                "confidence", isDuplicate ? "HIGH" : "LOW"
        )));
    }

    @Data
    public static class AnalysisReq {
        private String rawDescription;
        private String category;
    }

    @Data
    public static class DuplicateReq {
        private String text1;
        private String text2;
    }
}
