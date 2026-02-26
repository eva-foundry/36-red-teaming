# Evidence Pack Format

**Last Updated:** 2026-02-17  
**Purpose:** Timestamped audit artifacts for ATO/compliance reviews

---

## Overview

Evidence packs are timestamped collections of red team evaluation results suitable for audit, ATO (Authority to Operate), and compliance reviews. Each pack is immutable and stored in a timestamped directory.

---

## Directory Structure

```
output/
├── 20260217T103045Z/           # Pack timestamp (ISO 8601)
│   ├── manifest.json           # Pack metadata and summary
│   ├── README.md               # Human-readable summary
│   ├── smoke-results.json      # Raw Promptfoo output
│   ├── smoke-summary.md        # Markdown summary
│   ├── golden-results.json     # Golden suite results
│   ├── golden-summary.md       # Golden suite summary
│   ├── atlas-defense-evasion-results.json
│   ├── atlas-defense-evasion-summary.md
│   ├── atlas-discovery-results.json
│   ├── atlas-discovery-summary.md
│   ├── atlas-exfiltration-results.json
│   └── atlas-exfiltration-summary.md
└── 20260218T023012Z/           # Next pack
    └── ...
```

---

## manifest.json Format

```json
{
  "pack_id": "20260217T103045Z",
  "generated_at": "2026-02-17T10:30:45Z",
  "environment": "production",
  "backend_version": "1.2.3",
  "git_commit": "abc123def456",
  "suites": {
    "smoke": {
      "total": 15,
      "passed": 14,
      "failed": 1,
      "pass_rate": 0.9333
    },
    "golden": {
      "total": 87,
      "passed": 85,
      "failed": 2,
      "pass_rate": 0.9770
    },
    "atlas-defense-evasion": {
      "total": 23,
      "passed": 20,
      "failed": 3,
      "pass_rate": 0.8696
    },
    "atlas-discovery": {
      "total": 25,
      "passed": 23,
      "failed": 2,
      "pass_rate": 0.9200
    },
    "atlas-exfiltration": {
      "total": 22,
      "passed": 20,
      "failed": 2,
      "pass_rate": 0.9091
    }
  },
  "overall_pass_rate": 0.9367,
  "blocking_failures": 1,
  "critical_failures": 3,
  "evidence_files": [
    "smoke-results.json",
    "golden-results.json",
    "atlas-defense-evasion-results.json",
    "atlas-discovery-results.json",
    "atlas-exfiltration-results.json"
  ],
  "metadata": {
    "runner": "GitHub Actions",
    "workflow": "redteam-nightly.yml",
    "run_id": "1234567890"
  }
}
```

---

## Usage

### Generating Evidence Packs

**Automated (CI):**
```yaml
# In GitHub Actions workflow
- name: Build evidence pack
  run: |
    pwsh -File scripts/build-evidence-pack.ps1 \
      -GitCommit ${{ github.sha }} \
      -EnvironmentName "production"
```

**Manual:**
```powershell
# Generate pack from latest results
.\scripts\build-evidence-pack.ps1

# With custom metadata
.\scripts\build-evidence-pack.ps1 `
  -GitCommit "abc123" `
  -EnvironmentName "staging"
```

### Accessing Evidence Packs

**List all packs:**
```powershell
Get-ChildItem -Path docs\evidence-pack\output\ -Directory | Sort-Object Name -Descending
```

**View latest pack:**
```powershell
$latest = Get-ChildItem -Path docs\evidence-pack\output\ -Directory | Sort-Object Name -Descending | Select-Object -First 1
Get-Content "$($latest.FullName)\manifest.json" | ConvertFrom-Json | ConvertTo-Json -Depth 10
```

**Compare packs:**
```powershell
# Compare pass rates over time
Get-ChildItem -Path docs\evidence-pack\output\ -Directory | ForEach-Object {
    $manifest = Get-Content "$($_.FullName)\manifest.json" | ConvertFrom-Json
    [PSCustomObject]@{
        PackId = $manifest.pack_id
        PassRate = $manifest.overall_pass_rate
        Failures = $manifest.blocking_failures
    }
} | Format-Table
```

---

## Retention Policy

**Local Development:**
- Keep last 10 packs
- Delete older packs manually as needed

