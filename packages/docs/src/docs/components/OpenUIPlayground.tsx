import { KamodOpenUIRenderer } from "@kamod-ch/openui";
import {
  CONTACT_FORM_LANG,
  EMPTY_STATE_LANG,
  SETTINGS_UI_LANG,
  SIMPLE_CARD_LANG,
  STATUS_CARD_LANG,
} from "@kamod-ch/openui/examples";
import { Button, Label, Switch } from "@kamod-ch/ui";
import { useEffect, useRef, useState } from "preact/hooks";

const FIXTURES = {
  "Simple card": SIMPLE_CARD_LANG,
  "Status card": STATUS_CARD_LANG,
  "Contact form": CONTACT_FORM_LANG,
  "Settings tabs": SETTINGS_UI_LANG,
  "Empty state": EMPTY_STATE_LANG,
} as const;

type FixtureKey = keyof typeof FIXTURES;

const STREAM_CHUNK_MS = 40;

export const OpenUIPlayground = () => {
  const [fixtureKey, setFixtureKey] = useState<FixtureKey>("Status card");
  const [draftContent, setDraftContent] = useState<string>(FIXTURES["Status card"]);
  const [renderContent, setRenderContent] = useState<string>(FIXTURES["Status card"]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [simulateStreaming, setSimulateStreaming] = useState(false);
  const [log, setLog] = useState<string[]>([]);
  const streamTimerRef = useRef<number | null>(null);

  const appendLog = (line: string) => {
    setLog((prev) => [line, ...prev].slice(0, 8));
  };

  const applyFixture = (key: FixtureKey) => {
    setFixtureKey(key);
    setDraftContent(FIXTURES[key]);
    setRenderContent(FIXTURES[key]);
    setIsStreaming(false);
    if (streamTimerRef.current != null) {
      window.clearInterval(streamTimerRef.current);
      streamTimerRef.current = null;
    }
  };

  const runStreamingPreview = () => {
    if (streamTimerRef.current != null) {
      window.clearInterval(streamTimerRef.current);
      streamTimerRef.current = null;
    }

    const full = draftContent;
    setIsStreaming(true);
    setRenderContent("");

    let index = 0;
    streamTimerRef.current = window.setInterval(() => {
      index = Math.min(full.length, index + Math.max(8, Math.floor(full.length / 24)));
      setRenderContent(full.slice(0, index));
      if (index >= full.length) {
        if (streamTimerRef.current != null) {
          window.clearInterval(streamTimerRef.current);
          streamTimerRef.current = null;
        }
        setIsStreaming(false);
      }
    }, STREAM_CHUNK_MS);
  };

  const handlePreview = () => {
    if (simulateStreaming) {
      runStreamingPreview();
      return;
    }
    setIsStreaming(false);
    setRenderContent(draftContent);
  };

  useEffect(() => {
    return () => {
      if (streamTimerRef.current != null) {
        window.clearInterval(streamTimerRef.current);
      }
    };
  }, []);

  return (
    <div class="openui-playground">
      <div class="openui-playground-toolbar">
        <div class="openui-playground-fixtures" role="tablist" aria-label="OpenUI fixtures">
          {(Object.keys(FIXTURES) as FixtureKey[]).map((key) => (
            <Button
              key={key}
              type="button"
              size="sm"
              variant={fixtureKey === key ? "default" : "outline"}
              onClick={() => applyFixture(key)}
            >
              {key}
            </Button>
          ))}
        </div>
        <div class="openui-playground-streaming">
          <Switch
            id="openui-simulate-streaming"
            checked={simulateStreaming}
            onCheckedChange={(checked) => setSimulateStreaming(checked)}
          />
          <Label htmlFor="openui-simulate-streaming">Simulate streaming</Label>
          <Button type="button" size="sm" variant="secondary" onClick={handlePreview}>
            {simulateStreaming ? "Stream preview" : "Update preview"}
          </Button>
        </div>
      </div>

      <div class="openui-playground-grid">
        <div class="openui-playground-editor">
          <label class="openui-playground-label" for="openui-lang-editor">
            OpenUI Lang
          </label>
          <textarea
            id="openui-lang-editor"
            class="openui-playground-textarea"
            rows={14}
            value={draftContent}
            onInput={(event) => setDraftContent(event.currentTarget.value)}
            spellcheck={false}
          />
        </div>

        <div class="openui-playground-preview">
          <p class="openui-playground-label">Live preview</p>
          <div class="openui-playground-preview-surface">
            <KamodOpenUIRenderer
              content={renderContent}
              isStreaming={isStreaming}
              onAction={(action) => appendLog(`action: ${JSON.stringify(action)}`)}
              onSubmit={({ formName, formState }) =>
                appendLog(`submit: ${formName ?? "form"} ${JSON.stringify(formState ?? {})}`)
              }
              onError={(errors) =>
                appendLog(`error: ${errors.map((error) => error.message).join("; ")}`)
              }
            />
          </div>
        </div>
      </div>

      <div class="openui-playground-log">
        <p class="openui-playground-label">Host event log</p>
        <pre class="openui-playground-log-output">
          {log.length ? log.join("\n") : "Click buttons or submit forms to see host callbacks."}
        </pre>
      </div>
    </div>
  );
};
