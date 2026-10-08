package com.ghostwrite.controller;

import com.ghostwrite.dto.request.AnonymousReportSubmitRequest;
import com.ghostwrite.dto.response.AnonymousReportSubmitResponse;
import com.ghostwrite.dto.response.ApiResponse;
import com.ghostwrite.service.AnonymousReportService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class AnonymousReportController {

    private final AnonymousReportService reportService;

    @PostMapping("/anonymous")
    public ResponseEntity<ApiResponse<AnonymousReportSubmitResponse>> submitAnonymousReport(
            @Valid @RequestBody AnonymousReportSubmitRequest request) {

        AnonymousReportSubmitResponse response = reportService.submitAnonymousReport(request);
        return new ResponseEntity<>(ApiResponse.success("Anonymous grievance successfully recorded", response), HttpStatus.CREATED);
    }
}
