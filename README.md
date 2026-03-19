# 36-red-teaming

# 36-red-teaming

<!-- Placeholders: 36-red-teaming = project folder name (e.g., "37-data-model", "48-eva-veritas") -->

**Template Version**: v5.0.0 (Session 44 - Governance Template Consolidation)  
**Part of EVA Foundry Workspace** | [Data Model](https://msub-eva-data-model.victoriousgrass-30debbd3.canadacentral.azurecontainerapps.io/model/projects/36-red-teaming) | [Veritas Audit](#veritas-audit)  
**Workspace Skills**: @sprint-advance | @progress-report | @gap-report | @sprint-report | @veritas-expert

---

## EVA Quick Links

| Resource | Link |
|----------|------|
| **Project Record** | `GET https://msub-eva-data-model.victoriousgrass-30debbd3.canadacentral.azurecontainerapps.io/model/projects/36-red-teaming` |
| **Live Session Data** | `GET .../model/project_work/?project_id=36-red-teaming&$orderby=id%20desc&$limit=10` |
| **Veritas Audit** | Run `audit_repo` MCP tool on `C:\eva-foundry\36-red-teaming` |
| **Trust Score** | Run `get_trust_score` MCP tool on `C:\eva-foundry\36-red-teaming` |
| **Sync to Model** | Run `sync_repo` MCP tool (full paperless DPDCA audit + write-back) |
| **Governance** | [PLAN.md](./PLAN.md) \| [STATUS.md](./STATUS.md) \| [ACCEPTANCE.md](./ACCEPTANCE.md) |
| **Instructions** | [.github/copilot-instructions.md](./.github/copilot-instructions.md) |

---


**Template Version**: v5.0.0 (Session 44 - Governance Template Consolidation)  
**Part of EVA Foundry Workspace** | [Data Model](https://msub-eva-data-model.victoriousgrass-30debbd3.canadacentral.azurecontainerapps.io/model/projects/36-red-teaming) | [Veritas Audit](#veritas-audit)  
**Workspace Skills**: @sprint-advance | @progress-report | @gap-report | @sprint-report | @veritas-expert

---

## EVA Quick Links

| Resource | Link |
|----------|------|
| **Project Record** | `GET https://msub-eva-data-model.victoriousgrass-30debbd3.canadacentral.azurecontainerapps.io/model/projects/36-red-teaming` |
| **Live Session Data** | `GET .../model/project_work/?project_id=36-red-teaming&$orderby=id%20desc&$limit=10` |
| **Veritas Audit** | Run `audit_repo` MCP tool on `C:\eva-foundry\36-red-teaming` |
| **Trust Score** | Run `get_trust_score` MCP tool on `C:\eva-foundry\36-red-teaming` |
| **Sync to Model** | Run `sync_repo` MCP tool (full paperless DPDCA audit + write-back) |
| **Governance** | [PLAN.md](./PLAN.md) \| [STATUS.md](./STATUS.md) \| [ACCEPTANCE.md](./ACCEPTANCE.md) |
| **Instructions** | [.github/copilot-instructions.md](./.github/copilot-instructions.md) |

---

## Purpose

**AI Security Observatory: LLM Vulnerability Scanning & Red Teaming using Promptfoo**

Project 36 provides automated security testing and vulnerability detection for AI-powered systems, with dual value streams:

### Standalone Value
- **For EVA/AI Answers**: Black-box red teaming harness producing ATO-ready evidence packs  
- **For AICOE**: Continuous AI security testing integrated into CI/CD pipelines  
- **For Compliance**: Pre-audited security evidence mapped to ITSG-33, NIST AI RMF, SOC 2, HIPAA

### Integrated Value (Project 58 CyberSec Factory)
- **Security Observatory Component**: One scanner among many (Nmap, Nessus, Azure Defender + AI Scanner)  
- **Unified Risk Model**: Traditional CVSS scores + LLM-specific risk scores ? combined Pareto ranking  
- **Cross-Domain Correlation**: "CVE-2024-1234 on host X enables prompt injection on AI backend Y"

---

## What ItSolves

### Problem
Traditional security tools (Nessus, Burp Suite, OWASP ZAP) detect infrastructure vulnerabilities (SQL injection, XSS, auth bypass) but **cannot test AI-specific attack vectors**:
- Prompt injection (direct and indirect)
- Jailbreaks and guardrail bypasses  
- PII and sensitive data leakage  
- Hallucinations and misinformation  
- Tool misuse and excessive agency  
- Model-specific biases and harmful content generation

**Impact**: AI systems deployed with hidden vulnerabilities ? compliance failures, data breaches, reputational damage

### Solution: Promptfoo-Powered Red Teaming
- **Comprehensive Coverage**: 50+ AI vulnerability types (MITRE ATLAS, OWASP LLM Top 10)  
- **Battle-Tested**: 300K+ user community, used by OpenAI, Anthropic, Fortune 500  
- **Evidence-Driven**: ATO-ready evidence packs with framework mapping (ATLAS ? OWASP ? NIST ? ITSG-33)  
- **CI/CD Native**: PR gate (smoke tests) + nightly regression + scheduled deep scans  
- **Black-Box Testing**: No model access required - tests AI systems via HTTP API (production-safe)

---

## Architecture

### 5-Layer Stack

#### Layer 1: Promptfoo Engine Core
- **Technology**: promptfoo npm package (`promptfoo@^0.100.0`)
- **Components**: CLI, YAML config system, built-in red team plugins, dashboard, evidence generation
- **Decision**: Use as-is, customize via providers + assertions

#### Layer 2: EVA Integration Layer
- **HTTP Provider** (`eval/promptfoo/providers/eva-answers-http.js`):
  - Endpoint: `POST /api/query` to EVA/AI Answers backends
  - Auth: Bearer token (Azure AD)  
  - Request/response mapping, error handling, retries
- **MCP Provider** (`eval/promptfoo/providers/eva-mcp.js`):
  - Connect to MCP servers (tools, agents), context injection testing, tool misuse detection
- **Custom Assertions** (`eval/promptfoo/assertions/eva-assertions.js`):
  - Bilingual validation (EN/FR), citation format checking (EVA-specific), toxicity scoring (Canadian cultural context), PII detection (SIN, passport, health numbers)

#### Layer 3: Framework Mapping Engine
- **Crosswalk Database** (`eval/promptfoo/mappings/framework-crosswalk.json`):
  ```json
  {
    "promptfoo_plugin": "harmful:hate",
    "mappings": {
      "mitre_atlas": ["AML.T0051.000 - LLM Prompt Injection"],
      "owasp_llm": ["LLM01 - Prompt Injection"],
      "nist_ai_rmf": ["GOVERN-1.2 - Harmful content risks"],
      "itsg33": ["SI-10 - Information Input Validation"],
      "compliance": ["SOC2-CC6.1 - Logical access controls"]
    },
    "severity_mapping": {
      "cvss_equivalent": 7.5,
      "risk_score": 8.2
    }
  }
  ```
- **Evidence Transformer** (`eval/promptfoo/lib/evidence-generator.js`):
  - Input: promptfoo test results (JSON)
  - Output: ATO evidence pack (manifest.json + logs + screenshots + compliance matrix)

#### Layer 4: Test Suite Library
```
eval/promptfoo/suites/
  smoke.yaml                    # 10-20 tests, PR gate, <2min, blocking
  golden.yaml                   # 30-100 tests, nightly regression, non-blocking
  atlas/
    AML.TA0007-defense-evasion.yaml    # Injection, jailbreak, obfuscation (15-30 tests)
    AML.TA0008-discovery.yaml          # System prompt probing, boundary inference (10-20 tests)
    AML.TA0010-exfiltration.yaml       # PII leaks, context extraction (15-30 tests)
    AML.TA0002-reconnaissance.yaml     # Model fingerprinting (Phase 2)
    AML.TA0004-initial-access.yaml     # Auth bypass via prompt (Phase 2)
  owasp/
    LLM01-prompt-injection.yaml
    LLM02-insecure-output-handling.yaml
    LLM06-sensitive-information-disclosure.yaml
    LLM08-excessive-agency.yaml        # Tool misuse, over-privileged actions
  compliance/
    itsg33-si-controls.yaml            # Input validation, output encoding
    hipaa-phi-leakage.yaml             # Healthcare-specific PII
    pci-dss-cardholder-data.yaml       # Payment card data exposure
```

**Coverage Targets**:
- **Phase 1 (MVP)**: 3 ATLAS tactics, 5 OWASP risks = ~60 tests
- **Phase 2**: 6 ATLAS tactics, 10 OWASP risks, 2 compliance suites = ~150 tests  
- **Phase 3**: Full 16 ATLAS tactics, compliance automation = ~300 tests

#### Layer 5: Observatory Integration (Project 58)
- **Scanner Adapter** (`observatory/scanners/promptfoo-adapter.js`):
  - Input: promptfoo evidence pack  
  - Output: Normalized vulnerability object (VulnSchema v1.0)  
  - Fields: `id, severity, cvss_equivalent, atlas_tactic, owasp_category, remediation, confidence`
- **Risk Aggregator** (`observatory/analyzer/risk-aggregator.js`):
  - Combine traditional vulns + LLM vulns  
  - Unified scoring: `risk_score = base_severity ? exploitability ? asset_criticality ? confidence`  
  - Pareto ranking: Sort by risk_score, mark top 20%
- **Dashboard Widgets** (Project 58 Synthesizer/Publisher):
  - "Top LLM Risks" (Pareto top 20%)
  - "ATLAS Tactic Heatmap" (16 tactics ? severity)
  - "Compliance Gap Report" (ITSG-33 controls mapped to findings)

---

## End-to-End Data Flow

```
1. Developer commits code ? GitHub PR
2. CI workflow triggers: `npm run test:smoke`
3. Promptfoo runs 10-20 tests against EVA dev environment (black-box HTTP API testing)
4. Results ? evidence generator ? JSON evidence + logs
5. Framework mapper ? ATLAS + OWASP + NIST + ITSG-33 tags applied
6. Assertion failures ? PR comment (block if critical findings)
7. [Pass] PR approved ? merge  
8. [Nightly] Full suite (60-150 tests) runs ? evidence pack ? Cosmos DB (L31-evidence, L45-verification_records)
9. [Project 58 Observatory] Fetches LLM vulns from L31-evidence layer
10. [Analyzer] Merges with Nessus/Defender findings ? unified Pareto ranking
11. [Synthesizer] Generates remediation roadmap (top 20% only)
12. [Publisher] Dashboard + PDF report + alert notifications + ticketing integration
```

---

## Framework Coverage

| Security Framework | Role | Coverage |
|--------------------|------|----------|
| **MITRE ATLAS** | AI threat modeling | 16 tactics, 155 techniques (Phase 3), 3 tactics (Phase 1 MVP) |
| **OWASP LLM Top 10 (2025)** | LLM app vulnerabilities | 10 critical risks, part of GenAI Security Project |
| **NIST AI RMF** | Risk governance | Map-Measure-Manage-Govern, Generative AI Profile (2024) |
| **ITSG-33** | Canadian gov security baseline | Input validation (SI), access control (AC), integrity (SC) |
| **EU AI Act** | Regulatory compliance | High-risk AI requirements |
| **SOC 2 Type II** | SaaS security controls | CC6.1 (logical access), CC7.2 (change management) |
| **HIPAA** | Healthcare data protection | PHI leakage detection, encryption, audit logging |
| **PCI-DSS** | Payment card security | Cardholder data exposure, secure transmission |

### Framework Alignment Matrix (Sample)

| Promptfoo Plugin | MITRE ATLAS | OWASP LLM v3 | NIST AI RMF | ITSG-33 | Compliance |
|------------------|-------------|--------------|-------------|---------|------------|
| harmful:hate | AML.T0051.000 | LLM01 | GOVERN-1.2 | SI-10 | SOC2-CC6.1 |
| pii | AML.T0024.000 | LLM06 | MAP-2.3 | SC-28 | GDPR Art.32 |
| prompt-injection | AML.T0051.002 | LLM01 | MEASURE-2.7 | SI-10 | SOC2-CC7.2 |
| jailbreak | AML.T0054.000 | LLM01 | MANAGE-4.2 | AC-3 | NIST-800-53-AC-3 |
| excessive-agency | AML.T0057.000 | LLM08 | MANAGE-2.3 | CM-5 | SOC2-CC8.1 |

**Full matrix available in**: `eval/promptfoo/mappings/framework-crosswalk.json` (~50 mappings)

---

## Project Structure

```
36-red-teaming/
??? README.md                   # This file
??? PLAN.md                     # Features, stories, WBS (veritas-normalized)
??? STATUS.md                   # Session log, metrics, current state
??? ACCEPTANCE.md               # Quality gates, sprint advance criteria
??? .github/
?   ??? copilot-instructions.md # Project-specific agent guidance
?   ??? workflows/
?       ??? redteam-smoke.yml   # PR gate (smoke suite, blocking)
?       ??? redteam-nightly.yml # Nightly full suite
??? eval/
?   ??? promptfoo/
?       ??? package.json        # Node.js dependencies (promptfoo, vitest)
?       ??? suites/             # YAML test configurations
?       ?   ??? smoke.yaml
?       ?   ??? golden.yaml
?       ?   ??? atlas/          # MITRE ATLAS tactic-based suites
?       ?   ??? owasp/          # OWASP LLM Top 10 suites
?       ?   ??? compliance/     # ITSG-33, HIPAA, PCI-DSS suites
?       ??? providers/          # Custom promptfoo providers
?       ?   ??? eva-answers-http.js
?       ?   ??? eva-mcp.js
?       ??? assertions/         # Custom assertion logic
?       ?   ??? eva-assertions.js
?       ??? mappings/           # Framework crosswalk database
?       ?   ??? framework-crosswalk.json
?       ??? lib/
?           ??? evidence-generator.js
??? observatory/                # Project 58 integration layer
?   ??? scanners/
?   ?   ??? promptfoo-adapter.js
?   ??? analyzer/
?       ??? risk-aggregator.js
??? evidence/                   # Test outputs (gitignored)
??? logs/                       # Timestamped logs (gitignored)
??? .eva/
    ??? veritas-plan.json       # MTI audit cache
    ??? veritas-results.json    # Latest audit results
```

---

## Quick Start

### Prerequisites
- Node.js ? 18.0.0 (for promptfoo)
- Promptfoo CLI: `npm install -g promptfoo` (or use `npx promptfoo@latest`)
- EVA/AI Answers backend access (dev/staging environment)
- Azure AD credentials for API authentication

### Environment Variables
Create `.env` file:
```bash
# EVA/AI Answers Backend
EVA_ANSWERS_ENDPOINT=https://dev-eva-answers.azurewebsites.net/api/query
EVA_ANSWERS_AUTH_TOKEN=Bearer <your-azure-ad-token>

# Promptfoo Config
PROMPTFOO_CACHE_PATH=.promptfoo-cache
PROMPTFOO_OUTPUT_PATH=evidence

# Framework Mapping
ENABLE_ATLAS_MAPPING=true
ENABLE_OWASP_MAPPING=true
ENABLE_NIST_MAPPING=true
ENABLE_ITSG33_MAPPING=true
```

### Run Smoke Suite (PR Gate)
```bash
cd eval/promptfoo
npm install
npm run test:smoke
```

**Expected Output**:
```
? 15/15 tests passed
? Completed in 47 seconds
?? Evidence pack: evidence/smoke-YYYYMMDD-HHMMSS.json
```

### Run Full Test Suite (Nightly)
```bash
npm run test:all
```

**Coverage**: smoke + golden + atlas (3 tactics) + owasp (5 risks) ? 60 tests, ~8 minutes

### View Results in Dashboard
```bash
promptfoo view
```

Opens web UI at `http://localhost:3000` with:
- Test results matrix (pass/fail/severity)
- ATLAS tactic heatmap
- Framework mapping visualization
- Evidence pack download

---

## CI/CD Integration

### GitHub Actions (PR Gate)
File: `.github/workflows/redteam-smoke.yml`

```yaml
name: AI Security - Smoke Tests

on:
  pull_request:
    branches: [main, develop]
    paths:
      - 'eval/promptfoo/**'
      - '.github/workflows/redteam-smoke.yml'

jobs:
  smoke-tests:
    runs-on: ubuntu-latest
    timeout-minutes: 5
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 18
      - name: Install dependencies
        run: cd eval/promptfoo && npm ci
      - name: Run smoke suite
        env:
          EVA_ANSWERS_ENDPOINT: ${{ secrets.EVA_DEV_ENDPOINT }}
          EVA_ANSWERS_AUTH_TOKEN: ${{ secrets.EVA_DEV_TOKEN }}
        run: cd eval/promptfoo && npm run test:smoke
      - name: Upload evidence
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: smoke-evidence
          path: eval/promptfoo/evidence/
      - name: Block PR if critical findings
        run: |
          critical=$(grep -c '"severity":"critical"' eval/promptfoo/evidence/*.json || echo 0)
          if [ "$critical" -gt 0 ]; then
            echo "? BLOCKED: $critical critical AI security findings detected"
            exit 1
          fi
```

### Nightly Full Suite  
File: `.github/workflows/redteam-nightly.yml`

```yaml
name: AI Security - Nightly Full Suite

on:
  schedule:
    - cron: '0 2 * * *'  # 2 AM UTC daily
  workflow_dispatch:

jobs:
  full-suite:
    runs-on: ubuntu-latest
    timeout-minutes: 30
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - name: Run full test suite
        env:
          EVA_ANSWERS_ENDPOINT: ${{ secrets.EVA_STAGING_ENDPOINT }}
          EVA_ANSWERS_AUTH_TOKEN: ${{ secrets.EVA_STAGING_TOKEN }}
        run: cd eval/promptfoo && npm ci && npm run test:all
      - name: Generate framework mappings
        run: node eval/promptfoo/lib/evidence-generator.js --format ato
      - name: Upload to Cosmos DB (L31-evidence)
        run: |
          # POST evidence to Data Model API
          # See: 37-data-model/docs/PAPERLESS-DPDCA-TUTORIAL.md
      - name: Create GitHub Issue for critical findings
        if: failure()
        uses: actions/github-script@v7
        # Auto-file issue with ATLAS/OWASP tags
```

---

## Professional Coding Standards

**All scripts must follow EVA workspace standards** (see [.github/copilot-instructions.md](../../.github/copilot-instructions.md)):

1. **Logging**: Dual logging (console minimal + file verbose) to `logs/{script}_{timestamp}.log`
2. **Encoding**: ASCII-only output - use `[PASS]` `[FAIL]` `[INFO]` `[ERROR]` (no emoji/Unicode)
3. **Evidence**: Save JSON with timestamp, operation name, status, metrics to `evidence/{operation}_{timestamp}.json`
4. **Exit codes**: `0` = success, `1` = business/validation fail, `2` = technical error
5. **Timestamped files**: `{component}_{context}_{YYYYMMDD_HHMMSS}.{ext}` (prevents overwrites, enables chronological sorting)
6. **Pre-flight checks**: Verify files exist, API reachable, dependencies installed, inputs valid before running
7. **Error handling**: Catch exceptions, save to evidence/, log to file, print `[ERROR]` to console, exit with code 2

**Mandatory directories**: Create `logs/`, `evidence/`, `debug/` at script start if missing

---

## Evidence Pack Structure (ATO-Ready)

Generated by: `eval/promptfoo/lib/evidence-generator.js`

```
evidence/redteam-YYYYMMDD-HHMMSS/
??? manifest.json               # Summary metadata
??? test-results.json           # Full promptfoo output
??? atlas-mapping.json          # MITRE ATLAS technique mapping
??? owasp-mapping.json          # OWASP LLM Top 10 mapping
??? nist-mapping.json           # NIST AI RMF mapping
??? itsg33-compliance.json      # ITSG-33 control coverage
??? logs/
?   ??? smoke-YYYYMMDD-HHMMSS.log
?   ??? atlas-defense-evasion-YYYYMMDD-HHMMSS.log
??? screenshots/                # (Optional) Dashboard exports
    ??? atlas-heatmap.png
```

### manifest.json Schema
```json
{
  "version": "1.0.0",
  "generated_at": "2026-03-12T14:30:00Z",
  "project": "36-red-teaming",
  "target_system": "EVA Answers API",
  "test_environment": "staging",
  "summary": {
    "total_tests": 60,
    "passed": 52,
    "failed": 8,
    "critical_findings": 2,
    "high_findings": 3,
    "medium_findings": 3
  },
  "framework_coverage": {
    "mitre_atlas": {
      "tactics_tested": ["AML.TA0007", "AML.TA0008", "AML.TA0010"],
      "techniques_tested": 15,
      "findings": 5
    },
    "owasp_llm": {
      "categories_tested": ["LLM01", "LLM02", "LLM06", "LLM08"],
      "findings": 3
    },
    "nist_ai_rmf": {
      "functions_covered": ["Govern", "Measure"],
      "findings": 2
    },
    "itsg33": {
      "controls_tested": ["SI-10", "AC-3", "SC-28"],
      "compliance_gaps": 0
    }
  },
  "risk_assessment": {
    "overall_risk_score": 6.8,
    "cvss_vector": "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:L/A:N",
    "pareto_rank": 3,
    "recommended_actions": [
      "Patch prompt injection vulnerability (finding #RT-001)",
      "Implement PII redaction (finding #RT-002)",
      "Review tool access controls (finding #RT-005)"
    ]
  },
  "attestation": {
    "test_methodology": "MITRE ATLAS v5.4.0, OWASP LLM Top 10 v3.0, black-box testing",
    "tools_used": ["promptfoo v0.100.0", "eva-answers-http-provider v1.0.0"],
    "tester": "AICOE Security Team",
    "reviewed_by": "TBD",
    "ato_status": "Evidence submitted, awaiting review"
  }
}
```

---

## Project 58 Integration

**Role**: Observatory component feeding LLM vulnerability data into Security Factory pipeline

**Integration Points**:

1. **Data Model (L31-evidence, L45-verification_records)**:
   ```javascript
   // Write LLM vulnerability findings to Cosmos DB
   POST /model/evidence
   {
     "id": "36-redteam-2026-03-12-001",
     "layer": "evidence",
     "project_id": "36-red-teaming",
     "evidence_type": "security_finding",
     "atlas_tactic": "AML.TA0007",
     "owasp_category": "LLM01",
     "severity": "high",
     "cvss_equivalent": 7.5,
     "risk_score": 8.2,
     "remediation": "Implement input sanitization for user prompts",
     "confidence": 0.92
   }
   ```

2. **Observatory Scanner Adapter**:
   ```javascript
   // observatory/scanners/promptfoo-adapter.js
   export function normalizeVulnerability(promptfooResult) {
     return {
       id: `RT-${result.test_id}`,
       source: 'promptfoo-redteam',
       severity: mapSeverity(result.severity),
       cvss_equivalent: result.cvss_equivalent,
       atlas_tactic: result.mappings.mitre_atlas[0],
       owasp_category: result.mappings.owasp_llm[0],
       description: result.description,
       remediation: result.remediation,
       confidence: result.confidence,
       evidence_url: result.evidence_pack_path
     };
   }
   ```

3. **Risk Aggregator (Pareto Analysis)**:
   ```javascript
   // observatory/analyzer/risk-aggregator.js
   export function unifiedRiskScore(vulns) {
     // Combine traditional + LLM vulnerabilities
     const scored = vulns.map(v => ({
       ...v,
       risk_score: v.base_severity * v.exploitability * v.asset_criticality * v.confidence
     }));
     
     // Pareto rank (top 20%)
     scored.sort((a, b) => b.risk_score - a.risk_score);
     const paretoThreshold = scored.length * 0.2;
     scored.forEach((v, i) => {
       v.is_pareto = i < paretoThreshold;
       v.pareto_rank = i + 1;
     });
     
     return scored;
   }
   ```

4. **Dashboard Integration** (Project 58 Synthesizer/Publisher):
   - Widget: "Top AI Security Risks" (Pareto-ranked)
   - Widget: "ATLAS Tactic Heatmap" (16 tactics ? severity)
   - Widget: "Framework Compliance" (ITSG-33, SOC 2, HIPAA status)
   - Combined view: Traditional vulns (Nessus/Defender) + AI vulns (Project 36)

---

## Phased Implementation Roadmap

### Phase 1: Foundation (Sprint 1-2, 4 weeks) ? **IN PROGRESS**
**Goal**: Standalone P36 delivers value (MVP++)

**Deliverables**:
1. ? Governance primed (README, PLAN, STATUS, ACCEPTANCE, copilot-instructions)
2. ? Promptfoo harness operational (smoke suite runs in CI)
3. ? HTTP provider for EVA Answers (black-box testing)
4. ? 3 ATLAS suites (Defense Evasion, Discovery, Exfiltration) = ~45 tests
5. ? Evidence pack generator (JSON + manifest)
6. ? Framework mapper (ATLAS + OWASP tags)
7. ? GitHub Actions workflows (PR gate + nightly)

**Success Criteria**:
- Smoke suite blocks PRs with critical findings
- Nightly suite generates evidence pack
- 5 real vulnerabilities discovered in EVA dev (proof of value)
- MTI score > 70 (eva-veritas audit)

### Phase 2: Observatory Integration (Sprint 3-4, 4 weeks)
**Goal**: P36 feeds data into P58 Security Factory  

**Deliverables**:
1. Scanner adapter (promptfoo ? VulnSchema v1.0)
2. Risk aggregator (traditional + LLM vulns ? unified Pareto)
3. Data Model integration (write to L31-evidence, L45-verification_records)
4. 3 more ATLAS suites (Reconnaissance, Initial Access, Execution) = ~90 total tests
5. MCP provider (test EVA agents + tools)
6. Dashboard widget (AI Security view in P58 Synthesizer)

**Success Criteria**:
- P58 dashboard shows "Top 20% LLM Risks" alongside traditional vulns
- End-to-end data flow: PR commit ? promptfoo ? Cosmos ? P58 dashboard ? remediation ticket
- MTI > 75 for both P36 and P58
- Cross-domain correlation working ("CVE enables prompt injection")

### Phase 3: SaaS Productization (Sprint 5-6, 4 weeks)
**Goal**: Multi-tenant, API-first, compliance-ready

**Deliverables**:
1. Multi-tenant isolation (tenant_id partition key)
2. REST API `/api/v1/redteam/scan` (async job queue)
3. Compliance reports (ITSG-33, SOC 2, HIPAA gap analysis)
4. Full ATLAS coverage (16 tactics, 155 techniques) = ~300 tests
5. Custom suite builder (YAML template generator UI)
6. Threat intelligence feed (community submissions ? new test cases)

**Success Criteria**:
- 3 beta customers onboarded ($10K/mo tier)
- <5 min scan time for typical EVA backend (50 endpoints, 100 tests)
- 99% uptime SLA compliance
- ATO package accepted by 1 government client (proof of ITSG-33/NIST compliance)
- MTI > 80

---

## Veritas Audit

**Required for sprint advance**: MTI score ? 70

```bash
# Option 1: MCP tool (recommended)
audit_repo  repo_path=C:\eva-foundry\36-red-teaming  threshold=70

# Option 2: CLI
cd C:\eva-foundry\48-eva-veritas
node src/cli.js audit --repo ../36-red-teaming --threshold 70

# Option 3: Workspace skill
@sprint-advance project=36-red-teaming
```

**Metrics Tracked**:
- **Coverage**: Features/stories with code + tests + evidence
- **Evidence Quality**: Timestamped, tagged, structured (JSON)
- **Consistency**: IDs match across PLAN/code/tests/evidence
- **Complexity**: Cyclomatic complexity, maintainability index
- **Field Population**: Required fields in evidence/governance docs

**Remediation**:
- Low coverage ? Add tests (`eval/promptfoo/suites/`)
- Missing evidence ? Run tests, generate evidence packs
- Inconsistent IDs ? Use `EVA-STORY:` tags in code comments
- High complexity ? Refactor, extract functions

**See**: [48-eva-veritas/docs/MTI-SCORING-ALGORITHM.md](../48-eva-veritas/docs/MTI-SCORING-ALGORITHM.md)

---

## Related Projects

- **Project 58 (CyberSec Factory)**: FKTE implementation #2, Pareto-based security consulting SaaS
- **Project 48 (eva-veritas)**: Requirements traceability, MTI scoring, quality gates
- **Project 37 (Data Model)**: Governance data storage (L31-evidence, L45-verification_records, L50-53 security layers)
- **Project 07 (Foundation)**: Workspace PM, governance standards, templates
- **Project 51 (ACA)**: Reference DPDCA implementation, professional coding standards

---

## Technology Stack

| Component | Technology | Version | Purpose |
|-----------|-----------|---------|---------|
| **Evaluation Engine** | promptfoo (npm) | ^0.100.0 | LLM red teaming & evaluation |
| **Runtime** | Node.js | ?18.0.0 | JavaScript execution environment |
| **Test Language** | YAML | N/A | Declarative test configuration |
| **Providers** | JavaScript | ES modules | HTTP/MCP client integration |
| **Assertions** | JavaScript | ES modules | Custom validation logic |
| **Evidence** | JSON + Markdown | N/A | Structured + human-readable |
| **Storage** | Cosmos DB | API v3 | Data Model integration (L31, L45) |
| **CI/CD** | GitHub Actions | v4 | PR gate + nightly workflows |
| **Dashboard** | Promptfoo Web UI | Built-in | Results visualization |
| **Reporting** | Node.js scripts | Custom | Evidence pack generation |

---

## Contributing

**Governance Requirements**:
1. All features must have ID in PLAN.md (`## Feature: ... [ID=F36-NN]`)
2. All code files must have story tags (`// EVA-STORY: F36-01-001`)
3. All PRs must pass smoke suite (CI gate)
4. All sprints must pass MTI audit (score ? 70)
5. All evidence must follow naming convention (`evidence/F36-01-001-{desc}-{timestamp}.{ext}`)

**Code Review Checklist**:
- [ ] Smoke tests pass (`npm run test:smoke`)
- [ ] New tests added to appropriate suite (atlas/, owasp/, compliance/)
- [ ] Framework mappings updated (`mappings/framework-crosswalk.json`)
- [ ] Evidence generated (`evidence/` folder)
- [ ] Dual logging implemented (console + file)
- [ ] ASCII-only output (no emoji)
- [ ] Exit codes correct (0/1/2)
- [ ] Pre-flight checks added
- [ ] MTI score maintained/improved

**See**: [CONTRIBUTING.md](./CONTRIBUTING.md) for detailed guidelines

---

## Support & Documentation

- **Workspace**: [.github/copilot-instructions.md](../../.github/copilot-instructions.md)
- **Data Model**: [37-data-model/docs/](../37-data-model/docs/)
- **Veritas**: [48-eva-veritas/docs/](../48-eva-veritas/docs/)
- **Project 58**: [58-cybersec/README.md](../58-cybersec/README.md)
- **Promptfoo Docs**: https://www.promptfoo.dev/docs/
- **MITRE ATLAS**: https://atlas.mitre.org/
- **OWASP LLM Top 10**: https://genai.owasp.org/llm-top-10/
- **NIST AI RMF**: https://www.nist.gov/itl/ai-risk-management-framework

---

**Last Updated**: 2026-03-12 by agent:AIAgentExpert (Session 45 - Project 36 Foundation Prime)
**Status**: Phase 1 - Foundation in progress
**Next Review**: 2026-03-26 (Sprint 2 close)
