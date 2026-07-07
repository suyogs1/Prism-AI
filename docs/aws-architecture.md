# AWS Cloud Production & Sandbox Architecture — Prism AI

This document details the enterprise cloud architecture designed for deploying **Prism AI** into IDBI Bank's secure Sandbox and commercial AWS infrastructure.

> [!IMPORTANT]
> **Architecture Freeze & Invariant Engine**: As per project guidelines, the core Decision Engine (`orchestrator.py`) is mathematically frozen. The cloud architecture presented below is designed to wrap the deterministic engine in scalable, zero-trust cloud infrastructure without altering a single line of scoring mathematics.

---

## 1. Production Cloud Architecture

The diagram below illustrates the end-to-end AWS production topology for Prism AI, highlighting separation of public presentation layers, secure application containers, and private data vaults.

```mermaid
graph TD
    subgraph Client_Layer ["Client & Portal Layer"]
        Banker[IDBI Banker Portal / Web App]
        MSME[MSME Applicant App / Mobile]
    end

    subgraph AWS_Edge ["AWS Edge & Security Layer"]
        CF[AWS CloudFront CDN / SSL]
        WAF[AWS WAF - SQLi/XSS Protection]
        R53[Amazon Route 53 DNS]
    end

    subgraph VPC_Public ["VPC - Public Subnet"]
        ALB[Application Load Balancer]
        IGW[Internet Gateway]
    end

    subgraph VPC_Private_App ["VPC - Private Subnet (App Layer)"]
        ECS[Amazon ECS Fargate - FastAPI Containers]
        Parser[BaseParser Abstraction Engine]
        Engine[Decision Engine - orchestrator.py]
    end

    subgraph VPC_Private_Data ["VPC - Isolated Data Subnet"]
        Aurora[Amazon Aurora PostgreSQL Serverless v2]
        S3[Amazon S3 Encrypted Document Vault]
        KMS[AWS KMS Key Management Service]
    end

    subgraph AWS_AI ["AWS AI & ML Services"]
        Bedrock[Amazon Bedrock - Llama 3 / Claude 3]
        Textract[AWS Textract - OCR Document AI]
    end

    subgraph External_Gateways ["IDBI Bank & Regulatory Gateways"]
        IDBI_SBX[IDBI Bank Sandbox API Gateway]
        AA_FIU[Account Aggregator FIU-IND Gateway]
        GSTN[GST Network Portal API]
        NPCI[NPCI / UPI Payment Network]
    end

    %% Routing Flow
    Banker --> CF
    MSME --> CF
    CF --> WAF
    WAF --> ALB
    ALB --> ECS

    %% Internal App Flow
    ECS --> Parser
    Parser --> Engine
    Engine --> Aurora
    Engine --> Bedrock
    ECS --> S3

    %% External & AI Integrations
    S3 --> Textract
    Parser <--> IDBI_SBX
    Parser <--> AA_FIU
    Parser <--> GSTN
    Parser <--> NPCI
    Aurora --- KMS
    S3 --- KMS
```

---

## 2. Data Ingestion & Normalization Flow

Prism AI utilizes a decoupled ingestion pipeline. External data from Account Aggregators or tax portals passes through the `BaseParser` abstraction layer before touching the invariant Decision Engine.

```mermaid
sequenceDiagram
    autonumber
    participant FIU as Account Aggregator (FIU-IND)
    participant GW as AWS API Gateway + Lambda
    participant BP as BaseParser Abstraction Layer
    participant DE as Decision Engine (orchestrator.py)
    participant DB as Aurora PostgreSQL DB
    participant LLM as Amazon Bedrock (Explainer)
    participant UI as IDBI Banker Portal

    FIU->>GW: 1. Stream 12-Month Bank Statement JSON (OAuth 2.0)
    GW->>GW: 2. Verify Digital Signature & Schema Integrity
    GW->>BP: 3. Forward Raw JSON Payload
    BP->>BP: 4. Extract Signals (monthly_cashflow, emi_bounces, avg_balance)
    BP->>DE: 5. Pass Normalized Parameters (Float/Int values only)
    DE->>DE: 6. Execute Deterministic Math (CF*0.35 + Growth*0.20 + Trust*0.25 + Risk*0.20)
    DE->>DB: 7. Store Immutable Score Snapshot & Audit Log
    DE->>LLM: 8. Send Computed JSON for Natural Language Narration
    LLM-->>DE: 9. Return Read-Only Explainability Narrative
    DE->>UI: 10. Render Financial Health Card & Loan Ceiling
```

---

## 3. Security & Zero-Trust Architecture

To comply with RBI guidelines for digital lending and cloud adoption, Prism AI enforces a strict Zero-Trust security model across all AWS services.

### Key Security Controls:
1. **Network Isolation**: Three-tier VPC architecture. Database and application servers reside in private subnets with no direct internet access.
2. **Encryption at Rest & in Transit**: All S3 document vaults and Aurora databases are encrypted using customer-managed AWS KMS keys (AES-256). All API endpoints mandate TLS 1.3.
3. **WAF & DDoS Mitigation**: AWS WAF inspects all incoming HTTP traffic for SQL injection, Cross-Site Scripting (XSS), and rate-limiting anomalies.
4. **IAM Role Separation**: Least-privilege IAM roles ensure that container instances running the Decision Engine cannot modify database schemas or delete S3 audit archives.
5. **Immutable Audit Trail**: AWS CloudTrail and Amazon CloudWatch log every API invocation and underwriter override to an immutable, WORM-compliant (Write Once, Read Many) S3 bucket for regulatory examination.

---

## 4. Sandbox Readiness Justification

Prism AI is ready for IDBI Bank Sandbox onboarding because:
- **Zero Schema Coupling**: The `BaseParser` isolates IDBI Bank's specific JSON schemas from core logic.
- **Predictable Latency**: Deterministic scoring math executes in `< 15 ms` within ECS Fargate containers.
- **Audit Compliance**: Built-in regulatory ledger mirroring satisfies RBI audit mandates out-of-the-box.
