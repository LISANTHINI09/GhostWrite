package com.ghostwrite.ai;

import com.ghostwrite.dto.request.GhostWriterGenerateRequest;
import com.ghostwrite.dto.response.AIAnalysisResponse;
import com.ghostwrite.dto.response.GhostWriterResponse;
import org.springframework.stereotype.Component;

import java.util.*;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Component("mockAIProvider")
public class MockAIProvider implements AIProvider {

    private static final Map<String, String> CATEGORY_DEPARTMENTS = Map.ofEntries(
            Map.entry("Hostel", "Hostel Administration & Estate Office"),
            Map.entry("Academic", "Academic Affairs & Dean's Secretariat"),
            Map.entry("Faculty", "Dean of Faculty & Departmental Affairs"),
            Map.entry("Examination", "Office of Controller of Examinations"),
            Map.entry("Administration", "Registrar & Central Institutional Administration"),
            Map.entry("Transport", "Campus Transportation Division"),
            Map.entry("Infrastructure", "Civil & Estate Infrastructure Maintenance"),
            Map.entry("Library", "Chief Librarian & Information Resources"),
            Map.entry("Laboratory", "Dean of Research & Lab Infrastructure"),
            Map.entry("Fees", "Finance, Accounts & Bursar's Office"),
            Map.entry("Harassment", "Internal Complaints Committee (ICC) & Gender Equity Cell"),
            Map.entry("Bullying", "Anti-Ragging Committee & Student Welfare Directorate"),
            Map.entry("Safety", "Campus Security, Proctorial Board & Safety Cell"),
            Map.entry("Technology / IT", "Information Technology & Campus Network Center"),
            Map.entry("Other", "General Institutional Grievance Redressal Committee")
    );

    @Override
    public GhostWriterResponse generateProfessionalDocument(GhostWriterGenerateRequest request) {
        String raw = request.getRawDescription() != null ? request.getRawDescription().trim() : "";
        String cat = request.getCategory() != null && !request.getCategory().isBlank() ? request.getCategory() : detectCategory(raw);
        String reporterType = request.getReporterType() != null ? request.getReporterType() : "Institutional Member";
        String targetDept = CATEGORY_DEPARTMENTS.getOrDefault(cat, "Institutional Grievance Committee");

        // Clean & polish raw grievance sentences
        String cleanedRaw = cleanText(raw);
        String subject = formulateTitle(cleanedRaw, cat);
        String summary = formulateExecutiveSummary(cleanedRaw, cat, reporterType);
        String detailed = formulateDetailedDescription(cleanedRaw, request);
        String context = formulateContext(request);
        String impact = formulateImpact(cleanedRaw, cat);
        String action = formulateRequestedAction(cleanedRaw, cat);
        String priority = determinePriority(cleanedRaw, cat);
        String rationale = formulateRationale(priority, cat, cleanedRaw);
        String closing = "Respectfully submitted for expedited administrative consideration and procedural redressal.\n"
                + "Grievance Record Reference: GhostWrite Confidential Verification Framework.";

        List<String> keywords = extractKeywords(cleanedRaw);
        String risk = determineRiskLevel(cleanedRaw, cat);

        return GhostWriterResponse.builder()
                .professionalTitle(subject)
                .executiveSummary(summary)
                .detailedDescription(detailed)
                .relevantContext(context)
                .impact(impact)
                .requestedAction(action)
                .suggestedPriority(priority)
                .suggestedDepartment(targetDept)
                .professionalClosing(closing)
                .priorityReasoning(rationale)
                .extractedKeywords(keywords)
                .estimatedRiskLevel(risk)
                .build();
    }

    @Override
    public AIAnalysisResponse analyzeReport(String rawDescription, String category) {
        String raw = rawDescription != null ? rawDescription.trim() : "";
        String cat = (category != null && !category.isBlank()) ? category : detectCategory(raw);
        String subcat = detectSubcategory(cat, raw);
        String priority = determinePriority(raw, cat);
        String severity = mapPriorityToSeverity(priority);
        String department = CATEGORY_DEPARTMENTS.getOrDefault(cat, "General Administration");
        String rationale = formulateRationale(priority, cat, raw);

        double sentiment = computeSentimentScore(raw);
        String emotion = determineEmotionTone(raw);
        String riskLevel = determineRiskLevel(raw, cat);
        List<String> keywords = extractKeywords(raw);
        List<String> riskFlags = detectRiskFlags(raw, cat);

        return AIAnalysisResponse.builder()
                .predictedCategory(cat)
                .predictedSubcategory(subcat)
                .predictedSeverity(severity)
                .predictedPriority(priority)
                .recommendedDepartment(department)
                .reasoningRationale(rationale)
                .sentimentScore(sentiment)
                .emotionTone(emotion)
                .riskLevel(riskLevel)
                .duplicateConfidence(0.0)
                .extractedKeywords(keywords)
                .riskFlags(riskFlags)
                .aiConfidenceScore(0.94)
                .build();
    }

