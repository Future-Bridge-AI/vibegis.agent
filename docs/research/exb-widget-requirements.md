# Experience Builder Widget Development Research

## Current Version Status
- **Experience Builder**: 1.19 (Nov 2025)
- **React**: 19
- **ArcGIS Maps SDK**: Latest JS SDK
- **UI Framework**: Jimu + Calcite Design System

## Critical Architecture Changes (1.19)
- React 19 upgrade with native custom element support.
- Breaking changes in Jimu libraries.
- New theme system: Source → Reference → Component layers with six prebuilt themes.

## Future Direction
- Esri is transitioning to web components (`<arcgis-map>`).
- Legacy JS SDK widgets will be deprecated.
- Jimu framework will adopt ArcGIS Maps SDK components.

## Required Widget Files
- `manifest.json` with `exbVersion` and `translatedLocales`.
- `runtime/widget.tsx` (React functional component).
- `setting/setting.tsx` for settings UI.
- `translations/default.ts` for i18n.

## Data Source Integration
- Data sources declared in `manifest.json` and accessed via `useDataSources`.
- `JimuMapView` and `FeatureLayer` are required for map interactions.

## Installation Path (Developer Edition)
1. Extract widget to `client/your-extensions/widgets/`.
2. Run `npm run build:prod` in the client folder.
3. Widget appears under Custom in Insert Widget panel.

## Implications for Our Generator
- Must emit TypeScript-only widgets with function components.
- `manifest.json` name must match the widget folder.
- i18n files are required even for single-language widgets.
- Target ExB 1.19 as baseline.
