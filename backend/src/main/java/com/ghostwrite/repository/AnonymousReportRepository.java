package com.ghostwrite.repository;

import com.ghostwrite.entity.AnonymousReport;
import com.ghostwrite.entity.ReportPriority;
import com.ghostwrite.entity.ReportSeverity;
import com.ghostwrite.entity.ReportStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface AnonymousReportRepository extends JpaRepository<AnonymousReport, Long>, JpaSpecificationExecutor<AnonymousReport> {

    Optional<AnonymousReport> findByReportId(String reportId);

    List<AnonymousReport> findByDepartment(String department);

    List<AnonymousReport> findByStatus(ReportStatus status);

    List<AnonymousReport> findByCategory(String category);

    List<AnonymousReport> findByClusterId(Long clusterId);

    long countByStatus(ReportStatus status);

    long countBySeverity(ReportSeverity severity);

    long countByPriority(ReportPriority priority);

    long countByDepartment(String department);

    long countByCategory(String category);

    @Query("SELECT r.category, COUNT(r) FROM AnonymousReport r GROUP BY r.category")
    List<Object[]> countReportsByCategory();

    @Query("SELECT r.severity, COUNT(r) FROM AnonymousReport r GROUP BY r.severity")
    List<Object[]> countReportsBySeverity();

    @Query("SELECT r.status, COUNT(r) FROM AnonymousReport r GROUP BY r.status")
    List<Object[]> countReportsByStatus();

    @Query("SELECT r.department, COUNT(r) FROM AnonymousReport r WHERE r.department IS NOT NULL GROUP BY r.department")
    List<Object[]> countReportsByDepartment();

    @Query("SELECT r.priority, COUNT(r) FROM AnonymousReport r GROUP BY r.priority")
    List<Object[]> countReportsByPriority();

    @Query("SELECT r FROM AnonymousReport r WHERE r.status IN (:activeStatuses) AND r.createdAt < :cutoff")
    List<AnonymousReport> findStaleReportsForEscalation(
            @Param("activeStatuses") List<ReportStatus> activeStatuses,
            @Param("cutoff") LocalDateTime cutoff);

    @Query("SELECT r FROM AnonymousReport r WHERE " +
            "(:search IS NULL OR LOWER(r.reportId) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(r.rawDescription) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(r.category) LIKE LOWER(CONCAT('%', :search, '%'))) AND " +
            "(:status IS NULL OR r.status = :status) AND " +
            "(:category IS NULL OR r.category = :category) AND " +
            "(:severity IS NULL OR r.severity = :severity) AND " +
            "(:priority IS NULL OR r.priority = :priority) AND " +
            "(:department IS NULL OR r.department = :department)")
    Page<AnonymousReport> findFilteredReports(
            @Param("search") String search,
            @Param("status") ReportStatus status,
            @Param("category") String category,
            @Param("severity") ReportSeverity severity,
            @Param("priority") ReportPriority priority,
            @Param("department") String department,
            Pageable pageable);
}
