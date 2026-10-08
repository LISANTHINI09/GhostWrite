package com.ghostwrite.controller;

import com.ghostwrite.dto.request.ReviewerActionRequest;
import com.ghostwrite.dto.response.AdminReportDetailResponse;
import com.ghostwrite.dto.response.AdminReportSummaryResponse;
import com.ghostwrite.dto.response.ApiResponse;
import com.ghostwrite.service.AdminService;
import com.ghostwrite.service.ReviewerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reviewer")
@RequiredArgsConstructor
public class ReviewerController {

    private final ReviewerService reviewerService;
    private final AdminService adminService;

    @GetMapping("/pending")
    public ResponseEntity<ApiResponse<Page<AdminReportSummaryResponse>>> getPendingQueue(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "15") int size) {

        PageRequest pageRequest = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<AdminReportSummaryResponse> reports = reviewerService.getPendingReviewQueue(pageRequest);
        return ResponseEntity.ok(ApiResponse.success(reports));
    }

    @GetMapping("/reports/{id}")
    public ResponseEntity<ApiResponse<AdminReportDetailResponse>> getReportDetail(@PathVariable String id) {
        AdminReportDetailResponse detail = adminService.getReportDetail(id);
        return ResponseEntity.ok(ApiResponse.success(detail));
    }

    @PostMapping("/{id}/action")
    public ResponseEntity<ApiResponse<String>> processAction(
            @PathVariable String id,
            @Valid @RequestBody ReviewerActionRequest request,
            Authentication auth) {

        String reviewerEmail = auth != null ? auth.getName() : "reviewer@ghostwrite.com";
        reviewerService.processReviewAction(id, request, reviewerEmail);
        return ResponseEntity.ok(ApiResponse.success("Review action executed successfully", null));
    }
}
