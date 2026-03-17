# Research Report: OpenCerts IM8 Compliance — What Needs to Be Done

**Date:** 2026-03-11
**Prepared by:** Alfred

---

## Overview

Singapore's IM8 (Instruction Manual for ICT & SS Management) is the mandatory security and governance policy framework for all Singapore government agencies and their vendors. OpenCerts is a blockchain-based digital certificate platform developed by GovTech, operated in partnership with SkillsFuture Singapore (SSG), and transitioning to IMDA maintenance from October 2025. While OpenCerts already benefits from strong cryptographic and blockchain-based security, achieving full IM8 compliance requires addressing specific requirements around data residency, access control, audit logging, vulnerability management, incident response, and third-party management — several of which are non-trivial given OpenCerts' use of the public Ethereum mainnet.

---

## Part 1 — What is IM8?

### Definition & Governance
- **IM8** = Instruction Manual for ICT & Smart Systems Management
- Governed by the **Smart Nation and Digital Government Group (SNDGG)**, administered by GovTech Singapore
- Mandatory for **all Singapore government agencies** and **private vendors serving the government**
- Subject to **regular audits** — non-compliance results in mandatory remediation

### Three Core Policy Domains

| Domain | What it covers |
|---|---|
| **Digital Service Standards (DSS)** | Standards for building and delivering digital government services |
| **Third Party Management (TPM)** | Requirements for vendors and suppliers handling government systems/data |
| **Data** | Data classification, protection, residency, and handling |

### Control Levels (Risk-Based Framework)

| Level | Type | Requirement |
|---|---|---|
| **Level 0** | Must-Haves | Mandatory for all systems — no exceptions |
| **Level 1** | Should-Haves | Strongly recommended; implement unless justification provided |
| **Level 2** | Good-to-Haves | Best practices; implement where feasible |

### Key Technical Requirements

| Area | Requirement |
|---|---|
| **Data Classification** | Classify data as Secret / Confidential / Restricted / Unclassified; apply controls per tier |
| **Access Control (IAM)** | Implement Identity & Access Management tooling; multi-factor authentication for privileged access |
| **Privileged Access Management** | PAM required with strong mandate for admin/privileged accounts |
| **Encryption** | Encryption keys must be stored in Singapore-housed Hardware Security Modules (HSMs) |
| **Data Residency** | Government data must remain within Singapore (IM8 clauses 10.5–10.11) |
| **Audit Logging** | Security logs must be enabled, retained, and protected from tampering |
| **Vulnerability Management** | Regular scans (agent-based or network-based); authenticated scans recommended; remediation with waiver for exceptions |
| **System Hardening** | Harden all systems per CIS Benchmark or OEM guidelines |
| **Incident Response** | Documented IR plan; SOP for containment, analysis, eradication, remediation; regular testing |

### Cloud-Specific Requirements
- Data must be hosted on **Government on Commercial Cloud (GCC)** platform for government workloads — provides pre-built IM8 compliance via AWS, Azure, or GCP in Singapore region
- Zero-trust network access, continuous monitoring, and robust incident response required
- MTCS Level 3 certification required for cloud service providers handling government data
- Encryption keys must remain in Singapore-based HSM clusters

