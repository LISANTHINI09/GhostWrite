package com.ghostwrite.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 50)
    private String recipientRole; // ROLE_ADMIN, ROLE_AUTHORITY, ROLE_REVIEWER

    @Column(length = 100)
    private String recipientDepartment;

    @Column(length = 120)
    private String recipientEmail;

    @Column(nullable = false, length = 150)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String message;

    @Column(length = 32)
    private String reportId;

    @Column(nullable = false, length = 50)
    private String notificationType; // NEW_REPORT, ASSIGNED, STATUS_CHANGE, ESCALATION, AUTHORITY_RESPONSE, NEW_MESSAGE

    @Builder.Default
    private boolean isRead = false;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;
}
