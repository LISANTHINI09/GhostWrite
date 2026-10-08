package com.ghostwrite.controller;

import com.ghostwrite.dto.response.ApiResponse;
import com.ghostwrite.dto.response.IssueClusterSummaryResponse;
import com.ghostwrite.service.IssueClusterService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/clusters")
@RequiredArgsConstructor
public class IssueClusterController {

    private final IssueClusterService clusterService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<IssueClusterSummaryResponse>>> getAllClusters() {
        return ResponseEntity.ok(ApiResponse.success(clusterService.getAllClusters()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> getClusterById(@PathVariable Long id) {
        return clusterService.getClusterById(id)
                .<ResponseEntity<ApiResponse<Object>>>map(c -> ResponseEntity.ok(ApiResponse.success(c)))
                .orElseGet(() -> ResponseEntity.status(404).body(ApiResponse.error("Cluster not found")));
    }
}
