import {
  DASHBOARD_DEMO_FIXTURES,
  DASHBOARD_LANG,
  type DashboardDemoFixtureKey,
} from "../examples/fixtures";
import { sanitizeOpenUILang } from "./sanitize";

export type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

export type DashboardLlmSettings = {
  apiKey: string;
  baseUrl: string;
  model: string;
  /** When true, skip the network and return demo fixtures. */
  demoMode: boolean;
};

export const DEFAULT_LLM_SETTINGS: DashboardLlmSettings = {
  apiKey: "",
  baseUrl: "https://api.openai.com/v1",
  model: "gpt-4o-mini",
  demoMode: true,
};

export const LLM_SETTINGS_STORAGE_KEY = "kamod-openui-dashboard-llm";

export const DASHBOARD_QUICK_PROMPTS: Array<{
  id: DashboardDemoFixtureKey;
  label: string;
  prompt: string;
}> = [
  {
    id: "kpi-overview",
    label: "KPI Overview",
    prompt:
      "Build a sales overview dashboard with four KPI cards, a revenue chart, and a top accounts table.",
  },
  {
    id: "analytics",
    label: "Analytics",
    prompt: "Build an analytics dashboard with a traffic-sources chart and an insight alert.",
  },
  {
    id: "team-status",
    label: "Team Status",
    prompt: "Build a team status dashboard with open/done/blocked KPIs and a current-work table.",
  },
];

export function loadLlmSettings(): DashboardLlmSettings {
  if (typeof sessionStorage === "undefined") {
    return { ...DEFAULT_LLM_SETTINGS };
  }
  try {
    const raw = sessionStorage.getItem(LLM_SETTINGS_STORAGE_KEY);
    if (!raw) return { ...DEFAULT_LLM_SETTINGS };
    const parsed = JSON.parse(raw) as Partial<DashboardLlmSettings>;
    return {
      ...DEFAULT_LLM_SETTINGS,
      ...parsed,
      demoMode: parsed.demoMode ?? !parsed.apiKey,
    };
  } catch {
    return { ...DEFAULT_LLM_SETTINGS };
  }
}

export function saveLlmSettings(settings: DashboardLlmSettings): void {
  if (typeof sessionStorage === "undefined") return;
  sessionStorage.setItem(LLM_SETTINGS_STORAGE_KEY, JSON.stringify(settings));
}

export type StreamDashboardLangOptions = {
  messages: ChatMessage[];
  settings: DashboardLlmSettings;
  /** Quick-prompt id used when demoMode is on. */
  demoKey?: DashboardDemoFixtureKey;
  signal?: AbortSignal;
  onChunk: (lang: string) => void;
};

/**
 * Stream OpenUI Lang from an OpenAI-compatible chat completions endpoint,
 * or return a canned fixture when demoMode is enabled.
 */
export async function streamDashboardLang(options: StreamDashboardLangOptions): Promise<string> {
  const { messages, settings, demoKey, signal, onChunk } = options;

  if (settings.demoMode || !settings.apiKey.trim()) {
    const full = (demoKey ? DASHBOARD_DEMO_FIXTURES[demoKey] : undefined) ?? DASHBOARD_LANG;
    return streamLocalFixture(full, onChunk, signal);
  }

  const base = settings.baseUrl.replace(/\/$/, "");
  const response = await fetch(`${base}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${settings.apiKey.trim()}`,
    },
    body: JSON.stringify({
      model: settings.model,
      stream: true,
      temperature: 0.2,
      messages,
    }),
    signal,
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(
      `LLM request failed (${response.status}): ${detail.slice(0, 240) || response.statusText}`,
    );
  }

  if (!response.body) {
    throw new Error("LLM response had no body");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let accumulated = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed.startsWith("data:")) continue;
      const payload = trimmed.slice(5).trim();
      if (!payload || payload === "[DONE]") continue;
      try {
        const json = JSON.parse(payload) as {
          choices?: Array<{ delta?: { content?: string } }>;
        };
        const delta = json.choices?.[0]?.delta?.content;
        if (typeof delta === "string" && delta.length > 0) {
          accumulated += delta;
          onChunk(sanitizeOpenUILang(accumulated));
        }
      } catch {
        // ignore malformed SSE chunks
      }
    }
  }

  const finalLang = sanitizeOpenUILang(accumulated);
  onChunk(finalLang);
  return finalLang;
}

async function streamLocalFixture(
  full: string,
  onChunk: (lang: string) => void,
  signal?: AbortSignal,
): Promise<string> {
  const step = Math.max(12, Math.floor(full.length / 20));
  let index = 0;
  while (index < full.length) {
    if (signal?.aborted) {
      throw new DOMException("Aborted", "AbortError");
    }
    index = Math.min(full.length, index + step);
    onChunk(full.slice(0, index));
    await new Promise((resolve) => setTimeout(resolve, 28));
  }
  onChunk(full);
  return full;
}
