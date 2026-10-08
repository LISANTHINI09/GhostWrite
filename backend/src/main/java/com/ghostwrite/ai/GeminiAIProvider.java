package com.ghostwrite.ai;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ghostwrite.dto.request.GhostWriterGenerateRequest;
import com.ghostwrite.dto.response.AIAnalysisResponse;
import com.ghostwrite.dto.response.GhostWriterResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Slf4j
@Component("geminiAIProvider")
public class GeminiAIProvider implements AIProvider {

    @Value("${gemini.api-key:${GEMINI_API_KEY:${ai.api-key:}}}")
    private String apiKey;

    @Value("${gemini.model:${AI_MODEL:gemini-1.5-flash}}")
    private String model;

    private final MockAIProvider fallbackProvider;
    private final ObjectMapper objectMapper;
    private final RestTemplate restTemplate;

    @Autowired
    public GeminiAIProvider(MockAIProvider fallbackProvider) {
        this.fallbackProvider = fallbackProvider;
        this.objectMapper = new ObjectMapper();

        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(10000);
        factory.setReadTimeout(15000);
        this.restTemplate = new RestTemplate(factory);
    }

    public boolean isApiKeyConfigured() {
        return apiKey != null && !apiKey.trim().isEmpty() && !apiKey.startsWith("${");
    }

    @Override
    public GhostWriterResponse generateProfessionalDocument(GhostWriterGenerateRequest request) {
        if (!isApiKeyConfigured()) {
            log.info("Gemini API key is not configured. Seamlessly utilizing local GhostWriter engine.");
            return fallbackProvider.generateProfessionalDocument(request);
        }

        try {
            log.info("Calling Google Gemini API ({}) for professional grievance rewriting...", model);
            String prompt = buildGhostWriterPrompt(request);
            String responseJson = callGeminiApi(prompt);
            GhostWriterResponse parsed = parseGhostWriterResponse(responseJson, request);
            if (parsed != null) {
                return parsed;
            }
        } catch (Exception ex) {
            log.warn("Gemini API call or response parsing failed ({}). Gracefully falling back to local NLP engine.", ex.getMessage());
        }

        return fallbackProvider.generateProfessionalDocument(request);
    }

    @Override
    public AIAnalysisResponse analyzeReport(String rawDescription, String category) {
        if (!isApiKeyConfigured()) {
            return fallbackProvider.analyzeReport(rawDescription, category);
        }

        try {
            log.info("Calling Google Gemini API ({}) for grievance analysis and categorization...", model);
            String prompt = buildAnalysisPrompt(rawDescription, category);
            String responseJson = callGeminiApi(prompt);
            AIAnalysisResponse parsed = parseAnalysisResponse(responseJson, rawDescription, category);
            if (parsed != null) {
                return parsed;
            }
        } catch (Exception ex) {
            log.warn("Gemini analysis failed ({}). Gracefully falling back to local analyzer.", ex.getMessage());
        }

        return fallbackProvider.analyzeReport(rawDescription, category);
    }

    @Override
    public double computeSimilarity(String text1, String text2) {
        // High-performance token Jaccard similarity
        return fallbackProvider.computeSimilarity(text1, text2);
    }

    private String callGeminiApi(String prompt) {
        String endpoint = "https://generativelanguage.googleapis.com/v1beta/models/" + model + ":generateContent?key=" + apiKey.trim();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, Object> textPart = Map.of("text", prompt);
        Map<String, Object> contentObj = Map.of("parts", List.of(textPart));
        Map<String, Object> genConfig = Map.of(
                "temperature", 0.2,
                "topP", 0.8,
                "maxOutputTokens", 1500
        );

        Map<String, Object> requestBody = Map.of(
                "contents", List.of(contentObj),
                "generationConfig", genConfig
        );

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
        ResponseEntity<String> response = restTemplate.exchange(endpoint, HttpMethod.POST, entity, String.class);

        if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
            return extractTextFromGeminiResponse(response.getBody());
        }

