<!-- eva-primed-plan -->
<!-- Template Version: v5.0.0 (Session 44 - Governance Template Consolidation) -->
<!-- Placeholders: 36-red-teaming | 36 | 2026-03-12 | agent:AIAgentExpert -->

## EVA Ecosystem Tools

| Resource | Access |Purpose |
|----------|--------|--------|
| **Data Model** | `GET https://msub-eva-data-model.victoriousgrass-30debbd3.canadacentral.azurecontainerapps.io/model/projects/36-red-teaming` | Project metadata, WBS, sessions |
| **Layer Catalog** | Query `/model/agent-summary` (live) | Current operational layer count, schema versions |
| **Category Runbooks** | `$session.userGuide.category_instructions` | 6 DPDCA workflows (session, sprint, evidence, governance, infra, ontology) |
| **Veritas Audit** | `audit_repo` MCP tool on `C:\eva-foundry\36-red-teaming` | MTI score, coverage gaps, traceability |
| **Azure Best Practices** | `C:\eva-foundry\18-azure-best\` | 32 entries: WAF, security, AI, IaC, cost |

## Workspace Skills

| Skill | Invoke As | Purpose |
|-------|-----------|---------|
| sprint-advance | `@sprint-advance` | Validate sprint advance gate (MTI > threshold) |
| progress-report | `@progress-report` | Sprint velocity/progress reporting with metrics dashboard |
| gap-report | `@gap-report` | MTI gap analysis with remediation recommendations |
| sprint-report | `@sprint-report` | Sprint metrics dashboard with historical trends |
| veritas-expert | `@veritas-expert` | Deep requirements traceability and coverage analysis |

## MCP Tools (Project 48: eva-veritas)

| Tool | Purpose | Usage Pattern |
|------|---------|---------------|
| `audit_repo` | Full repo MTI audit with gap analysis | Sprint advance gate (must pass before close) |
| `get_trust_score` | Quick MTI score for single repo | Progress reports, velocity dashboards |
| `sync_repo` | Full paperless DPDCA (API-first audit + write-back) | Sprint close governance loop (audit + persist) |
| `export_to_model` | Extract WBS/evidence/decisions/risks → upload to API | Backlog sync, evidence publishing |
| `dependency_audit` | Cross-project dependency check | Epic readiness, milestone planning |
| `scan_portfolio` | Multi-repo MTI scan with ranking | Workspace health reports, portfolio dashboards |

---

# Project Plan: AI Security Observatory (Promptfoo Foundation)

<!-- veritas-normalized 2026-03-12 prefix=36 source=README.md -->
<!-- Last updated: 2026-03-12 | agent:AIAgentExpert | Status: Foundation Prime -->

---

## Architecture Overview

**5-Layer Stack**:
1. **Layer 1: Promptfoo Engine Core** - Battle-tested harness (300K+ users)
2. **Layer 2: EVA Integration** - Custom providers, assertions, configurations
3. **Layer 3: Framework Mapping** - 5 compliance frameworks (ATLAS, OWASP, NIST, ITSG-33, EU AI Act)
4. **Layer 4: Test Suites** - Smoke tests, golden tests, framework-specific test packs
5. **Layer 5: Observatory Integration** - Project 58 CyberSec Factory data feed

**Dual Value Streams**:
- **Standalone**: ATO-ready evidence packs for EVA/AI Answers compliance
- **Integrated**: AI vulnerability scanner within multi-scanner CyberSec SaaS (Project 58)

---

## Sprint Structure (3 Sprints - Foundation Phase)

### Sprint 1: Core Infrastructure (2 weeks)
- Feature 36-01: Promptfoo Engine Setup
- Feature 36-02: EVA Custom Providers
- Feature 36-03: Smoke Test Suite

### Sprint 2: Framework Integration (2 weeks)
- Feature 36-04: Framework Mapping System
- Feature 36-05: MITRE ATLAS Test Packs
- Feature 36-06: Evidence Generator

### Sprint 3: Observatory Integration (2 weeks)
- Feature 36-07: Project 58 Data Feed
- Feature 36-08: Unified Reporting
- Feature 36-09: CI/CD Pipeline

---

## Feature: [PLANNED] Promptfoo Engine Setup [ID=36-01]

**Epic**: Layer 1 - Engine Core  
**Priority**: P0 (Blocker for all other features)  
**Estimated Effort**: 3 days  
**Dependencies**: None

### Story: [PLANNED] Install and Configure Promptfoo [ID=36-01-001]

**Description**: Install promptfoo CLI, configure basic setup, verify operation with built-in test suite.

**Acceptance**:
- [ ] Promptfoo npm package installed (v0.102.0+)
- [ ] `promptfoo eval` runs successfully with sample config
- [ ] Basic config file (`promptfooconfig.yaml`) validates
- [ ] Documentation reviewed: https://www.promptfoo.dev/docs/intro/

**Implementation**:
1. Install promptfoo: `npm install -g promptfoo@latest`
2. Create project structure: `red-teaming/promptfoo/`
3. Create initial config with Azure OpenAI provider
4. Run test evaluation: `promptfoo eval`
5. Review output formats (JSON, HTML, JSONL)

**Evidence File**: `evidence/36-01-001-promptfoo-install-{YYYYMMDD}.json`

---

### Story: [PLANNED] Configure Azure OpenAI Provider [ID=36-01-002]

**Description**: Configure promptfoo to use Azure OpenAI (msub-sandbox-openai) as default provider for test evaluations.

**Acceptance**:
- [ ] Azure OpenAI endpoint configured in `.env` file
- [ ] API key retrieved from Key Vault (msubsandkv202603031449)
- [ ] Provider connection test passes
- [ ] Sample prompt evaluation completes successfully

**Implementation**:
1. Query Key Vault for `azure-openai-endpoint` and `azure-openai-key`
2. Create `.env` file with AZURE_OPENAI_ENDPOINT, AZURE_OPENAI_KEY, AZURE_OPENAI_DEPLOYMENT
3. Update `promptfooconfig.yaml` with Azure provider
4. Test with simple prompt: "Explain quantum computing in one sentence"
5. Verify response and cost tracking

**Evidence File**: `evidence/36-01-002-azure-openai-config-{YYYYMMDD}.json`

**Source Files**: 
```yaml
# EVA-STORY: 36-01-002
# promptfoo/promptfooconfig.yaml
```

---

### Story: [PLANNED] Document Promptfoo Architecture [ID=36-01-003]

**Description**: Create architecture documentation explaining promptfoo's evaluation engine, provider system, assertion framework, and output formats.

**Acceptance**:
- [ ] Architecture diagram (providers → harness → assertions → outputs)
- [ ] Documentation covers: configs, prompts, providers, assertions, outputs
- [ ] Examples for each component type
- [ ] Links to official promptfoo docs

**Implementation**:
1. Create `docs/PROMPTFOO-ARCHITECTURE.md`
2. Diagram provider flow with Mermaid
3. Document built-in assertions vs custom assertions
4. Explain JSONL output format for evidence aggregation

**Evidence File**: `evidence/36-01-003-arch-doc-{YYYYMMDD}.md`

---

## Feature: [PLANNED] EVA Custom Providers [ID=36-02]

**Epic**: Layer 2 - EVA Integration  
**Priority**: P0 (Required for EVA Answers testing)  
**Estimated Effort**: 5 days  
**Dependencies**: 36-01 (Promptfoo Engine Setup)

### Story: [PLANNED] HTTP Provider for EVA Answers API [ID=36-02-001]

**Description**: Implement custom promptfoo provider that supports black-box HTTP testing of EVA Answers search API (`/search` endpoint).

**Acceptance**:
- [ ] Provider file: `providers/eva-answers-http.js`
- [ ] Supports POST /api/search with query/filters/options
- [ ] Extracts response: results array, citations, execution time
- [ ] Handles authentication (API key or AAD token)
- [ ] Error handling for timeouts, 4xx, 5xx responses
- [ ] Test configuration validated with real EVA Answers instance

**Implementation**:
1. Create `providers/eva-answers-http.js` using promptfoo provider interface
2. Implement `callApi(prompt, context, options)` method
3. Parse EVA Answers response format
4. Extract metrics: latency, result count, citation count
5. Create test config: `configs/eva-answers-smoke.yaml`
6. Run 5 sample queries against dev/staging endpoint

**Evidence File**: `evidence/36-02-001-http-provider-{YYYYMMDD}.json`

**Source Files**:
```javascript
// EVA-STORY: 36-02-001
// EVA-FEATURE: 36-02
// providers/eva-answers-http.js
```

---

### Story: [PLANNED] MCP Provider for Agent Testing [ID=36-02-002]

**Description**: Implement custom provider for testing AI agents using Model Context Protocol (MCP) servers and tools.

**Acceptance**:
- [ ] Provider file: `providers/eva-mcp.js`
- [ ] Connects to MCP server via stdio/SSE
- [ ] Invokes MCP tools (list_tools, call_tool)
- [ ] Captures tool responses and errors
- [ ] Supports multi-turn conversations with context
- [ ] Test with eva-veritas MCP server (`audit_repo` tool)

**Implementation**:
1. Create `providers/eva-mcp.js` using MCP client protocol
2. Implement tool discovery and invocation
3. Handle stdio transport (Node.js child_process)
4. Parse MCP JSON-RPC responses
5. Create test config: `configs/mcp-agent-smoke.yaml`
6. Run 3 test cases with eva-veritas audit_repo tool

**Evidence File**: `evidence/36-02-002-mcp-provider-{YYYYMMDD}.json`

**Source Files**:
```javascript
// EVA-STORY: 36-02-002
// EVA-FEATURE: 36-02
// providers/eva-mcp.js
```

---

### Story: [PLANNED] Custom EVA Assertions [ID=36-02-003]

**Description**: Implement custom assertion functions for EVA-specific quality checks (bilingual responses, Canadian PII detection, citation format validation).

**Acceptance**:
- [ ] Assertion file: `assertions/eva-assertions.js`
- [ ] `is-bilingual`: Validates EN+FR content presence
- [ ] `has-valid-citations`: Checks [1], [2] format and reference list
- [ ] `no-canadian-pii`: Detects SIN, health card, credit card patterns
- [ ] `latency-under`: Performance assertion (< N ms)
- [ ] `cost-under`: Azure OpenAI token cost assertion (< $N)
- [ ] Test assertions with 10 sample outputs

**Implementation**:
1. Create `assertions/eva-assertions.js` with custom assertion functions
2. Implement bilingual detection (French keywords, character patterns)
3. Implement citation regex: `\[\d+\]` and reference list parsing
4. Implement Canadian PII patterns: SIN (999-999-999), health card formats
5. Integrate with promptfoo assertion framework
6. Create test suite: `tests/test-assertions.js`

**Evidence File**: `evidence/36-02-003-custom-assertions-{YYYYMMDD}.json`

**Source Files**:
```javascript
// EVA-STORY: 36-02-003
// EVA-FEATURE: 36-02
// assertions/eva-assertions.js
```

---

## Feature: [PLANNED] Smoke Test Suite [ID=36-03]

**Epic**: Layer 4 - Test Suites  
**Priority**: P0 (PR gate requirement)  
**Estimated Effort**: 3 days  
**Dependencies**: 36-02 (EVA Custom Providers)

### Story: [PLANNED] Golden Test Suite (Regression Detection) [ID=36-03-001]

**Description**: Create golden test suite with 20 known-good prompts/responses to detect model behavior regressions.

**Acceptance**:
- [ ] Test suite file: `test-suites/golden.yaml`
- [ ] 20 test cases covering: factual QA, summarization, translation, coding, reasoning
- [ ] Expected outputs stored as reference
- [ ] Similarity assertion: `is-similar` (>= 0.85 cosine similarity)
- [ ] CI workflow: runs on model version changes
- [ ] Failure triggers alerting

**Implementation**:
1. Create `test-suites/golden.yaml` with 20 prompts
2. Generate reference outputs from GPT-4o (current production model)
3. Store expected outputs in `test-suites/golden-expected/`
4. Configure `is-similar` assertion with 0.85 threshold
5. Create GitHub Actions workflow: `.github/workflows/golden-tests.yml`
6. Run baseline: all 20 tests pass

**Evidence File**: `evidence/36-03-001-golden-suite-{YYYYMMDD}.json`

**Source Files**:
```yaml
# EVA-STORY: 36-03-001
# EVA-FEATURE: 36-03
# test-suites/golden.yaml
```

---

### Story: [PLANNED] Smoke Test Suite (PR Gate) [ID=36-03-002]

**Description**: Create fast smoke test suite (< 2 min runtime) for PR quality gate with 10-15 critical security checks.

**Acceptance**:
- [ ] Test suite file: `test-suites/smoke.yaml`
- [ ] 10-15 test cases covering: prompt injection, jailbreak, PII leakage, harmful content
- [ ] Execution time < 2 minutes (parallel execution)
- [ ] GitHub Actions workflow: `.github/workflows/pr-gate.yml`
- [ ] PR blocks on test failure
- [ ] Results posted as PR comment

**Implementation**:
1. Create `test-suites/smoke.yaml` with 10-15 critical tests
2. Select high-severity OWASP LLM Top 10 scenarios:
   - LLM01: Prompt Injection (2 tests)
   - LLM02: Data Leakage (2 tests)
   - LLM06: Excessive Agency (2 tests)
   - LLM07: System Prompt Leakage (2 tests)
   - LLM09: Misinformation (2 tests)
3. Configure parallel execution: `--concurrency 5`
4. Create PR gate workflow with promptfoo GitHub Action
5. Test PR gate: create test PR, verify blocking behavior

**Evidence File**: `evidence/36-03-002-smoke-suite-{YYYYMMDD}.json`

**Source Files**:
```yaml
# EVA-STORY: 36-03-002
# EVA-FEATURE: 36-03
# test-suites/smoke.yaml
# .github/workflows/pr-gate.yml
```

---

### Story: [PLANNED] Nightly Full Scan [ID=36-03-003]

**Description**: Create comprehensive nightly test suite (200+ tests) covering all security frameworks, runs overnight, generates evidence pack.

**Acceptance**:
- [ ] Test configuration: `test-suites/nightly.yaml`
- [ ] 200+ tests covering all MITRE ATLAS tactics
- [ ] Runs daily at 2 AM ET via scheduled GitHub Action
- [ ] Generates evidence pack: HTML report + JSON + compliance matrix
- [ ] Uploads to Azure Blob Storage: `msub-security-evidence`
- [ ] Sends summary to Teams channel on failure

**Implementation**:
1. Create `test-suites/nightly.yaml` aggregating all test suites
2. Configure scheduled GitHub Action: `cron: "0 6 * * *"` (2 AM ET = 6 AM UTC)
3. Implement evidence pack generator: `scripts/generate-evidence-pack.ps1`
4. Create Azure Blob Storage container for evidence artifacts
5. Configure Teams webhook for alerting
6. Run manual test: verify 3-hour runtime, evidence upload, alert

**Evidence File**: `evidence/36-03-003-nightly-scan-{YYYYMMDD}.json`

**Source Files**:
```yaml
# EVA-STORY: 36-03-003
# EVA-FEATURE: 36-03
# test-suites/nightly.yaml
# .github/workflows/nightly-scan.yml
```

---

## Feature: [PLANNED] Framework Mapping System [ID=36-04]

**Epic**: Layer 3 - Framework Mapping  
**Priority**: P1 (Required for compliance evidence)  
**Estimated Effort**: 4 days  
**Dependencies**: 36-03 (Smoke Test Suite)

### Story: [PLANNED] Framework Crosswalk Database [ID=36-04-001]

**Description**: Create JSON database mapping promptfoo security plugins (50+) to 5 compliance frameworks (ATLAS, OWASP, NIST, ITSG-33, EU AI Act).

**Acceptance**:
- [ ] Database file: `mappings/framework-crosswalk.json`
- [ ] 50+ promptfoo plugins mapped to frameworks
- [ ] Each mapping includes: plugin ID, framework IDs, control IDs, severity, description
- [ ] Validation schema with JSON Schema
- [ ] Documentation: `docs/FRAMEWORK-MAPPING.md`
- [ ] Coverage report: % of each framework covered by tests

**Implementation**:
1. Enumerate promptfoo security plugins: https://www.promptfoo.dev/docs/red-team/plugins/
2. Create `mappings/framework-crosswalk.json` with structure:
   ```json
   {
     "plugin_id": "prompt-injection",
     "frameworks": {
       "atlas": ["AML.T0051.000", "AML.T0051.001"],
       "owasp": ["LLM01"],
       "nist": ["AI.1.1", "AI.3.2"],
       "itsg33": ["SC-7", "SI-10"],
       "eu_ai_act": ["Article 15"]
     },
     "severity": "critical",
     "description": "Direct prompt injection attempts"
   }
   ```
3. Map all 50+ plugins to frameworks
4. Create validation script: `scripts/validate-crosswalk.js`
5. Generate coverage report: framework control coverage by available tests

**Evidence File**: `evidence/36-04-001-framework-crosswalk-{YYYYMMDD}.json`

**Source Files**:
```json
// EVA-STORY: 36-04-001
// EVA-FEATURE: 36-04
// mappings/framework-crosswalk.json
```

---

### Story: [PLANNED] Compliance Matrix Generator [ID=36-04-002]

**Description**: Implement tool that consumes test results + crosswalk database → generates compliance matrix (which controls are tested, pass/fail status).

**Acceptance**:
- [ ] Script file: `scripts/generate-compliance-matrix.js`
- [ ] Input: promptfoo eval results (JSONL) + framework-crosswalk.json
- [ ] Output: compliance matrix per framework (HTML + CSV)
- [ ] Matrix columns: Control ID, Control Name, Test Count, Pass Count, Fail Count, Coverage %
- [ ] ATO evidence format compatible (NIST 800-53, ITSG-33)
- [ ] Test with 100 sample results

**Implementation**:
1. Create `scripts/generate-compliance-matrix.js` (Node.js script)
2. Parse promptfoo JSONL output: extract plugin IDs, pass/fail status
3. Join with framework-crosswalk.json: map plugin results to controls
4. Aggregate by control: count tests, pass/fail
5. Generate HTML report with Bootstrap styling
6. Generate CSV for Excel import
7. Run with sample data: 100 test results → 5 compliance matrices

**Evidence File**: `evidence/36-04-002-compliance-matrix-{YYYYMMDD}.json`

**Source Files**:
```javascript
// EVA-STORY: 36-04-002
// EVA-FEATURE: 36-04
// scripts/generate-compliance-matrix.js
```

---

### Story: [PLANNED] Framework Documentation [ID=36-04-003]

**Description**: Create comprehensive documentation for each framework: control descriptions, mapping rationale, test coverage gaps, remediation guidance.

**Acceptance**:
- [ ] 5 framework docs: `docs/frameworks/{atlas,owasp,nist,itsg33,eu-ai-act}.md`
- [ ] Each doc includes: framework overview, control catalog, EVA mapping, coverage gaps
- [ ] Mapping rationale for each control
- [ ] Remediation guidance for failed tests
- [ ] Links to official framework documents

**Implementation**:
1. Create `docs/frameworks/` directory
2. For each framework, create comprehensive doc:
   - MITRE ATLAS: 14 tactics, 40+ techniques
   - OWASP LLM Top 10: 10 vulnerability categories
   - NIST AI RMF: 4 functions, 7 categories, 23 subcategories
   - ITSG-33: 20 security control families
   - EU AI Act: Article 15 (transparency), Article 52 (transparency obligations)
3. Document mapping logic and coverage status
4. Include remediation guidance for common failures

**Evidence File**: `evidence/36-04-003-framework-docs-{YYYYMMDD}.json`

---

## Feature: [PLANNED] MITRE ATLAS Test Packs [ID=36-05]

**Epic**: Layer 4 - Test Suites  
**Priority**: P1 (High-value security coverage)  
**Estimated Effort**: 6 days  
**Dependencies**: 36-04 (Framework Mapping)

### Story: [PLANNED] Defense Evasion Test Pack [ID=36-05-001]

**Description**: Implement test suite for MITRE ATLAS Tactic TA0005 (Defense Evasion) - 8 techniques covering adversarial examples, model backdoors, prompt obfuscation.

**Acceptance**:
- [ ] Test suite: `test-suites/atlas/defense-evasion.yaml`
- [ ] 30+ test cases covering 8 techniques:
   - AML.T0043: Craft Adversarial Data
   - AML.T0044: Full ML Model Access
   - AML.T0051: Prompt Injection
   - AML.T0054: Backdoor ML Model
- [ ] Tests use promptfoo built-in plugins + custom prompts
- [ ] All tests tagged with ATLAS technique IDs
- [ ] Results integrate with compliance matrix

**Implementation**:
1. Research ATLAS TA0005 techniques: https://atlas.mitre.org/tactics/AML.TA0005/
2. Create `test-suites/atlas/defense-evasion.yaml`
3. Map techniques to promptfoo plugins:
   - AML.T0051 → prompt-injection, indirect-prompt-injection plugins
   - AML.T0043 → adversarial-suffix, jailbreak plugins
4. Add custom test cases for unmapped techniques
5. Tag all tests with `atlas_technique` metadata
6. Run test suite: verify 30+ tests execute, results tagged correctly

**Evidence File**: `evidence/36-05-001-atlas-defense-evasion-{YYYYMMDD}.json`

**Source Files**:
```yaml
# EVA-STORY: 36-05-001
# EVA-FEATURE: 36-05
# test-suites/atlas/defense-evasion.yaml
```

---

### Story: [PLANNED] Discovery Test Pack [ID=36-05-002]

**Description**: Implement test suite for MITRE ATLAS Tactic TA0007 (Discovery) - techniques for probing ML models to extract information about architecture, training data, or system capabilities.

**Acceptance**:
- [ ] Test suite: `test-suites/atlas/discovery.yaml`
- [ ] 20+ test cases covering discovery techniques:
   - AML.T0024: Discover ML Model Ontology
   - AML.T0029: Discover ML Model Family
   - AML.T0033: Discover ML Artifacts
- [ ] Tests attempt to extract: system prompts, model names, training data samples
- [ ] Uses promptfoo plugins: system-prompt-leak, prompt-extraction
- [ ] Results annotated with discovery success/failure

**Implementation**:
1. Research ATLAS TA0007 techniques: https://atlas.mitre.org/tactics/AML.TA0007/
2. Create `test-suites/atlas/discovery.yaml`
3. Implement system prompt extraction tests (10 variants)
4. Implement model identification tests (5 variants)
5. Implement training data extraction tests (5 variants)
6. Run test suite against GPT-4o: baseline discovery success rate

**Evidence File**: `evidence/36-05-002-atlas-discovery-{YYYYMMDD}.json`

**Source Files**:
```yaml
# EVA-STORY: 36-05-002
# EVA-FEATURE: 36-05
# test-suites/atlas/discovery.yaml
```

---

### Story: [PLANNED] Exfiltration Test Pack [ID=36-05-003]

**Description**: Implement test suite for MITRE ATLAS Tactic TA0011 (Exfiltration) - techniques for extracting sensitive data from ML systems.

**Acceptance**:
- [ ] Test suite: `test-suites/atlas/exfiltration.yaml`
- [ ] 25+ test cases covering exfiltration techniques:
   - AML.T0024: Exfiltration via ML Inference API
   - AML.T0030: Membership Inference
   - AML.T0036: Exfil Model Artifacts
- [ ] Tests attempt to extract: PII, training data, model weights
- [ ] Uses custom assertions: `no-canadian-pii`, `no-sensitive-data`
- [ ] Results show exfiltration success rate (should be 0%)

**Implementation**:
1. Research ATLAS TA0011 techniques: https://atlas.mitre.org/tactics/AML.TA0011/
2. Create `test-suites/atlas/exfiltration.yaml`
3. Implement PII extraction tests (10 variants): SSN, health card, credit card
4. Implement training data extraction tests (10 variants)
5. Implement model artifact extraction tests (5 variants)
6. Run test suite: verify all tests fail (no exfiltration successful)

**Evidence File**: `evidence/36-05-003-atlas-exfiltration-{YYYYMMDD}.json`

**Source Files**:
```yaml
# EVA-STORY: 36-05-003
# EVA-FEATURE: 36-05
# test-suites/atlas/exfiltration.yaml
```

---

## Feature: [PLANNED] Evidence Generator [ID=36-06]

**Epic**: Layer 3 - Framework Mapping  
**Priority**: P1 (Required for ATO evidence packs)  
**Estimated Effort**: 4 days  
**Dependencies**: 36-04 (Framework Mapping), 36-05 (ATLAS Test Packs)

### Story: [PLANNED] ATO Evidence Pack Builder [ID=36-06-001]

**Description**: Implement PowerShell script that aggregates test results, compliance matrices, framework docs → generates ATO-ready evidence pack (ZIP archive with structured artifacts).

**Acceptance**:
- [ ] Script: `scripts/build-evidence-pack.ps1`
- [ ] Input: test results directory (JSONL, HTML, CSV)
- [ ] Output: ZIP archive with structure:
   ```
   evidence-pack-{YYYYMMDD}.zip
     /test-results/ (HTML reports, JSONL)
     /compliance-matrices/ (5 frameworks × CSV/HTML)
     /framework-docs/ (5 framework guides)
     /executive-summary.pdf (auto-generated)
     /manifest.json (metadata: date, test count, pass rate, coverage)
   ```
- [ ] Executive summary includes: test statistics, risk heat map, remediation priorities
- [ ] Manifest includes cryptographic hash (SHA256) for integrity

**Implementation**:
1. Create `scripts/build-evidence-pack.ps1`
2. Aggregate test results from `output/` directory
3. Generate compliance matrices for all 5 frameworks
4. Copy framework documentation
5. Generate executive summary (Markdown → PDF via pandoc)
6. Create manifest.json with metadata + SHA256 hashes
7. Create ZIP archive with timestamped filename
8. Test: run with 100 sample test results → verify ZIP structure

**Evidence File**: `evidence/36-06-001-evidence-pack-builder-{YYYYMMDD}.json`

**Source Files**:
```powershell
# EVA-STORY: 36-06-001
# EVA-FEATURE: 36-06
# scripts/build-evidence-pack.ps1
```

---

### Story: [PLANNED] Continuous Evidence Publishing [ID=36-06-002]

**Description**: Configure GitHub Actions workflow to automatically generate and publish evidence packs to Azure Blob Storage after nightly scans.

**Acceptance**:
- [ ] Workflow: `.github/workflows/publish-evidence.yml`
- [ ] Triggered by: nightly scan completion (workflow_run event)
- [ ] Generates evidence pack using `build-evidence-pack.ps1`
- [ ] Uploads to Azure Blob Storage: `msub-security-evidence` container
- [ ] Sets blob metadata: test_date, test_count, pass_rate, frameworks
- [ ] Sends notification to Teams channel with download link
- [ ] Retention policy: 90 days (automated cleanup)

**Implementation**:
1. Create `.github/workflows/publish-evidence.yml`
2. Configure workflow_run trigger from nightly-scan.yml
3. Add Azure login step (uses Managed Identity)
4. Run build-evidence-pack.ps1
5. Upload to Blob Storage using Azure CLI
6. Set blob metadata for searchability
7. Post Teams notification using webhook
8. Test manually: trigger workflow, verify upload

**Evidence File**: `evidence/36-06-002-evidence-publishing-{YYYYMMDD}.json`

**Source Files**:
```yaml
# EVA-STORY: 36-06-002
# EVA-FEATURE: 36-06
# .github/workflows/publish-evidence.yml
```

---

### Story: [PLANNED] Evidence Retrieval Portal [ID=36-06-003]

**Description**: Create simple web UI for browsing/downloading evidence packs from Azure Blob Storage (Static Web App + Azure Functions backend).

**Acceptance**:
- [ ] Static Web App: `evidence-portal/` (HTML + JS)
- [ ] Azure Function: `list-evidence-packs` (returns blob list with metadata)
- [ ] Azure Function: `generate-download-url` (returns SAS token for time-limited download)
- [ ] UI features: date filter, framework filter, search by test ID
- [ ] Authentication: Azure AD (AICOE team members only)
- [ ] Deployed to: `https://msub-evidence-portal.azurewebsites.net`

