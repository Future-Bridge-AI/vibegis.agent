# Product Requirements Document (PRD)

## Overview
ArcGIS AI Development Assistant provides a BMAD-driven workflow to help users specify, architect, and generate ArcGIS Experience Builder widgets with ArcGIS Maps SDK integration.

## Functional Requirements
1. **BMAD Workflow Orchestration**
   - Guide users through Analyze → Specify → Architect → Generate phases.
   - Produce phase artifacts: Widget Brief, Widget PRD, Technical Specification.
2. **ArcGIS Domain Agents**
   - Provide specialized agents (Map Architect, Widget Developer, REST API Expert, ExB Config).
   - Ensure outputs align with ExB 1.19 and Jimu framework conventions.
3. **Widget Generation**
   - Generate required ExB widget files: `manifest.json`, `config.ts`, `runtime/widget.tsx`, `setting/setting.tsx`, `translations/default.ts`.
   - Ensure manifest fields match folder name and target ExB version.
4. **Data Source Binding**
   - Support FeatureLayer and Web Map data sources via `useDataSources`.
   - Surface settings UI for layer selection and field configuration.
5. **Live Preview**
   - Provide a preview surface with ArcGIS Maps SDK rendering.
   - Render generated widgets in a realistic ExB-like environment.
6. **Packaging & Export**
   - Bundle output into a downloadable ZIP for manual installation in ExB Developer Edition.

## Non-Functional Requirements
- **Compatibility**: React 19, TypeScript, ExB 1.19, Jimu framework, Calcite Design System.
- **Reliability**: Generate complete widget packages with required files and i18n.
- **Usability**: Clear UI steps, guided prompts, and consistent outputs.

## Assumptions
- Users have access to ArcGIS Experience Builder Developer Edition.
- Context7 is available for real-time ArcGIS documentation grounding.
- Generated widgets target ExB 1.19 as the baseline.

## Success Metrics
- Users can generate a valid widget package without manual fixes.
- Feature Info Panel widget is generated end-to-end in under 10 minutes.
- Generated widgets pass ExB build without missing file errors.
