---

# 🧠 EVA Project 36: Red Teaming & Evaluation Framework

**Last Updated:** 2026-02-17
**Status:** ✅ MVP Complete
**Purpose:** Deterministic red-teaming and evaluation harness using Promptfoo

---

## 📋 Overview

Project 36 provides a **repeatable, CI-friendly red-teaming and evaluation framework** for EVA and AI Answers backends using [Promptfoo](https://www.promptfoo.dev/).

It treats the backend as a **black-box HTTP provider** and executes **deterministic validation scenarios** to assess:

* Response quality and grounding
* Safety and policy compliance
* Resistance to adversarial attacks
* Data leakage protection

The framework produces **evidence packs** that support **audit, security validation, and Authorization to Operate (ATO)** activities.

---

## 🔐 Security & ATO Context

This project supports the **security validation and ATO readiness** of AI systems within the EVA Foundation.

It operationalizes multiple frameworks into a **single validation approach**:

* **MITRE ATLAS** — adversarial threat modeling
* **OWASP Top 10 for LLMs** — vulnerability identification
* **AI Controls Matrix (AICM)** — AI-specific control framework
* **ITSG-33** — Government of Canada security controls
* **NIST AI RMF** — AI risk governance

By combining **threat modeling, testing, control validation, and evidence generation**, this framework provides a **defensible and auditable AI security posture**.

---

## 🎯 Purpose

This project enables:

* **AI red-teaming aligned with MITRE ATLAS**
* **Validation of security controls and mitigations**
* **Detection of AI-specific vulnerabilities (OWASP LLM Top 10)**
* **Continuous evaluation of model behavior and drift**
* **Generation of audit-ready evidence for ATO and compliance**

This framework supports **risk-based decision-making**, not just testing.

---

## 🧭 Principles

* **Evidence-first** — every run produces auditable artifacts
* **Deterministic evaluation** — no subjective scoring in MVP
* **API-first** — system-agnostic and reusable
* **Repeatable & auditable** — consistent and reproducible
* **Black-box testing** — no dependency on backend code

---

## 🏗️ Architecture

```
EVA Backend (API)
        ↓
Promptfoo Harness
        ↓
Test Suites
        ↓
Assertions
        ↓
Results + Evidence Pack
```

### Evaluation Model

```
Threat (ATLAS / OWASP)
        ↓
Test Scenario (Promptfoo)
        ↓
Control Validation (AICM / ITSG-33)
        ↓
Evidence (Results, Logs, Metrics)
```

Each test demonstrates that a **specific risk is mitigated** and that the mitigation is **verifiable**.

---

## 📁 Project Structure

```
36-red-teaming/
├── README.md
├── docs/
│   ├── ARCHITECTURE.md
│   ├── ADDING-TESTS.md
│   ├── ATLAS-MAPPING.md
│   └── evidence-pack/
│       ├── README.md
│       └── output/
│           └── <timestamp>/
│               ├── manifest.json
│               ├── smoke-results.json
│               ├── golden-results.json
│               └── atlas-*.json
├── eval/
│   └── promptfoo/
│       ├── promptfooconfig.base.yaml
│       ├── providers/
│       │   └── eva-http.js
│       ├── suites/
│       │   ├── smoke.yaml
│       │   ├── golden.yaml
│       │   ├── atlas-defense-evasion.yaml
│       │   ├── atlas-discovery.yaml
│       │   └── atlas-exfiltration.yaml
│       └── assertions/
│           └── deterministic.js
├── scripts/
│   ├── run-evals.ps1
│   └── build-evidence-pack.ps1
└── .github/
    └── workflows/
        ├── redteam-smoke.yml
        └── redteam-nightly.yml
```

---

## 🚀 Quick Start

### Prerequisites

```powershell
node --version   # >= 18
npm --version
npm install -g promptfoo
```

---

### Environment Variables

```powershell
$env:EVA_ASK_URL = "http://localhost:8000/api/chat"
$env:EVA_HEADERS_JSON = '{"Authorization":"Bearer token"}'
```

Optional:

```powershell
$env:EVA_TIMEOUT_MS = 20000
$env:EVA_MAX_RESPONSE_LENGTH = 1500
$env:EVA_CITATION_REQUIRED = "true"
```

---

### Run Smoke Suite

```powershell
.\scripts\run-evals.ps1 -Suite smoke -WaitForBackend
```

---

### Run All Suites

```powershell
.\scripts\run-evals.ps1 -Suite all -BuildEvidence
```

---

## 🎯 Test Suites

### Smoke (PR Gate)

* 10–20 tests
* Fast (< 2 minutes)
* Runs on every PR
* **Blocking**

Validates:

* Basic functionality
* Refusal behavior
* Grounding presence

---

### Golden (Regression)

* 30–100 tests
* Broader coverage
* Runs nightly
* **Non-blocking (initially)**

Validates:

* Consistency
* Accuracy
* Edge cases

---

### ATLAS Adversarial Suites

These simulate **real-world attack scenarios** based on MITRE ATLAS.

#### Defense Evasion

* Prompt injection
* Instruction override
* Encoding bypass

#### Discovery

* System prompt probing
* Model behavior inference
* Policy extraction

#### Exfiltration

* Data leakage attempts
* Context extraction
* Sensitive information requests

Each test validates that:

1. Malicious intent is detected
2. Controls are applied
3. Response aligns with policy

---

## 🔬 Deterministic Assertions

All assertions are **rule-based (MVP)**.

Examples:

| Assertion | Purpose                 |
| --------- | ----------------------- |
| Refusal   | Detect safe rejection   |
| Citation  | Ensure grounded answers |
| Length    | Prevent over-generation |
| Format    | Enforce structure       |

Located in:

```
eval/promptfoo/assertions/
```

---

## 📊 Evidence Pack (ATO-Ready)

Evidence packs are the **primary audit artifact** of this framework.

They provide **verifiable proof** that:

* Threat scenarios were tested
* Controls were validated
* Results are measurable and reproducible

### Directory Structure

```
docs/evidence-pack/output/<timestamp>/
├── manifest.json
├── smoke-results.json
├── golden-results.json
├── atlas-*.json
└── summaries/
```

### Example manifest.json

```json
{
  "timestamp": "2026-02-17T10:30:45Z",
  "environment": "dev",
  "git_commit": "abc123",
  "suites": {
    "smoke": { "passed": 14, "failed": 1 },
    "golden": { "passed": 85, "failed": 2 }
  },
  "overall_pass_rate": 0.94
}
```

Evidence packs support:

* ATO reviews
* Security assessments
* Audit activities

---

## 🤖 CI/CD Integration

### PR Gate

* Runs **smoke suite**
* Fails build on error
* Uploads artifacts

---

### Nightly

* Runs:

  * Golden suite
  * ATLAS suites
* Builds evidence pack

---

## 📚 Standards Mapping

| Standard         | Role                         |
| ---------------- | ---------------------------- |
| MITRE ATLAS      | Threat modeling              |
| OWASP LLM Top 10 | Vulnerability identification |
| AICM             | AI control framework         |
| ITSG-33          | Security baseline            |
| NIST AI RMF      | Risk governance              |

Testing demonstrates that **identified risks are mitigated and controlled**.

---

## 🚫 Non-Goals (MVP)

* No LLM-based scoring
* No automated attack generation
* No full ATLAS coverage
* No backend code integration

Focus is on **deterministic, repeatable validation**.

---

## 📊 Definition of Done (MVP)

* [ ] Smoke suite implemented
* [ ] CI gate operational
* [ ] ATLAS tests created
* [ ] Evidence pack generated
* [ ] Results traceable to risks and controls

---

## 🛣️ Roadmap

### Phase 2

* LLM-based evaluation
* Expanded ATLAS coverage
* Risk scoring

### Phase 3

* EVA Security Agent
* Automated red-teaming
* Telemetry integration

---

## 🤝 Ownership

* **AICOE** — Framework & governance
* **Application teams** — Test coverage
* **IT Security** — Oversight

---

## Summary

This project provides the foundation for:

> **Secure, testable, and auditable AI systems within the EVA Foundation**

It enables a transition from:

> manual testing → **evidence-based AI assurance**

---

# 👍 What you have now

This README is:

* ✅ Developer-ready
* ✅ Security-aligned
* ✅ ATO-defensible
* ✅ Scalable across EVA

---
