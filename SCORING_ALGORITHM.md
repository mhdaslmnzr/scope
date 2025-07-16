# SCOPE Vendor Risk Scoring Algorithm

This document explains the vendor risk scoring algorithm used in the SCOPE platform. The algorithm is designed to provide a comprehensive, multi-dimensional risk score for each vendor, based on four main pillars and a set of weighted subcategories.

---

## Overview

Each vendor is assessed across **four risk pillars**:

1. **Cybersecurity**
2. **Compliance**
3. **Geopolitical**
4. **Reputation**

Each pillar is composed of several subcategories (scoring components), each with its own weight. The final aggregate score is a weighted sum of all subcategory scores, normalized to a 0-100 scale.

---

## Pillars, Categories, and Weights

### 1. **Cybersecurity**
- **Vulnerability Management** (weight: 5)
- **Attack Surface** (5)
- **Web/App Security** (5)
- **Cloud & Infra** (5)
- **Email Security** (5)
- **Code Repo Exposure** (5)
- **Endpoint Hygiene** (5)
- **IOC & Infra Threat** (3)
- **Detection & Response** (2)

### 2. **Compliance**
- **Certifications** (6)
- **Questionnaire Quality** (5)
- **Regulatory Violations** (5)
- **Privacy Compliance** (2)
- **Contractual Clauses** (2)

### 3. **Geopolitical**
- **Country Risk** (6)
- **Sector Risk** (4)
- **Company Size** (3)
- **Infra Jurisdiction** (3)
- **Concentration Risk** (2)
- **Environmental Exposure** (2)

### 4. **Reputation**
- **Data Breach History** (6)
- **Credential/Data Leaks** (5)
- **Brand Spoofing** (3)
- **Dark Web Presence** (3)
- **Social Sentiment** (3)

---

## Scoring Steps

### 1. Score Assignment
Each subcategory is scored from 0 to 100 based on vendor data and assessment results.

### 2. Weight Application
Each subcategory score is multiplied by its weight.

---

## Calculation Code Examples

### Calculate Each Pillar Score
For each pillar (e.g., Cybersecurity), sum the weighted scores of its subcategories and divide by the total weight for that pillar:

```js
function calculatePillarScore(scoreDetails, pillarCategories) {
  // scoreDetails: array of { category, score, weight }
  // pillarCategories: array of category names for the pillar
  const items = scoreDetails.filter(item => pillarCategories.includes(item.category));
  const weightedSum = items.reduce((sum, item) => sum + item.score * item.weight, 0);
  const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
  return totalWeight > 0 ? weightedSum / totalWeight : 0;
}
```

### Calculate Aggregate Score
Sum the weighted scores of all subcategories and divide by the total weight:

```js
function calculateAggregateScore(scoreDetails) {
  const weightedSum = scoreDetails.reduce((sum, item) => sum + item.score * item.weight, 0);
  const totalWeight = scoreDetails.reduce((sum, item) => sum + item.weight, 0);
  return totalWeight > 0 ? weightedSum / totalWeight : 0;
}
```

### Apply Criticality Multiplier (Optional)
Optionally, adjust the aggregate score by a multiplier based on vendor criticality:

```js
function applyCriticalityMultiplier(aggregateScore, criticality) {
  const multipliers = {
    'Critical': 1.25,
    'High': 1.10,
    'Medium': 1.00,
    'Low': 0.85,
  };
  return aggregateScore * (multipliers[criticality] || 1.0);
}
```

---

## Explanations for Each Subcategory

- **Vulnerability Management**: Assesses open CVEs, patch cycles, and outdated software.
- **Attack Surface**: Evaluates open ports, misconfigured services, and exposed assets.
- **Web/App Security**: Checks TLS version, CMS exposure, and authentication endpoints.
- **Cloud & Infra**: Reviews S3 buckets, API security, and cloud config hygiene.
- **Email Security**: Checks SPF, DKIM, and DMARC presence.
- **Code Repo Exposure**: Detects hardcoded secrets and public GitHub leaks.
- **Endpoint Hygiene**: Assesses use of MDM, AV, and device control.
- **IOC & Infra Threat**: Looks for blacklisted IPs, C2 infrastructure, and threat feed matches.
- **Detection & Response**: Measures SOC readiness, IR plans, and logging coverage.
- **Certifications**: Considers ISO 27001, SOC2, NIST CSF, PCI DSS, etc.
- **Questionnaire Quality**: Evaluates depth and honesty in SIG/OpenFAIR/NIST documents.
- **Regulatory Violations**: Checks for sanctions, fines, or penalties from data protection bodies.
- **Privacy Compliance**: Assesses GDPR, HIPAA, CCPA alignment.
- **Contractual Clauses**: Checks encryption, MFA, audit rights in contracts.
- **Country Risk**: Considers political instability, sanctions, cyber laws, OFAC lists.
- **Sector Risk**: Industry classification (e.g., Finance = High risk).
- **Company Size**: Global footprint, employee size, asset sprawl.
- **Infra Jurisdiction**: Location of hosted systems and legal exposure.
- **Concentration Risk**: Critical vendor used across multiple internal systems.
- **Environmental Exposure**: Natural disaster risk at HQ or primary DC.
- **Data Breach History**: Known breaches, data loss events.
- **Credential/Data Leaks**: Leaked email/password, exposed keys.
- **Brand Spoofing**: Typosquatting, cloned sites, social spoofing.
- **Dark Web Presence**: Mentions in threat actor channels, paste dumps.
- **Social Sentiment**: Media coverage, defacements, hacktivist attention.

---

## Example Calculation

Suppose a vendor has the following scores (out of 100) and weights for three subcategories:

- Vulnerability Management: 40 (weight 5)
- Code Repo Exposure: 30 (weight 5)
- Data Breach History: 60 (weight 6)

Weighted sum = (40×5) + (30×5) + (60×6) = 200 + 150 + 360 = 710
Total weight = 5 + 5 + 6 = 16
Aggregate Score = 710 / 16 = 44.4

---

## Notes
- All scores and weights are currently hardcoded for demonstration. In production, these will be dynamically calculated based on real vendor data and assessments.
- The algorithm is designed to be transparent and explainable for both technical and non-technical users. 