**Implementation**:
1. Create `evidence-portal/` directory with static HTML/CSS/JS
2. Create Azure Function App: `msub-evidence-functions`
3. Implement `list-evidence-packs` function (queries Blob Storage)
4. Implement `generate-download-url` function (generates SAS token)
5. Configure Azure AD authentication
6. Deploy Static Web App + Functions
7. Test: browse evidence packs, download one, verify 1-hour SAS expiry

**Evidence File**: `evidence/36-06-003-evidence-portal-{YYYYMMDD}.json`

**Source Files**:
```javascript
// EVA-STORY: 36-06-003
// EVA-FEATURE: 36-06
// evidence-portal/app.js
// functions/list-evidence-packs/index.js
```

---

## Feature: [PLANNED] Project 58 Data Feed [ID=36-07]

**Epic**: Layer 5 - Observatory Integration  
**Priority**: P2 (Project 58 dependency)  
**Estimated Effort**: 5 days  
**Dependencies**: 36-06 (Evidence Generator), Project 58 Observatory API

### Story: [PLANNED] Observatory API Client [ID=36-07-001]

**Description**: Implement Node.js client for Project 58 Observatory API to submit AI scan results in standardized format.

**Acceptance**:
- [ ] Client library: `integrations/observatory-client.js`
- [ ] Methods: `submitScanResults()`, `getScanStatus()`, `listScans()`
- [ ] Payload format: Observatory JSON schema (host, scanner_type="ai", findings array)
- [ ] Authentication: API key from Key Vault (`observatory-api-key`)
- [ ] Error handling: retry logic (3 attempts), circuit breaker pattern
- [ ] Test with Project 58 dev environment

