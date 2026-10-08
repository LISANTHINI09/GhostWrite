package com.ghostwrite.repository;

import com.ghostwrite.entity.ReporterContact;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ReporterContactRepository extends JpaRepository<ReporterContact, Long> {
    Optional<ReporterContact> findByReportId(String reportId);
}