    @Override
    public double computeSimilarity(String text1, String text2) {
        if (text1 == null || text2 == null) return 0.0;
        Set<String> words1 = Arrays.stream(text1.toLowerCase().split("\\W+"))
                .filter(w -> w.length() > 3)
                .collect(Collectors.toSet());
        Set<String> words2 = Arrays.stream(text2.toLowerCase().split("\\W+"))
                .filter(w -> w.length() > 3)
                .collect(Collectors.toSet());

        if (words1.isEmpty() || words2.isEmpty()) return 0.0;

        Set<String> intersection = new HashSet<>(words1);
        intersection.retainAll(words2);

        Set<String> union = new HashSet<>(words1);
        union.addAll(words2);

        return (double) intersection.size() / union.size();
    }

    private String cleanText(String text) {
        if (text == null) return "";
        return text.replaceAll("\\s+", " ").trim();
    }

    private String formulateTitle(String text, String category) {
        String lower = text.toLowerCase();
        if (lower.contains("water")) return "Formal Representation: Immediate Intervention Required for " + category + " Water Supply and Quality";
        if (lower.contains("wifi") || lower.contains("internet") || lower.contains("network")) return "Urgent Notification: Campus Digital Connectivity Deficiencies in " + category;
        if (lower.contains("food") || lower.contains("mess") || lower.contains("canteen")) return "Grievance Submission: Dietary Hygiene and Food Quality Standards";
        if (lower.contains("exam") || lower.contains("schedule") || lower.contains("date")) return "Administrative Appeal: Scheduling Concerns and Conflict in " + category;
        if (lower.contains("harass") || lower.contains("bully") || lower.contains("threat")) return "Confidential Urgent Petition: Incident of Misconduct and Protection Request";
        if (lower.contains("fee") || lower.contains("fine") || lower.contains("refund")) return "Financial Review Request: Clarification on Institutional Fee Assessment";
        if (lower.contains("bus") || lower.contains("transport") || lower.contains("timing")) return "Logistical Petition: Commute Inefficiencies and Route Reliability";
        return "Formal Grievance: Comprehensive Review of Identified Deficiencies in " + category;
    }

    private String formulateExecutiveSummary(String text, String category, String reporterType) {
        return "This representation is formally submitted on behalf of " + reporterType.toLowerCase()
                + " stakeholders regarding operational and administrative discrepancies identified within the "
                + category + " domain. The concern highlights significant institutional oversights requiring structured remediation to uphold institutional benchmarks.";
    }

    private String formulateDetailedDescription(String text, GhostWriterGenerateRequest request) {
        StringBuilder sb = new StringBuilder();
        sb.append("A formal documentation of the reported condition indicates the following substantive observations:\n\n");
        sb.append("1. Factual Record: \"").append(text).append("\"\n\n");
        sb.append("2. Observational Context: The reporter asserts that conditions described have disrupted normative routines and warrant institutional intervention.\n");
        if (request.getLocation() != null && !request.getLocation().isBlank()) {
            sb.append("3. Specific Locus: Activity occurred at/within ").append(request.getLocation().trim()).append(".\n");
        }
        if (request.getIncidentDate() != null && !request.getIncidentDate().isBlank()) {
            sb.append("4. Relevant Timeline: The recorded sequence of events pertains to dates around ").append(request.getIncidentDate().trim()).append(".\n");
        }
        sb.append("5. Confidentiality Assurance: In accordance with GhostWrite protocols, all reporter identifiers are cryptographically decoupled from this grievance manifest.");
        return sb.toString();
    }

    private String formulateContext(GhostWriterGenerateRequest request) {
        List<String> details = new ArrayList<>();
        if (request.getLocation() != null && !request.getLocation().isBlank()) details.add("Location: " + request.getLocation());
        if (request.getDepartment() != null && !request.getDepartment().isBlank()) details.add("Department: " + request.getDepartment());
        if (request.getIncidentDate() != null && !request.getIncidentDate().isBlank()) details.add("Incident Date: " + request.getIncidentDate());
        if (request.getRelatedAuthority() != null && !request.getRelatedAuthority().isBlank()) details.add("Reported Authority: " + request.getRelatedAuthority());
        if (request.getAdditionalNotes() != null && !request.getAdditionalNotes().isBlank()) details.add("Supplemental Notes: " + request.getAdditionalNotes());

        if (details.isEmpty()) {
            return "No auxiliary contextual parameters were supplied; findings remain grounded strictly in the primary grievance text.";
        }
        return String.join(" | ", details);
    }