**Implementation**:
1. Review Project 58 Observatory API spec: `/api/v1/scans`
2. Create `integrations/observatory-client.js` using axios
3. Implement `submitScanResults()`: POST /api/v1/scans
4. Implement payload transformation: promptfoo results → Observatory format
5. Add authentication header: `Authorization: Bearer ${API_KEY}`
6. Add retry logic with exponential backoff
7. Test with mock Observatory API (Project 58 simulator)

**Evidence File**: `evidence/36-07-001-observatory-client-{YYYYMMDD}.json`

**Source Files**:
```javascript
// EVA-STORY: 36-07-001
// EVA-FEATURE: 36-07
// integrations/observatory-client.js
```

---

### Story: [PLANNED] Finding Transformation Pipeline [ID=36-07-002]

**Description**: Implement transformation pipeline: promptfoo test results → Observatory finding format (standardized severity, CVSS-like scoring, remediation guidance).

**Acceptance**:
- [ ] Transform script: `integrations/transform-findings.js`
- [ ] Input: promptfoo JSONL results
- [ ] Output: Observatory findings JSON array
- [ ] Severity mapping: promptfoo (critical/high/medium/low) → Observatory (9-10/7-8/4-6/1-3)
- [ ] Risk score calculation: combines severity + exploitability + impact
- [ ] Remediation: extracts from framework guidance + adds EVA-specific context
- [ ] Test with 50 sample findings

