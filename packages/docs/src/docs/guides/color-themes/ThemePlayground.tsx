import {
  ArrowUpRightIcon,
  BellIcon,
  CheckIcon,
  CircleAlertIcon,
  FlaskConicalIcon,
  InfoIcon,
  MoonIcon,
  RotateCcwIcon,
  SendIcon,
  SunIcon,
} from "@kamod-ch/icons/lucide";
import type { ThemePresetId } from "@kamod-ch/themes";
import {
  Badge,
  Button,
  Checkbox,
  Input,
  Progress,
  Skeleton,
  Switch,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@kamod-ch/ui";
import type { ComponentChildren } from "preact";
import { useLayoutEffect, useRef, useState } from "preact/hooks";
import { withBasePath } from "../../../base-path";
import { BlockHeadingLink } from "../../../blocks/BlockHeadingLink";
import { observeViewportActivity } from "../../../layout/runtime/viewport-activity";
import "./theme-playground.css";

type Scene = "ready" | "loading" | "error";
const checks = [
  ["Content reviewed", "Text, labels and empty states"],
  ["Keyboard tested", "Focus, selection and form controls"],
  ["Both modes checked", "Surfaces, feedback and chart colors"],
] as const;

function TokenHint({ label, children }: { label: string; children: ComponentChildren }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button type="button" class="theme-playground-hint" aria-label={label}>
          <InfoIcon size={12} aria-hidden="true" />
        </button>
      </TooltipTrigger>
      <TooltipContent class="theme-playground-tooltip">{children}</TooltipContent>
    </Tooltip>
  );
}

function LoadingSpecimen() {
  const [animate, setAnimate] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const node = root.current;
    if (!node) return;
    node.removeAttribute("data-loading-active");
    if (!animate) return;
    return observeViewportActivity(node, (active) =>
      node.toggleAttribute("data-loading-active", active),
    );
  }, [animate]);

  return (
    <div ref={root} class="theme-playground-loading" aria-label="Loading state specimen">
      <div class="theme-playground-skeleton-label" aria-hidden="true">
        <Skeleton />
        <Skeleton />
      </div>
      <Skeleton class="theme-playground-skeleton-input" aria-hidden="true" />
      <div class="theme-playground-skeleton-checks" aria-hidden="true">
        {checks.map(([name]) => (
          <div key={name}>
            <Skeleton />
            <div>
              <Skeleton />
              <Skeleton />
            </div>
          </div>
        ))}
      </div>
      <label class="theme-playground-animation-control">
        <span>Animate placeholders</span>
        <Switch
          size="sm"
          checked={animate}
          onCheckedChange={setAnimate}
          aria-label="Animate placeholders"
        />
      </label>
      <p>
        {animate
          ? "A gentle pulse, paused offscreen or in a hidden tab. Reduced motion keeps it still."
          : "Paused for a closer look. Turn on the pulse, or choose Content to bring the form back."}
      </p>
    </div>
  );
}

