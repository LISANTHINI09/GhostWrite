package com.ghostwrite.repository;

import com.ghostwrite.entity.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {
    List<AuditLog> findByTargetReportIdOrderByCreatedAtDesc(String targetReportId);
    List<AuditLog> findTop50ByOrderByCreatedAtDesc();
}
