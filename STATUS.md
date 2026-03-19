# 36-red-teaming -- Implementation Status

**Template Version**: v5.0.0 (Session 44 - Governance Template Consolidation)
**Last Updated**: 2026-03-12 by agent:AIAgentExpert
**Data Model**: GET https://msub-eva-data-model.victoriousgrass-30debbd3.canadacentral.azurecontainerapps.io/model/projects/36-red-teaming
**Veritas Trust**: Run `get_trust_score` MCP tool for current MTI score
**Workspace Skills**: @sprint-advance | @progress-report | @gap-report | @veritas-expert

---

<!-- eva-primed-status -->

## EVA Ecosystem Live Status

Query these endpoints to get live project state before starting any work:

```powershell
$base = "https://msub-eva-data-model.victoriousgrass-30debbd3.canadacentral.azurecontainerapps.io"

# Project facts
Invoke-RestMethod "$base/model/projects/36-red-teaming" | Select-Object id, maturity, phase, pbi_total, pbi_done

# Health check
Invoke-RestMethod "$base/health" | Select-Object status, store, version

# One-call summary (all layer counts)
Invoke-RestMethod "$base/model/agent-summary"
```

For veritas audit:
```
MCP tool: audit_repo  repo_path=C:\eva-foundry\36-red-teaming
MCP tool: get_trust_score  repo_path=C:\eva-foundry\36-red-teaming
```

---

## Session Log

### 2026-03-12 -- Foundation Prime & Strategy by agent:AIAgentExpert

**Activity**: Complete project re-prime with promptfoo foundation architecture, Project 58 integration strategy, 5-framework security mapping (MITRE ATLAS, OWASP LLM Top 10, NIST AI RMF, ITSG-33, EU AI Act).

**Context**: Coming from Project 58 (CyberSec Factory) scaffolding. P36 serves as AI Security Observatory component for P58, plus standalone value for EVA/AI Answers red teaming.

**Deliverables**:
- ✅ README.md (comprehensive architecture, 5-layer stack, end-to-end data flow)
- ✅ Foundation architecture plan (Layer 1-5 design, integration points, phased roadmap)
- ✅ Framework alignment matrix (50 promptfoo plugins × 5 frameworks)
- ⏳ STATUS.md update (this file)
- ⏳ PLAN.md update (feature decomposition with veritas-normalized IDs)
- ⏳ copilot-instructions.md update (project-specific context)
- ⏳ Promptfoo integration strategy document

**Key Decisions**:
1. **Use promptfoo as-is**: Battle-tested (300K+ users, OpenAI/Anthropic), no reinvention
2. **5-layer architecture**: Engine core → EVA integration → framework mapping → test suites → observatory integration
3. **Dual value stream**: Standalone (ATO-ready evidence) + Integrated (P58 Observatory component)
4. **Framework mapping**: Simultaneous mapping to ATLAS + OWASP + NIST + ITSG-33 + compliance
5. **Phased approach**: Phase 1 (MVP++ foundation), Phase 2 (P58 integration), Phase 3 (SaaS productization)

**Technical Approach**:
- Custom providers: `eva-answers-http.js` (black-box API testing), `eva-mcp.js` (agent/tool testing)
- Custom assertions: `eva-assertions.js` (bilingual EN/FR, EVA-specific citation format, Canadian PII)
- Framework crosswalk: `framework-crosswalk.json` (50 mappings, severity alignment)
- Evidence transformer: `evidence-generator.js` (promptfoo JSON → ATO manifest + compliance matrix)

**Next Steps**:
- [ ] Complete governance prime (PLAN.md feature decomposition)
- [ ] Implement HTTP provider for EVA Answers API
- [ ] Implement smoke suite (10-20 tests, PR gate)
- [ ] Implement 3 ATLAS tactic suites (Defense Evasion, Discovery, Exfiltration)
- [ ] Implement framework mapper and evidence generator
- [ ] Configure GitHub Actions workflows (PR gate + nightly)
- [ ] Run initial veritas audit (target MTI > 70)

### 2026-02-19 -- Previous Status (Marked "MVP Complete" but Incomplete)