**Implementation**:
1. Create `integrations/transform-findings.js`
2. Parse promptfoo JSONL: extract test ID, plugin ID, pass/fail, output
3. Map severity levels (use framework-crosswalk.json as reference)
4. Calculate risk score: `severity * 0.4 + exploitability * 0.3 + impact * 0.3`
5. Extract remediation from framework docs (precomputed lookup table)
6. Add EVA-specific context: link to test suite, reproduction steps
7. Test: transform 50 promptfoo results → validate against Observatory schema

**Evidence File**: `evidence/36-07-002-finding-transform-{YYYYMMDD}.json`

**Source Files**:
```javascript
// EVA-STORY: 36-07-002
// EVA-FEATURE: 36-07
// integrations/transform-findings.js
```

---

### Story: [PLANNED] Automated Nightly Submission [ID=36-07-003]

**Description**: Extend nightly scan workflow to automatically submit results to Project 58 Observatory after test completion.

**Acceptance**:
- [ ] Workflow update: `.github/workflows/nightly-scan.yml`
- [ ] New step: "Submit to Observatory" (after evidence pack generation)
- [ ] Uses `observatory-client.js` + `transform-findings.js`
- [ ] Submission includes: scan timestamp, test count, findings array, evidence pack URL
- [ ] Failure handling: logs error, sends alert, does not block evidence pack generation
- [ ] Verification: check Observatory UI for scan results

