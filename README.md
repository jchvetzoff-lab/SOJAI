# SOJAI

Smart Observer for Joint Artificial Intelligence

SOJAI is an AI-native clinical operating platform designed to transform orthodontics and dental workflows into a secure, data-driven, and scalable enterprise SaaS model.

## 1. Executive Overview

### Vision
SOJAI delivers the reference AI-native operating system for clinical decision support, imaging intelligence, and practice operations across modern healthcare organizations.

### Mission
Provide practitioners with real-time diagnostic augmentation, structured clinical intelligence, and operational automation while preserving the highest standards of safety, traceability, and regulatory compliance.

### Problem in Orthodontics
Orthodontic workflows still rely on fragmented tools: disconnected imaging, manual report writing, inconsistent clinical documentation, and delayed treatment planning. This creates inefficiencies, variable quality of care, and poor data continuity.

### Why AI-Native Clinical Platforms Are the Future
AI-native platforms unify patient context, imaging intelligence, and workflow automation in one composable stack. They reduce administrative burden, improve clinical consistency, accelerate treatment cycles, and establish a foundation for longitudinal predictive care.

### Strategic Differentiation
- Vertical-first AI product strategy (orthodontics first, then full dental and multi-specialty expansion)
- Unified architecture across clinical analysis, practice operations, and reporting
- Tool-orchestrated AI layer with structured outputs and explainable confidence metadata
- Enterprise-grade security, compliance controls, and multi-tenant tenancy model
- Cloud-native operating model built for scalability and observability from inception

## 2. Product Modules

### AI Image Analysis Engine
SOJAI ingests 2D and 3D radiographic data and produces structured findings, clinical summaries, confidence-ranked observations, and treatment-support indicators. Output is normalized for downstream workflows (reports, records, care plans).

### AI Clinical Assistant (Jarvis Layer)
Jarvis is the conversational clinical copilot integrated with patient context, appointment timeline, and imaging outputs. It supports practitioner prompts, structured note drafting, and guided next-step recommendations.

### AI Command Center
A centralized orchestration workspace for high-value AI tools. Clinicians and coordinators can execute workflows (summarization, treatment draft generation, report generation, analysis queueing) with run history and traceability.

### Intelligent Patient Record System
A longitudinal patient record layer that consolidates demographics, visits, imaging events, AI outputs, notes, and generated documents into a coherent, queryable clinical timeline.

### Practice Management Suite
Operational layer covering scheduling, team roles, activity workflows, and configurable clinic settings. Designed for integrated clinical-operations continuity and future revenue-cycle interoperability.

### AI Treatment Draft Generator
Produces structured, editable treatment drafts from imaging findings, historical context, and practitioner intent. Generates clinically interpretable plans with recommendation rationale.

### 3D Imaging & Visualization Engine
Interactive visualization layer for CBCT and advanced imaging workflows, including annotation overlays, contextual findings display, and pathway to segmentation and simulation toolchains.

### Automated Clinical Reporting System
Creates standardized, export-ready, clinically structured reports aligned with medical documentation requirements and organizational templates.

## 3. System Architecture

### High-Level Architecture Diagram
```text
+-----------------------------------------------------------------------------------+
|                                  Client Layer                                     |
|  Web App (Next.js) | Clinical Workspaces | Command Center | Imaging Viewer       |
+-----------------------------------------+-----------------------------------------+
                                          |
                                          v
+-----------------------------------------------------------------------------------+
|                                  API Gateway                                      |
|  AuthN/AuthZ | Rate Limiting | Request Validation | Tenant Routing | Audit Hooks  |
+-----------------------------------------+-----------------------------------------+
                                          |
                                          v
+-----------------------------------------------------------------------------------+
|                             Application Services Layer                             |
|  Patient Service | Clinic Service | Reporting Service | Workflow Service          |
+-----------------------------------------+-----------------------------------------+
                                          |
                                          v
+-----------------------------------------------------------------------------------+
|                              AI Orchestration Layer                                |
|  Prompt Orchestration | Tool Registry | Model Routing | Confidence Engine         |
+-----------------------------------------+-----------------------------------------+
                     |                                          |
                     v                                          v
+-------------------------------------------+     +---------------------------------+
| Secure Medical Data Store                 |     | Object Storage (Imaging)        |
| Relational Clinical Data + Audit Ledger   |     | DICOM/Images + Derived Artifacts|
+-------------------------------------------+     +---------------------------------+
                     \                                          /
                      \                                        /
                       v                                      v
+-----------------------------------------------------------------------------------+
|                                Observability Layer                                 |
|  Structured Logs | Metrics | Distributed Traces | Alerting | SLO Monitoring       |
+-----------------------------------------------------------------------------------+
```

