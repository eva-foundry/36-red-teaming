# 36-red-teaming -- Acceptance Criteria

**Template Version**: v5.0.0 (Session 44 - Governance Template Consolidation)
**Created**: 2026-03-12 by agent:AIAgentExpert
**Last Updated**: 2026-03-12
**Data Model**: GET https://msub-eva-data-model.victoriousgrass-30debbd3.canadacentral.azurecontainerapps.io/model/projects/36-red-teaming
**Status**: Foundation Prime

---

<!-- eva-primed-acceptance -->

## Summary

| Gate | Criteria | Status |
|------|----------|--------|
| AC-1 | Data model record exists and is current | PENDING |
| AC-2 | copilot-instructions.md is v5.0.0 compliant (PART 1/2 present, ASCII-clean) | PENDING |
| AC-3 | Veritas trust score >= 0.6 (MTI baseline) | PENDING |
| AC-4 | All tests pass (exit 0) | PENDING |
| AC-5 | No non-ASCII characters in any .md or .ps1 or .py file | PENDING |
| AC-6 | PLAN.md has active sprint stories with IDs | PASS |
| AC-7 | README.md references data-model API and veritas | PASS |
| AC-8 | Core functionality implemented and operational | PENDING |
| AC-9 | Promptfoo smoke suite operational (< 2 min runtime) | PENDING |
| AC-10 | Framework mapping complete (5 frameworks) | PENDING |
| AC-11 | Evidence pack generator operational | PENDING |
| AC-12 | Project 58 integration tested | PENDING |

---

## AC-1: Data Model Record Current

**Criteria**: `GET /model/projects/36-red-teaming` returns maturity, phase, pbi_total >= 1.
**Verification**:
```powershell
$base = "https://msub-eva-data-model.victoriousgrass-30debbd3.canadacentral.azurecontainerapps.io"
Invoke-RestMethod "$base/model/projects/36-red-teaming" |
    Select-Object id, maturity, phase, pbi_total, pbi_done, notes
```
**Status**: PENDING (Create record: POST /model/projects)

---

## AC-2: copilot-instructions.md Compliant

**Criteria**: PART 1, PART 2 present. ASCII-clean. v5.0.0 template compliant.
**Verification**: Run MCP tool `audit_project` with target_path = C:\eva-foundry\36-red-teaming
**Status**: PENDING (Update copilot-instructions.md)

---

## AC-3: Veritas Trust Score

**Criteria**: MTI score >= 60 on first audit (baseline governance complete).
**Verification**:
```bash
# CLI mode (preferred for single-repo validation)
node C:\eva-foundry\48-eva-veritas\src\cli.js audit --repo C:\eva-foundry\36-red-teaming --threshold 60

# MCP mode (for orchestration/automation)
MCP tool: get_trust_score  repo_path=C:\eva-foundry\36-red-teaming
```
**MTI Score Ranges** (from Project 48 eva-veritas):
- 90-100: Trusted - Evidence complete, approved to ship
- 75-89: Conditional-deploy - Minor gaps, document and proceed
- 60-74: Review-required - Phase 1 complete, Phase 2 gaps remain
- 45-59: Review-required - Significant gaps, review before deploy
- 0-44: Block - Critical gaps, do not deploy
- null: Ungoverned - No stories in PLAN.md, add governance

**Formula**: Adaptive 3/4/5-component based on available data (coverage 35%, evidence 20%, consistency 25%, complexity 10%, field_population 10%)

**Status**: PENDING (Run audit after Sprint 1 completion)

---

## AC-4: All Tests Pass

**Criteria**: Test suite exits 0, >= 80% coverage.
**Verification**:
```powershell
cd C:\eva-foundry\36-red-teaming
# Run promptfoo smoke suite
promptfoo eval -c test-suites/smoke.yaml
# Check exit code
if ($LASTEXITCODE -eq 0) { Write-Host "PASS" } else { Write-Host "FAIL" }
```
**Status**: PENDING (Create smoke suite - Story 36-03-002)