**Implementation**:
1. Update `.github/workflows/nightly-scan.yml`
2. Add step after `build-evidence-pack.ps1`:
   ```yaml
   - name: Submit to Observatory
     run: node integrations/submit-to-observatory.js
   ```
3. Create `integrations/submit-to-observatory.js`: orchestrates transform + API client
4. Add error handling: catch API failures, log to file, continue workflow
5. Test manually: trigger nightly scan, verify Observatory receives data

**Evidence File**: `evidence/36-07-003-nightly-submission-{YYYYMMDD}.json`

**Source Files**:
```yaml
# EVA-STORY: 36-07-003
# EVA-FEATURE: 36-07
# .github/workflows/nightly-scan.yml (updated)
# integrations/submit-to-observatory.js (new)
```

---

## Feature: [PLANNED] Unified Reporting [ID=36-08]

**Epic**: Layer 5 - Observatory Integration  
**Priority**: P2 (Project 58 SaaS dependency)  
**Estimated Effort**: 4 days  
**Dependencies**: 36-07 (Project 58 Data Feed)

### Story: [PLANNED] Combined Risk Dashboard [ID=36-08-001]

**Description**: Design dashboard showing unified risk scores combining traditional CVSS vulnerabilities (Nessus, Azure Defender) + AI vulnerabilities (Project 36) with Pareto-ranked view.