### Architecture Principles
- Domain-driven modular boundaries by feature and service capability
- Stateless application tier with horizontally scalable deployment units
- Strong separation of clinical data, imaging artifacts, and AI execution telemetry
- Deterministic orchestration patterns for reproducible clinical AI runs

## 4. AI Architecture

### LLM Orchestration Layer
SOJAI uses a model-agnostic orchestration layer that routes requests to approved LLM providers and task-specific pipelines. Routing policy is based on use case criticality, latency targets, and reliability thresholds.

### Tool-Calling Framework
The AI runtime executes validated tools from a controlled registry. Each tool defines:
- Identity and metadata
- Input schema contract
- Execution policy
- Structured output contract

### Structured JSON Clinical Outputs
All AI responses are normalized to typed JSON contracts for deterministic downstream usage in records, reports, analytics, and audit processes.

### AI Registry System
The registry governs tool lifecycle, versioning, compatibility, and policy-based activation by tenant and environment.

### Confidence Scoring
Each inference includes confidence and context metadata to support clinical review, triage prioritization, and explainability.

### Modular Model Integration
The orchestration layer supports multi-provider and multi-model strategies to reduce lock-in, improve resilience, and optimize cost/performance.

### Future-Ready 3D Segmentation Capability
SOJAI architecture includes asynchronous imaging pipelines for 3D segmentation and advanced volumetric analysis with queue-based execution and artifact lineage.

### Predictive Treatment Modeling
The platform roadmap includes longitudinal predictive models combining historical clinical outcomes, imaging changes, and treatment progression trajectories.

## 5. Security & Compliance

SOJAI security is designed for enterprise clinical environments and regulated health data operations.

### Governance and Compliance
- GDPR-aligned privacy-by-design controls
- HIPAA/HDS readiness architecture for protected health data workflows
- Data minimization, lawful processing controls, and retention governance

### Identity and Access Control
- Role-Based Access Control (RBAC) across practitioner, assistant, admin, and tenant-admin scopes
- Tenant-aware authorization policies
- Session security with signed tokens and strict policy enforcement

### Multi-Tenant Isolation
- Tenant-scoped data partitioning
- Isolated access context at application and data layers
- Policy boundaries for cross-tenant protection

### Encryption and Key Security
- TLS encryption in transit
- Encryption at rest for clinical and imaging data
- Managed key lifecycle with secure key management integration

### Auditability and Clinical Traceability
- Append-only audit events for critical clinical actions
- Full traceability for who/what/when across AI runs, record changes, and exports
- Immutable-oriented event lineage for compliance verification

### Environment Isolation
- Strict dev/staging/prod separation
- Independent configuration and secret scopes per environment
- Controlled promotion workflow between environments

## 6. AI Pipeline – Technical Core

### End-to-End Flow
`Image Upload -> Validation -> Preprocessing -> AI Inference -> Structured JSON Output -> Confidence Scoring -> Record Storage -> Reporting Layer`

### Stage-by-Stage Processing
- `Image Upload`: Clinical imaging artifacts are ingested through controlled upload interfaces with tenant context and metadata tagging. This establishes traceable source attribution and prevents orphaned data ingestion.
- `Validation`: File format, payload integrity, schema-level metadata, and access authorization are verified before processing. This prevents malformed inputs, unauthorized processing, and cross-tenant leakage risk.
- `Preprocessing`: Imaging normalization, quality checks, and modality-aware preparation are applied to produce consistent model inputs. This reduces variance and improves inference stability across heterogeneous imaging sources.
- `AI Inference`: Orchestrated model execution runs through policy-governed tool pipelines with deterministic runtime controls. This ensures predictable execution behavior and auditable inference pathways.
- `Structured JSON Output`: Inference outputs are normalized to typed JSON contracts aligned with clinical entities. This guarantees machine-readability, contract enforcement, and reliable downstream integration.
- `Confidence Scoring`: Each finding is enriched with calibrated confidence metadata and contextual signals. This supports clinical prioritization, review workflows, and transparent decision support.
- `Record Storage`: Validated outputs are persisted in secure tenant-scoped clinical records with audit-linked event references. This ensures continuity, traceability, and compliant longitudinal history.
- `Reporting Layer`: Structured outputs are transformed into standardized clinical reports and operational summaries. This reduces documentation latency while preserving consistency and governance controls.

