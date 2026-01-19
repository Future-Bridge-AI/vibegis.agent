import { useWorkflowStore } from "../store";
import type {
  DataSourceType,
  MapInteractionType,
  TargetUserType,
} from "../types";

const targetUsers: TargetUserType[] = [
  "GIS Analysts",
  "Field Workers",
  "Public/Citizens",
  "Managers/Executives",
  "Developers",
];

const mapInteractionOptions: MapInteractionType[] = [
  "Click to select features",
  "Draw geometry",
  "View only (no interaction)",
  "Hover to highlight",
];

const dataSourceOptions: DataSourceType[] = [
  "Feature Layer",
  "Web Map",
  "CSV/GeoJSON",
  "No data source",
];

const AnalyzePhase = () => {
  const widgetBrief = useWorkflowStore((state) => state.widgetBrief);
  const updateBrief = useWorkflowStore((state) => state.updateBrief);

  const toggleTargetUser = (user: TargetUserType) => {
    const nextUsers = widgetBrief.targetUsers.includes(user)
      ? widgetBrief.targetUsers.filter((item) => item !== user)
      : [...widgetBrief.targetUsers, user];

    updateBrief({ targetUsers: nextUsers });
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-400">
          Analyze Phase
        </p>
        <h2 className="text-2xl font-semibold text-slate-100">Widget Brief</h2>
        <p className="text-sm text-slate-300">
          Capture the widget concept, audience, and data inputs before designing
          features.
        </p>
      </div>

      <form className="space-y-8">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-200" htmlFor="widget-name">
              Widget Name
            </label>
            <input
              id="widget-name"
              type="text"
              value={widgetBrief.name}
              onChange={(event) => updateBrief({ name: event.target.value })}
              placeholder="e.g. incident-summary"
              className="w-full rounded-xl border border-slate-800 bg-slate-800/80 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-cyan-400/70 focus:outline-none"
            />
          </div>
          <div className="space-y-2">
            <label
              className="text-sm font-semibold text-slate-200"
              htmlFor="display-label"
            >
              Display Label
            </label>
            <input
              id="display-label"
              type="text"
              value={widgetBrief.displayLabel}
              onChange={(event) => updateBrief({ displayLabel: event.target.value })}
              placeholder="e.g. Incident Summary"
              className="w-full rounded-xl border border-slate-800 bg-slate-800/80 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-cyan-400/70 focus:outline-none"
            />
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-2">
            <label
              className="text-sm font-semibold text-slate-200"
              htmlFor="description"
            >
              Description
            </label>
            <textarea
              id="description"
              rows={4}
              value={widgetBrief.description}
              onChange={(event) => updateBrief({ description: event.target.value })}
              placeholder="Explain what the widget does."
              className="w-full resize-none rounded-xl border border-slate-800 bg-slate-800/80 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-cyan-400/70 focus:outline-none"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-200" htmlFor="purpose">
              Purpose
            </label>
            <textarea
              id="purpose"
              rows={4}
              value={widgetBrief.purpose}
              onChange={(event) => updateBrief({ purpose: event.target.value })}
              placeholder="Describe the problem it solves."
              className="w-full resize-none rounded-xl border border-slate-800 bg-slate-800/80 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-cyan-400/70 focus:outline-none"
            />
          </div>
        </div>

        <div className="border-t border-slate-800/80 pt-6">
          <div className="space-y-4">
            <p className="text-sm font-semibold text-slate-200">Target Users</p>
            <div className="grid gap-3 sm:grid-cols-2">
              {targetUsers.map((user) => (
                <label
                  key={user}
                  className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-3 text-sm text-slate-200"
                >
                  <input
                    type="checkbox"
                    checked={widgetBrief.targetUsers.includes(user)}
                    onChange={() => toggleTargetUser(user)}
                    className="h-4 w-4 rounded border-slate-700 bg-slate-950 text-cyan-400 focus:ring-cyan-400/60"
                  />
                  <span>{user}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-6 border-t border-slate-800/80 pt-6 lg:grid-cols-2">
          <div className="space-y-4">
            <p className="text-sm font-semibold text-slate-200">Map Interaction Type</p>
            <div className="space-y-3">
              {mapInteractionOptions.map((option) => (
                <label
                  key={option}
                  className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-3 text-sm text-slate-200"
                >
                  <input
                    type="radio"
                    name="map-interaction"
                    value={option}
                    checked={widgetBrief.mapInteraction === option}
                    onChange={() => updateBrief({ mapInteraction: option })}
                    className="h-4 w-4 border-slate-700 bg-slate-950 text-cyan-400 focus:ring-cyan-400/60"
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-sm font-semibold text-slate-200">Data Source Type</p>
            <div className="space-y-3">
              {dataSourceOptions.map((option) => (
                <label
                  key={option}
                  className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-3 text-sm text-slate-200"
                >
                  <input
                    type="radio"
                    name="data-source"
                    value={option}
                    checked={widgetBrief.dataSource === option}
                    onChange={() => updateBrief({ dataSource: option })}
                    className="h-4 w-4 border-slate-700 bg-slate-950 text-cyan-400 focus:ring-cyan-400/60"
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800/80 pt-6">
          <div className="space-y-2">
            <label
              className="text-sm font-semibold text-slate-200"
              htmlFor="key-features"
            >
              Key Features
            </label>
            <textarea
              id="key-features"
              rows={4}
              value={widgetBrief.keyFeatures}
              onChange={(event) => updateBrief({ keyFeatures: event.target.value })}
              placeholder="List the main capabilities and workflow steps."
              className="w-full resize-none rounded-xl border border-slate-800 bg-slate-800/80 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-cyan-400/70 focus:outline-none"
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default AnalyzePhase;
