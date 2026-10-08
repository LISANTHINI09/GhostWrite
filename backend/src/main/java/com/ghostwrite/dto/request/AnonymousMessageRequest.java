package com.ghostwrite.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class AnonymousMessageRequest {
    private String trackingToken; // Required if unauthenticated reporter

    @NotBlank(message = "Message text cannot be blank")
    private String messageText;
}