### Performance & Evaluation
- Latency is managed through asynchronous orchestration, queue-aware execution, and workload segmentation by task criticality.
- Structured output validation enforces schema compliance, preventing contract drift and downstream processing errors.
- Confidence scoring combines model output signals and policy thresholds to support risk-aware clinical review.
- Model performance is monitored through quality metrics, error-rate tracking, and longitudinal outcome-aligned evaluation.
- Reproducibility is maintained via deterministic orchestration, versioned tool contracts, and traceable execution metadata.

### Technology Choice Justification
- LLM-based orchestration is used to unify multimodal reasoning, workflow intelligence, and natural-language clinical interaction.
- A model-agnostic architecture avoids provider lock-in and enables resilient routing across approved AI backends.
- JSON-structured outputs enforce clinical traceability, machine interoperability, and auditable record integration.
- API-based AI integration provides elastic scaling, controlled rollout, and fast iteration across enterprise deployments.

## 7. Business Model

### Target Users
- Orthodontic clinics (primary segment)
- Multi-practitioner dental groups
- Enterprise healthcare networks
- Future B2C intelligent health record users

### Revenue Streams
1. SaaS Subscription per Clinic
- Monthly and annual licensing models with tiered access by operational and clinical capability.
- Progressive packaging from core clinical operations to advanced AI orchestration and analytics.

2. AI Pay-Per-Analysis
- Usage-based monetization aligned to analysis volume and workload complexity.
- Premium AI tools and advanced inference workflows billed per execution event.

3. Enterprise Licensing
- Custom deployment programs for large organizations with integration and governance requirements.
- SLA-backed contracts covering reliability, support levels, security posture, and compliance controls.

4. Future B2C Monetization
- Patient application subscription for longitudinal intelligent health record services.
- Premium insights and predictive wellness intelligence delivered through consent-governed personalization.
- Interoperability services enabling secure data exchange and portability across provider ecosystems.

### Cost Structure
- Cloud infrastructure for compute, storage, networking, and observability operations.
- AI inference expenditure driven by model utilization, orchestration overhead, and task mix.
- Engineering, security, and compliance investment for platform reliability and regulatory alignment.
- Customer acquisition, enablement, and support operations across clinical and enterprise segments.

### Go-To-Market Strategy
- Direct sales motion focused on high-value clinic and multi-site dental operators.
- Strategic partnerships with imaging and dental equipment providers to accelerate channel adoption.
- Structured beta onboarding for reference clients with measurable workflow and outcome benchmarks.
- Conference and academic positioning to reinforce clinical credibility and category leadership.

## 8. Responsible AI & Risk Management

### Bias & Model Risk
- Clinical bias can emerge from non-representative datasets, modality imbalance, and demographic undercoverage.
- Dataset representativeness is governed through curation policies, coverage analysis, and quality controls.
- Risk mitigation combines continuous monitoring, human-in-the-loop validation, and escalation pathways for uncertain outputs.

### Data Protection
- Data minimization principles restrict processing to required clinical and operational attributes.
- Encryption controls protect data in transit and at rest across all regulated storage boundaries.
- Access controls enforce role-based, tenant-scoped authorization with strict policy evaluation.
- Retention policies define controlled lifecycle management, archival windows, and compliant deletion workflows.

### Ethical Positioning
- AI is positioned as clinical decision support and does not replace practitioner judgment.
- Output transparency is maintained through structured findings, rationale framing, and auditable execution traces.
- Confidence visibility is embedded in workflow interfaces to support accountable clinical interpretation.

### Security Risks
- API abuse risk is mitigated with authentication hardening, rate limiting, and anomaly detection.
- Model injection and prompt-manipulation risk is mitigated through input validation, policy filters, and guarded tool execution.
- Tenant data leakage risk is mitigated via strict isolation, RBAC enforcement, and scoped data access boundaries.
- Security controls are reinforced by request validation, append-only audit logs, and continuous monitoring.

## 9. Data Strategy & Governance

### Data Categories
SOJAI processes structured and semi-structured clinical data including:
- Imaging artifacts (2D radiographs, CBCT metadata references)
- Patient demographic attributes (tenant-scoped)
- Clinical notes and structured findings
- AI-generated structured outputs
- Operational workflow metadata

### Data Minimization Principle
Only strictly necessary attributes are processed for each workflow. Imaging files are separated from relational clinical records to reduce surface exposure and enforce architectural compartmentalization.

### Tenant-Scoped Data Isolation
All records are logically partitioned by tenant identifier, ensuring strict clinic-level isolation at both application and data layers.

### GDPR Alignment
SOJAI architecture supports:
- Explicit lawful basis for processing
- Data subject access and export capabilities
- Controlled retention and deletion workflows
- Audit-linked traceability of processing events

No cross-tenant processing occurs without explicit policy control.

## 10. Performance Metrics & KPIs