---

## AC-5: ASCII-Clean Markdown

**Criteria**: No non-ASCII chars in .md, .ps1, .py files.
**Verification**:
```powershell
Get-ChildItem -Path "C:\eva-foundry\36-red-teaming" -Recurse -Include *.md,*.ps1,*.py,*.js,*.yaml |
    Select-String '[^\x00-\x7F]' |
    Select-Object -First 10
```
**Status**: PENDING (Validate before first commit)

---

## AC-6: PLAN.md Has Active Stories

**Criteria**: At least 1 feature with ID=36-01, at least 1 story with ID=36-01-001.
**Verification**: Manual review of PLAN.md
**Status**: PASS (9 features, 27 stories defined - 2026-03-12)

---

## AC-7: README.md References

**Criteria**: README.md includes data-model API link and veritas MCP tool instructions.
**Verification**: Grep README.md for "msub-eva-data-model" and "audit_repo"
**Status**: PASS (README.md created 2026-03-12 with all references)

---

## AC-8: Core Functionality Operational

**Criteria**: Primary project deliverable (AI security scanning with promptfoo) is implemented and functional.
**Verification**: 
1. Promptfoo installed and configured
2. Azure OpenAI provider operational
3. At least one test suite runs successfully
4. Evidence files generated

**Status**: PENDING (Sprint 1 implementation)

---

## AC-9: Promptfoo Smoke Suite Operational

**Criteria**: Smoke test suite runs in < 2 minutes, blocks PR on failure.
**Verification**:
```powershell
# Run smoke suite with timing
Measure-Command { promptfoo eval -c test-suites/smoke.yaml --concurrency 5 }
# Should complete in < 120 seconds
```
**Acceptance Thresholds**:
- [ ] Runtime < 2 minutes
- [ ] 10-15 critical security tests
- [ ] GitHub Actions workflow configured
- [ ] PR blocking on failure

**Status**: PENDING (Story 36-03-002)

---

## AC-10: Framework Mapping Complete

**Criteria**: All 5 security frameworks mapped to promptfoo plugins with crosswalk database.
**Verification**:
```powershell
# Check framework-crosswalk.json exists and validates
Test-Path "C:\eva-foundry\36-red-teaming\mappings\framework-crosswalk.json"
node scripts/validate-crosswalk.js
```
**Framework Coverage**:
- [ ] MITRE ATLAS: 14 tactics, 40+ techniques
- [ ] OWASP LLM Top 10: 10 vulnerability categories
- [ ] NIST AI RMF: 4 functions, 7 categories, 23 subcategories
- [ ] ITSG-33: 20 security control families
- [ ] EU AI Act: Article 15 + Article 52

**Status**: PENDING (Sprint 2 - Feature 36-04)

---

## AC-11: Evidence Pack Generator Operational

**Criteria**: Automated evidence pack generation produces ATO-ready ZIP archive.
**Verification**:
```powershell
# Run evidence pack builder
.\scripts\build-evidence-pack.ps1 -InputDir output -OutputDir evidence-packs
# Verify ZIP structure
Expand-Archive -Path "evidence-packs\evidence-pack-*.zip" -DestinationPath "temp-verify"
Test-Path "temp-verify\manifest.json"
Test-Path "temp-verify\test-results"
Test-Path "temp-verify\compliance-matrices"
```
**Required Artifacts**:
- [ ] Test results (JSONL, HTML)
- [ ] Compliance matrices (5 frameworks × CSV/HTML)
- [ ] Framework documentation
- [ ] Executive summary (PDF)
- [ ] Manifest with SHA256 hashes

**Status**: PENDING (Sprint 2 - Story 36-06-001)

---

## AC-12: Project 58 Integration Tested

**Criteria**: Observatory API client successfully submits scan results to Project 58.
**Verification**:
```powershell
# Test Observatory API client
node integrations/submit-to-observatory.js --dry-run
# Verify no errors, valid payload generated
```
**Integration Requirements**:
- [ ] Observatory API client operational
- [ ] Finding transformation pipeline tested
- [ ] Automated nightly submission configured
- [ ] Results visible in Observatory UI