**Acceptance**:
- [ ] Dashboard design: Figma mockup or Mermaid diagram
- [ ] Data model: combined risk score = `0.6 * CVSS + 0.4 * AI_RISK`
- [ ] Pareto ranking: 80-20 principle (20% of findings represent 80% of risk)
- [ ] Visualization: heat map (severity × exploitability), trend charts
- [ ] Filters: by scanner, by framework, by date range
- [ ] Export: CSV, PDF report

**Implementation**:
1. Design dashboard layout in Figma (or document with Mermaid diagrams)
2. Define combined risk score formula (consult Project 58 architect)
3. Design Pareto ranking algorithm: sort by risk score, calculate cumulative %
4. Create data aggregation logic: query Observatory API for all scanners
5. Document dashboard requirements: `docs/UNIFIED-DASHBOARD.md`
6. Review with Project 58 team

**Evidence File**: `evidence/36-08-001-dashboard-design-{YYYYMMDD}.json`

---

### Story: [PLANNED] Cross-Scanner Correlation [ID=36-08-002]

**Description**: Implement correlation engine that connects traditional vulnerabilities with AI vulnerabilities (e.g., "SQL injection on API endpoint enables prompt injection attack").

**Acceptance**:
- [ ] Correlation engine: `scripts/correlate-findings.js`
- [ ] Input: findings from multiple scanners (Nessus, Azure Defender, Project 36)
- [ ] Output: correlation graph (finding pairs with relationship types)
- [ ] Relationship types: "enables", "amplifies", "mitigates", "related_to"
- [ ] Example: "CVE-2024-1234 (SQL injection on /api/auth) enables LLM01 (prompt injection via auth bypass)"
- [ ] Test with 20 simulated finding pairs

