package com.ghostwrite.service;

import com.ghostwrite.dto.response.NotificationResponse;
import com.ghostwrite.entity.Notification;
import com.ghostwrite.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;

    public void createNotification(String recipientRole, String recipientDepartment, String title, String message, String reportId, String type) {
        Notification notification = Notification.builder()
                .recipientRole(recipientRole)
                .recipientDepartment(recipientDepartment)
                .title(title)
                .message(message)
                .reportId(reportId)
                .notificationType(type)
                .isRead(false)
                .build();
        notificationRepository.save(notification);
        log.info("Notification dispatched: [{}] -> Role: {}, Dept: {}", title, recipientRole, recipientDepartment);
    }

    public List<NotificationResponse> getRecentNotifications() {
        return notificationRepository.findTop20ByOrderByCreatedAtDesc().stream()
                .map(n -> NotificationResponse.builder()
                        .id(n.getId())
                        .title(n.getTitle())
                        .message(n.getMessage())
                        .reportId(n.getReportId())
                        .notificationType(n.getNotificationType())
                        .isRead(n.isRead())
                        .createdAt(n.getCreatedAt())
                        .build())
                .collect(Collectors.toList());
    }

    public void markAsRead(Long id) {
        notificationRepository.findById(id).ifPresent(n -> {
            n.setRead(true);
            notificationRepository.save(n);
        });
    }
}
