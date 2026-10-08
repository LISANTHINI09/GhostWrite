package com.ghostwrite.repository;

import com.ghostwrite.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByRecipientRoleOrRecipientDepartmentOrderByCreatedAtDesc(String recipientRole, String recipientDepartment);
    List<Notification> findTop20ByOrderByCreatedAtDesc();
}