**Implementation**:
1. Create `scripts/correlate-findings.js`
2. Load findings from Observatory API (all scanners)
3. Implement correlation rules:
   - Auth bypass + LLM vulnerability → enables
   - Network exposure + AI service → amplifies
   - WAF rule + prompt injection test → mitigates
4. Build correlation graph using graph theory (nodes = findings, edges = relationships)
5. Generate correlation report: finding pairs with relationship descriptions
6. Test with sample data: 50 findings → expected 10-15 correlations

**Evidence File**: `evidence/36-08-002-cross-scanner-correlation-{YYYYMMDD}.json`

**Source Files**:
```javascript
// EVA-STORY: 36-08-002
// EVA-FEATURE: 36-08
// scripts/correlate-findings.js
```

---

### Story: [PLANNED] Executive Risk Report [ID=36-08-003]

**Description**: Implement automated executive report generator: combines all scanner results, Pareto ranking, risk trends, top 5 recommendations → PDF report for CISO/leadership.

**Acceptance**:
- [ ] Report generator: `scripts/generate-executive-report.js`
- [ ] Report sections:
   - Executive summary (1 page): risk score trend, top 3 findings
   - Pareto analysis (1 page): 20% of findings causing 80% of risk
   - Scanner comparison (1 page): coverage by scanner type
   - Top 5 recommendations (1 page): prioritized remediation actions
   - Appendix: detailed findings table
- [ ] Output: PDF report (5-10 pages)
- [ ] Scheduling: monthly generation, emailed to leadership

**Implementation**:
1. Create `scripts/generate-executive-report.js`
2. Query Observatory API: last 30 days of findings
3. Calculate risk metrics: total findings, critical count, risk trend
4. Generate Pareto chart (using chart.js or similar)
5. Create top 5 recommendations (rule-based: highest risk + easiest remediation)
6. Render Markdown report template → convert to PDF (pandoc)
7. Test: generate report with 100 sample findings

**Evidence File**: `evidence/36-08-003-executive-report-{YYYYMMDD}.json`

**Source Files**:
```javascript
// EVA-STORY: 36-08-003
// EVA-FEATURE: 36-08
// scripts/generate-executive-report.js
```

---

## Feature: [PLANNED] CI/CD Pipeline [ID=36-09]

**Epic**: Layer 5 - Observatory Integration  
**Priority**: P0 (Required for automation)  
**Estimated Effort**: 3 days  
**Dependencies**: All previous features

### Story: [PLANNED] PR Quality Gate [ID=36-09-001]

**Description**: Implement GitHub Actions workflow that blocks PRs if smoke tests fail (any critical security test regression).

**Acceptance**:
- [ ] Workflow: `.github/workflows/pr-gate.yml`
- [ ] Trigger: on pull_request (all branches → main)
- [ ] Runs smoke test suite (`test-suites/smoke.yaml`)
- [ ] Execution time: < 2 minutes
- [ ] Blocks merge if any test fails
- [ ] Posts comment on PR with test results (pass/fail counts, failed test IDs)
- [ ] Test with sample PR

**Implementation**:
1. Create `.github/workflows/pr-gate.yml`
2. Configure trigger: `on: [pull_request]`
3. Add job: "smoke-tests"
   ```yaml
   - run: promptfoo eval -c test-suites/smoke.yaml --concurrency 5
   - run: node scripts/check-results.js output/latest.json
   ```
4. Implement `scripts/check-results.js`: parse results, exit 1 if any failure
5. Add PR comment step: use GitHub Actions API to post results
6. Test: create test PR with intentional failure, verify blocking

**Evidence File**: `evidence/36-09-001-pr-gate-{YYYYMMDD}.json`

**Source Files**:
```yaml
# EVA-STORY: 36-09-001
# EVA-FEATURE: 36-09
# .github/workflows/pr-gate.yml
```

---

### Story: [PLANNED] Scheduled Nightly Scan [ID=36-09-002]

**Description**: Implement GitHub Actions workflow for comprehensive nightly security scan (already outlined in 36-03-003, now ensure full integration).

**Acceptance**:
- [ ] Workflow: `.github/workflows/nightly-scan.yml`
- [ ] Trigger: schedule (cron: "0 6 * * *") + manual dispatch
- [ ] Runs full test suite: 200+ tests across all frameworks
- [ ] Execution time: 2-3 hours
- [ ] Generates evidence pack (36-06-001)
- [ ] Submits to Observatory (36-07-003)
- [ ] Sends summary to Teams channel
- [ ] Test: manual trigger, verify full pipeline

**Implementation**:
1. Create `.github/workflows/nightly-scan.yml`
2. Configure schedule: `cron: "0 6 * * *"` (2 AM ET)
3. Add job steps:
   - Run full test suite: `promptfoo eval -c test-suites/nightly.yaml`
   - Generate evidence pack: `scripts/build-evidence-pack.ps1`
   - Upload to Blob Storage: Azure CLI
   - Submit to Observatory: `integrations/submit-to-observatory.js`
   - Send Teams notification: webhook
