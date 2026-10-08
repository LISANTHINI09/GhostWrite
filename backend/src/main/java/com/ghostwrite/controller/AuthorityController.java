package com.ghostwrite.controller;

import com.ghostwrite.dto.request.AuthorityResponseRequest;
import com.ghostwrite.dto.request.ReportStatusUpdateRequest;
import com.ghostwrite.dto.response.AdminReportDetailResponse;
import com.ghostwrite.dto.response.AdminReportSummaryResponse;
import com.ghostwrite.dto.response.ApiResponse;
import com.ghostwrite.entity.User;
import com.ghostwrite.repository.UserRepository;
import com.ghostwrite.service.AdminService;
import com.ghostwrite.service.AuthorityService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/authority")
@RequiredArgsConstructor
public class AuthorityController {

    private final AuthorityService authorityService;
    private final AdminService adminService;
    private final UserRepository userRepository;

    @GetMapping("/reports")
    public ResponseEntity<ApiResponse<Page<AdminReportSummaryResponse>>> getAuthorityReports(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "15") int size,
            Authentication auth) {

        String department = null;
        if (auth != null) {
            User user = userRepository.findByEmail(auth.getName()).orElse(null);
            if (user != null) {
                department = user.getDepartment();
            }
        }

        PageRequest pageRequest = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<AdminReportSummaryResponse> reports = authorityService.getDepartmentReports(department, pageRequest);
        return ResponseEntity.ok(ApiResponse.success(reports));
    }

    @GetMapping("/reports/{id}")
    public ResponseEntity<ApiResponse<AdminReportDetailResponse>> getReportDetail(@PathVariable String id) {
        AdminReportDetailResponse detail = authorityService.getReportDetail(id);
        return ResponseEntity.ok(ApiResponse.success(detail));
    }

    @PostMapping("/reports/{id}/response")
    public ResponseEntity<ApiResponse<String>> submitResponse(
            @PathVariable String id,
            @Valid @RequestBody AuthorityResponseRequest request,
            Authentication auth) {

        String authorityEmail = auth != null ? auth.getName() : "authority@ghostwrite.com";
        authorityService.submitResponse(id, request, authorityEmail);
        return ResponseEntity.ok(ApiResponse.success("Departmental response recorded and published to tracking record", null));
    }

    @PutMapping("/reports/{id}/status")
    public ResponseEntity<ApiResponse<String>> updateStatus(
            @PathVariable String id,
            @Valid @RequestBody ReportStatusUpdateRequest request,
            Authentication auth) {

        String authorityEmail = auth != null ? auth.getName() : "authority@ghostwrite.com";
        adminService.updateStatus(id, request, authorityEmail);
        return ResponseEntity.ok(ApiResponse.success("Status successfully updated", null));
    }
}
