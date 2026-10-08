package com.ghostwrite.service;

import com.ghostwrite.ai.AIProvider;
import com.ghostwrite.ai.GeminiAIProvider;
import com.ghostwrite.dto.request.GhostWriterGenerateRequest;
import com.ghostwrite.dto.response.AIAnalysisResponse;
import com.ghostwrite.dto.response.GhostWriterResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Map;

@Slf4j
@Service
public class GhostWriterService {

    private final AIProvider activeProvider;
    private final String configuredProviderName;
    private final GeminiAIProvider geminiAIProvider;

    @Autowired
    public GhostWriterService(
            @Value("${ai.provider:mock}") String providerName,
            @Qualifier("mockAIProvider") AIProvider mockProvider,
            @Qualifier("llmProvider") AIProvider llmProvider,
            @Qualifier("geminiAIProvider") GeminiAIProvider geminiProvider) {
        this.configuredProviderName = providerName;
        this.geminiAIProvider = geminiProvider;

        if ("gemini".equalsIgnoreCase(providerName)) {
            this.activeProvider = geminiProvider;
            log.info("GhostWriter active AI engine set to: Google Gemini AI Provider");
        } else if ("llm".equalsIgnoreCase(providerName)) {
            this.activeProvider = llmProvider;
            log.info("GhostWriter active AI engine set to: Generic LLM Provider");
        } else {
            this.activeProvider = mockProvider;
            log.info("GhostWriter active AI engine set to: Local Heuristic Mock AI Provider");
        }
    }

    public GhostWriterResponse generate(GhostWriterGenerateRequest request) {
        return activeProvider.generateProfessionalDocument(request);
    }

    public AIAnalysisResponse analyze(String rawDescription, String category) {
        return activeProvider.analyzeReport(rawDescription, category);
    }

    public double calculateSimilarity(String text1, String text2) {
        return activeProvider.computeSimilarity(text1, text2);
    }

    public Map<String, Object> getAiProviderInfo() {
        boolean isGeminiConfigured = geminiAIProvider != null && geminiAIProvider.isApiKeyConfigured();
        return Map.of(
                "providerName", configuredProviderName,
                "isLiveKeyConfigured", isGeminiConfigured,
                "activeMode", ("gemini".equalsIgnoreCase(configuredProviderName) && isGeminiConfigured) ? "REAL_GEMINI" : "MOCK_LOCAL_HEURISTICS",
                "factPreservationGuard", "ACTIVE",
                "zeroHallucinationPolicy", "ENFORCED"
        );
    }
}