**Status**: PENDING (Sprint 3 - Feature 36-07)

---

## Quality Gates

### Sprint 1 Advance Gate (Foundation Complete)
- [ ] AC-1: Data model record exists - PASS
- [ ] AC-3: MTI score >= 60 - PASS
- [ ] AC-4: Smoke tests pass - PASS
- [ ] AC-8: Promptfoo operational - PASS
- [ ] AC-9: Smoke suite < 2 min - PASS
- [ ] Test coverage >= 80%
- [ ] No P0/P1 bugs
- [ ] All Feature 36-01, 36-02, 36-03 stories DONE

**Exit Criteria**: Promptfoo engine operational, EVA providers working, smoke tests passing in CI/CD

---

### Sprint 2 Advance Gate (Framework Integration Complete)
- [ ] Sprint 1 Gate: PASS
- [ ] AC-10: Framework mapping complete - PASS
- [ ] AC-11: Evidence pack generator operational - PASS
- [ ] MTI score >= 70
- [ ] 200+ tests operational (3 ATLAS test packs)
- [ ] Nightly scan produces evidence pack
- [ ] All Feature 36-04, 36-05, 36-06 stories DONE

**Exit Criteria**: 5 frameworks mapped, ATLAS test packs operational, evidence packs generated

---

### Sprint 3 Advance Gate (Observatory Integration Complete)
- [ ] Sprint 2 Gate: PASS
- [ ] AC-12: Project 58 integration tested - PASS
- [ ] MTI score >= 75
- [ ] Observatory receives nightly scans
- [ ] Unified reporting operational
- [ ] Executive reports generated
- [ ] All Feature 36-07, 36-08, 36-09 stories DONE

**Exit Criteria**: Project 58 integration complete, unified reporting operational, CI/CD stable

---

### Phase 1 Release Gate (Foundation Phase Complete)
- [ ] Sprint 3 Gate: PASS
- [ ] All acceptance criteria (AC-1 through AC-12): PASS
- [ ] MTI score >= 75
- [ ] Documentation complete (README, PLAN, STATUS, ACCEPTANCE, copilot-instructions)
- [ ] All 9 features (36-01 through 36-09) marked DONE
- [ ] Evidence of successful production use (1+ week of nightly scans)
- [ ] No P0 bugs, < 5 P1 bugs
- [ ] Stakeholder sign-off (Project 58 team, AICOE leadership)

**Exit Criteria**: Production-ready AI Security Observatory providing dual value streams (standalone ATO evidence + integrated Observatory component)

---

## Evidence Tracking

Evidence artifacts for acceptance validation are stored in `evidence/` directory:

### Governance Evidence
- `evidence/governance-prime-{YYYYMMDD}.json` - Governance template compliance
- `evidence/veritas-audit-{YYYYMMDD}.json` - MTI score audit results
- `evidence/ascii-validation-{YYYYMMDD}.txt` - Character encoding validation

### Functional Evidence
- `evidence/36-01-001-promptfoo-install-{YYYYMMDD}.json` - Promptfoo installation
- `evidence/36-01-002-azure-openai-config-{YYYYMMDD}.json` - Azure OpenAI configuration
- `evidence/36-03-002-smoke-suite-{YYYYMMDD}.json` - Smoke suite execution
- `evidence/36-04-001-framework-crosswalk-{YYYYMMDD}.json` - Framework crosswalk database
- `evidence/36-06-001-evidence-pack-builder-{YYYYMMDD}.json` - Evidence pack generation
- `evidence/36-07-001-observatory-client-{YYYYMMDD}.json` - Observatory API integration

### Test Evidence
- `output/smoke-results-{YYYYMMDD}.jsonl` - Smoke test results
- `output/nightly-results-{YYYYMMDD}.jsonl` - Nightly scan results
- `evidence-packs/evidence-pack-{YYYYMMDD}.zip` - ATO evidence packs