4. Add manual dispatch trigger for testing
5. Test manually: verify 2-3 hour runtime, all outputs generated

**Evidence File**: `evidence/36-09-002-nightly-scan-complete-{YYYYMMDD}.json`

**Source Files**:
```yaml
# EVA-STORY: 36-09-002
# EVA-FEATURE: 36-09
# .github/workflows/nightly-scan.yml
```

---

### Story: [PLANNED] Infrastructure as Code [ID=36-09-003]

**Description**: Create Bicep templates for all Azure resources (Blob Storage, Function App, Key Vault secrets, Managed Identities) supporting Project 36.

**Acceptance**:
- [ ] Bicep template: `infrastructure/main.bicep`
- [ ] Resources defined:
   - Storage Account: `msub-security-evidence` (evidence pack storage)
   - Function App: `msub-evidence-functions` (evidence portal backend)
   - Key Vault secrets: `observatory-api-key`
   - Managed Identity: GitHub Actions workflow identity
- [ ] Parameter file: `infrastructure/parameters.json`
- [ ] Deployment script: `infrastructure/deploy.ps1`
- [ ] Test deployment to dev resource group

**Implementation**:
1. Create `infrastructure/main.bicep`
2. Define Storage Account with blob container
3. Define Function App with consumption plan
4. Configure Managed Identity for GitHub Actions
5. Create parameter file with environment-specific values
6. Create deployment script using `az deployment group create`
7. Test: deploy to `EVA-Sandbox-dev` resource group

**Evidence File**: `evidence/36-09-003-iac-deployment-{YYYYMMDD}.json`

**Source Files**:
```bicep
// EVA-STORY: 36-09-003
// EVA-FEATURE: 36-09
// infrastructure/main.bicep
```

---

## Backlog

### Future Features (Phase 2 - SaaS Productization)
- Multi-tenant architecture (1 Observatory instance, N customer scans)
- Customer-specific evidence packs (isolated Blob Storage per tenant)
- Pricing tiers: $0 free (10 scans/month), $10K professional (unlimited), $30K enterprise (white-label)
- White-label branding (custom reports, logo replacement)
- API-first architecture (customers can integrate their own tools)

### Future Features (Phase 3 - Advanced Capabilities)
- Adversarial training dataset generation (failed prompts → fine-tuning data)
- Automated remediation suggestions (code patches for guardrail improvements)
- Continuous fuzzing (AI-generated test cases, evolutionary algorithms)
- Red team as a service (human-in-the-loop adversarial testing)

### Technical Debt
- None yet (greenfield project)

### Dependencies

| Dependency | Type | Status | Mitigation |
|------------|------|--------|------------|
| **Promptfoo stability** | External | PASS | Battle-tested library (300K+ users), stable v0.100+ |
| **Project 58 Observatory API** | Internal | IN PROGRESS | Defer integration to Sprint 3, develop against mock API |
| **Azure OpenAI quota** | Infrastructure | PASS | 200K TPM quota available in msub-sandbox-openai |
| **EVA Answers API** | Internal | PASS | Stable production API, documented endpoint |
| **Azure Blob Storage** | Infrastructure | PASS | Unlimited tier, EVA-Sandbox-dev resource group |

---

## EVA-Veritas Integration Notes

**PLAN.md Format Requirements** (for automated MTI scoring):
- Features: `## Feature: {TITLE} [ID={PREFIX}-{NN}]`
- Stories: `### Story: {TITLE} [ID={PREFIX}-{NN}-{NNN}]`
- Tasks: `#### Task: {TITLE}` (optional, not scored)

**Source File Tagging Pattern**:
```javascript
// EVA-STORY: 36-01-001
// EVA-FEATURE: 36-01
```

**Evidence File Pattern**:
```
evidence/36-01-001-{description}-{YYYYMMDD}.{ext}
```

**MTI Audit Command**:
```bash
node C:\eva-foundry\48-eva-veritas\src\cli.js audit --repo C:\eva-foundry\36-red-teaming --threshold 70
```

**Quality Gate**: MTI score must be >= 70 for sprint advance. Run `audit_repo` MCP tool or `eva audit` CLI before merge.

**See**: [48-eva-veritas/docs/EVIDENCE-CONVENTION.md](../48-eva-veritas/docs/EVIDENCE-CONVENTION.md) for complete conventions

---

## Sprint Summary

### Sprint 1: Core Infrastructure (2 weeks, 11 stories)
**Goal**: Promptfoo operational, EVA providers working, smoke tests passing
- Feature 36-01: Promptfoo Engine Setup (3 stories)
- Feature 36-02: EVA Custom Providers (3 stories)
- Feature 36-03: Smoke Test Suite (3 stories)
- **Exit Criteria**: MTI >= 60, smoke tests pass in < 2 min, PR gate operational

### Sprint 2: Framework Integration (2 weeks, 9 stories)
**Goal**: 5 frameworks mapped, ATLAS test packs operational, evidence packs generated
- Feature 36-04: Framework Mapping System (3 stories)
- Feature 36-05: MITRE ATLAS Test Packs (3 stories)
- Feature 36-06: Evidence Generator (3 stories)
- **Exit Criteria**: MTI >= 70, 200+ tests operational, nightly scan produces evidence pack

### Sprint 3: Observatory Integration (2 weeks, 7 stories)
**Goal**: Project 58 integration complete, unified reporting operational, CI/CD stable
- Feature 36-07: Project 58 Data Feed (3 stories)
- Feature 36-08: Unified Reporting (3 stories)
- Feature 36-09: CI/CD Pipeline (3 stories)
- **Exit Criteria**: MTI >= 75, Observatory receives nightly scans, executive reports generated

**Total: 3 sprints, 9 features, 27 stories, 6 weeks estimated**

---

**Foundation Prime Complete**: 2026-03-12  
**Next Session**: Sprint 1 Kickoff - Story 36-01-001 (Install Promptfoo)
