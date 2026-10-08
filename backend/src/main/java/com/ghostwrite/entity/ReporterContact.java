package com.ghostwrite.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "reporter_isolated_contacts", indexes = {
        @Index(name = "idx_contact_report_id", columnList = "reportId", unique = true)
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReporterContact {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 32)
    private String reportId; // Foreign reference by report public ID

    @Column(length = 255)
    private String encryptedContactEmail;

    @Column(length = 100)
    private String encryptedContactPhone;

    @Column(columnDefinition = "TEXT")
    private String optionalNote;

    @Builder.Default
    private boolean isEncrypted = true;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;
}