---

## Compliance & Security Attestation

### Security Testing Completeness
- [ ] MITRE ATLAS coverage: >= 50% of techniques tested
- [ ] OWASP LLM Top 10: All 10 categories tested
- [ ] NIST AI RMF: >= 60% of subcategories tested
- [ ] ITSG-33: >= 40% of control families tested
- [ ] EU AI Act: Article 15 + 52 compliance documented

### Data Protection
- [ ] No Canadian PII in test outputs (SIN, health card, credit card)
- [ ] No Azure secrets in code/logs (Key Vault integration only)
- [ ] Test data anonymized/synthetic
- [ ] Evidence packs encrypted at rest (Azure Blob Storage)

### Operational Readiness
- [ ] Runbooks documented (installation, configuration, troubleshooting)
- [ ] Disaster recovery tested (restore from evidence pack)
- [ ] Monitoring configured (GitHub Actions + Azure Monitor)
- [ ] Incident response plan documented

---

## Definition of Done (Project-Level)

A project is considered **DONE** when:

1. **All Quality Gates**: Sprint 1, 2, 3, and Phase 1 Release gates PASS
2. **All Acceptance Criteria**: AC-1 through AC-12 show PASS status
3. **MTI >= 75**: Veritas audit shows MTI score >= 75 (conditional-deploy or trusted)
4. **Production Evidence**: >= 7 days of successful nightly scans in production
5. **Documentation Complete**: All governance docs updated, architecture docs complete
6. **Stakeholder Sign-Off**: Project 58 team + AICOE leadership approval
7. **Zero P0 Bugs**: No critical blockers, < 5 P1 bugs
8. **Evidence Archive**: All ATO evidence packs published to Azure Blob Storage

**Phase 1 Target Date**: Q2 2026 (6 weeks from kickoff)

---

## Verification Checklist (Before Release)

### Pre-Release Validation
```powershell
# 1. Run full veritas audit
node C:\eva-foundry\48-eva-veritas\src\cli.js audit --repo C:\eva-foundry\36-red-teaming --threshold 75

# 2. Validate ASCII-clean
Get-ChildItem -Path "C:\eva-foundry\36-red-teaming" -Recurse -Include *.md,*.ps1,*.py,*.js,*.yaml | 
    Select-String '[^\x00-\x7F]' | Measure-Object | Select-Object -ExpandProperty Count
# Should return 0

# 3. Run smoke suite
promptfoo eval -c test-suites/smoke.yaml --concurrency 5
# Should exit 0 in < 2 minutes

# 4. Run nightly suite
promptfoo eval -c test-suites/nightly.yaml
# Should complete with >= 200 tests

# 5. Generate evidence pack
.\scripts\build-evidence-pack.ps1 -InputDir output -OutputDir evidence-packs
# Should create timestamped ZIP with all artifacts

# 6. Test Observatory integration
node integrations/submit-to-observatory.js --dry-run
# Should succeed with valid payload

# 7. Verify data model sync
Invoke-RestMethod "https://msub-eva-data-model.victoriousgrass-30debbd3.canadacentral.azurecontainerapps.io/model/projects/36-red-teaming"
# Should return current project state
```

### Post-Release Monitoring (First 7 Days)
- [ ] Day 1: Verify nightly scan runs successfully
- [ ] Day 2: Verify evidence pack uploaded to Blob Storage
- [ ] Day 3: Verify Observatory receives scan results
- [ ] Day 4: Verify no alerts/failures in GitHub Actions
- [ ] Day 5: Verify MTI score stable >= 75
- [ ] Day 6: Verify executive report generated
- [ ] Day 7: Stakeholder review + sign-off

---

**Foundation Prime Status**: Acceptance criteria defined (2026-03-12)  
**Next Milestone**: Sprint 1 Advance Gate (MTI >= 60, smoke tests operational)
