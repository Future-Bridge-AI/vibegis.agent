import { useEffect, useMemo } from "react";

import { useWorkflowStore } from "../store";
import type {
  CalciteComponentType,
  FunctionalRequirement,
  RequirementPriority,
  SettingType,
  WidgetSetting,
} from "../types";

const priorities: RequirementPriority[] = ["High", "Medium", "Low"];
const settingTypes: SettingType[] = [
  "text",
  "number",
  "boolean",
  "layer-selector",
  "field-selector",
];
const calciteComponents: CalciteComponentType[] = [
  "Card",
  "Panel",
  "List",
  "Table",
  "Button",
  "Modal",
  "Tabs",
];

const defaultRequirement = (): FunctionalRequirement => ({
  description: "",
  priority: "Medium",
});

const defaultSetting = (): WidgetSetting => ({
  name: "",
  type: "text",
  defaultValue: "",
});

const SpecifyPhase = () => {
  const widgetBrief = useWorkflowStore((state) => state.widgetBrief);
  const widgetPRD = useWorkflowStore((state) => state.widgetPRD);
  const updatePRD = useWorkflowStore((state) => state.updatePRD);

  const suggestedRequirements = useMemo<FunctionalRequirement[]>(() => {
    switch (widgetBrief.mapInteraction) {
      case "Click to select features":
        return [
          {
            description: "Allow users to click map features to view details.",
            priority: "High",
          },
          {
            description: "Show selected feature attributes in a summary panel.",
            priority: "Medium",
          },
          {
            description: "Provide a clear selection state on the map.",
            priority: "Medium",
          },
        ];
      case "Draw geometry":
        return [
          {
            description: "Enable drawing polygons or lines on the map.",
            priority: "High",
          },
          {
            description: "Use drawn geometry to query intersecting features.",
            priority: "High",
          },
          {
            description: "Offer tools to clear or edit drawn geometry.",
            priority: "Medium",
          },
        ];
      case "Hover to highlight":
        return [
          {
            description: "Highlight features on hover without selection.",
            priority: "High",
          },
          {
            description: "Display lightweight tooltip details on hover.",
            priority: "Medium",
          },
        ];
      case "View only (no interaction)":
        return [
          {
            description: "Present map layers and widget content in a read-only view.",
            priority: "High",
          },
          {
            description: "Explain data sources and context without interactions.",
            priority: "Low",
          },
        ];
      default:
        return [
          {
            description: "Define the core user flow for the widget.",
            priority: "High",
          },
          {
            description: "List data inputs required for the widget to operate.",
            priority: "Medium",
          },
        ];
    }
  }, [widgetBrief.mapInteraction]);

  useEffect(() => {
    if (widgetPRD.functionalRequirements.length === 0) {
      updatePRD({ functionalRequirements: suggestedRequirements });
    }
  }, [suggestedRequirements, updatePRD, widgetPRD.functionalRequirements.length]);

  const updateRequirement = (index: number, updates: FunctionalRequirement) => {
    const nextRequirements = widgetPRD.functionalRequirements.map((item, idx) =>
      idx === index ? updates : item,
    );
    updatePRD({ functionalRequirements: nextRequirements });
  };

  const addRequirement = () => {
    updatePRD({
      functionalRequirements: [
        ...widgetPRD.functionalRequirements,
        defaultRequirement(),
      ],
    });
  };

  const removeRequirement = (index: number) => {
    updatePRD({
      functionalRequirements: widgetPRD.functionalRequirements.filter(
        (_, idx) => idx !== index,
      ),
    });
  };

  const toggleSettings = (enabled: boolean) => {
    updatePRD({
      settingsConfig: {
        ...widgetPRD.settingsConfig,
        hasSettings: enabled,
        settings: enabled ? widgetPRD.settingsConfig.settings : [],
      },
    });
  };

  const updateSetting = (index: number, updates: WidgetSetting) => {
    const nextSettings = widgetPRD.settingsConfig.settings.map((item, idx) =>
      idx === index ? updates : item,
    );
    updatePRD({
      settingsConfig: {
        ...widgetPRD.settingsConfig,
        settings: nextSettings,
      },
    });
  };

  const addSetting = () => {
    updatePRD({
      settingsConfig: {
        ...widgetPRD.settingsConfig,
        settings: [...widgetPRD.settingsConfig.settings, defaultSetting()],
      },
    });
  };

  const removeSetting = (index: number) => {
    updatePRD({
      settingsConfig: {
        ...widgetPRD.settingsConfig,
        settings: widgetPRD.settingsConfig.settings.filter(
          (_, idx) => idx !== index,
        ),
      },
    });
  };

  const toggleComponent = (component: CalciteComponentType) => {
    const nextComponents = widgetPRD.uiRequirements.preferredComponents.includes(
      component,
    )
      ? widgetPRD.uiRequirements.preferredComponents.filter(
          (item) => item !== component,
        )
      : [...widgetPRD.uiRequirements.preferredComponents, component];

    updatePRD({
      uiRequirements: {
        ...widgetPRD.uiRequirements,
        preferredComponents: nextComponents,
      },
    });
  };

  const hasDataSource =
    widgetBrief.dataSource !== "" && widgetBrief.dataSource !== "No data source";

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-400">
          Specify Phase
        </p>
        <h2 className="text-2xl font-semibold text-slate-100">Widget PRD</h2>
        <p className="text-sm text-slate-300">
          Translate the widget brief into detailed requirements, settings, and UI
          expectations.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
          Brief Summary
        </p>
        <div className="mt-3 space-y-2">
          <h3 className="text-lg font-semibold text-slate-100">
            {widgetBrief.displayLabel || "Untitled Widget"}
          </h3>
          <p className="text-sm text-slate-300">
            {widgetBrief.description ||
              "Add a description in the Analyze phase to summarize the widget."}
          </p>
          <p className="text-xs text-slate-500">Folder name: {widgetBrief.name || "-"}</p>
        </div>
      </div>

      <form className="space-y-8">
        <div className="border-t border-slate-800/80 pt-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-semibold text-slate-200">
                  Functional Requirements
                </h3>
                <p className="text-xs text-slate-400">
                  Capture feature expectations and prioritize delivery.
                </p>
              </div>
              <button
                type="button"
                onClick={addRequirement}
                className="rounded-full border border-slate-700 px-4 py-2 text-xs font-semibold text-slate-200 transition hover:border-slate-500 hover:text-white"
              >
                Add Requirement
              </button>
            </div>
            <div className="space-y-3">
              {widgetPRD.functionalRequirements.map((requirement, index) => (
                <div
                  key={`requirement-${index}`}
                  className="grid gap-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-4 md:grid-cols-[1fr_180px_auto]"
                >
                  <div className="space-y-2">
                    <label
                      className="text-xs font-semibold text-slate-400"
                      htmlFor={`requirement-${index}-description`}
                    >
                      Description
                    </label>
                    <input
                      id={`requirement-${index}-description`}
                      type="text"
                      value={requirement.description}
                      onChange={(event) =>
                        updateRequirement(index, {
                          ...requirement,
                          description: event.target.value,
                        })
                      }
                      placeholder="Describe the requirement"
                      className="w-full rounded-xl border border-slate-800 bg-slate-800/80 px-4 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-cyan-400/70 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      className="text-xs font-semibold text-slate-400"
                      htmlFor={`requirement-${index}-priority`}
                    >
                      Priority
                    </label>
                    <select
                      id={`requirement-${index}-priority`}
                      value={requirement.priority}
                      onChange={(event) =>
                        updateRequirement(index, {
                          ...requirement,
                          priority: event.target.value as RequirementPriority,
                        })
                      }
                      className="w-full rounded-xl border border-slate-800 bg-slate-800/80 px-3 py-2 text-sm text-slate-100 focus:border-cyan-400/70 focus:outline-none"
                    >
                      {priorities.map((priority) => (
                        <option key={priority} value={priority}>
                          {priority}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-end">
                    <button
                      type="button"
                      onClick={() => removeRequirement(index)}
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

        <div className="border-t border-slate-800/80 pt-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-semibold text-slate-200">
                  Settings Configuration
                </h3>
                <p className="text-xs text-slate-400">
                  Define configurable settings and defaults.
                </p>
              </div>
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-200">
                <input
                  type="checkbox"
                  checked={widgetPRD.settingsConfig.hasSettings}
                  onChange={(event) => toggleSettings(event.target.checked)}
                  className="h-4 w-4 rounded border-slate-700 bg-slate-950 text-cyan-400 focus:ring-cyan-400/60"
                />
                Widget has configurable settings
              </label>
            </div>

            {widgetPRD.settingsConfig.hasSettings && (
              <div className="space-y-3">
                {widgetPRD.settingsConfig.settings.map((setting, index) => (
                  <div
                    key={`setting-${index}`}
                    className="grid gap-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-4 md:grid-cols-[1fr_180px_1fr_auto]"
                  >
                    <div className="space-y-2">
                      <label
                        className="text-xs font-semibold text-slate-400"
                        htmlFor={`setting-${index}-name`}
                      >
                        Setting name
                      </label>
                      <input
                        id={`setting-${index}-name`}
                        type="text"
                        value={setting.name}
                        onChange={(event) =>
                          updateSetting(index, {
                            ...setting,
                            name: event.target.value,
                          })
                        }
                        placeholder="e.g. Default layer"
                        className="w-full rounded-xl border border-slate-800 bg-slate-800/80 px-4 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-cyan-400/70 focus:outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label
                        className="text-xs font-semibold text-slate-400"
                        htmlFor={`setting-${index}-type`}
                      >
                        Setting type
                      </label>
                      <select
                        id={`setting-${index}-type`}
                        value={setting.type}
                        onChange={(event) =>
                          updateSetting(index, {
                            ...setting,
                            type: event.target.value as SettingType,
                          })
                        }
                        className="w-full rounded-xl border border-slate-800 bg-slate-800/80 px-3 py-2 text-sm text-slate-100 focus:border-cyan-400/70 focus:outline-none"
                      >
                        {settingTypes.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label
                        className="text-xs font-semibold text-slate-400"
                        htmlFor={`setting-${index}-default`}
                      >
                        Default value
                      </label>
                      <input
                        id={`setting-${index}-default`}
                        type="text"
                        value={setting.defaultValue}
                        onChange={(event) =>
                          updateSetting(index, {
                            ...setting,
                            defaultValue: event.target.value,
                          })
                        }
                        placeholder="e.g. Parcels"
                        className="w-full rounded-xl border border-slate-800 bg-slate-800/80 px-4 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-cyan-400/70 focus:outline-none"
                      />
                    </div>
                    <div className="flex items-end">
                      <button
                        type="button"
                        onClick={() => removeSetting(index)}
                        className="rounded-full border border-slate-800 px-3 py-2 text-xs font-semibold text-slate-300 transition hover:border-rose-400/60 hover:text-rose-200"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addSetting}
                  className="rounded-full border border-slate-700 px-4 py-2 text-xs font-semibold text-slate-200 transition hover:border-slate-500 hover:text-white"
                >
                  Add Setting
                </button>
              </div>
            )}
          </div>
        </div>

        {hasDataSource && (
          <div className="border-t border-slate-800/80 pt-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-slate-200">
                  Data Binding
                </h3>
                <p className="text-xs text-slate-400">
                  Capture how data sources are configured and bound to inputs.
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-3 text-sm text-slate-200">
                  <input
                    type="checkbox"
                    checked={widgetPRD.dataBindings.requiresLayerSelection}
                    onChange={(event) =>
                      updatePRD({
                        dataBindings: {
                          ...widgetPRD.dataBindings,
                          requiresLayerSelection: event.target.checked,
                        },
                      })
                    }
                    className="h-4 w-4 rounded border-slate-700 bg-slate-950 text-cyan-400 focus:ring-cyan-400/60"
                  />
                  Requires layer selection in settings
                </label>
                <label className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-3 text-sm text-slate-200">
                  <input
                    type="checkbox"
                    checked={widgetPRD.dataBindings.requiresFieldSelection}
                    onChange={(event) =>
                      updatePRD({
                        dataBindings: {
                          ...widgetPRD.dataBindings,
                          requiresFieldSelection: event.target.checked,
                        },
                      })
                    }
                    className="h-4 w-4 rounded border-slate-700 bg-slate-950 text-cyan-400 focus:ring-cyan-400/60"
                  />
                  Requires field selection in settings
                </label>
                <label className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-3 text-sm text-slate-200">
                  <input
                    type="checkbox"
                    checked={widgetPRD.dataBindings.supportsMultipleSources}
                    onChange={(event) =>
                      updatePRD({
                        dataBindings: {
                          ...widgetPRD.dataBindings,
                          supportsMultipleSources: event.target.checked,
                        },
                      })
                    }
                    className="h-4 w-4 rounded border-slate-700 bg-slate-950 text-cyan-400 focus:ring-cyan-400/60"
                  />
                  Supports multiple data sources
                </label>
              </div>
            </div>
          </div>
        )}

        <div className="border-t border-slate-800/80 pt-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-200">
                UI Requirements
              </h3>
              <p className="text-xs text-slate-400">
                Choose preferred Calcite components and styling needs.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {calciteComponents.map((component) => (
                <label
                  key={component}
                  className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-3 text-sm text-slate-200"
                >
                  <input
                    type="checkbox"
                    checked={widgetPRD.uiRequirements.preferredComponents.includes(
                      component,
                    )}
                    onChange={() => toggleComponent(component)}
                    className="h-4 w-4 rounded border-slate-700 bg-slate-950 text-cyan-400 focus:ring-cyan-400/60"
                  />
                  <span>{component}</span>
                </label>
              ))}
            </div>
            <label className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-3 text-sm text-slate-200">
              <input
                type="checkbox"
                checked={widgetPRD.uiRequirements.customStyling}
                onChange={(event) =>
                  updatePRD({
                    uiRequirements: {
                      ...widgetPRD.uiRequirements,
                      customStyling: event.target.checked,
                    },
                  })
                }
                className="h-4 w-4 rounded border-slate-700 bg-slate-950 text-cyan-400 focus:ring-cyan-400/60"
              />
              Custom styling needed
            </label>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SpecifyPhase;
