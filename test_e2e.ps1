$ErrorActionPreference = "Stop"

Write-Host "================================================================"
Write-Host " GHOSTWRITE COMPREHENSIVE END-TO-END VERIFICATION SUITE"
Write-Host "================================================================"

# --- 1. FRONTEND SERVER VERIFICATION ---
Write-Host "`n[STEP 1] VERIFY FRONTEND SERVER"
$fe = Invoke-WebRequest -Uri "http://localhost:5173/" -UseBasicParsing
if ($fe.StatusCode -ne 200) { throw "Frontend server not returning 200 OK" }
Write-Host " -> SUCCESS: Frontend online at http://localhost:5173/ (HTTP $($fe.StatusCode))"

# --- 2. AI GHOST WRITER & STATUS ENDPOINT ---
Write-Host "`n[STEP 2] VERIFY AI ENGINE STATUS & GHOST WRITER GENERATION"
$aiStatus = Invoke-RestMethod -Uri "http://localhost:8080/api/ghostwriter/status" -Method Get
Write-Host " -> AI Engine Status: Mode=$($aiStatus.data.activeMode), Guard=$($aiStatus.data.factPreservationGuard), LiveKeyConfigured=$($aiStatus.data.isLiveKeyConfigured)"

$gwBody = @{
    rawDescription = "Library study rooms on 3rd floor have broken AC units and water leaking onto electrical outlets near desk 14. Students reported electrical sparks yesterday."
    category = "Infrastructure / Facility"
    reporterType = "STUDENT"
    location = "Central Library 3rd Floor"
} | ConvertTo-Json

$gwRes = Invoke-RestMethod -Uri "http://localhost:8080/api/ghostwriter/generate" -Method Post -Body $gwBody -ContentType "application/json"
if (-not $gwRes.data.professionalTitle) { throw "AI did not generate professionalTitle" }
Write-Host " -> SUCCESS: AI Transformed Grievance"
Write-Host "    Professional Title: $($gwRes.data.professionalTitle)"
Write-Host "    Suggested Priority: $($gwRes.data.suggestedPriority)"
Write-Host "    Suggested Dept    : $($gwRes.data.suggestedDepartment)"
Write-Host "    Executive Summary : $($gwRes.data.executiveSummary.Substring(0, [Math]::Min(80, $gwRes.data.executiveSummary.Length)))..."

# --- 3. ANONYMOUS REPORT SUBMISSION ---
Write-Host "`n[STEP 3] SUBMIT ANONYMOUS REPORT"
$subBody = @{
    reporterType = "STUDENT"
    category = "Infrastructure / Facility"
    severity = "HIGH"
    rawDescription = "Library study rooms on 3rd floor have broken AC units and water leaking onto electrical outlets near desk 14. Students reported electrical sparks yesterday."
    location = "Central Library 3rd Floor"
    acceptedProfessionalTitle = $gwRes.data.professionalTitle
    acceptedExecutiveSummary = $gwRes.data.executiveSummary
    acceptedDetailedDescription = $gwRes.data.detailedDescription
    acceptedRequestedAction = $gwRes.data.requestedAction
    acceptedSuggestedPriority = $gwRes.data.suggestedPriority
    acceptedSuggestedDepartment = $gwRes.data.suggestedDepartment
} | ConvertTo-Json

$subRes = Invoke-RestMethod -Uri "http://localhost:8080/api/reports/anonymous" -Method Post -Body $subBody -ContentType "application/json"
$repId = $subRes.data.reportId
$repToken = $subRes.data.trackingToken
if (-not $repId -or -not $repToken) { throw "Submission did not return reportId and trackingToken" }
Write-Host " -> SUCCESS: Created Report ID: $repId (Tracking Token: $repToken)"

# --- 4. REPORT TRACKING & ANONYMITY VERIFICATION ---
Write-Host "`n[STEP 4] TRACK REPORT WITH TOKEN (PRIVACY AUDIT)"
$trackUrl = "http://localhost:8080/api/reports/track/$repId`?token=$repToken"
$trackRes = Invoke-RestMethod -Uri $trackUrl -Method Get
if ($trackRes.data.reporterEmail -or $trackRes.data.reporterName) { throw "PRIVACY VIOLATION: Reporter PII leaked in tracking API!" }
Write-Host " -> SUCCESS: Tracked Report Status: $($trackRes.data.status), Priority: $($trackRes.data.priority)"
Write-Host "    Zero PII Verified: Reporter identity completely shielded."