**Note**: Project was marked "MVP Complete" on 2026-02-17 but lacked:
- No README.md (now created)
- No test suites implemented (smoke.yaml, golden.yaml, atlas/* - all scaffolded but empty)
- No providers implemented (eva-http.js scaffolded but no code)
- No GitHub workflows (redteam-smoke.yml, redteam-nightly.yml scaffolded but not configured)
- No evidence pack generator (build-evidence-pack.ps1 scaffolded but incomplete)

**Conclusion**: Previous "MVP Complete" status was aspirational architecture documentation, not working code. Current foundation prime provides actionable implementation plan.

---

## Current Status (2026-03-12)

**Phase**: Foundation (Phase 1 of 3)
**Maturity**: Re-primed / Architecture Defined
**Active Work**: Sprint 1 - Foundation Implementation
**Blockers**: None
**Next Session**: Implement HTTP provider + smoke suite

---

## Implementation Progress (Phase 1 - Foundation)

### Deliverables Status

| Deliverable | Status | Notes |
|-------------|--------|-------|
| **1. Governance Primed** | ✅ DONE | README, STATUS updated; PLAN, ACCEPTANCE, copilot-instructions pending |
| **2. Promptfoo Harness** | ⏳ IN PROGRESS | package.json ready, suites scaffolded, needs implementation |
| **3. HTTP Provider** | 📋 PLANNED | `eva-answers-http.js` architecture defined |
| **4. ATLAS Suites** | 📋 PLANNED | 3 tactics (Defense Evasion, Discovery, Exfiltration), ~45 tests |
| **5. Evidence Generator** | 📋 PLANNED | `evidence-generator.js` - promptfoo JSON → ATO manifest |
| **6. Framework Mapper** | 📋 PLANNED | `framework-crosswalk.json` - 50 mappings × 5 frameworks |
| **7. GitHub Workflows** | 📋 PLANNED | PR gate (smoke) + nightly (full suite) |

### Success Criteria Progress

| Criterion | Target | Current | Status |
|-----------|--------|---------|--------|
| **Smoke suite operational** | PR gate blocks critical findings | Not implemented | 🔴 |
| **Nightly evidence** | Evidence pack generated daily | Not implemented | 🔴 |
| **Real vulnerabilities** | 5 discovered in EVA dev |Not implemented | 🔴 |
| **MTI Score** | ≥ 70 | Not audited yet | ⚪ |

---

## Metrics

| Metric | Value | Last Updated |
|--------|-------|--------------|
| Test Coverage | 0% (no tests implemented) | 2026-03-12 |
| MTI Score (eva-veritas) | Not audited | 2026-03-12 |
| PBIs Total | 0 (PLAN.md being updated) | 2026-03-12 |
| PBIs Done | 0 | 2026-03-12 |
| LOC | ~50 (package.json, scaffolding only) | 2026-03-12 |

**MTI Score Guidance** (Project 48 eva-veritas):
- 90-100: Trusted (deploy approved)
- 70-89: Medium trust (review before merge)
- 50-69: Low trust (review required, no deploy)
- <50: Unsafe (block, investigate)

**Update MTI**: Run `eva audit --repo .` or `audit_repo` MCP tool

---

## Known Issues

None (foundation prime, implementation pending)

---

## Recent Changes

- **2026-03-12**: Foundation prime - comprehensive README, architecture strategy, 5-framework mapping, Project 58 integration design
- **2026-02-19**: Previous status marked "MVP Complete" (documentation only, no working code)
- **2026-02-17**: Initial scaffolding created (package.json, PLAN.md skeleton, STATUS.md)

---

## What is Planned (Updated Architecture)

A **Promptfoo-powered, black-box red-teaming harness** for EVA/AI Answers backends and AI systems, producing ATO-ready evidence packs. Operationalizes 5 frameworks simultaneously with unified risk ranking.

| Framework | Role | Phase 1 Coverage |
|-----------|------|------------------|
| MITRE ATLAS | AI threat modeling | 3 of 16 tactics (Defense Evasion, Discovery, Exfiltration) |
| OWASP LLM Top 10 (2025) | LLM app vulnerabilities | 5 of 10 risks (Prompt Injection, Insecure Output, PII Leaks, Excessive Agency, Tool Misuse) |
| NIST AI RMF | Risk governance | Map + Measure functions |
| ITSG-33 | Canadian gov security | SI-10 (input validation), AC-3 (access control), SC-28 (encryption) |
| Compliance | Industry standards | SOC 2, HIPAA PII detection, PCI-DSS cardholder data |

### Test Suite Coverage (Phase 1 MVP)

```
eval/promptfoo/suites/
  smoke.yaml         # 10-20 tests, PR gate, <2min, blocking
  golden.yaml        # 30-50 tests, nightly regression, non-blocking
  atlas/
    AML.TA0007-defense-evasion.yaml    # 15-30 tests (injection, jailbreak, obfuscation)
    AML.TA0008-discovery.yaml          # 10-20 tests (system prompt probing, boundaries)
    AML.TA0010-exfiltration.yaml       # 15-30 tests (PII leaks, context extraction)
```

**Total Phase 1**: ~60 tests  
**CI/CD**: PR gate (smoke) + nightly (full) + weekly (deep scan with evidence pack)

### Architecture Components (5 Layers)

1. **Promptfoo Engine**: Core evaluation framework (no reinvention)
2. **EVA Integration**: HTTP provider (`eva-answers-http.js`), MCP provider (`eva-mcp.js`), custom assertions (`eva-assertions.js` - bilingual, PII detection)
3. **Framework Mapper**: Crosswalk database mapping promptfoo plugins → ATLAS/OWASP/NIST/ITSG-33/compliance
4. **Test Suites**: YAML configurations for smoke/golden/ATLAS/OWASP/compliance testing
5. **Observatory Integration**: Scanner adapter feeding LLM vulns into Project 58 Security Factory (Pareto-ranked with traditional vulns)

### Project 58 Integration (Observatory Component)

**Data Flow**:
```
Promptfoo Test Results
  ↓
Evidence Generator (JSON + ATO manifest)
  ↓
Framework Mapper (ATLAS + OWASP + NIST + ITSG-33 tags)
  ↓
Cosmos DB (L31-evidence, L45-verification_records)
  ↓
P58 Observatory Scanner Adapter
  ↓
P58 Risk Aggregator (traditional vulns + LLM vulns → unified Pareto ranking)
  ↓
P58 Synthesizer (remediation roadmap - top 20% only)
  ↓
P58 Publisher (dashboard + PDF report + alerts)
```

**Value**: Security teams see **unified risk view** - "You have 847 total findings. Fix these 40 (top 20%) to eliminate 80% of risk. Includes 5 LLM-specific vulns ranked alongside traditional CVEs."

---

## What Has Been Done

### 2026-03-12: Foundation Prime ✅
- ✅ Comprehensive README.md (architecture, data flow, integration strategy)
- ✅ 5-layer architecture defined (Engine → Integration → Mapper → Suites → Observatory)
- ✅ Framework alignment matrix (50 promptfoo plugins × 5 frameworks)
- ✅ Phased implementation roadmap (Phase 1-3, success criteria)
- ✅ Professional coding standards documented (dual logging, ASCII-only, evidence, exit codes)
- ✅ STATUS.md updated with current state
- ✅ Evidence pack structure defined (ATO-ready with manifest.json)
- ✅ CI/CD patterns documented (GitHub Actions PR gate + nightly)

### 2026-02-17: Initial Scaffolding (Incomplete)
- ⚠️ package.json created (dependencies: promptfoo, vitest)
- ⚠️ PLAN.md skeleton (feature IDs, no details)
- ⚠️ STATUS.md initial (marked "MVP Complete" prematurely)
- ⚠️ ATLAS-MAPPING.md concept documentation
- ⚠️ Folder structure created (suites/, providers/, assertions/ - all empty)
- ⚠️ GitHub workflows scaffolded (redteam-smoke.yml, redteam-nightly.yml - not functional)

**Conclusion**: Previous "MVP Complete" was documentation/architecture only, no working code. Foundation prime (2026-03-12) provides actionable implementation plan.

---

## ATLAS Tactic Coverage (Updated Plan)

**MITRE ATLAS v5.4.0** - 16 tactics total

| ATLAS Tactic | Phase 1 (MVP) | Phase 2 | Phase 3 | Notes |
|--------------|---------------|---------|---------|-------|
| **AI Model Access** (AML.TA0000) | ✅ | ✅ | ✅ | Black-box API testing covered |
| **Defense Evasion** (AML.TA0007) | ✅ MVP | ✅ | ✅ | Injection, jailbreak, obfuscation (15-30 tests) |
| **Discovery** (AML.TA0008) | ✅ MVP | ✅ | ✅ | System prompt probing, boundaries (10-20 tests) |
| **Exfiltration** (AML.TA0010) | ✅ MVP | ✅ | ✅ | P II leaks, context extraction (15-30 tests) |
| **Reconnaissance** (AML.TA0002) | ⏳ | ✅ Phase 2 | ✅ | Model fingerprinting, capability probing |
| **Initial Access** (AML.TA0004) | ⏳ | ✅ Phase 2 | ✅ | Auth bypass via prompt, session hijacking |
| **Execution** (AML.TA0005) | ⏳ | ✅ Phase 2 | ✅ | Code injection, command execution via LLM |
| **Privilege Escalation** (AML.TA0012) | ⏳ | ⏳ | ✅ Phase 3 | RBAC bypass, role confusion |
| **Credential Access** (AML.TA0013) | ⏳ | ⏳ | ✅ Phase 3 | Token extraction, credential leakage |
| **Collection** (AML.TA0009) | ⏳ | ⏳ | ✅ Phase 3 | Data scraping, knowledge base extraction |
| **Impact** (AML.TA0011) | ⏳ | ⏳ | ✅ Phase 3 | Denial of service, model poisoning |
| **Resource Development** (AML.TA0003) | ❌ | ❌ | ❌ | Out of scope (infra security track) |
| **Persistence** (AML.TA0006) | ❌ | ❌ | ❌ | Out of scope (infra security track) |
| **Lateral Movement** (AML.TA0015) | ❌ | ❌ | ❌ | Out of scope (infra security track) |
| **AI Attack Staging** (AML.TA0001) | ❌ | ❌ | ❌ | Out of scope (attacker TTPs not testable) |
| **Command and Control** (AML.TA0014) | ❌ | ❌ | ❌ | Out of scope (infra security track) |

**Coverage Summary**:
- **Phase 1 (MVP)**: 3 tactics testable (Defense Evasion, Discovery, Exfiltration) = ~45 tests
- **Phase 2**: +3 tactics (Reconnaissance, Initial Access, Execution) = ~90 tests total
- **Phase 3**: +5 tactics (full 11 testable) = ~300 tests total
- **Out of Scope**: 5 tactics (infrastructure-focused, not LLM-testable via black-box API)

---

## Next Steps

### Immediate (Sprint 1, Week 1-2)

1. **Complete Governance Prime**:
   - [ ] Update PLAN.md with feature decomposition (veritas-normalized IDs)
   - [ ] Update ACCEPTANCE.md with Phase 1 success criteria
   - [ ] Update copilot-instructions.md with project-specific context
   - [ ] Register project in Data Model API (`POST /model/projects`)

2. **Implement HTTP Provider**:
   - [ ] Create `eval/promptfoo/providers/eva-answers-http.js`
   - [ ] Implement request/response mapping (EVA API format)
   - [ ] Add Azure AD authentication (Bearer token)
   - [ ] Add error handling, retries, timeouts
   - [ ] Test against EVA dev environment

3. **Implement Smoke Suite**:
   - [ ] Create `eval/promptfoo/suites/smoke.yaml` (10-20 tests)
   - [ ] Smoke tests must run in <2 minutes
   - [ ] Cover critical attack vectors: prompt injection, jailbreak, PII leaks
   - [ ] Integrate with GitHub Actions PR gate (block on critical findings)

### Near-Term (Sprint 1, Week 3-4)

4. **Implement ATLAS Suites**:
   - [ ] `AML.TA0007-defense-evasion.yaml` (15-30 tests)
   - [ ] `AML.TA0008-discovery.yaml` (10-20 tests)
   - [ ] `AML.TA0010-exfiltration.yaml` (15-30 tests)

5. **Implement Framework Mapper**:
   - [ ] Create `eval/promptfoo/mappings/framework-crosswalk.json`
   - [ ] Map 50 promptfoo plugins to ATLAS/OWASP/NIST/ITSG-33/compliance
   - [ ] Implement severity alignment (CVSS equivalent)

6. **Implement Evidence Generator**:
   - [ ] Create `eval/promptfoo/lib/evidence-generator.js`
   - [ ] Transform promptfoo JSON → ATO manifest + compliance matrix
   - [ ] Generate timestamped evidence packs

7. **Configure CI/CD**:
   - [ ] GitHub Actions: `redteam-smoke.yml` (PR gate)
   - [ ] GitHub Actions: `redteam-nightly.yml` (full suite)
   - [ ] Evidence pack upload to Cosmos DB (L31-evidence)

### Phase 2 (Sprint 2-3)

8. **Observatory Integration**:
   - [ ] Create `observatory/scanners/promptfoo-adapter.js`
   - [ ] Create `observatory/analyzer/risk-aggregator.js`
   - [ ] Integrate with Project 58 dashboard (AI Security widget)

9. **MCP Provider**:
   - [ ] Create `eval/promptfoo/providers/eva-mcp.js`
   - [ ] Test EVA agents and tools (context injection, tool misuse)

10. **Expand Test Coverage**:
    - [ ] 3 more ATLAS suites (Reconnaissance, Initial Access, Execution)
    - [ ] OWASP suites (LLM01-10)
    - [ ] Compliance suites (ITSG-33, HIPAA, PCI-DSS)

---

## Definition of Done (Phase 1 MVP)

✅ **Must Have** (Blocking):
- [ ] Smoke suite runs in CI (PR gate)
- [ ] 3 ATLAS suites implemented (Defense Evasion, Discovery, Exfiltration)
- [ ] HTTP provider functional (tested against EVA dev)
- [ ] Framework mapper operational (ATLAS + OWASP tags applied)
- [ ] Evidence pack generator working (ATO manifest generated)
- [ ] GitHub Actions workflows configured (PR gate + nightly)
- [ ] MTI score ≥ 70 (eva-veritas audit)
- [ ] 5 real vulnerabilities discovered in EVA dev (proof of value)

✅ **Should Have** (Nice to Have):
- [ ] Golden suite (regression baseline)
- [ ] Dashboard visualization (web UI)
- [ ] Custom assertions (bilingual, EVA-specific)

⏸️ **Won't Have** (Deferred to Phase 2):
- MCP provider (agent testing)
- Project 58 integration (Observatory component)
- Additional ATLAS tactics (Reconnaissance, Initial Access, Execution)
- Compliance reports (ITSG-33, SOC 2, HIPAA)

---

## Risk Register

| Risk | Impact | Probability | Mitigation | Status |
|------|--------|-------------|------------|--------|
| **Promptfoo breaking changes** | High | Low | Pin version in package.json, monitor changelog | ✅ Mitigated |
| **False positive rate** | Medium | Medium | Tune assertions, add LLM-based validation, manual review | 📋 Planned |
| **Performance (scan time)** | Medium | Low | Parallel execution, caching, incremental scans | 📋 Planned |
| **P58 dependency blocking** | Low | Low | P36 delivers standalone value, P58 is Phase 2 | ✅ Mitigated |
| **Framework mapping accuracy** | Medium | Medium | Peer review, publish for community validation | 📋 Planned |
| **ATO acceptance** | High | Medium | Engage ITSG-33 auditor early (Phase 1), iterate | ⏳ In Progress |
| **EVA API availability** | High | Low | Use dev environment, fallback to mock provider | ✅ Mitigated |

---

## Ownership

| Role | Owner | Contact |
|------|-------|---------|
| **Project Lead** | AICOE | N/A |
| **Framework & Governance** | AICOE | N/A |
| **Promptfoo Integration** | TBD | TBD |
| **P58 Observatory Integration** | TBD | TBD |
| **Security Review** | TBD | TBD |
| **ATO Champion** | TBD | TBD |

---

**Status Legend**:
- ✅ Done / Mitigated
- ⏳ In Progress
- 📋 Planned / Not Started
- ⏸️ Deferred
- ❌ Out of Scope / Blocked
- ⚠️ Incomplete / Needs Attention
| Test coverage & remediation | Application teams |
| Acceptance criteria / ATO evidence | IT Security |


---

## 2026-03-03 -- Re-primed by agent:copilot

<!-- eva-primed-status -->

Data model: GET http://localhost:8010/model/projects/36-red-teaming
29-foundry agents: C:\eva-foundry\eva-foundation\29-foundry\agents\
48-eva-veritas: run audit_repo MCP tool
