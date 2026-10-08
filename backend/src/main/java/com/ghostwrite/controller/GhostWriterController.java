package com.ghostwrite.controller;

import com.ghostwrite.dto.request.GhostWriterGenerateRequest;
import com.ghostwrite.dto.response.ApiResponse;
import com.ghostwrite.dto.response.GhostWriterResponse;
import com.ghostwrite.service.GhostWriterService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/ghostwriter")
@RequiredArgsConstructor
public class GhostWriterController {

    private final GhostWriterService ghostWriterService;

    @PostMapping("/generate")
    public ResponseEntity<ApiResponse<GhostWriterResponse>> generateDocument(
            @Valid @RequestBody GhostWriterGenerateRequest request) {

        GhostWriterResponse response = ghostWriterService.generate(request);
        return ResponseEntity.ok(ApiResponse.success("Professional representation generated successfully", response));
    }

    @PostMapping("/regenerate")
    public ResponseEntity<ApiResponse<GhostWriterResponse>> regenerateDocument(
            @Valid @RequestBody GhostWriterGenerateRequest request) {

        GhostWriterResponse response = ghostWriterService.generate(request);
        return ResponseEntity.ok(ApiResponse.success("Representation re-synthesized successfully", response));
    }

    @GetMapping("/status")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getAiStatus() {
        return ResponseEntity.ok(ApiResponse.success(ghostWriterService.getAiProviderInfo()));
    }
}