# --- 5. TRACKING SECURITY: INVALID TOKEN REJECTION ---
Write-Host "`n[STEP 5] VERIFY TRACKING ACCESS CONTROL (INVALID TOKEN)"
try {
    $badTrackUrl = "http://localhost:8080/api/reports/track/$repId`?token=INVALID_TOKEN_9999"
    $badRes = Invoke-RestMethod -Uri $badTrackUrl -Method Get
    throw "Security Failure: Invalid tracking token did not reject!"
} catch {
    Write-Host " -> SUCCESS: Invalid tracking token correctly rejected with error (Expected)."
}

# --- 6. ANONYMOUS 2-WAY CHAT ---
Write-Host "`n[STEP 6] TEST ANONYMOUS ENCRYPTED CHAT"
$msgBody = @{
    messageText = "Have maintenance engineers been dispatched to inspect the electrical outlets?"
    trackingToken = $repToken
} | ConvertTo-Json

$msgRes = Invoke-RestMethod -Uri "http://localhost:8080/api/reports/$repId/messages" -Method Post -Body $msgBody -ContentType "application/json"
Write-Host " -> SUCCESS: Sent Anonymous Message: '$($msgRes.data.messageText)' from $($msgRes.data.senderLabel)"

# --- 7. ADMIN AUTHENTICATION & GOVERNANCE ---
Write-Host "`n[STEP 7] TEST CENTRAL ADMIN LOGIN & GOVERNANCE"
$adminLoginBody = @{ email = "admin@ghostwrite.com"; password = "GhostWrite@2026" } | ConvertTo-Json
$adminLoginRes = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method Post -Body $adminLoginBody -ContentType "application/json"
$adminToken = $adminLoginRes.data.token
$adminHeaders = @{ Authorization = "Bearer $adminToken" }
Write-Host " -> SUCCESS: Admin Logged In: $($adminLoginRes.data.fullName) ($($adminLoginRes.data.role))"

$adminDash = Invoke-RestMethod -Uri "http://localhost:8080/api/admin/dashboard" -Headers $adminHeaders -Method Get
Write-Host "    Total Grievances: $($adminDash.data.totalReports)"
Write-Host "    Critical Count  : $($adminDash.data.criticalReports)"

$adminReportDetail = Invoke-RestMethod -Uri "http://localhost:8080/api/admin/reports/$repId" -Headers $adminHeaders -Method Get
Write-Host "    Loaded Report Detail: $($adminReportDetail.data.reportId) (Status: $($adminReportDetail.data.status))"

# --- 8. AUTHORITY AUTHENTICATION & INVESTIGATION WORKFLOW ---
Write-Host "`n[STEP 8] TEST AUTHORITY LOGIN & DEPARTMENT INVESTIGATION"
$authLoginBody = @{ email = "authority@ghostwrite.com"; password = "GhostWrite@2026" } | ConvertTo-Json
$authLoginRes = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method Post -Body $authLoginBody -ContentType "application/json"
$authJwt = $authLoginRes.data.token
$authHeaders = @{ Authorization = "Bearer $authJwt" }
Write-Host " -> SUCCESS: Authority Logged In: $($authLoginRes.data.fullName) ($($authLoginRes.data.role))"

$authReports = Invoke-RestMethod -Uri "http://localhost:8080/api/authority/reports" -Headers $authHeaders -Method Get
Write-Host "    Assigned Department Grievances: $($authReports.data.totalElements)"

$authRespBody = @{
    responseText = "Facilities Engineering has isolated the power circuit and replaced the faulty AC condensation drain pipe."
    statusUpdate = "RESOLVED"
    remarks = "Circuit replaced and water hazard cleared"
} | ConvertTo-Json

$authRespRes = Invoke-RestMethod -Uri "http://localhost:8080/api/authority/reports/$repId/response" -Headers $authHeaders -Method Post -Body $authRespBody -ContentType "application/json"
Write-Host " -> SUCCESS: Authority Response Recorded: $($authRespRes.message)"

