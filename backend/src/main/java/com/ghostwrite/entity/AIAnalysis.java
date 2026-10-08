package com.ghostwrite.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "ai_analyses")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AIAnalysis {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "report_id", nullable = false, unique = true)
    private AnonymousReport report;

    @Column(length = 60)
    private String predictedCategory;

    @Column(length = 60)
    private String predictedSubcategory;

    @Column(length = 20)
    private String predictedSeverity;

    @Column(length = 10)
    private String predictedPriority;

    @Column(length = 100)
    private String recommendedDepartment;

    @Column(columnDefinition = "TEXT")
    private String reasoningRationale; // Explainable AI rationale

    private Double sentimentScore;

    @Column(length = 50)
    private String emotionTone;

    @Column(length = 20)
    private String riskLevel;

    private Double duplicateConfidence;

    @Column(columnDefinition = "TEXT")
    private String extractedKeywords; // Comma-separated or JSON list of keywords

    @Column(columnDefinition = "TEXT")
    private String riskFlags;

    @Builder.Default
    private Double aiConfidenceScore = 0.92;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;
}