    private String formulateImpact(String text, String category) {
        String lower = text.toLowerCase();
        if (lower.contains("harass") || lower.contains("threat") || lower.contains("bully")) {
            return "Impinges upon personal psychological well-being, campus physical safety, and institutional statutory compliance.";
        }
        if (lower.contains("water") || lower.contains("food") || lower.contains("health") || lower.contains("dirty")) {
            return "Presents acute health vulnerabilities and sanitary non-compliance affecting dormitory occupants and campus hygiene.";
        }
        if (lower.contains("exam") || lower.contains("grade") || lower.contains("attendance") || lower.contains("class")) {
            return "Jeopardizes academic progression, student equity, and instructional delivery credibility.";
        }
        return "Adversely affects campus routine, student/staff morale, and institutional operational efficacy.";
    }

    private String formulateRequestedAction(String text, String category) {
        String lower = text.toLowerCase();
        if (lower.contains("harass") || lower.contains("bully")) {
            return "Immediate invocation of confidential inquiry under statutory committee mandates, with interim safety safeguards enacted.";
        }
        if (lower.contains("water") || lower.contains("infrastructure") || lower.contains("clean")) {
            return "Dispatch of an emergency technical maintenance audit followed by structural rehabilitation and water test validation within 24 hours.";
        }
        if (lower.contains("exam") || lower.contains("academic")) {
            return "Convening of the academic review board to evaluate timetable alignment and issue corrective administrative circulars.";
        }
        return "Formal departmental inspection, prompt rectification of cited conditions, and issuance of a progress advisory on the grievance tracking register.";
    }

    private String determinePriority(String text, String category) {
        String lower = text.toLowerCase();
        if (category.equalsIgnoreCase("Harassment") || category.equalsIgnoreCase("Bullying") || category.equalsIgnoreCase("Safety")
                || lower.contains("danger") || lower.contains("threat") || lower.contains("suicide") || lower.contains("assault") || lower.contains("emergency")) {
            return "P1";
        }
        if (lower.contains("water") || lower.contains("health") || lower.contains("electricity") || lower.contains("exam tomorrow") || lower.contains("severe")) {
            return "P2";
        }
        if (lower.contains("delay") || lower.contains("wifi") || lower.contains("ac ") || lower.contains("bus") || lower.contains("library")) {
            return "P3";
        }
        return "P4";
    }

    private String mapPriorityToSeverity(String priority) {
        return switch (priority) {
            case "P1" -> "CRITICAL";
            case "P2" -> "HIGH";
            case "P3" -> "MEDIUM";
            default -> "LOW";
        };
    }

    private String formulateRationale(String priority, String category, String text) {
        return switch (priority) {
            case "P1" -> "High priority (P1) assigned because the report indicates potential statutory risk, personal security concerns, or critical institutional vulnerability in " + category + ". Immediate intervention is recommended within 12 hours.";
            case "P2" -> "Priority P2 designated due to persistent operational disruption or health/academic risk affecting multiple community members in " + category + ". Escalation standard is 24 hours.";
            case "P3" -> "Priority P3 assigned as the report describes functional inconvenience or logistical friction that can be investigated under normal administrative workflows within 3 days.";
            default -> "Priority P4 registered for routine institutional inquiry and administrative enhancement with standard 7-day review SLA.";
        };
    }

    private String determineRiskLevel(String text, String category) {
        String lower = text.toLowerCase();
        if (category.equalsIgnoreCase("Harassment") || category.equalsIgnoreCase("Safety") || lower.contains("abuse") || lower.contains("threat")) return "CRITICAL";
        if (lower.contains("water") || lower.contains("food") || lower.contains("fire") || lower.contains("injury")) return "HIGH";
        if (lower.contains("broken") || lower.contains("poor") || lower.contains("wifi") || lower.contains("fail")) return "MEDIUM";
        return "LOW";
    }

