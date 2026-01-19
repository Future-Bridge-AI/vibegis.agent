import { useEffect, useMemo, useRef } from "react";

import { useWorkflowStore } from "../store";
import type {
  ArcgisModuleType,
  MessageType,
  StateManagementApproach,
  WidgetSubComponent,
} from "../types";

const stateOptions: StateManagementApproach[] = [
  "Local React state (useState/useReducer)",
  "Zustand store",
  "Redux (jimu-core)",
];

const messageTypes: MessageType[] = [
  "EXTENT_CHANGE",
  "DATA_RECORDS_SELECTION_CHANGE",
  "DATA_RECORD_SET_CHANGE",
  "MAP_CLICK",
  "WIDGET_STATE_CHANGE",
];

const arcgisModules: ArcgisModuleType[] = [
  "FeatureLayer",
  "GraphicsLayer",
  "Query",
  "Geometry",
  "Graphic",
  "SketchViewModel",
  "PopupTemplate",
];

const defaultSubComponent = (): WidgetSubComponent => ({
  name: "",
  purpose: "",
});

const toPascalCase = (value: string) =>
  value
    .split(/[^a-zA-Z0-9]+/)
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join("");

const ArchitectPhase = () => {
  const widgetBrief = useWorkflowStore((state) => state.widgetBrief);
  const widgetPRD = useWorkflowStore((state) => state.widgetPRD);
  const widgetArchitecture = useWorkflowStore((state) => state.widgetArchitecture);
  const updateArchitecture = useWorkflowStore((state) => state.updateArchitecture);

  const requirementCount = widgetPRD.functionalRequirements.length;
  const hasSettings = widgetPRD.settingsConfig.hasSettings;
  const hasMapInteraction = widgetBrief.mapInteraction !== "";
  const hasDataSource =
    widgetBrief.dataSource !== "" && widgetBrief.dataSource !== "No data source";

  const defaultComponentName = useMemo(() => {
    const baseName = widgetBrief.name || widgetBrief.displayLabel || "Widget";
    return toPascalCase(baseName) || "Widget";
  }, [widgetBrief.displayLabel, widgetBrief.name]);

  const autoInitRef = useRef(false);

  useEffect(() => {
    if (!autoInitRef.current) {
      updateArchitecture({
        mainComponentName:
          widgetArchitecture.mainComponentName || defaultComponentName,
        jimuIntegration: {
          ...widgetArchitecture.jimuIntegration,
          usesJimuMapView:
            hasMapInteraction || widgetArchitecture.jimuIntegration.usesJimuMapView,
          usesDataSourceComponent:
            hasDataSource ||
            widgetArchitecture.jimuIntegration.usesDataSourceComponent,
        },
      });
      autoInitRef.current = true;
    }
  }, [
    defaultComponentName,
    hasDataSource,
    hasMapInteraction,
    updateArchitecture,
    widgetArchitecture.jimuIntegration,
    widgetArchitecture.mainComponentName,
  ]);

  const requiredJimuModules = useMemo(() => {
    const modules = ["jimu-core", "jimu-ui"];
    if (hasMapInteraction) {
      modules.push("jimu-arcgis");
    }
    return modules;
  }, [hasMapInteraction]);

  useEffect(() => {
    if (
      requiredJimuModules.join("|") !==
      widgetArchitecture.dependencies.requiredJimuModules.join("|")
    ) {
      updateArchitecture({
        dependencies: {
          ...widgetArchitecture.dependencies,
          requiredJimuModules,
        },
      });
    }
  }, [
    requiredJimuModules,
    updateArchitecture,
    widgetArchitecture.dependencies,
  ]);

  const updateSubComponent = (index: number, updates: WidgetSubComponent) => {
    updateArchitecture({
      subComponents: widgetArchitecture.subComponents.map((item, idx) =>
        idx === index ? updates : item,
      ),
    });
  };

  const addSubComponent = () => {
    updateArchitecture({
      subComponents: [...widgetArchitecture.subComponents, defaultSubComponent()],
    });
  };

  const removeSubComponent = (index: number) => {
    updateArchitecture({
      subComponents: widgetArchitecture.subComponents.filter(
        (_, idx) => idx !== index,
      ),
    });
  };

  const toggleMessageType = (message: MessageType) => {
    const nextTypes = widgetArchitecture.jimuIntegration.messageTypes.includes(
      message,
    )
      ? widgetArchitecture.jimuIntegration.messageTypes.filter(
          (item) => item !== message,
        )
      : [...widgetArchitecture.jimuIntegration.messageTypes, message];

    updateArchitecture({
      jimuIntegration: {
        ...widgetArchitecture.jimuIntegration,
        messageTypes: nextTypes,
      },
    });
  };

  const toggleArcgisModule = (moduleName: ArcgisModuleType) => {
    const nextModules =
      widgetArchitecture.dependencies.additionalArcgisModules.includes(moduleName)
        ? widgetArchitecture.dependencies.additionalArcgisModules.filter(
            (item) => item !== moduleName,
          )
        : [
            ...widgetArchitecture.dependencies.additionalArcgisModules,
            moduleName,
          ];

    updateArchitecture({
      dependencies: {
        ...widgetArchitecture.dependencies,
        additionalArcgisModules: nextModules,
      },
    });
  };

  const fileList = [
    { name: "manifest.json", selected: true },
    { name: "config.ts", selected: true },
    { name: "runtime/widget.tsx", selected: true },
    { name: "setting/setting.tsx", selected: hasSettings },
    { name: "translations/default.ts", selected: true },
    { name: "icon.svg", selected: true },
  ];

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-400">
          Architect Phase
        </p>
        <h2 className="text-2xl font-semibold text-slate-100">
          Widget Architecture
        </h2>
        <p className="text-sm text-slate-300">
          Translate requirements into a technical plan and integration blueprint.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
          Brief Summary
        </p>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-slate-100">
              {widgetBrief.displayLabel || "Untitled Widget"}
            </h3>
            <p className="text-xs text-slate-400">Folder: {widgetBrief.name || "-"}</p>
          </div>
          <span className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-300">
            {requirementCount} requirements captured
          </span>
        </div>
      </div>

      <form className="space-y-8">
        <div className="border-t border-slate-800/80 pt-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-200">
                File Structure Preview
              </h3>
              <p className="text-xs text-slate-400">
                Preview the Experience Builder widget files that will be generated.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 text-sm">
              <ul className="space-y-2 font-mono text-xs">
                <li className="text-slate-300">widget/</li>
                <ul className="space-y-2 pl-4">
                  {fileList.map((file) => (
                    <li
                      key={file.name}
                      className={`rounded-lg px-2 py-1 ${
                        file.selected
                          ? "bg-slate-800/80 text-cyan-200"
                          : "text-slate-500"
                      }`}
                    >
                      {file.name}
                    </li>
                  ))}
                </ul>
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800/80 pt-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-200">
                Component Architecture
              </h3>
              <p className="text-xs text-slate-400">
                Define the core widget component and supporting subcomponents.
              </p>
            </div>
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="space-y-2">
                <label
                  className="text-sm font-semibold text-slate-200"
                  htmlFor="main-component"
                >
                  Main component name
                </label>
                <input
                  id="main-component"
                  type="text"
                  value={widgetArchitecture.mainComponentName}
                  onChange={(event) =>
                    updateArchitecture({
                      mainComponentName: event.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-slate-800 bg-slate-800/80 px-4 py-3 text-sm text-slate-100 focus:border-cyan-400/70 focus:outline-none"
                />
              </div>
              <div className="space-y-2">
                <p className="text-sm font-semibold text-slate-200">
                  State management approach
                </p>
                <div className="space-y-2">
                  {stateOptions.map((option) => (
                    <label
                      key={option}
                      className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-3 text-sm text-slate-200"
                    >
                      <input
                        type="radio"
                        name="state-management"
                        checked={widgetArchitecture.stateManagement === option}
                        onChange={() =>
                          updateArchitecture({ stateManagement: option })
                        }
                        className="h-4 w-4 border-slate-700 bg-slate-950 text-cyan-400 focus:ring-cyan-400/60"
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-200">
                  Sub-components
                </p>
                <button
                  type="button"
                  onClick={addSubComponent}
                  className="rounded-full border border-slate-700 px-4 py-2 text-xs font-semibold text-slate-200 transition hover:border-slate-500 hover:text-white"
                >
                  Add sub-component
                </button>
              </div>
              <div className="space-y-3">
                {widgetArchitecture.subComponents.map((component, index) => (
                  <div
                    key={`sub-component-${index}`}
                    className="grid gap-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-4 md:grid-cols-[1fr_1.4fr_auto]"
                  >
                    <div className="space-y-2">
                      <label
                        className="text-xs font-semibold text-slate-400"
                        htmlFor={`sub-component-${index}-name`}
                      >
                        Component name
                      </label>
                      <input
                        id={`sub-component-${index}-name`}
                        type="text"
                        value={component.name}
                        onChange={(event) =>
                          updateSubComponent(index, {
                            ...component,
                            name: event.target.value,
                          })
                        }
                        className="w-full rounded-xl border border-slate-800 bg-slate-800/80 px-4 py-2 text-sm text-slate-100 focus:border-cyan-400/70 focus:outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label
                        className="text-xs font-semibold text-slate-400"
                        htmlFor={`sub-component-${index}-purpose`}
                      >
                        Purpose
                      </label>
                      <input
                        id={`sub-component-${index}-purpose`}
                        type="text"
                        value={component.purpose}
                        onChange={(event) =>
                          updateSubComponent(index, {
                            ...component,
                            purpose: event.target.value,
                          })
                        }
                        className="w-full rounded-xl border border-slate-800 bg-slate-800/80 px-4 py-2 text-sm text-slate-100 focus:border-cyan-400/70 focus:outline-none"
                      />
                    </div>
                    <div className="flex items-end">
                      <button
                        type="button"
                        onClick={() => removeSubComponent(index)}
                        className="rounded-full border border-slate-800 px-3 py-2 text-xs font-semibold text-slate-300 transition hover:border-rose-400/60 hover:text-rose-200"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800/80 pt-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-200">
                Jimu Integration
              </h3>
              <p className="text-xs text-slate-400">
                Specify core Experience Builder integrations.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-3 text-sm text-slate-200">
                <input
                  type="checkbox"
                  checked={widgetArchitecture.jimuIntegration.usesJimuMapView}
                  onChange={(event) =>
                    updateArchitecture({
                      jimuIntegration: {
                        ...widgetArchitecture.jimuIntegration,
                        usesJimuMapView: event.target.checked,
                      },
                    })
                  }
                  className="h-4 w-4 rounded border-slate-700 bg-slate-950 text-cyan-400 focus:ring-cyan-400/60"
                />
                Uses JimuMapView
              </label>
              <label className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-3 text-sm text-slate-200">
                <input
                  type="checkbox"
                  checked={widgetArchitecture.jimuIntegration.usesDataSourceComponent}
                  onChange={(event) =>
                    updateArchitecture({
                      jimuIntegration: {
                        ...widgetArchitecture.jimuIntegration,
                        usesDataSourceComponent: event.target.checked,
                      },
                    })
                  }
                  className="h-4 w-4 rounded border-slate-700 bg-slate-950 text-cyan-400 focus:ring-cyan-400/60"
                />
                Uses DataSourceComponent
              </label>
              <label className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-3 text-sm text-slate-200">
                <input
                  type="checkbox"
                  checked={widgetArchitecture.jimuIntegration.publishesMessages}
                  onChange={(event) =>
                    updateArchitecture({
                      jimuIntegration: {
                        ...widgetArchitecture.jimuIntegration,
                        publishesMessages: event.target.checked,
                      },
                    })
                  }
                  className="h-4 w-4 rounded border-slate-700 bg-slate-950 text-cyan-400 focus:ring-cyan-400/60"
                />
                Publishes messages
              </label>
              <label className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-3 text-sm text-slate-200">
                <input
                  type="checkbox"
                  checked={widgetArchitecture.jimuIntegration.subscribesMessages}
                  onChange={(event) =>
                    updateArchitecture({
                      jimuIntegration: {
                        ...widgetArchitecture.jimuIntegration,
                        subscribesMessages: event.target.checked,
                      },
                    })
                  }
                  className="h-4 w-4 rounded border-slate-700 bg-slate-950 text-cyan-400 focus:ring-cyan-400/60"
                />
                Subscribes to messages
              </label>
            </div>

            {(widgetArchitecture.jimuIntegration.publishesMessages ||
              widgetArchitecture.jimuIntegration.subscribesMessages) && (
              <div className="space-y-3">
                <p className="text-xs font-semibold text-slate-400">
                  Message types
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  {messageTypes.map((message) => (
                    <label
                      key={message}
                      className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-3 text-sm text-slate-200"
                    >
                      <input
                        type="checkbox"
                        checked={widgetArchitecture.jimuIntegration.messageTypes.includes(
                          message,
                        )}
                        onChange={() => toggleMessageType(message)}
                        className="h-4 w-4 rounded border-slate-700 bg-slate-950 text-cyan-400 focus:ring-cyan-400/60"
                      />
                      <span>{message}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-slate-800/80 pt-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-200">Dependencies</h3>
              <p className="text-xs text-slate-400">
                Confirm required modules and any additional ArcGIS dependencies.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 text-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                Required Jimu modules
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {requiredJimuModules.map((moduleName) => (
                  <span
                    key={moduleName}
                    className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-200"
                  >
                    {moduleName}
                  </span>
                ))}
              </div>
            </div>
            <div className="space-y-3">
              <p className="text-xs font-semibold text-slate-400">
                Additional ArcGIS modules
              </p>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {arcgisModules.map((moduleName) => (
                  <label
                    key={moduleName}
                    className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-3 text-sm text-slate-200"
                  >
                    <input
                      type="checkbox"
                      checked={widgetArchitecture.dependencies.additionalArcgisModules.includes(
                        moduleName,
                      )}
                      onChange={() => toggleArcgisModule(moduleName)}
                      className="h-4 w-4 rounded border-slate-700 bg-slate-950 text-cyan-400 focus:ring-cyan-400/60"
                    />
                    <span>{moduleName}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ArchitectPhase;
