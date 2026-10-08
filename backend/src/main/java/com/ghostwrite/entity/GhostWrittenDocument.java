package com.ghostwrite.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "ghost_written_documents")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GhostWrittenDocument {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "report_id", nullable = false, unique = true)
    private AnonymousReport report;

    @Column(nullable = false, length = 255)
    private String professionalTitle;

    @Column(columnDefinition = "TEXT")
    private String executiveSummary;

    @Column(columnDefinition = "LONGTEXT")
    private String detailedDescription;

    @Column(columnDefinition = "TEXT")
    private String relevantContext;

    @Column(columnDefinition = "TEXT")
    private String impact;

    @Column(columnDefinition = "TEXT")
    private String requestedAction;

    @Column(length = 20)
    private String suggestedPriority;

    @Column(length = 100)
    private String suggestedDepartment;

    @Column(columnDefinition = "TEXT")
    private String professionalClosing;

    @Column(nullable = false, length = 30)
    @Builder.Default
    private String documentStatus = "GENERATED"; // GENERATED, REVIEWER_EDITED, APPROVED

    @Builder.Default
    private boolean editedByReviewer = false;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