### IM8 Reform (2026)
- Active reform initiative to make controls "lean, relevant, and effective"
- Controls now published in **OSCAL (Open Security Controls Assessment Language)** format for machine-readability and future compliance automation
- Differentiated treatment based on system risk materiality — not one-size-fits-all
- Public reference: [github.com/GovTechSG/tech-standards](https://github.com/GovTechSG/tech-standards)

---

## Part 2 — What is OpenCerts?

### Platform Summary
- Blockchain-based digital certificate issuance and verification platform
- Developed by **GovTech Singapore** with **SkillsFuture Singapore (SSG)** and **Ngee Ann Polytechnic**
- From **1 October 2025**: maintenance transferred to **IMDA**
- Used nationally for: O/A Levels, ITE qualifications, polytechnic diplomas, university degrees, WSQ certificates

### Technical Architecture

| Component | Detail |
|---|---|
| **Blockchain** | Ethereum public mainnet (not private/government-controlled) |
| **Certificate format** | `.opencert` files (JSON, conforms to OpenAttestation specification) |
| **Data on blockchain** | Only Merkle root hashes — no personal data |
| **Personal data storage** | Off-chain; stored with issuing institution and in MySkillsFuture Skills Passport |
| **Smart contracts** | Certificate Store contract per institution (Solidity); manages issuance and revocation |
| **Cryptography** | Merkle tree hashing; one-way; tamper-evident signatures |
| **Verification** | Checks document hash against blockchain + issuer identity via OpenCerts registry or DNS-TXT |
| **APIs** | Verify, Email, Storage, Status APIs available |
| **Open source** | Yes — github.com/OpenCerts; built on OpenAttestation standard |

### Existing Security Strengths
- Tamper-proof by design: cryptographic merkle tree hashing
- Certificate revocation management via Certificate Store smart contract
- No personal data stored on blockchain (privacy-preserving architecture)
- PDPA compliance built in: consent required for third-party handling
- Public auditability: anyone can verify certificates against Ethereum blockchain
- Government backing: GovTech, MOE, SSG, IMDA oversight

### Current Compliance Posture
- **PDPA**: Compliant (consent and data protection obligations enforced)
- **ISO 27001**: Not publicly documented for OpenCerts specifically
- **SOC 2**: Not publicly documented for OpenCerts specifically
- **IM8**: Not publicly documented as formally certified
- **MTCS Level 3**: Not explicitly confirmed for OpenCerts platform

---

## Part 3 — IM8 Compliance Gap Analysis for OpenCerts

### Critical Issue: Ethereum Mainnet vs. IM8 Data Residency

This is the most significant compliance challenge. IM8 clauses 10.5–10.11 require government data to remain within Singapore. The Ethereum public mainnet is globally distributed — data (even hashes) published to it does not reside in Singapore exclusively. This creates a fundamental tension between OpenCerts' architecture and IM8 requirements.

**Assessment:** Hash-only data on blockchain may be arguable as non-personal data (since it is irreversible), but this requires formal legal and compliance determination by IMDA/GovTech.

---

### Gap Analysis Table

| IM8 Requirement | OpenCerts Current State | Gap | Priority |
|---|---|---|---|
| **Data Residency (clauses 10.5–10.11)** | Ethereum mainnet is globally distributed; personal data off-chain | Hashes on public global blockchain may not satisfy data residency | **High** |
| **Data Classification** | Not publicly documented as formally classified | Formal classification of certificate data and system tiers needed | **High** |
| **Encryption Keys in Singapore HSM** | Not publicly documented | Need to confirm HSM usage for encryption keys | **High** |
| **Hosting on GCC Platform** | Uses public blockchain + GovTech/SSG infrastructure; GCC not confirmed | Confirm whether GCC is used for off-chain components | **High** |
| **Audit Logging** | Not publicly documented | Implement centralised security logging; protect from tampering | **Medium** |
| **Vulnerability Management** | Not publicly documented | Establish regular vulnerability scanning and remediation process | **Medium** |
| **System Hardening** | Not publicly documented | Harden all servers/containers per CIS Benchmark | **Medium** |
| **IAM / Privileged Access Management** | Not publicly documented | Implement PAM for admin access to certificate stores and APIs | **Medium** |
| **Incident Response Plan** | Not publicly documented | Document IR SOP; conduct regular drills | **Medium** |
| **Third Party Management (TPM)** | Open source with community contributions | Establish formal vendor/contributor assessment process | **Medium** |
| **PDPA** | Consent and data protection obligations enforced | Already addressed — maintain and document | **Low (done)** |
| **Cryptographic security** | Strong — merkle tree, tamper-evident, revocation | Already addressed — maintain and document | **Low (done)** |

---

## Part 4 — What You Need to Do for IM8 Compliance

### Phase 1 — Foundational (Must-Do First)

1. **Engage IMDA and GovTech for formal IM8 scoping**
   - Since IMDA took over OpenCerts from October 2025, initiate a formal IM8 compliance assessment with them
   - Clarify whether hash-only blockchain data satisfies data residency requirements (legal determination needed)
   - Request access to GovTech's IM8 compliance documentation via TechPass/GovTech portal

2. **Conduct formal data classification**
   - Classify OpenCerts system and data assets: certificate content (Restricted/Confidential), blockchain hashes (Unclassified — needs confirmation), API keys and admin credentials (Confidential)
   - Apply appropriate Level 0 controls to each tier

3. **Confirm and document GCC hosting for off-chain components**
   - Verify all off-chain components (APIs, storage, MySkillsFuture integration) are hosted on GCC
   - If not, plan migration to GCC (AWS, Azure, or GCP Singapore region)
   - Ensure encryption keys are held in Singapore-based HSM

4. **Address the Ethereum mainnet residency question**
   - Option A: Obtain formal waiver / legal determination that hashes are non-personal data and exempt from residency requirements
   - Option B: Migrate to a **private/permissioned blockchain** hosted in Singapore (e.g. GCC-hosted Ethereum or Hyperledger Fabric) — significant architectural change
   - Option C: Continue with public Ethereum but document the risk acceptance with IMDA sign-off

### Phase 2 — Security Controls

5. **Implement centralised audit logging**
   - Enable security logs for all API calls, admin actions, certificate issuances, and revocations
   - Retain logs per IM8 requirements; protect from tampering (immutable log store)
   - Integrate with GCC's central SIEM (pre-approved IM8 pattern)

6. **Establish vulnerability management programme**
   - Run regular authenticated vulnerability scans on all servers, containers, and APIs
   - Harden all systems per CIS Benchmark (Level 1 minimum)
   - Document findings and remediation; maintain waiver register for exceptions

7. **Implement IAM and PAM**
   - Enforce MFA for all admin access to Certificate Store deployments and APIs
   - Implement Privileged Access Management for infrastructure and smart contract admin keys
   - Automate IAM tooling; avoid manual access management

8. **Document and test incident response plan**
   - Create IR SOP: detection → containment → analysis → eradication → remediation → lessons learned
   - Align with GovTech's whole-of-government IR playbook
   - Conduct tabletop exercises at least annually

### Phase 3 — Third Party Management & Governance

9. **Establish formal Third Party Management process**
   - As an open-source project, assess all external contributors and dependencies under IM8 TPM domain
   - Review and vet all third-party libraries (OpenAttestation, Ethereum clients, etc.)
   - Establish supply chain security practices (SBOM, dependency auditing)

10. **Obtain formal compliance certifications**
    - Pursue **MTCS Level 3** certification (required for cloud service providers handling government data)
    - Consider **ISO 27001** to complement MTCS Level 3 and provide international recognition
    - These certifications provide structured, auditable compliance evidence aligned with IM8

11. **Document compliance evidence pack**
    - GCC artefacts (policies, risk registers, evidence packs) cover 80%+ of IM8 controls out of the box
    - Supplement with OpenCerts-specific controls documentation
    - Maintain for annual IM8 audits

---

## Part 5 — Summary Recommendation

### Complexity Assessment

| Dimension | Assessment |
|---|---|
| **Effort** | High — significant work required, especially on data residency and GCC migration |
| **Architectural risk** | Medium–High — Ethereum mainnet residency issue may require architectural decision |
| **Timeline** | 6–12 months for full compliance (Phase 1–3) |
| **Quick wins** | Audit logging, vulnerability management, IAM/PAM, IR plan — implementable without architectural changes |

### Prioritised Action List

| Priority | Action | Effort |
|---|---|---|
| 1 | Engage IMDA/GovTech for formal IM8 scoping and data residency determination | Low |
| 2 | Classify all data assets formally | Low |
| 3 | Confirm GCC hosting for all off-chain components | Medium |
| 4 | Resolve Ethereum mainnet residency (waiver or migration) | High |
| 5 | Implement centralised audit logging + SIEM integration | Medium |
| 6 | Vulnerability scanning + system hardening (CIS Benchmark) | Medium |
| 7 | IAM/PAM implementation | Medium |
| 8 | Document and test incident response plan | Medium |
| 9 | Third party / supply chain management process | Medium |
| 10 | Pursue MTCS Level 3 + ISO 27001 certifications | High |

### Key Risk to Flag

> **The public Ethereum mainnet is the single biggest IM8 compliance risk.** All other requirements can be met with engineering and process work. The data residency question requires a formal legal/policy determination from IMDA — this should be the first call made.

---

## Sources

| # | Title | URL |
|---|---|---|
| 1 | IM8 Reform Documentation — GovTech Singapore | https://docs.developer.tech.gov.sg/docs?product=IM8+Reform |
| 2 | Agile Playbook — IM8 Reference | https://docs.developer.tech.gov.sg/docs/agile-playbook/agile-instruction-manual-8 |
| 3 | GovTech Tech Standards (OSCAL/IM8) — GitHub | https://github.com/GovTechSG/tech-standards |
| 4 | Government on Commercial Cloud — GovTech | https://www.tech.gov.sg/products-and-services/for-government-agencies/software-development/government-on-commercial-cloud/ |
| 5 | Singapore GCC Compliance Guide — Accrets | https://www.accrets.com/cloud-it/gcc-goverment-cloud-singapore/ |
| 6 | IM8 Proficiency Development Programme — Digital Academy | https://www.thedigitalacademy.tech.gov.sg/course/detail/im8-proficiency-development-programme---role-based-pathways-architecture-and-security |
| 7 | Guide to Cybersecurity Compliance in Singapore — Exabeam | https://www.exabeam.com/blog/compliance/guide-to-cybersecurity-compliance-in-singapore/ |
| 8 | Adapting OSCAL for Singapore Government — NIST | https://csrc.nist.gov/csrc/media/projects/open-security-controls-assessment-language/images-media/2025/1.15.2025_GovTechSingapore.pdf |
| 9 | OpenCerts Website | https://www.opencerts.io/ |
| 10 | OpenCerts Documentation | https://docs.opencerts.io/ |
| 11 | OpenCerts — GitHub Organisation | https://github.com/OpenCerts |
| 12 | SkillsFuture Singapore — OpenCerts Announcement | https://www.ssg.gov.sg/newsroom/convenient-and-secure-authentication-of-education-and-training-certificates-through-opencerts/ |
| 13 | MySkillsFuture — Digital Certificates FAQ | https://www.myskillsfuture.gov.sg/content/portal/en/header/faqs/DigitalCertificates.html |
| 14 | OECD Observatory — OpenCerts Case Study | https://oecd-opsi.org/innovations/opencerts/ |
| 15 | GovTech TechNews — OpenCerts Blockchain | https://www.tech.gov.sg/technews/with-this-blockchain-based-platform-you-may-no-longer-need-physical-certificates/ |
| 16 | Document Store Smart Contract — Open-Attestation GitHub | https://github.com/Open-Attestation/document-store |
| 17 | MTCS Singapore — Microsoft Learn | https://learn.microsoft.com/en-us/compliance/regulatory/offering-mtcs-singapore |
| 18 | Singapore Cybersecurity Compliance — InsiderSecurity | https://insidersecurity.co/a-comprehensive-guide-to-singapore-cybersecurity-compliance/ |

## Confidence

**Medium–High** — IM8 policy findings are well-sourced from official GovTech and government documentation. OpenCerts technical architecture is well-documented via official docs and GitHub. The gap analysis is based on publicly available information; specific internal compliance status of OpenCerts (audit logs, HSM usage, GCC hosting confirmation) could not be verified from public sources. Formal compliance determination requires engagement with IMDA/GovTech directly.