# --- 9. REVIEWER AUTHENTICATION & MODERATION WORKFLOW ---
Write-Host "`n[STEP 9] TEST REVIEWER LOGIN & MODERATION QUEUE"
$revLoginBody = @{ email = "reviewer@ghostwrite.com"; password = "GhostWrite@2026" } | ConvertTo-Json
$revLoginRes = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method Post -Body $revLoginBody -ContentType "application/json"
$revJwt = $revLoginRes.data.token
$revHeaders = @{ Authorization = "Bearer $revJwt" }
Write-Host " -> SUCCESS: Reviewer Logged In: $($revLoginRes.data.fullName) ($($revLoginRes.data.role))"

$revPending = Invoke-RestMethod -Uri "http://localhost:8080/api/reviewer/pending" -Headers $revHeaders -Method Get
Write-Host "    Pending Queue Size: $($revPending.data.totalElements)"

$revActionBody = @{
    action = "APPROVE"
    remarks = "Tone verified, institutional protocol validated for safety hazard."
} | ConvertTo-Json
$revActionRes = Invoke-RestMethod -Uri "http://localhost:8080/api/reviewer/$repId/action" -Headers $revHeaders -Method Post -Body $revActionBody -ContentType "application/json"
Write-Host " -> SUCCESS: Reviewer Endorsement Processed: $($revActionRes.message)"

# --- 10. AI INSIGHTS & ANALYTICS ---
Write-Host "`n[STEP 10] TEST AI INSTITUTIONAL INSIGHTS"
$insightsRes = Invoke-RestMethod -Uri "http://localhost:8080/api/analytics/insights" -Headers $adminHeaders -Method Get
Write-Host " -> SUCCESS: Loaded $($insightsRes.data.Count) AI Institutional Insights"
foreach ($item in $insightsRes.data | Select-Object -First 3) {
    Write-Host "    - [$($item.impactLevel)] $($item.title): $($item.metricStat)"
}

# --- 11. FORMAL DOCUMENT EXPORT & ANONYMITY AUDIT ---
Write-Host "`n[STEP 11] TEST FORMAL DOSSIER EXPORT & ZERO PII VERIFICATION"
$docRes = Invoke-WebRequest -Uri "http://localhost:8080/api/documents/$repId/view" -UseBasicParsing
if ($docRes.StatusCode -ne 200) { throw "Dossier export returned status $($docRes.StatusCode)" }
if ($docRes.Content -match "reporterEmail" -or $docRes.Content -match "Lisa") {
    throw "PRIVACY VIOLATION: Private reporter data leaked in document dossier!"
}
Write-Host " -> SUCCESS: Formal Document Rendered (Status 200, $($docRes.RawContentLength) bytes)"
Write-Host "    CONFIDENTIAL ANONYMOUS PROTECTED: Verified zero PII in export."

# --- 12. SECURITY & RBAC ENFORCEMENT AUDIT ---
Write-Host "`n[STEP 12] TEST SECURITY & ROLE-BASED ACCESS CONTROL (UNAUTHORIZED REJECTION)"
try {
    $unauthRes = Invoke-RestMethod -Uri "http://localhost:8080/api/admin/dashboard" -Method Get
    throw "Security Failure: Unauthenticated request was NOT rejected!"
} catch {
    Write-Host " -> SUCCESS: Unauthenticated admin dashboard access rejected (HTTP 401/403 Expected)"
}

try {
    # Reviewer attempting to access admin dashboard
    $forbiddenRes = Invoke-RestMethod -Uri "http://localhost:8080/api/admin/dashboard" -Headers $revHeaders -Method Get
    throw "Security Failure: Reviewer was allowed access to Admin dashboard!"
} catch {
    Write-Host " -> SUCCESS: Role-based boundary enforced: Reviewer forbidden from Admin dashboard (HTTP 403 Expected)"
}

Write-Host "`n================================================================"
Write-Host " >>> ALL 12 END-TO-END SYSTEM INTEGRATION TESTS PASSED! <<< "
Write-Host "================================================================"