    private double computeSentimentScore(String text) {
        String lower = text.toLowerCase();
        int negativeHits = 0;
        int positiveHits = 0;
        String[] negWords = {"bad", "dirty", "unresolved", "terrible", "harass", "failed", "rude", "poor", "pain", "worst", "broken", "danger", "delay", "threat"};
        String[] posWords = {"resolved", "good", "thank", "kind", "cooperative", "helpful", "prompt"};

        for (String w : negWords) if (lower.contains(w)) negativeHits++;
        for (String w : posWords) if (lower.contains(w)) positiveHits++;

        if (negativeHits == 0 && positiveHits == 0) return -0.15;
        double raw = (positiveHits - negativeHits) / (double) (positiveHits + negativeHits + 1);
        return Math.max(-0.95, Math.min(0.2, raw));
    }

    private String determineEmotionTone(String text) {
        String lower = text.toLowerCase();
        if (lower.contains("threat") || lower.contains("scared") || lower.contains("fear") || lower.contains("urgent")) return "Anxious / Distressed";
        if (lower.contains("repeated") || lower.contains("told many times") || lower.contains("nothing happened") || lower.contains("ignored")) return "Frustrated / Disillusioned";
        if (lower.contains("request") || lower.contains("kindly") || lower.contains("please")) return "Formal / Constructive";
        return "Concerned / Inquisitive";
    }

    private List<String> extractKeywords(String text) {
        Set<String> stopWords = Set.of("the", "and", "is", "in", "it", "to", "of", "for", "with", "on", "at", "by", "this", "that", "from", "they", "we", "i", "are", "was", "were", "been", "have", "has", "had", "very", "many", "times", "not", "but", "nothing", "happened", "some", "our");
        return Arrays.stream(text.toLowerCase().split("[^a-zA-Z0-9]+"))
                .filter(w -> w.length() > 3 && !stopWords.contains(w))
                .distinct()
                .limit(8)
                .collect(Collectors.toList());
    }

    private List<String> detectRiskFlags(String text, String category) {
        List<String> flags = new ArrayList<>();
        String lower = text.toLowerCase();
        if (category.equalsIgnoreCase("Harassment") || lower.contains("harass")) flags.add("STATUTORY_COMPLIANCE_ICC_TRIGGER");
        if (category.equalsIgnoreCase("Bullying") || lower.contains("bully") || lower.contains("ragging")) flags.add("ANTI_RAGGING_MANDATE");
        if (lower.contains("water") || lower.contains("food") || lower.contains("hygiene")) flags.add("CAMPUS_HEALTH_VULNERABILITY");
        if (lower.contains("told many times") || lower.contains("months") || lower.contains("repeated")) flags.add("CHRONIC_UNRESOLVED_GRIEVANCE");
        if (lower.contains("exam") || lower.contains("hall ticket") || lower.contains("grades")) flags.add("ACADEMIC_TIMELINE_CRITICAL");
        if (flags.isEmpty()) flags.add("STANDARD_ADMIN_REVIEW");
        return flags;
    }

    private String detectCategory(String text) {
        String lower = text.toLowerCase();
        if (lower.contains("hostel") || lower.contains("room") || lower.contains("warden") || lower.contains("mess")) return "Hostel";
        if (lower.contains("water") || lower.contains("ac ") || lower.contains("light") || lower.contains("lift") || lower.contains("washroom")) return "Infrastructure";
        if (lower.contains("prof") || lower.contains("teacher") || lower.contains("faculty") || lower.contains("attendance")) return "Faculty";
        if (lower.contains("exam") || lower.contains("mark") || lower.contains("grade") || lower.contains("result")) return "Examination";
        if (lower.contains("wifi") || lower.contains("portal") || lower.contains("internet") || lower.contains("server")) return "Technology / IT";
        if (lower.contains("bus") || lower.contains("cab") || lower.contains("driver")) return "Transport";
        if (lower.contains("harass") || lower.contains("threat")) return "Harassment";
        if (lower.contains("fee") || lower.contains("refund") || lower.contains("scholarship")) return "Fees";
        return "Academic";
    }

    private String detectSubcategory(String category, String text) {
        String lower = text.toLowerCase();
        if (category.equalsIgnoreCase("Hostel")) {
            if (lower.contains("water")) return "Water & Sanitation";
            if (lower.contains("food") || lower.contains("mess")) return "Mess & Catering";
            return "Facility Maintenance";
        }
        if (category.equalsIgnoreCase("Infrastructure")) {
            if (lower.contains("water")) return "Plumbing & Potability";
            if (lower.contains("ac") || lower.contains("power")) return "HVAC & Electrical";
            return "Estate Maintenance";
        }
        if (category.equalsIgnoreCase("Academic")) {
            if (lower.contains("schedule") || lower.contains("calendar")) return "Curriculum Scheduling";
            return "Instructional Quality";
        }
        return "General Operations";
    }
}
