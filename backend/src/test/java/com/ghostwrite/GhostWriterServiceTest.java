package com.ghostwrite;

import com.ghostwrite.ai.MockAIProvider;
import com.ghostwrite.dto.request.GhostWriterGenerateRequest;
import com.ghostwrite.dto.response.GhostWriterResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class GhostWriterServiceTest {

    private MockAIProvider aiProvider;

    @BeforeEach
    void setUp() {
        aiProvider = new MockAIProvider();
    }

    @Test
    void testGhostWriterGenerationPreservesFactsAndElevatesTone() {
        GhostWriterGenerateRequest request = new GhostWriterGenerateRequest();
        request.setRawDescription("Hostel water is very bad and brownish. Caretaker did not fix it.");
        request.setCategory("Hostel");
        request.setReporterType("STUDENT");
        request.setLocation("Hostel Block A");

        GhostWriterResponse response = aiProvider.generateProfessionalDocument(request);

        assertNotNull(response);
        assertNotNull(response.getProfessionalTitle());
        assertTrue(response.getProfessionalTitle().toLowerCase().contains("water"));
        assertNotNull(response.getExecutiveSummary());
        assertTrue(response.getDetailedDescription().contains("Hostel water is very bad"));
        assertNotNull(response.getRequestedAction());
        assertNotNull(response.getSuggestedPriority());
    }

    @Test
    void testSimilarityDetection() {
        String text1 = "Hostel water in block A is dirty and brown";
        String text2 = "Water in hostel block A is dirty and brown";
        double score = aiProvider.computeSimilarity(text1, text2);
        assertTrue(score > 0.5, "Similar texts should have high similarity score");
    }

    @Test
    void testGeminiAIProviderFallbackWhenKeyMissing() {
        com.ghostwrite.ai.GeminiAIProvider geminiProvider = new com.ghostwrite.ai.GeminiAIProvider(aiProvider);
        assertFalse(geminiProvider.isApiKeyConfigured());

        GhostWriterGenerateRequest request = new GhostWriterGenerateRequest();
        request.setRawDescription("Lab equipment in Physics Room 204 is sparking during practical sessions.");
        request.setCategory("Lab / Infrastructure");
        request.setReporterType("STUDENT");

        GhostWriterResponse response = geminiProvider.generateProfessionalDocument(request);
        assertNotNull(response);
        assertNotNull(response.getProfessionalTitle());
        assertTrue(response.getDetailedDescription().contains("Lab equipment"));
    }
}
