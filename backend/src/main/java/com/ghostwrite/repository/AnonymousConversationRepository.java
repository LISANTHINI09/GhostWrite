package com.ghostwrite.repository;

import com.ghostwrite.entity.AnonymousConversation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AnonymousConversationRepository extends JpaRepository<AnonymousConversation, Long> {
    Optional<AnonymousConversation> findByReportId(Long reportId);
}