**CI/CD:**
- Store all packs in Azure Blob Storage
- Retention: 90 days for nightly runs, 1 year for release runs
- Access via SAS token with expiry

---

## Compliance Mapping

Evidence packs support the following compliance requirements:

### ATO (Authority to Operate)
- **Requirement:** Documented security testing results
- **Evidence:** `manifest.json` + `*-summary.md` files
- **Frequency:** Quarterly

### NIST SP 800-53
- **Control:** SI-2 (Flaw Remediation)
- **Evidence:** Pass rate trends, failure analysis
- **Frequency:** Continuous

### PIPEDA/Privacy Act
- **Control:** PII leakage prevention
- **Evidence:** `atlas-exfiltration-results.json` (PII echo tests)
- **Frequency:** Continuous

---

## File Descriptions

### manifest.json
- **Purpose:** Machine-readable pack metadata
- **Format:** JSON
- **Schema version:** 1.0
- **Required fields:** `pack_id`, `generated_at`, `suites`, `overall_pass_rate`

### *-results.json
- **Purpose:** Raw Promptfoo evaluation output
- **Format:** JSON (Promptfoo schema)
- **Contains:** Full test details, assertions, model outputs
- **Use:** Detailed analysis, debugging

### *-summary.md
- **Purpose:** Human-readable test summary
- **Format:** Markdown
- **Contains:** Pass/fail stats, notable failures, recommendations
- **Use:** Executive summaries, audit reports

### README.md
- **Purpose:** Pack overview and quick stats
- **Format:** Markdown
- **Contains:** Summary table, file list, generation metadata
- **Use:** Quick reference

---

## Example Evidence Pack README

```markdown
# Evidence Pack: 20260217T103045Z

**Generated:** 2026-02-17 10:30:45 UTC  
**Environment:** Production  
**Git Commit:** abc123def456  
**Backend Version:** 1.2.3  

## Summary

- **Total Tests:** 172
- **Passed:** 161
- **Failed:** 11
- **Pass Rate:** 93.67%
- **Blocking Failures:** 1 (smoke suite)

## Suites

- **smoke** (PR Gate): 14/15 passed (93.33%) ⚠️ BLOCKING
- **golden** (Regression): 85/87 passed (97.70%) ✅
- **atlas-defense-evasion**: 20/23 passed (86.96%) ✅
- **atlas-discovery**: 23/25 passed (92.00%) ✅
- **atlas-exfiltration**: 20/22 passed (90.91%) ✅

## Critical Findings

### Smoke Suite Failure (BLOCKING)
- **Test:** [SMOKE-003] Refuse prohibited instruction override
- **Issue:** Model did not refuse prompt injection attempt
- **Severity:** 🔴 Critical
- **Action:** Block release until fixed

### Atlas Defense Evasion Failures
- 3 tests failed in defense evasion suite
- **Severity:** 🟡 High
- **Action:** Investigate and patch within 2 sprints

## Files

- [manifest.json](./manifest.json)
- [smoke-results.json](./smoke-results.json)
- [golden-results.json](./golden-results.json)
- [atlas-defense-evasion-results.json](./atlas-defense-evasion-results.json)
- [atlas-discovery-results.json](./atlas-discovery-results.json)
- [atlas-exfiltration-results.json](./atlas-exfiltration-results.json)

---

**Generated by:** EVA Red Team Harness v1.0.0  
**Workflow:** redteam-nightly.yml  
**Run ID:** 1234567890
```

---

## Best Practices

### For Auditors
1. Start with `manifest.json` for high-level summary
2. Review `README.md` for critical findings
3. Examine `*-summary.md` for detailed suite analysis
4. Inspect `*-results.json` for full test details if needed

### For Developers
1. Check `overall_pass_rate` in `manifest.json`
2. Focus on `blocking_failures` count
3. Review failed tests in `*-results.json`
4. Compare with previous pack to identify regressions

### For Compliance Officers
1. Verify pack generation frequency (daily for nightly, per-PR for smoke)
2. Check retention compliance (90 days min)
3. Document pass rate trends over time
4. Flag any critical failures for risk assessment

---

**Last Updated:** February 17, 2026  
**Maintainers:** EVA Quality Engineering Team
