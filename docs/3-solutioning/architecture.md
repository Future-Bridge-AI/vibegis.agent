# Architecture

## High-Level Overview
The platform orchestrates BMAD agents (Analyst, PM, Architect) and ArcGIS domain agents to transform user intent into packaged Experience Builder widgets. Context7 provides ArcGIS documentation grounding while the UI offers live preview and export capabilities.

## Core Components
- **BMAD Workflow Engine**: Manages phase progression and artifact generation.
- **ArcGIS Domain Agents**: MapView expert, Widget Developer, REST API expert, ExB Config agent.
- **Context Engineering Layer**: Context7 ArcGIS JS SDK docs, Jimu API references, Calcite design guidance, and sample code corpus.
- **Output & Preview**: Live ArcGIS map preview plus ZIP packaging of widget files.

## Data Flow
1. User inputs requirements → Analyst agent produces Widget Brief.
2. PM agent converts brief into PRD and settings requirements.
3. Architect agent defines file structure, Jimu component hierarchy, and state management.
4. Developer agent generates code and manifests.
5. Packaging service bundles assets for download.

## Integration Points
- **ArcGIS Maps SDK for JavaScript**: Map rendering and data access.
- **Jimu framework**: Widget runtime and settings integrations.
- **Calcite Design System**: UI components and styling.
- **Context7**: Real-time documentation access.

## Deployment Options
- SaaS-hosted platform.
- Developer Edition-focused local build.
- Optional VS Code extension for offline use.