/** A working local scene: no page preference, remote requests or background timers. */
export function ThemePlayground({
  preset,
  label,
  example,
}: {
  preset: ThemePresetId;
  label: string;
  example?: string;
}) {
  const [scheme, setScheme] = useState<"light" | "dark">("light");
  const [scene, setScene] = useState<Scene>("ready");
  const [title, setTitle] = useState("A better first impression");
  const [completed, setCompleted] = useState([true, true, false]);
  const [notify, setNotify] = useState(true);
  const [published, setPublished] = useState(false);
  const id = `color-theme-${preset}-playground`;
  const count = completed.filter(Boolean).length;
  const invalid = scene === "error" || !title.trim();

  const reset = () => {
    setScene("ready");
    setTitle("A better first impression");
    setCompleted([true, true, false]);
    setNotify(true);
    setPublished(false);
  };

  return (
    <section class="theme-playground" aria-labelledby={id}>
      <div class="theme-study-section-heading">
        <div>
          <h4 id={id} tabIndex={-1}>
            <FlaskConicalIcon size={14} aria-hidden="true" />
            <BlockHeadingLink id={id}>Put the palette to work</BlockHeadingLink>
          </h4>
          <p>
            Edit a release, check its states, then switch appearances. Only this workspace changes.
          </p>
        </div>
      </div>
      <div
        class={`theme-playground-scope ${scheme}`}
        data-theme-scope=""
        data-theme={preset}
        style={{ colorScheme: scheme }}
        aria-label={`${label} interactive workspace`}
      >
        <div class="theme-playground-toolbar">
          <div class="theme-playground-identity">
            <span class="theme-playground-mark" aria-hidden="true">
              <FlaskConicalIcon size={17} />
            </span>
            <div>
              <strong>Release studio</strong>
              <span>{label} · Local experiment</span>
            </div>
          </div>
          <div class="theme-playground-modes" role="group" aria-label="Workspace appearance">
            {(["light", "dark"] as const).map((mode) => {
              const Icon = mode === "light" ? SunIcon : MoonIcon;
              return (
                <Button
                  key={mode}
                  type="button"
                  variant="ghost"
                  size="xs"
                  aria-pressed={scheme === mode}
                  onClick={() => setScheme(mode)}
                >
                  <Icon size={12} aria-hidden="true" />
                  {mode === "light" ? "Light" : "Dark"}
                </Button>
              );
            })}
          </div>
        </div>
        <div class="theme-playground-controls">
          <span>Inspect a state</span>
          <div role="group" aria-label="Workspace state">
            {(
              [
                ["ready", "Content"],
                ["loading", "Loading"],
                ["error", "Validation"],
              ] as const
            ).map(([value, name]) => (
              <Button
                key={value}
                type="button"
                size="xs"
                variant="ghost"
                aria-pressed={scene === value}
                onClick={() => {
                  setScene(value);
                  setPublished(false);
                }}
              >
                {name}
              </Button>
            ))}
          </div>
          <TokenHint label="About the workspace states">
            Content, loading and validation share the same layout. Compare muted placeholders, input
            boundaries and error feedback without changing the page theme. Loading stays paused
            until you enable its optional animation; choose Content to bring the form back.
          </TokenHint>
        </div>
        <div class="theme-playground-workspace">
          <div class="theme-playground-editor">
            <div class="theme-playground-panel-heading">
              <span>Next release</span>
              <Badge variant={published ? "success" : "secondary"} size="xxs">
                {published ? "Published" : "Draft"}
              </Badge>
            </div>
            {scene === "loading" ? (
              <LoadingSpecimen />
            ) : (
              <>
                <label class="theme-playground-field" for={`${id}-title`}>
                  <span>Release title</span>
                  <Input
                    id={`${id}-title`}
                    value={title}
                    aria-invalid={invalid}
                    aria-describedby={invalid ? `${id}-error` : undefined}
                    onInput={(event) => {
                      setTitle(event.currentTarget.value);
                      setPublished(false);
                      if (scene === "error") setScene("ready");
                    }}
                  />
                </label>
                {invalid && (
                  <p id={`${id}-error`} class="theme-playground-error" role="alert">
                    <CircleAlertIcon size={13} aria-hidden="true" />
                    {scene === "error"
                      ? "This title is already in use. Edit it to clear the example error."
                      : "Give your release a title before publishing."}
                  </p>
                )}
                <fieldset class="theme-playground-checks" disabled={published}>
                  <legend>Before it goes live</legend>
                  {checks.map(([name, detail], index) => (
                    <label key={name}>
                      <Checkbox
                        checked={completed[index]}
                        onCheckedChange={(checked) => {
                          setCompleted((previous) =>
                            previous.map((value, at) => (at === index ? checked === true : value)),
                          );
                          setPublished(false);
                        }}
                      />
                      <span>
                        <strong>{name}</strong>
                        <small>{detail}</small>
                      </span>
                    </label>
                  ))}
                </fieldset>
              </>
            )}
          </div>
          <aside class="theme-playground-inspector" aria-label="Release readiness">
            <div class="theme-playground-panel-heading">
              <span>Ready for the next step?</span>
              <TokenHint label="About progress and feedback colors">
                The progress bar uses primary on muted. Success adds a quiet success tint; errors
                add a colored boundary. Both keep readable page text, with words and icons so their
                meaning survives even when a preset shares their hue.
              </TokenHint>
            </div>
            <div class="theme-playground-readiness">
              <strong>
                {count}
                <span> / 3</span>
              </strong>
              <span>release checks complete</span>
            </div>
            <Progress value={count} max={3} aria-label="Release checks complete" />
            <p class="theme-playground-guidance">
              {published
                ? "Your local preview is published. Nothing has left this page."
                : count === 3
                  ? "All checks are in. Try the primary action and watch the feedback change."
                  : "Complete the checklist to make the primary action available."}
            </p>
            <label class="theme-playground-notify">
              <BellIcon size={14} aria-hidden="true" />
              <span>Notify the team</span>
              <Switch
                size="sm"
                checked={notify}
                onCheckedChange={setNotify}
                aria-label="Notify the team"
              />
            </label>
            <Button
              type="button"
              class="theme-playground-publish"
              size="sm"
              disabled={scene === "loading" || invalid || count !== 3 || published}
              onClick={() => setPublished(true)}
            >
              {published ? <CheckIcon size={14} /> : <SendIcon size={14} />}
              {published ? "Published locally" : "Publish preview"}
            </Button>
            <div class="theme-playground-feedback" role="status" aria-live="polite">
              {published ? (
                <span class="theme-playground-success">
                  <CheckIcon size={13} aria-hidden="true" />
                  {notify ? "Published. Team notification previewed." : "Published quietly."}
                </span>
              ) : (
                <span>Local only · No messages or releases are sent.</span>
              )}
            </div>
          </aside>
        </div>
        <div class="theme-playground-bottom">
          <div class="theme-playground-chart">
            <div>
              <strong>Five colors, one visual rhythm</strong>
              <span>Chart roles stay separate from action and feedback colors.</span>
            </div>
            <div
              class="theme-playground-chart-bars"
              role="img"
              aria-label="Chart token sample: five bars using chart-1 through chart-5"
            >
              {[42, 72, 56, 90, 66].map((height, index) => (
                <span
                  key={index}
                  style={{ height: `${height}%`, background: `var(--chart-${index + 1})` }}
                />
              ))}
            </div>
            <TokenHint label="About the chart token sample">
              These decorative bars compare chart-1 through chart-5. Their fixed heights are not
              product metrics. Use these roles for separate data series, with labels or patterns
              when color alone cannot identify them.
            </TokenHint>
          </div>
          <Button type="button" size="xs" variant="outline" onClick={reset}>
            <RotateCcwIcon size={12} aria-hidden="true" />
            Reset experiment
          </Button>
        </div>
      </div>
      <p class="theme-playground-caption">
        {example ? <span>{example} </span> : null}
        <a href={withBasePath("/docs/theming/token-overrides#what-a-theme-token-actually-is")}>
          Trace these roles back to the tokens <ArrowUpRightIcon size={11} aria-hidden="true" />
        </a>
      </p>
    </section>
  );
}
