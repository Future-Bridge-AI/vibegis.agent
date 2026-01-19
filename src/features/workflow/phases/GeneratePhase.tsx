import { useMemo, useState } from "react";

import Editor from "@monaco-editor/react";

import { generateWidget } from "../../../lib/generator/generateWidget";
import { packageWidget } from "../../../lib/generator/packageWidget";
import { useWorkflowStore } from "../store";

const formatBytes = (size: number) => `${size} B`;

const GeneratePhase = () => {
  const workflowState = useWorkflowStore((state) => state);
  const [generatedFiles, setGeneratedFiles] = useState<Record<string, string>>({});
  const [activeFile, setActiveFile] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);

  const filesToGenerate = useMemo(() => {
    const baseFiles = [
      "manifest.json",
      "config.ts",
      "runtime/widget.tsx",
      "translations/default.ts",
    ];

    if (workflowState.widgetPRD.settingsConfig.hasSettings) {
      baseFiles.push("setting/setting.tsx");
    }

    return baseFiles;
  }, [workflowState.widgetPRD.settingsConfig.hasSettings]);

  const integrations = useMemo(() => {
    const items: string[] = [];
    if (workflowState.widgetArchitecture.jimuIntegration.usesJimuMapView) {
      items.push("JimuMapView");
    }
    if (workflowState.widgetArchitecture.jimuIntegration.usesDataSourceComponent) {
      items.push("DataSourceComponent");
    }
    if (workflowState.widgetArchitecture.jimuIntegration.publishesMessages) {
      items.push("Publishes messages");
    }
    if (workflowState.widgetArchitecture.jimuIntegration.subscribesMessages) {
      items.push("Subscribes to messages");
    }
    return items;
  }, [workflowState.widgetArchitecture.jimuIntegration]);

  const handleGenerate = async () => {
    setIsGenerating(true);
    const files = generateWidget(workflowState);
    setGeneratedFiles(files);
    const firstFile = Object.keys(files)[0];
    setActiveFile(firstFile ?? "");
    setIsGenerating(false);
  };

  const handleDownload = async () => {
    if (Object.keys(generatedFiles).length === 0) {
      return;
    }
    const blob = await packageWidget(generatedFiles);
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${workflowState.widgetBrief.name || "widget"}.zip`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const handleCopy = async (fileName: string) => {
    const content = generatedFiles[fileName];
    if (!content) {
      return;
    }
    await navigator.clipboard.writeText(content);
  };

  const tabs = Object.keys(generatedFiles);

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-400">
          Generate Phase
        </p>
        <h2 className="text-2xl font-semibold text-slate-100">
          Generate Widget
        </h2>
        <p className="text-sm text-slate-300">
          Review the generated files, then export the widget bundle for deployment.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
              Generation Summary
            </p>
            <h3 className="mt-2 text-lg font-semibold text-slate-100">
              {workflowState.widgetBrief.displayLabel || "Untitled Widget"}
            </h3>
            <p className="text-xs text-slate-400">
              Folder name: {workflowState.widgetBrief.name || "-"}
            </p>
            <p className="mt-3 text-sm text-slate-300">
              Files to generate: {filesToGenerate.length}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {integrations.length === 0 ? (
                <span className="text-xs text-slate-500">
                  No additional integrations selected.
                </span>
              ) : (
                integrations.map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-cyan-500/40 px-3 py-1 text-xs text-cyan-200"
                  >
                    {item}
                  </span>
                ))
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={handleGenerate}
            className="rounded-full bg-cyan-500 px-6 py-3 text-sm font-semibold text-slate-900 shadow-lg shadow-cyan-500/30 transition hover:bg-cyan-400"
          >
            {isGenerating ? "Generating..." : "Generate Widget"}
          </button>
        </div>
      </div>

      {tabs.length > 0 && (
        <div className="space-y-6">
          <div className="flex flex-wrap gap-2">
            {tabs.map((fileName) => {
              const size = new TextEncoder().encode(generatedFiles[fileName]).length;
              const isActive = activeFile === fileName;

              return (
                <button
                  key={fileName}
                  type="button"
                  onClick={() => setActiveFile(fileName)}
                  className={`rounded-full border px-4 py-2 text-xs font-semibold transition ${
                    isActive
                      ? "border-cyan-400/60 bg-cyan-500/10 text-cyan-200"
                      : "border-slate-800 text-slate-300 hover:border-slate-600"
                  }`}
                >
                  {fileName} ({formatBytes(size)})
                </button>
              );
            })}
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/60">
            <div className="flex items-center justify-between border-b border-slate-800 px-4 py-2 text-xs text-slate-400">
              <span>{activeFile}</span>
              <button
                type="button"
                onClick={() => handleCopy(activeFile)}
                className="rounded-full border border-slate-700 px-3 py-1 text-xs font-semibold text-slate-200 transition hover:border-slate-500 hover:text-white"
              >
                Copy to Clipboard
              </button>
            </div>
            <Editor
              height="420px"
              theme="vs-dark"
              language={activeFile.endsWith(".json") ? "json" : "typescript"}
              value={generatedFiles[activeFile]}
              options={{ readOnly: true, minimap: { enabled: false } }}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-[auto_1fr]">
            <button
              type="button"
              onClick={handleDownload}
              className="rounded-full border border-cyan-500/60 bg-cyan-500/10 px-6 py-3 text-sm font-semibold text-cyan-200 transition hover:bg-cyan-500/20"
            >
              Download Widget ZIP
            </button>
            <details className="rounded-2xl border border-slate-800 bg-slate-900/60 px-4 py-3 text-sm text-slate-300">
              <summary className="cursor-pointer text-sm font-semibold text-slate-200">
                Installation instructions
              </summary>
              <ol className="mt-3 list-decimal space-y-2 pl-5 text-xs text-slate-400">
                <li>Extract to client/your-extensions/widgets/</li>
                <li>Run npm run build:prod</li>
                <li>Widget appears in the Custom section</li>
              </ol>
            </details>
          </div>
        </div>
      )}
    </div>
  );
};

export default GeneratePhase;
