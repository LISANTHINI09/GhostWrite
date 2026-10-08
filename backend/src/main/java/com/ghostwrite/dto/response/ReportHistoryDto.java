package com.ghostwrite.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReportHistoryDto {
    private String oldStatus;
    private String newStatus;
    private String changedByRole;
    private String remarks;
    private LocalDateTime timestamp;
}
