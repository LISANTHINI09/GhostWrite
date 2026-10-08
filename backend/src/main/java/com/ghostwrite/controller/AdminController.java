package com.ghostwrite.controller;

import com.ghostwrite.dto.request.ReportAssignRequest;
import com.ghostwrite.dto.request.ReportPriorityUpdateRequest;
import com.ghostwrite.dto.request.ReportStatusUpdateRequest;
import com.ghostwrite.dto.response.*;
import com.ghostwrite.entity.ReportPriority;
import com.ghostwrite.entity.ReportSeverity;
import com.ghostwrite.entity.ReportStatus;
import com.ghostwrite.entity.User;
import com.ghostwrite.repository.UserRepository;
import com.ghostwrite.service.AdminService;
import com.ghostwrite.service.AuditLogService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;
    private final AuditLogService auditLogService;
    private final UserRepository userRepository;

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<AdminDashboardKpis>> getDashboard() {
        AdminDashboardKpis kpis = adminService.getDashboardKpis();
        return ResponseEntity.ok(ApiResponse.success(kpis));
    }

    @GetMapping("/reports")
    public ResponseEntity<ApiResponse<Page<AdminReportSummaryResponse>>> getReports(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) ReportStatus status,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) ReportSeverity severity,
            @RequestParam(required = false) ReportPriority priority,
            @RequestParam(required = false) String department,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "15") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String direction) {

        Sort sort = direction.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        PageRequest pageRequest = PageRequest.of(page, size, sort);

        Page<AdminReportSummaryResponse> reports = adminService.getFilteredReports(search, status, category, severity, priority, department, pageRequest);
        return ResponseEntity.ok(ApiResponse.success(reports));
    }

    @GetMapping("/reports/{id}")
    public ResponseEntity<ApiResponse<AdminReportDetailResponse>> getReportDetail(@PathVariable String id) {
        AdminReportDetailResponse detail = adminService.getReportDetail(id);
        return ResponseEntity.ok(ApiResponse.success(detail));
    }

    @PutMapping("/reports/{id}/status")
    public ResponseEntity<ApiResponse<String>> updateStatus(
            @PathVariable String id,
            @Valid @RequestBody ReportStatusUpdateRequest request,
            Authentication auth) {

        String adminEmail = auth != null ? auth.getName() : "admin@ghostwrite.com";
        adminService.updateStatus(id, request, adminEmail);
        return ResponseEntity.ok(ApiResponse.success("Status updated to " + request.getStatus(), null));
    }

    @PutMapping("/reports/{id}/priority")
    public ResponseEntity<ApiResponse<String>> updatePriority(
            @PathVariable String id,
            @Valid @RequestBody ReportPriorityUpdateRequest request,
            Authentication auth) {

        String adminEmail = auth != null ? auth.getName() : "admin@ghostwrite.com";
        adminService.updatePriority(id, request, adminEmail);
        return ResponseEntity.ok(ApiResponse.success("Priority updated to " + request.getPriority(), null));
    }

    @PostMapping("/reports/{id}/assign")
    public ResponseEntity<ApiResponse<String>> assignReport(
            @PathVariable String id,
            @Valid @RequestBody ReportAssignRequest request,
            Authentication auth) {

        String adminEmail = auth != null ? auth.getName() : "admin@ghostwrite.com";
        adminService.assignReport(id, request, adminEmail);
        return ResponseEntity.ok(ApiResponse.success("Report successfully routed to " + request.getDepartment(), null));
    }

    @PostMapping("/reports/{id}/escalate")
    public ResponseEntity<ApiResponse<String>> escalateReport(
            @PathVariable String id,
            @RequestBody(required = false) Map<String, String> body,
            Authentication auth) {

        String remarks = body != null ? body.get("remarks") : "Escalated by Admin";
        String adminEmail = auth != null ? auth.getName() : "admin@ghostwrite.com";
        adminService.escalateReport(id, remarks, adminEmail);
        return ResponseEntity.ok(ApiResponse.success("Report escalated to executive hierarchy", null));
    }

    @GetMapping("/audit-logs")
    public ResponseEntity<ApiResponse<List<AuditLogResponse>>> getAuditLogs() {
        return ResponseEntity.ok(ApiResponse.success(auditLogService.getRecentLogs()));
    }

    @GetMapping("/users")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getUsers() {
        List<Map<String, Object>> users = userRepository.findAll().stream()
                .map(u -> Map.<String, Object>of(
                        "id", u.getId(),
                        "email", u.getEmail(),
                        "fullName", u.getFullName(),
                        "role", u.getRole().name(),
                        "department", u.getDepartment() != null ? u.getDepartment() : "General Administration",
                        "active", u.isActive()
                ))
                .collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success(users));
    }
}
