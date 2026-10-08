# GhostWrite 👻✍️
### Anonymous Institutional Issue Reporting & AI-Powered Professional Writing Platform

[![Java](https://img.shields.io/badge/Java-21%20LTS-orange.svg)](https://www.oracle.com/java/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.5-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8-purple.svg)](https://vitejs.dev/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-blue.svg)](https://www.mysql.com/)
[![Security](https://img.shields.io/badge/Security-Zero--Knowledge%20Anonymity-emerald.svg)]()

---

## 🌟 1. Project Overview & Problem Statement

In educational institutions (universities, colleges, and polytechnics), students, researchers, and campus staff frequently observe critical issues:
- **Academic Grievances:** Grading bias, delayed evaluations, thesis supervisor conflicts.
- **Campus Facilities & Safety:** Electrical hazards, contaminated drinking water, unsafe laboratory conditions, broken lighting.
- **Harassment & Misconduct:** Bullying, intimidation, discriminatory practices, extortion.
- **Hostel & Transport Infrastructure:** Substandard dining hall hygiene, non-functioning transport routes, unaddressed maintenance.

### The Problem
Stakeholders hesitate to report these issues because they fear:
1. **Academic & Career Retaliation:** Fear of faculty reprisal, loss of marks, or disciplinary backlash.
2. **Loss of Privacy & Exposure:** Apprehension that their identity will be disclosed to accused parties or peers.
3. **Bureaucratic Frustration:** Raw complaints often sound angry, unstructured, or informal, leading university administration boards to dismiss them without formal investigation.

### The Solution: GhostWrite
**GhostWrite** provides an institutional platform with two core pillars:
1. **Cryptographic Anonymity & Decoupled Architecture:** Strict zero-knowledge submission where student name, email, register number, and device IP are never recorded. Tracking is governed strictly by high-entropy, non-sequential **Report IDs** (`GW-2026-XXXXXX`) and secret **Tracking Tokens** (`TK-XXXX-XXXX-XXXX`).
2. **AI Ghost Writer Engine (Zero-Hallucination):** Transforms raw, unformatted student complaints into authoritative, formal, professional representation dossiers—complete with executive summaries, impact assessments, requested remedial actions, explainable priority assignments, and department routing.

---

## 🚀 2. Key Features

- **7-Step Anonymous Submission Wizard:** Intuitive step-by-step reporting with role selection, category classification, severity rating, location tagging, evidence upload, and live AI Ghost Writer generation.
- **Real-Time Fact-Preserving AI Ghost Writer:** Transforms unstructured input into an official representation letter without ever hallucinating or fabricating facts, names, dates, or accusations.
- **Strict Anonymity Safeguards:** 
  - Zero PII stored with reports.
  - Tracking requires only Report ID + secret Tracking Token.
  - Public IDs are non-sequential.
  - Voluntary contact details are segregated in an isolated emergency contact vault.
- **Two-Way Encrypted Anonymous Chat:** Allows administrators and authorities to ask clarifying questions while keeping the reporter fully anonymous.
- **Automated SLA Escalation Engine:** Background scheduler automatically flags unaddressed high/critical severity grievances past target turnaround times.
- **Intelligent Duplicate Detection & Clustering:** Detects related complaints across campus and links them into recurrent issue clusters (e.g., *"Hostel Block A Water Quality Hazard"*).
- **Multi-Role Governance Portals:**
  - **Central Admin Portal:** Campus-wide KPI analytics, department oversight, priority overrides, audit logging, and formal docket export.
  - **Department Authority Portal:** Department-specific complaint queue, investigation note recording, status updates, and official response publishing.
  - **Ethics Reviewer Portal:** AI moderation queue for approving, editing, or linking AI-generated dossiers before formal institutional routing.
- **Formal Institutional Dossier Export:** Generates printable, high-standard formal representation documents (HTML/PDF) ready for syndicate board presentation.
- **Explainable AI Analytics:** Campus sentiment tracking, risk flag identification, department workload distribution, and automated institutional insights.

---

## 🤖 3. AI Architecture & Configuration

GhostWrite features a pluggable, fault-tolerant AI abstraction architecture (`com.ghostwrite.ai.AIProvider`):

```
                        ┌───────────────────────────────┐
                        │   GhostWriterService Engine   │
                        └──────────────┬────────────────┘
                                       │
                ┌──────────────────────┴──────────────────────┐
                ▼                                             ▼
     ┌───────────────────────┐                    ┌────────────────────────┐
     │   GeminiAIProvider    │                    │     MockAIProvider     │
     │  (Google Gemini API)  │                    │ (Deterministic Heuristic│
     │   gemini-1.5-flash    │                    │     NLP Engine)        │
     └──────────┬────────────┘                    └────────────────────────┘
                │
                ▼ (Automatic Fallback if Key Missing / Network Error)
     ┌───────────────────────┐
     │  Zero Downtime Safety │
     └───────────────────────┘
```

### Supported Modes:

1. **MOCK AI MODE (`AI_PROVIDER=mock`)**
   - Enabled by default when no external API key is provided.
   - Uses local heuristic NLP parsing, deterministic priority scoring, keyword extraction, and sentiment classification.
   - Requires zero external network calls; fully functional offline.

2. **GEMINI AI MODE (`AI_PROVIDER=gemini`)**
   - Uses Google's official Gemini API (`gemini-1.5-flash`).
   - Generates nuanced professional representations with strict JSON schema compliance.
   - Governed by a **Zero-Hallucination System Prompt**: strictly prohibits the generation of unstated names, dates, locations, or allegations.
   - **Safe Fallback:** If `GEMINI_API_KEY` is absent or the API request encounters an issue, the system automatically falls back to `MockAIProvider` without crashing or returning 500 errors.

### AI Configuration & Environment Variables

| Variable | Description | Default | Allowed Values |
|---|---|---|---|
| `AI_PROVIDER` | Active AI provider engine | `mock` | `mock`, `gemini` |
| `GEMINI_API_KEY` | Google Gemini API Key | *(empty)* | Any valid Gemini API key |
| `AI_MODEL` | Gemini LLM Model | `gemini-1.5-flash` | `gemini-1.5-flash`, `gemini-1.5-pro` |

#### Checking AI Engine Status:
Inspect the active AI engine at any time:
```http
GET http://localhost:8080/api/ghostwriter/status
```
Response:
```json
{
  "success": true,
  "data": {
    "providerName": "mock",
    "activeMode": "MOCK_LOCAL_HEURISTICS",
    "isLiveKeyConfigured": false,
    "factPreservationGuard": "ACTIVE",
    "zeroHallucinationPolicy": "ENFORCED"
  }
}
```

---

## 🛡️ 4. Anonymous Privacy & Security Architecture

1. **Decoupled Data Architecture:** The `anonymous_reports` table contains **zero** foreign keys or references to the `users` table.
2. **High-Entropy Identifiers:**
   - Report IDs: Format `GW-2026-XXXXXX` generated via cryptographic random strings.
   - Tracking Tokens: Format `TK-XXXX-XXXX-XXXX` with 128-bit entropy.
3. **Role-Based Access Control (RBAC):**
   - `/api/admin/**` restricted to `ROLE_ADMIN`.
   - `/api/authority/**` restricted to `ROLE_AUTHORITY` and `ROLE_ADMIN`.
   - `/api/reviewer/**` restricted to `ROLE_REVIEWER` and `ROLE_ADMIN`.
   - `/api/reports/anonymous` and `/api/reports/track/**` are public.
4. **Isolated Contact Vault:** Optional emergency contact details (phone/email) are stored in `reporter_isolated_contacts`, physically segregated from report content and inaccessible during routine administrative reviews.
5. **Printable Document Anonymity:** Formal representation dossiers (`/api/documents/{id}/view`) never contain submitter IP, user ID, or contact details.

---

## 🏗️ 5. System Architecture & Tech Stack

```
┌────────────────────────────────────────────────────────┐
│                   Vite + React 19                      │
│   (Institutional Dark SaaS UI, Lucide, Axios)          │
│   Port 5173                                            │
└───────────────────────────┬────────────────────────────┘
                            │ REST / JSON (JWT Auth)
┌───────────────────────────▼────────────────────────────┐
│              Spring Boot 3.2.5 Backend                 │
│   - Security & JWT Auth Filter                         │
│   - GhostWriterService (Pluggable Gemini / Mock AI)    │
│   - Audit Logging & SLA Escalation Scheduler           │
│   Port 8080                                            │
└───────────────────────────┬────────────────────────────┘
                            │ JPA / Hibernate
┌───────────────────────────▼────────────────────────────┐
│                    MySQL 8.0 Database                  │
│   - 12 Relational Tables with Indexes & Foreign Keys  │
│   Port 3306 (ghostwrite_db)                            │
└────────────────────────────────────────────────────────┘
```

### Technology Matrix
- **Backend:** Java 21 LTS, Spring Boot 3.2.5, Spring Security 6, Spring Data JPA, Jackson, Lombok.
- **Frontend:** React 19, Vite 8, React Router v7, Lucide React, Vanilla CSS3 Design Tokens.
- **Database:** MySQL 8.0, HikariCP Connection Pool.
- **Testing:** JUnit 5, Mockito, PowerShell Integration Suite (`test_e2e.ps1`).

---

## 🔑 6. Demo Credentials

| Role | Email | Password | Assigned Department |
|---|---|---|---|
| **Chief Administrator** | `admin@ghostwrite.com` | `GhostWrite@2026` | Central Institutional Administration |
| **Department Authority** | `authority@ghostwrite.com` | `GhostWrite@2026` | Hostel Administration & Estate Office |
| **Ethics Reviewer** | `reviewer@ghostwrite.com` | `GhostWrite@2026` | Institutional Grievance Cell |

> The application seeds 20+ realistic grievances, issue clusters, activity timelines, and metrics automatically on first launch.

---

## 📡 7. Comprehensive API Reference

### Public Anonymous Endpoints
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/reports/anonymous` | Submit a new anonymous grievance |
| `GET` | `/api/reports/track/{reportId}?token={token}` | Track report status with secret token |
| `POST` | `/api/reports/{reportId}/messages` | Send anonymous chat message (requires token) |
| `GET` | `/api/reports/{reportId}/messages?token={token}` | Fetch anonymous chat thread |
| `POST` | `/api/ghostwriter/generate` | Real-time AI professional representation generation |
| `GET` | `/api/ghostwriter/status` | Inspect active AI engine and security guard status |
| `GET` | `/api/clusters` | List top recurring campus issue clusters |
| `GET` | `/api/documents/{reportId}/view` | View and print formal institutional dossier |

### Central Admin Endpoints (`ROLE_ADMIN`)
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/login` | Authenticate administrative staff |
| `GET` | `/api/admin/dashboard` | Campus KPI statistics and metrics |
| `GET` | `/api/admin/reports` | Paginated grievance search with multi-filter |
| `GET` | `/api/admin/reports/{id}` | Complete grievance dossier details |
| `PUT` | `/api/admin/reports/{id}/status` | Update grievance status |
| `PUT` | `/api/admin/reports/{id}/priority` | Update priority level (P1-P4) |
| `POST` | `/api/admin/reports/{id}/assign` | Reassign grievance to department |
| `POST` | `/api/admin/reports/{id}/escalate` | Manually escalate grievance |
| `GET` | `/api/admin/audit-logs` | Retrieve institutional tamper-evident audit logs |

### Department Authority Endpoints (`ROLE_AUTHORITY`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/authority/reports` | Department-filtered grievance queue |
| `GET` | `/api/authority/reports/{id}` | Inspect assigned grievance dossier |
| `POST` | `/api/authority/reports/{id}/response` | Post official departmental resolution response |
| `PUT` | `/api/authority/reports/{id}/status` | Advance department investigation status |

### Ethics Reviewer Endpoints (`ROLE_REVIEWER`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/reviewer/pending` | Moderation queue for pending grievances |
| `GET` | `/api/reviewer/reports/{id}` | Inspect full dossier before endorsement |
| `POST` | `/api/reviewer/{id}/action` | Execute action (`APPROVE`, `EDIT`, `REJECT`, `MARK_DUPLICATE`) |

### Institutional Analytics & AI Insights
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/analytics/overview` | Institutional breakdown by department, category, and severity |
| `GET` | `/api/analytics/trends` | Time-series grievance inflow and resolution rates |
| `GET` | `/api/analytics/insights` | Explainable AI institutional pattern insights |

---

## 💻 8. Setup & Execution Instructions

### Prerequisites
- **Java:** JDK 21 LTS installed and on `PATH`
- **Node.js:** Node.js v18+ and npm installed
- **MySQL:** MySQL Server 8.0 running on localhost:3306

### Step 1: Database Setup
Create the MySQL database:
```sql
CREATE DATABASE IF NOT EXISTS ghostwrite_db;
```
*(Hibernate automatically validates and initializes all tables and seed records).*

### Step 2: Configure Environment (Optional)
Copy `.env.example` to `.env` or set system environment variables:
```bash
# To enable Google Gemini AI:
export AI_PROVIDER=gemini
export GEMINI_API_KEY="your-gemini-api-key-here"

# To run offline / local mock AI (Default):
export AI_PROVIDER=mock
```

### Step 3: Run Backend
```bash
cd backend
mvn clean test        # Run automated test suite
mvn spring-boot:run   # Start Spring Boot on port 8080
```

### Step 4: Run Frontend
```bash
cd frontend
npm install
npm run build         # Validate production bundle
npm run dev           # Start Vite development server on port 5173
```

Access the application in your browser at:
👉 **`http://localhost:5173/`**

---

## 🧪 9. Automated Testing & Verification

### 1. Backend Unit & Fallback Tests
```bash
cd backend
mvn test
```
*Executes Spring context loading, factual preservation validation, and Gemini fallback verification.*

### 2. Frontend Production Build
```bash
cd frontend
npm run build
```
*Validates JSX syntax, React components, CSS stylesheets, and bundling with zero warnings.*

### 3. Comprehensive End-to-End Verification Suite
GhostWrite includes a 12-step PowerShell end-to-end integration test runner:
```powershell
powershell -ExecutionPolicy Bypass -File test_e2e.ps1
```

**Verification Steps Covered:**
1. Frontend HTTP 200 Availability
2. AI Engine Status & Fact-Preserving Ghost Writer Generation
3. Anonymous Report Submission (Non-sequential ID + Token generation)
4. Secret Token Progress Tracking & Zero-PII Verification
5. Security Audit: Invalid Tracking Token Rejection
6. Encrypted Two-Way Anonymous Chat
7. Admin Login, JWT Authentication & Governance KPIs
8. Department Authority Login, Assigned Queue & Resolution Submission
9. Ethics Reviewer Login, Moderation Queue & Dossier Approval
10. Explainable AI Institutional Pattern Insights
11. Formal Document Export & Zero-Leakage Privacy Check
12. Security Audit: Role-Based Boundary Enforcement (HTTP 401/403)

---

## 📁 10. Repository File Structure

```
ghost/
├── backend/
│   ├── pom.xml
│   └── src/
│       ├── main/java/com/ghostwrite/
│       │   ├── GhostWriteApplication.java
│       │   ├── ai/                      # AIProvider, MockAIProvider, GeminiAIProvider, LLMProvider
│       │   ├── config/                  # DataInitializer, WebConfig
│       │   ├── controller/              # 13 REST Controllers
│       │   ├── dto/                     # Request & Response DTOs
│       │   ├── entity/                  # 14 JPA Entities & Enums
│       │   ├── exception/               # GlobalExceptionHandler, ErrorDetails
│       │   ├── repository/              # 13 Spring Data Repositories
│       │   ├── security/                # JWT Filter, TokenProvider, SecurityConfig
│       │   └── service/                 # Business logic, SLA escalation, Analytics
│       ├── main/resources/
│       │   └── application.properties   # Database, JWT, and AI Configuration
│       └── test/java/com/ghostwrite/    # JUnit 5 & Mockito test suite
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   └── src/
│       ├── api.js                       # Axios with JWT interceptor
│       ├── index.css                    # Professional Dark SaaS Design System
│       ├── App.jsx                      # App orchestration and routing
│       ├── context/                     # AuthContext for role state
│       ├── components/                  # Navbar, Footer, Sidebar, ChatBox
│       └── pages/                       # 14 Institutional Pages
├── postman_collection.json              # Complete Postman collection
├── schema.sql                           # Full MySQL DDL schema
├── test_e2e.ps1                         # 12-step E2E integration test suite
└── README.md                            # Comprehensive project guide
```

---

## 🔮 11. Future Roadmap

- 📱 Progressive Web App (PWA) with offline draft mode for areas with poor connectivity.
- 🎙️ Multilingual Voice-to-Text reporting in regional languages (Tamil, Hindi, Telugu, Marathi).
- 🔔 Real-time WebSocket notifications for instant authority chat responses.
- 🔗 Zero-Knowledge Proof (ZKP) cryptographic proofs for verifiable grievance logging.
- 🗺️ Interactive campus GIS heatmap for physical infrastructure and safety audits.

---

*GhostWrite is engineered for secure, ethical, and transparent institutional governance.*
