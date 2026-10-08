package com.ghostwrite.dto.response;

import com.ghostwrite.entity.SenderType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MessageDto {
    private Long id;
    private SenderType senderType;
    private String senderLabel; // e.g. "Anonymous Reporter", "Hostel Authority", "Admin"
    private String messageText;
    private LocalDateTime createdAt;
}
