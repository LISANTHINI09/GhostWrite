package com.ghostwrite.repository;

import com.ghostwrite.entity.GhostWrittenDocument;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface GhostWrittenDocumentRepository extends JpaRepository<GhostWrittenDocument, Long> {
    Optional<GhostWrittenDocument> findByReportId(Long reportId);
}
