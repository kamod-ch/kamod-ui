import { Button, Input, Label, Switch, Textarea } from "@kamod-ch/ui";
import { useCallback, useEffect, useRef, useState } from "preact/hooks";
import { DASHBOARD_LANG, type DashboardDemoFixtureKey } from "../examples/fixtures";
import { dashboardPreset } from "../presets/dashboard";
import { KamodOpenUIRenderer } from "../renderer/KamodOpenUIRenderer";
import { createDashboardSystemPrompt } from "./createDashboardSystemPrompt";
import {
  type ChatMessage,
  DASHBOARD_QUICK_PROMPTS,
  type DashboardLlmSettings,
  loadLlmSettings,
  saveLlmSettings,
  streamDashboardLang,
} from "./dashboard-llm";

export type DashboardGeneratorCoreProps = {
  /** Extra class on the root shell. */
  className?: string;
  /** Optional note shown under the title (e.g. Pro branding). */
  footnote?: string;
};

type ChatTurn = {
  role: "user" | "assistant" | "system";
  content: string;
};

/**
 * Chat + live OpenUI preview for generative dashboards (BYOK or demo mode).
 */
export function DashboardGeneratorCore({ className, footnote }: DashboardGeneratorCoreProps) {
  const [settings, setSettings] = useState<DashboardLlmSettings>(() => loadLlmSettings());
  const [showSettings, setShowSettings] = useState(false);
  const [prompt, setPrompt] = useState(DASHBOARD_QUICK_PROMPTS[0]?.prompt ?? "");
  const [activeDemoKey, setActiveDemoKey] = useState<DashboardDemoFixtureKey>("kpi-overview");
  const [turns, setTurns] = useState<ChatTurn[]>([]);
  const [lang, setLang] = useState(DASHBOARD_LANG);
  const [draftLang, setDraftLang] = useState(DASHBOARD_LANG);
  const [view, setView] = useState<"preview" | "lang">("preview");
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [log, setLog] = useState<string[]>([]);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    saveLlmSettings(settings);
  }, [settings]);

  const appendLog = useCallback((line: string) => {
    setLog((prev) => [line, ...prev].slice(0, 8));
  }, []);

  const stop = () => {
    abortRef.current?.abort();
    abortRef.current = null;
    setIsStreaming(false);
  };

  const runGenerate = async (userPrompt: string, demoKey?: DashboardDemoFixtureKey) => {
    const trimmed = userPrompt.trim();
    if (!trimmed || isStreaming) return;

    stop();
    const controller = new AbortController();
    abortRef.current = controller;
    setError(null);
    setIsStreaming(true);
    setView("preview");

    const userTurn: ChatTurn = { role: "user", content: trimmed };
    setTurns((prev) => [...prev, userTurn]);

    const systemPrompt = createDashboardSystemPrompt();
    const messages: ChatMessage[] = [
      { role: "system", content: systemPrompt },
      ...turns
        .filter((t) => t.role === "user" || t.role === "assistant")
        .map((t) => ({ role: t.role as "user" | "assistant", content: t.content })),
      { role: "user", content: trimmed },
    ];

    setLang("");
    setDraftLang("");

    try {
      const result = await streamDashboardLang({
        messages,
        settings,
        demoKey: demoKey ?? (settings.demoMode ? activeDemoKey : undefined),
        signal: controller.signal,
        onChunk: (chunk) => {
          setLang(chunk);
          setDraftLang(chunk);
        },
      });
      setLang(result);
      setDraftLang(result);
      setTurns((prev) => [...prev, { role: "assistant", content: result }]);
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") {
        appendLog("generation stopped");
      } else {
        const message = err instanceof Error ? err.message : String(err);
        setError(message);
        appendLog(`error: ${message}`);
      }
    } finally {
      setIsStreaming(false);
      abortRef.current = null;
    }
  };

  const applyLangEdit = () => {
    setLang(draftLang);
    setView("preview");
  };

  const copyLang = async () => {
    try {
      await navigator.clipboard.writeText(lang);
      appendLog("copied OpenUI Lang");
    } catch {
      appendLog("copy failed");
    }
  };

  const shellClass = ["dashboard-generator", className].filter(Boolean).join(" ");

  return (
    <div class={shellClass}>
      <div class="dashboard-generator-toolbar">
        <div class="dashboard-generator-quick" role="group" aria-label="Quick prompts">
          {DASHBOARD_QUICK_PROMPTS.map((item) => (
            <Button
              key={item.id}
              type="button"
              size="sm"
              variant={activeDemoKey === item.id ? "default" : "outline"}
              onClick={() => {
                setActiveDemoKey(item.id);
                setPrompt(item.prompt);
                void runGenerate(item.prompt, item.id);
              }}
              disabled={isStreaming}
            >
              {item.label}
            </Button>
          ))}
        </div>
        <div class="dashboard-generator-toolbar-actions">
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => setShowSettings((v) => !v)}
          >
            Settings
          </Button>
          {isStreaming ? (
            <Button type="button" size="sm" variant="secondary" onClick={stop}>
              Stop
            </Button>
          ) : null}
        </div>
      </div>

      {showSettings ? (
        <div class="dashboard-generator-settings">
          <div class="dashboard-generator-settings-row">
            <Switch
              id="dashboard-demo-mode"
              checked={settings.demoMode}
              onCheckedChange={(checked) =>
                setSettings((prev) => ({ ...prev, demoMode: Boolean(checked) }))
              }
            />
            <Label htmlFor="dashboard-demo-mode">Demo mode (no API key)</Label>
          </div>
          <div class="dashboard-generator-settings-fields">
            <div>
              <Label htmlFor="dashboard-api-key">API key</Label>
              <Input
                id="dashboard-api-key"
                type="password"
                autocomplete="off"
                placeholder="sk-… (stored in sessionStorage only)"
                value={settings.apiKey}
                disabled={settings.demoMode}
                onInput={(event) =>
                  setSettings((prev) => ({
                    ...prev,
                    apiKey: event.currentTarget.value,
                    demoMode: false,
                  }))
                }
              />
            </div>
            <div>
              <Label htmlFor="dashboard-base-url">Base URL</Label>
              <Input
                id="dashboard-base-url"
                value={settings.baseUrl}
                disabled={settings.demoMode}
                onInput={(event) =>
                  setSettings((prev) => ({ ...prev, baseUrl: event.currentTarget.value }))
                }
              />
            </div>
            <div>
              <Label htmlFor="dashboard-model">Model</Label>
              <Input
                id="dashboard-model"
                value={settings.model}
                disabled={settings.demoMode}
                onInput={(event) =>
                  setSettings((prev) => ({ ...prev, model: event.currentTarget.value }))
                }
              />
            </div>
          </div>
          <p class="dashboard-generator-settings-note">
            Use a disposable demo key. Requests go directly from your browser to the provider.
            Prefer demo mode unless you intentionally want live generation.
          </p>
        </div>
      ) : null}

      <div class="dashboard-generator-grid">
        <div class="dashboard-generator-chat">
          <p class="dashboard-generator-label">Chat</p>
          <div class="dashboard-generator-turns" aria-live="polite">
            {turns.length === 0 ? (
              <p class="dashboard-generator-muted">
                Describe a dashboard, or pick a quick prompt.{" "}
                {settings.demoMode
                  ? "Demo mode streams a local fixture."
                  : "Live mode calls your OpenAI-compatible endpoint."}
              </p>
            ) : (
              turns.map((turn, index) => (
                <div
                  key={`${turn.role}-${index}`}
                  class={`dashboard-generator-turn dashboard-generator-turn-${turn.role}`}
                >
                  <span class="dashboard-generator-turn-role">{turn.role}</span>
                  <pre class="dashboard-generator-turn-body">
                    {turn.role === "assistant"
                      ? `${turn.content.slice(0, 280)}${turn.content.length > 280 ? "…" : ""}`
                      : turn.content}
                  </pre>
                </div>
              ))
            )}
          </div>

          <label class="dashboard-generator-label" for="dashboard-prompt">
            Prompt
          </label>
          <Textarea
            id="dashboard-prompt"
            rows={4}
            value={prompt}
            onInput={(event) => setPrompt(event.currentTarget.value)}
            placeholder="Sales dashboard with 4 KPI cards, a chart, and a customers table"
            disabled={isStreaming}
          />
          <div class="dashboard-generator-chat-actions">
            <Button
              type="button"
              size="sm"
              onClick={() => void runGenerate(prompt)}
              disabled={isStreaming || !prompt.trim()}
            >
              {isStreaming ? "Generating…" : "Generate"}
            </Button>
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={() => void runGenerate(prompt, activeDemoKey)}
              disabled={isStreaming || !prompt.trim()}
            >
              Regenerate
            </Button>
          </div>
          {error ? <p class="dashboard-generator-error">{error}</p> : null}
          {footnote ? <p class="dashboard-generator-footnote">{footnote}</p> : null}
        </div>

        <div class="dashboard-generator-preview-pane">
          <div class="dashboard-generator-preview-tabs" role="tablist">
            <Button
              type="button"
              size="sm"
              variant={view === "preview" ? "default" : "outline"}
              onClick={() => setView("preview")}
            >
              Live preview
            </Button>
            <Button
              type="button"
              size="sm"
              variant={view === "lang" ? "default" : "outline"}
              onClick={() => setView("lang")}
            >
              OpenUI Lang
            </Button>
            <Button type="button" size="sm" variant="ghost" onClick={() => void copyLang()}>
              Copy Lang
            </Button>
          </div>

          {view === "preview" ? (
            <div class="dashboard-generator-preview-surface">
              <KamodOpenUIRenderer
                content={lang || null}
                library={dashboardPreset}
                isStreaming={isStreaming}
                onAction={(action) => appendLog(`action: ${JSON.stringify(action)}`)}
                onError={(errors) => appendLog(`error: ${errors.map((e) => e.message).join("; ")}`)}
              />
            </div>
          ) : (
            <div class="dashboard-generator-lang-editor">
              <textarea
                class="dashboard-generator-textarea"
                rows={16}
                value={draftLang}
                onInput={(event) => setDraftLang(event.currentTarget.value)}
                spellcheck={false}
              />
              <Button type="button" size="sm" onClick={applyLangEdit}>
                Apply to preview
              </Button>
            </div>
          )}
        </div>
      </div>

      <div class="dashboard-generator-log">
        <p class="dashboard-generator-label">Host event log</p>
        <pre class="dashboard-generator-log-output">
          {log.length ? log.join("\n") : "Click buttons in the preview to see host callbacks."}
        </pre>
      </div>
    </div>
  );
}
