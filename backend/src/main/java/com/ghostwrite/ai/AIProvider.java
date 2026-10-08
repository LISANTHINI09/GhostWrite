package com.ghostwrite.ai;

import com.ghostwrite.dto.request.GhostWriterGenerateRequest;
import com.ghostwrite.dto.response.AIAnalysisResponse;
import com.ghostwrite.dto.response.GhostWriterResponse;

public interface AIProvider {

    GhostWriterResponse generateProfessionalDocument(GhostWriterGenerateRequest request);

    AIAnalysisResponse analyzeReport(String rawDescription, String category);

    double computeSimilarity(String text1, String text2);
}
