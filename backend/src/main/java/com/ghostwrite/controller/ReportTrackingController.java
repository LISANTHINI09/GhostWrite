package com.ghostwrite.controller;

import com.ghostwrite.dto.response.ApiResponse;
import com.ghostwrite.dto.response.TrackingReportResponse;
import com.ghostwrite.service.ReportTrackingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reports/track")
@RequiredArgsConstructor
public class ReportTrackingController {

    private final ReportTrackingService trackingService;

    @GetMapping("/{reportId}")
    public ResponseEntity<ApiResponse<TrackingReportResponse>> trackReport(
            @PathVariable String reportId,
            @RequestParam(required = false) String token,
            @RequestHeader(value = "X-Tracking-Token", required = false) String headerToken) {

        String effectiveToken = (token != null && !token.isBlank()) ? token : headerToken;
        TrackingReportResponse response = trackingService.trackReport(reportId, effectiveToken);
        return ResponseEntity.ok(ApiResponse.success("Report tracking data loaded", response));
    }
}
