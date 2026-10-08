package com.ghostwrite.repository;

import com.ghostwrite.entity.AnonymousMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AnonymousMessageRepository extends JpaRepository<AnonymousMessage, Long> {
    List<AnonymousMessage> findByConversationIdOrderByCreatedAtAsc(Long conversationId);
}