        throw new RuntimeException("Gemini returned non-2xx status: " + response.getStatusCode());
    }

    private String extractTextFromGeminiResponse(String responseBody) {
        try {
            JsonNode root = objectMapper.readTree(responseBody);
            JsonNode candidates = root.path("candidates");
            if (candidates.isArray() && !candidates.isEmpty()) {
                JsonNode parts = candidates.get(0).path("content").path("parts");
                if (parts.isArray() && !parts.isEmpty()) {
                    return parts.get(0).path("text").asText("");
                }
            }
        } catch (Exception e) {
            log.error("Failed to extract content part from Gemini response: {}", e.getMessage());
        }
        return responseBody;
    }

    private String buildGhostWriterPrompt(GhostWriterGenerateRequest req) {
        return """
                You are GhostWrite Institutional AI, an expert academic ombudsman and formal documentation assistant.
                Your task is to transform the user's raw grievance into a structured, highly formal institutional representation dossier.
                
                CRITICAL FACTUAL INTEGRITY RULES:
                1. You MUST PRESERVE all factual statements supplied by the user verbatim.
                2. You MUST NEVER invent or hallucinate names, dates, locations, incidents, evidence, accusations, or medical claims that were not stated in the input.
                3. Elevate emotional or informal language into polite, objective, administrative English suitable for a University Syndicate or Board of Governors.
                
                USER GRIEVANCE INPUT:
                - Raw Complaint: "%s"
                - Category: "%s"
                - Reporter Role: "%s"
                - Location: "%s"
                - Timeline / Date: "%s"
                - Prior Authority Contacted: "%s"
                - Auxiliary Notes: "%s"
                
                OUTPUT REQUIREMENTS:
                Return ONLY a single valid JSON object with the following exact keys (no markdown formatting outside JSON):
                {
                  "professionalTitle": "Formal Subject Line",
                  "executiveSummary": "Concise 2-3 sentence overview of the grievance and its urgency",
                  "detailedDescription": "Structured factual representation referencing the exact details supplied",
                  "relevantContext": "Concise summary of location, dates and contextual details",
                  "impact": "Institutional, academic or sanitary disruption analysis",
                  "requestedAction": "Clear, constructive remedial action requested from management",
                  "suggestedPriority": "P1 or P2 or P3 or P4",
                  "suggestedDepartment": "Recommended institutional department to investigate",
                  "professionalClosing": "Formal closing endorsement statement",
                  "priorityReasoning": "Explainable rationale justifying the priority assignment",
                  "extractedKeywords": ["keyword1", "keyword2", "keyword3"],
                  "estimatedRiskLevel": "LOW or MEDIUM or HIGH or CRITICAL"
                }
                """.formatted(
                clean(req.getRawDescription()),
                clean(req.getCategory()),
                clean(req.getReporterType()),
                clean(req.getLocation()),
                clean(req.getIncidentDate()),
                clean(req.getRelatedAuthority()),
                clean(req.getAdditionalNotes())
        );
    }

    private String buildAnalysisPrompt(String rawText, String category) {
        return """
                Analyze the following anonymous institutional grievance for classification and risk triage.
                Preserve all facts. Do NOT hallucinate.
                
                Grievance: "%s"
                User Category: "%s"
                
                Output ONLY a single valid JSON object with these exact keys:
                {
                  "predictedCategory": "Academic, Hostel, Infrastructure, Transport, Harassment, Examination, Technology / IT, or Administration",
                  "predictedSubcategory": "Specific sub-classification",
                  "predictedSeverity": "LOW, MEDIUM, HIGH, or CRITICAL",
                  "predictedPriority": "P1, P2, P3, or P4",
                  "recommendedDepartment": "Name of the appropriate division",
                  "reasoningRationale": "Explainable justification explaining why this priority was determined",
                  "sentimentScore": -0.75,
                  "emotionTone": "e.g. Frustrated, Concerned, Urgent, Distressed",
                  "riskLevel": "LOW, MEDIUM, HIGH, or CRITICAL",
                  "extractedKeywords": ["word1", "word2"],
                  "riskFlags": ["FLAG1", "FLAG2"],
                  "aiConfidenceScore": 0.95
                }
                """.formatted(clean(rawText), clean(category));
    }

    private GhostWriterResponse parseGhostWriterResponse(String rawOutput, GhostWriterGenerateRequest request) {
        try {
            String jsonStr = sanitizeJsonString(rawOutput);
            JsonNode node = objectMapper.readTree(jsonStr);

            List<String> keywords = new ArrayList<>();
            JsonNode kwNode = node.path("extractedKeywords");
            if (kwNode.isArray()) {
                kwNode.forEach(k -> keywords.add(k.asText()));
            }

            return GhostWriterResponse.builder()
                    .professionalTitle(node.path("professionalTitle").asText("Formal Grievance Representation"))
                    .executiveSummary(node.path("executiveSummary").asText(""))
                    .detailedDescription(node.path("detailedDescription").asText(request.getRawDescription()))
                    .relevantContext(node.path("relevantContext").asText(""))
                    .impact(node.path("impact").asText(""))
                    .requestedAction(node.path("requestedAction").asText(""))
                    .suggestedPriority(node.path("suggestedPriority").asText("P3"))
                    .suggestedDepartment(node.path("suggestedDepartment").asText("General Administration"))
                    .professionalClosing(node.path("professionalClosing").asText("Respectfully submitted for institutional redressal."))
                    .priorityReasoning(node.path("priorityReasoning").asText("Priority established via Gemini classification model."))
                    .extractedKeywords(keywords.isEmpty() ? List.of("institutional", "grievance") : keywords)
                    .estimatedRiskLevel(node.path("estimatedRiskLevel").asText("MEDIUM"))
                    .build();
        } catch (Exception e) {
            log.warn("Could not deserialize Gemini JSON output: {}. Raw: {}", e.getMessage(), rawOutput);
            return null;
        }
    }

    private AIAnalysisResponse parseAnalysisResponse(String rawOutput, String rawDescription, String category) {
        try {
            String jsonStr = sanitizeJsonString(rawOutput);
            JsonNode node = objectMapper.readTree(jsonStr);

            List<String> keywords = new ArrayList<>();
            node.path("extractedKeywords").forEach(k -> keywords.add(k.asText()));

            List<String> flags = new ArrayList<>();
            node.path("riskFlags").forEach(f -> flags.add(f.asText()));

            return AIAnalysisResponse.builder()
                    .predictedCategory(node.path("predictedCategory").asText(category != null ? category : "General"))
                    .predictedSubcategory(node.path("predictedSubcategory").asText("Operations"))
                    .predictedSeverity(node.path("predictedSeverity").asText("MEDIUM"))
                    .predictedPriority(node.path("predictedPriority").asText("P3"))
                    .recommendedDepartment(node.path("recommendedDepartment").asText("General Administration"))
                    .reasoningRationale(node.path("reasoningRationale").asText("Assessed via Gemini intelligence model."))
                    .sentimentScore(node.path("sentimentScore").asDouble(-0.3))
                    .emotionTone(node.path("emotionTone").asText("Concerned"))
                    .riskLevel(node.path("riskLevel").asText("MEDIUM"))
                    .duplicateConfidence(0.0)
                    .extractedKeywords(keywords)
                    .riskFlags(flags)
                    .aiConfidenceScore(node.path("aiConfidenceScore").asDouble(0.95))
                    .build();
        } catch (Exception e) {
            log.warn("Could not deserialize Gemini analysis JSON: {}", e.getMessage());
            return null;
        }
    }

    private String sanitizeJsonString(String raw) {
        if (raw == null) return "{}";
        String s = raw.trim();
        if (s.startsWith("```json")) {
            s = s.substring(7);
        } else if (s.startsWith("```")) {
            s = s.substring(3);
        }
        if (s.endsWith("```")) {
            s = s.substring(0, s.length() - 3);
        }
        return s.trim();
    }

    private String clean(String input) {
        return input == null ? "" : input.replace("\"", "\\\"").replace("\n", " ");
    }
}
