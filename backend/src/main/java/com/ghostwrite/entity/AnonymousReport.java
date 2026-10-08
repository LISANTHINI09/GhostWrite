package com.ghostwrite.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "anonymous_reports", indexes = {
        @Index(name = "idx_report_id", columnList = "reportId", unique = true),
        @Index(name = "idx_status", columnList = "status"),
        @Index(name = "idx_category", columnList = "category"),
        @Index(name = "idx_department", columnList = "department"),
        @Index(name = "idx_priority", columnList = "priority")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AnonymousReport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 32)
    private String reportId; // e.g., GW-2026-A1B2C3

    @Column(nullable = false, length = 128)
    private String trackingTokenHash; // Securely verified tracking token

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private ReporterType reporterType;

    @Column(nullable = false, length = 50)
    private String category;

    @Column(length = 50)
    private String subcategory;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private ReportSeverity severity;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private ReportPriority priority;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private ReportStatus status;

    @Column(length = 100)
    private String department;

    @Column(length = 120)
    private String assignedTo;

    @Column(nullable = false, columnDefinition = "LONGTEXT")
    private String rawDescription;

    @Column(length = 50)
    private String incidentDate;

    @Column(length = 150)
    private String location;

    @Column(length = 150)
    private String relatedAuthority;

    @Column(columnDefinition = "TEXT")
    private String additionalNotes;

    @Column(columnDefinition = "TEXT")
    private String authorityResponse;

    @Column(columnDefinition = "TEXT")
    private String resolutionNotes;

    private Long clusterId;

    private LocalDateTime escalatedAt;

    @Builder.Default
    private boolean isConfidentialContactProvided = false;

    @OneToOne(mappedBy = "report", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private GhostWrittenDocument ghostWrittenDocument;

    @OneToOne(mappedBy = "report", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private AIAnalysis aiAnalysis;

    @OneToMany(mappedBy = "report", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<ReportAttachment> attachments = new ArrayList<>();

    @OneToMany(mappedBy = "report", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<ReportStatusHistory> statusHistories = new ArrayList<>();

    @OneToOne(mappedBy = "report", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private AnonymousConversation conversation;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
