package com.ghostwrite.controller;

import com.ghostwrite.dto.request.AnonymousMessageRequest;
import com.ghostwrite.dto.response.ApiResponse;
import com.ghostwrite.dto.response.MessageDto;
import com.ghostwrite.entity.SenderType;
import com.ghostwrite.service.AnonymousMessageService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reports/{reportId}/messages")
@RequiredArgsConstructor
public class AnonymousMessageController {

    private final AnonymousMessageService messageService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<MessageDto>>> getMessages(@PathVariable String reportId) {
        List<MessageDto> messages = messageService.getMessages(reportId);
        return ResponseEntity.ok(ApiResponse.success(messages));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<MessageDto>> sendMessage(
            @PathVariable String reportId,
            @Valid @RequestBody AnonymousMessageRequest request,
            Authentication auth) {

        MessageDto message;
        if (auth != null && auth.isAuthenticated() && !auth.getName().equalsIgnoreCase("anonymousUser")) {
            boolean isAdmin = auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
            SenderType senderType = isAdmin ? SenderType.ADMIN : SenderType.AUTHORITY;
            message = messageService.sendMessageAsAuthority(reportId, request.getMessageText(), auth.getName(), senderType);
        } else {
            message = messageService.sendMessageAsReporter(reportId, request);
        }

        return ResponseEntity.ok(ApiResponse.success("Message transmitted securely", message));
    }
}
