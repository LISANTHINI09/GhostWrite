package com.ghostwrite.service;

import com.ghostwrite.dto.response.IssueClusterSummaryResponse;
import com.ghostwrite.entity.AnonymousReport;
import com.ghostwrite.entity.IssueCluster;
import com.ghostwrite.entity.ReportSeverity;
import com.ghostwrite.repository.IssueClusterRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class IssueClusterService {

    private final IssueClusterRepository clusterRepository;

    @Transactional
    public Long associateOrCreateCluster(AnonymousReport report, List<String> keywords) {
        String cat = report.getCategory();
        String loc = report.getLocation() != null ? report.getLocation() : "Campus General";

        // Check if an existing cluster in this category has overlapping title or keywords
        List<IssueCluster> existingClusters = clusterRepository.findByCategory(cat);
        for (IssueCluster cluster : existingClusters) {
            String titleLower = cluster.getTitle().toLowerCase();
            boolean match = keywords.stream().anyMatch(k -> titleLower.contains(k.toLowerCase()));
            if (match) {
                cluster.setReportCount(cluster.getReportCount() + 1);
                if (report.getSeverity() == ReportSeverity.CRITICAL) {
                    cluster.setSeverity(ReportSeverity.CRITICAL);
                }
                clusterRepository.save(cluster);
                return cluster.getId();
            }
        }

        // Otherwise create new cluster
        String primaryKeyword = (keywords != null && !keywords.isEmpty()) ? keywords.get(0).toUpperCase() : "GENERAL";
        String clusterCode = "CLUS-" + cat.toUpperCase().replaceAll("[^A-Z]", "") + "-" + UUID.randomUUID().toString().substring(0, 4).toUpperCase();
        String clusterTitle = cat + " Concern: " + (primaryKeyword.length() > 1 ? primaryKeyword.substring(0, 1) + primaryKeyword.substring(1).toLowerCase() : primaryKeyword) + " (" + loc + ")";

        IssueCluster newCluster = IssueCluster.builder()
                .clusterCode(clusterCode)
                .title(clusterTitle)
                .description("System-detected cluster grouping recurring reports regarding " + cat + " issues in " + loc)
                .category(cat)
                .department(report.getDepartment())
                .affectedArea(loc)
                .reportCount(1)
                .severity(report.getSeverity())
                .status("ACTIVE")
                .build();

        IssueCluster saved = clusterRepository.save(newCluster);
        return saved.getId();
    }

    public List<IssueClusterSummaryResponse> getAllClusters() {
        return clusterRepository.findAllByOrderByReportCountDesc().stream()
                .map(c -> IssueClusterSummaryResponse.builder()
                        .id(c.getId())
                        .clusterCode(c.getClusterCode())
                        .title(c.getTitle())
                        .description(c.getDescription())
                        .category(c.getCategory())
                        .department(c.getDepartment())
                        .affectedArea(c.getAffectedArea())
                        .reportCount(c.getReportCount())
                        .severity(c.getSeverity() != null ? c.getSeverity().name() : "HIGH")
                        .status(c.getStatus())
                        .createdAt(c.getCreatedAt())
                        .updatedAt(c.getUpdatedAt())
                        .build())
                .collect(Collectors.toList());
    }

    public Optional<IssueCluster> getClusterById(Long id) {
        return clusterRepository.findById(id);
    }
}