SOJAI platform performance and AI quality are measured through structured operational and clinical indicators.

### Technical KPIs
- Target inference latency: sub-3 seconds for standard workflows
- API availability target: ≥ 99.5%
- Structured output schema validation rate: 100% enforced contract compliance
- Error-rate monitoring with automated anomaly detection

### AI Quality Monitoring
- Confidence score distribution analysis
- Structured output completeness rate
- Model drift monitoring through longitudinal evaluation

### Business & Adoption KPIs
- Monthly active clinics
- AI tool execution volume growth
- Average time saved per clinical workflow
- Report generation turnaround time reduction

KPIs are continuously monitored through observability pipelines and dashboard instrumentation.

## 11. Infrastructure & DevOps

### Containerization
- Multi-stage Docker builds for deterministic artifacts
- Runtime-optimized production image with non-root execution
- Health checks for service availability management

### CI/CD Pipeline Architecture
- Pipeline gates: lint, typecheck, tests, security checks, build verification
- Artifact versioning and traceable release metadata
- Progressive deployment strategy with rollback support

### Cloud-Native Deployment Model
- Stateless app services behind load balancing
- Managed database and object storage services
- Queues/workers for asynchronous AI and imaging tasks

### Horizontal Scalability Strategy
- Auto-scaling application replicas
- Workload segmentation by service domain and queue type
- Caching and edge delivery for performance-sensitive flows

### Observability and Reliability
- Structured logs with correlation identifiers
- RED/USE metrics for API and worker performance
- Distributed traces for request and AI pipeline visibility
- Alerting tied to SLOs (availability, latency, error budget)

## 12. Project Structure

```text
src/
 ├── app/               # App Router entries, route handlers, layouts
 ├── features/          # Domain modules (ai, patients, clinic, reporting)
 ├── services/          # Stable service contracts and adapters
 ├── ai/                # Orchestration primitives, prompt/runtime policies
 ├── infrastructure/    # Deployment/runtime integrations and platform adapters
 ├── config/            # Feature flags, environment parsing, platform settings
 ├── hooks/             # Reusable stateful logic for UI/workflow integration
 └── components/        # Shared UI system and platform components
```

### Architectural Philosophy
SOJAI follows a feature-based, contract-driven architecture where UI modules consume stable service interfaces, and AI operations are mediated by a controlled orchestration and tool-registry layer.

## 13. Development & Deployment

### Local Setup
```bash
npm ci
cp .env.example .env.local
npm run dev
```

### Environment Variables
```env
ANTHROPIC_API_KEY=
NEXT_PUBLIC_AI_PROVIDER=mock
NEXT_PUBLIC_DEMO_LATENCY_MS=600
```

### Docker Usage
```bash
# Build production image
docker build -t sojai:prod .

# Run production container
docker run --rm -p 3000:3000 --env-file .env.local sojai:prod

# Development stack
docker compose up --build
```

### Production Deployment Flow
1. Build and verify immutable container artifacts.
2. Execute CI quality and security gates.
3. Promote artifact to staging with full observability checks.
4. Perform controlled rollout to production with monitoring and rollback safeguards.

## 14. Roadmap (Strategic Evolution)

### Phase 1: Orthodontics SaaS
AI-assisted imaging analysis, treatment drafting, command-center workflows, and integrated clinical reporting for orthodontic practices.

### Phase 2: Dental Expansion
Extension to endodontics, implantology, periodontics, and full dental workflow standardization with cross-specialty data continuity.

### Phase 3: Multi-Specialty Vertical SaaS
Domain expansion into additional medical verticals through reusable AI orchestration, compliance controls, and tenancy architecture.

### Phase 4: B2C Intelligent Health Record
Patient-facing intelligent health record ecosystem with longitudinal insights, consent-aware data portability, and cross-provider interoperability.

## 15. Technical Differentiation

SOJAI differentiates itself from traditional dental software and generic AI wrappers through:

- AI-native orchestration rather than feature add-ons
- Structured JSON clinical contracts ensuring deterministic integration
- Tenant-aware architecture embedded at service design level
- Tool-registry governance model enabling controlled AI extensibility
- Model-agnostic routing to prevent vendor lock-in
- Integrated observability across AI execution and clinical workflows

This positioning establishes SOJAI not as a point solution, but as a domain-specific clinical operating system designed for regulated healthcare environments.

## 16. Strategic Closing Statement

SOJAI is engineered as an AI-native clinical operating system, not a point solution. By combining vertical SaaS execution, regulated-data architecture, and modular AI orchestration, SOJAI establishes the infrastructure for the next generation of healthcare platforms: scalable, secure, interoperable, and clinically intelligent.
