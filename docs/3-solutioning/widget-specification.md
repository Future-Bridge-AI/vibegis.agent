# Experience Builder Widget Specification

## Target Runtime
- **Experience Builder Version**: 1.19
- **React**: 19
- **Language**: TypeScript
- **UI**: Jimu framework + Calcite Design System

## Required Widget Package Structure
```
my-custom-widget/
├── manifest.json
├── config.ts
├── icon.svg
├── runtime/
│   └── widget.tsx
├── setting/
│   ├── setting.tsx
│   └── translations/
│       └── default.ts
├── translations/
│   └── default.ts
└── doc/
    └── index.html
```

## Required Files
- **manifest.json**: Must include `name`, `type`, `version`, `exbVersion`, `translatedLocales`, and `dependency` when using `jimu-arcgis`.
- **runtime/widget.tsx**: Functional React component using `AllWidgetProps` and Jimu UI patterns.
- **setting/setting.tsx**: Settings panel component using `AllWidgetSettingProps`.
- **translations/default.ts**: i18n strings for runtime and settings.

## Data Source Binding
- Use `props.useDataSources` for FeatureLayer and Web Map bindings.
- Support `JimuMapView` access and `FeatureLayer` queries in runtime widget.

## Output Requirements
- Generate TypeScript-only source files.
- Ensure manifest `name` matches folder name.
- Provide settings configuration for layer selection and field visibility.

## Initial Widget Deliverable
Feature Info Panel widget that listens to map selection and renders attributes using Calcite components.
