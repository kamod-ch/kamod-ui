import {
  ArrowUpRightIcon,
  DropletsIcon,
  InfoIcon,
  MoonIcon,
  PaletteIcon,
  SearchIcon,
  SunIcon,
} from "@kamod-ch/icons/lucide";
import type { ThemePresetId } from "@kamod-ch/themes";
import { CopyButton, Tooltip, TooltipContent } from "@kamod-ch/ui";
import { type CSSProperties, Fragment, type TargetedEvent } from "preact";
import { createPortal } from "preact/compat";
import { useEffect, useId, useMemo, useRef, useState } from "preact/hooks";
import { BlockHeadingLink } from "../../../blocks/BlockHeadingLink";
import {
  colorFromBytes,
  colorGroups,
  coreColorNames,
  type ResolvedColor,
  type ThemeColorToken,
  themeColorTokens,
  tokenColorExpression,
} from "./theme-color-tokens";
import "./theme-color-reference.css";

type Scheme = "light" | "dark";
type Format = "variable" | "css" | "hex" | "rgb";
type Palette = Record<Scheme, Record<string, ResolvedColor>>;
type Selection = { token: ThemeColorToken; scheme: Scheme };
type Hover = Selection & { rect: DOMRect };
const schemes = ["light", "dark"] as const;
const sourceUrl = (file: string) =>
  `https://github.com/kamod-ch/kamod-ui/blob/main/packages/themes/src/${file}`;
const appearance = (scheme: Scheme) => (scheme === "light" ? "Light" : "Dark");

function colorValue(token: ThemeColorToken, scheme: Scheme, format: Format, palette: Palette) {
  const resolved = palette[scheme][token.name];
  if (format === "variable") return tokenColorExpression(token, scheme);
  return resolved?.[format];
}

/** A pair of local scopes, one batched read near the viewport, and no saved preference. */
function usePalette(tokens: ThemeColorToken[], preset: ThemePresetId) {
  const root = useRef<HTMLDivElement>(null);
  const light = useRef<HTMLSpanElement>(null);
  const dark = useRef<HTMLSpanElement>(null);
  const [palette, setPalette] = useState<Palette>({ light: {}, dark: {} });
  useEffect(() => {
    let cancelled = false;
    const resolve = () => {
      if (cancelled) return;
      const result: Palette = { light: {}, dark: {} };
      let context: CanvasRenderingContext2D | null = null;
      let attemptedCanvas = false;
      for (const scheme of schemes) {
        const probe = scheme === "light" ? light.current : dark.current;
        if (!probe) continue;
        for (const token of tokens) {
          probe.style.color = tokenColorExpression(token, scheme);
          const css = getComputedStyle(probe).color;
          if (
            !css ||
            (!getComputedStyle(probe).getPropertyValue(`--${token.name}`).trim() && !token.optional)
          )
            continue;
          // A DOM without styles can retain var() verbatim; it is not a resolved color.
          if (css.startsWith("var(")) continue;
          result[scheme][token.name] = { css };
          if (!attemptedCanvas) {
            attemptedCanvas = true;
            const canvas = document.createElement("canvas");
            canvas.width = canvas.height = 1;
            try {
              context = canvas.getContext("2d", { willReadFrequently: true });
            } catch {
              /* Exact CSS values remain available without a Canvas export. */
            }
          }
          if (context) {
            context.clearRect(0, 0, 1, 1);
            context.fillStyle = css;
            context.fillRect(0, 0, 1, 1);
            result[scheme][token.name] = colorFromBytes(css, context.getImageData(0, 0, 1, 1).data);
          }
        }
      }
      if (!cancelled) setPalette(result);
    };
    if (typeof IntersectionObserver === "undefined" || !root.current) resolve();
    else {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((entry) => entry.isIntersecting)) {
            observer.disconnect();
            resolve();
          }
        },
        { rootMargin: "320px" },
      );
      observer.observe(root.current);
      return () => {
        cancelled = true;
        observer.disconnect();
      };
    }
    return () => {
      cancelled = true;
    };
  }, [tokens, preset]);
  return { root, light, dark, palette };
}

/** Two reading sections: a quick palette and the complete source-backed color vocabulary. */
export function ThemeColorReference({ preset, label }: { preset: ThemePresetId; label: string }) {
  const tokens = useMemo(() => themeColorTokens(preset), [preset]);
  const { root, light, dark, palette } = usePalette(tokens, preset);
  const [scheme, setScheme] = useState<Scheme>("light");
  const [format, setFormat] = useState<Format>("hex");
  const [query, setQuery] = useState("");
  const [selection, setSelection] = useState<Selection>({
    token: tokens.find((token) => token.name === "primary")!,
    scheme: "light",
  });
  const [hover, setHover] = useState<Hover | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const tooltipId = useId();
  const filterId = useId();
  const formatId = useId();
  const keepOpen = () => clearTimeout(closeTimer.current);
  const closeSoon = () => {
    keepOpen();
    closeTimer.current = setTimeout(() => setHover(null), 160);
  };
  useEffect(() => () => clearTimeout(closeTimer.current), []);
  useEffect(() => {
    if (!hover) return;
    const close = (event: Event) => {
      if (event.target instanceof Element && event.target.closest(".theme-color-tooltip")) return;
      setHover(null);
    };
    window.addEventListener("scroll", close, true);
    window.addEventListener("resize", close);
    return () => {
      window.removeEventListener("scroll", close, true);
      window.removeEventListener("resize", close);
    };
  }, [hover]);

  const show = (event: TargetedEvent<HTMLButtonElement>, token: ThemeColorToken, mode: Scheme) => {
    keepOpen();
    setHover({ token, scheme: mode, rect: event.currentTarget.getBoundingClientRect() });
  };
  const inspectProps = (token: ThemeColorToken, mode: Scheme, core = false) => ({
    "aria-label": `${core ? "Explore" : "Inspect"} ${label} ${appearance(mode).toLowerCase()} ${token.label} color`,
    "aria-describedby":
      hover?.token.name === token.name && hover.scheme === mode ? tooltipId : undefined,
    onMouseEnter: (event: TargetedEvent<HTMLButtonElement>) => show(event, token, mode),
    onMouseLeave: closeSoon,
    onFocusIn: (event: TargetedEvent<HTMLButtonElement>) => show(event, token, mode),
    onFocusOut: () => setHover(null),
    onKeyDown: (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setHover(null);
        event.stopPropagation();
      }
    },
    onClick: () => {
      setSelection({ token, scheme: mode });
      setHover(null);
      if (core) setQuery("");
      if (core)
        requestAnimationFrame(() => {
          const inspector = root.current?.querySelector<HTMLElement>(".theme-color-inspector");
          inspector?.scrollIntoView({ block: "nearest" });
          inspector?.focus({ preventScroll: true });
        });
    },
  });
  const selected = selection.token;
  const selectedColor = palette[selection.scheme][selected.name];
  const filtered = tokens.filter((token) =>
    `${token.name} ${token.label} ${token.group}`
      .toLowerCase()
      .includes(query.trim().toLowerCase()),
  );
  const coreLabels: Record<string, string> = {
    accent: "Accent",
    muted: "Muted",
    "sidebar-background": "Sidebar",
  };
  const core = coreColorNames.map((name) => {
    const token = tokens.find((token) => token.name === name)!;
    return { ...token, label: coreLabels[name] ?? token.label };
  });
  const coreId = `color-theme-${preset}-core-colors`;
  const allId = `color-theme-${preset}-all-colors`;
  const name = tokenColorExpression(selected, selection.scheme);

  const inspector = (
    <div
      class="theme-color-inspector"
      role="region"
      tabIndex={-1}
      aria-label={`${label} selected color`}
    >
      <div class="theme-color-inspector-intro" aria-live="polite" aria-atomic="true">
        <span
          class={`theme-color-inspector-dot ${selection.scheme}`}
          data-theme-scope=""
          data-theme={preset}
          style={{ background: tokenColorExpression(selected, selection.scheme) }}
          aria-hidden="true"
        />
        <div>
          <strong>
            {selected.label}
            <span> / {appearance(selection.scheme)}</span>
          </strong>
          <code>--{selected.name}</code>
        </div>
      </div>
      <div class="theme-color-inspector-values">
        <div>
          <span>CSS variable</span>
          <code>{name}</code>
          <CopyButton
            value={name}
            label={`Copy ${selected.name} CSS variable`}
            subject="CSS variable"
            iconOnly
          />
        </div>
        <div>
          <span>Resolved CSS</span>
          <code>{selectedColor?.css ?? "Available in browser"}</code>
          <CopyButton
            value={selectedColor?.css ?? ""}
            disabled={!selectedColor?.css}
            label={`Copy ${selected.name} resolved CSS`}
            subject="CSS color"
            iconOnly
          />
        </div>
        <div>
          <span>HEX · sRGB export</span>
          <code>{selectedColor?.hex ?? "Available in your browser"}</code>
          <CopyButton
            value={selectedColor?.hex ?? ""}
            label={`Copy ${selected.name} HEX color`}
            subject="HEX color"
            iconOnly
            disabled={!selectedColor?.hex}
          />
        </div>
      </div>
      <div class="theme-color-inspector-context">
        <p>{selected.description}</p>
        <a href={sourceUrl(selected[selection.scheme].source)}>
          Read source declaration
          <ArrowUpRightIcon size={12} aria-hidden="true" />
        </a>
      </div>
    </div>
  );

  return (
    <div ref={root} class="theme-color-reference" data-code-help="off">
      <span
        ref={light}
        class="theme-color-resolver light"
        data-theme-scope=""
        data-theme={preset}
        aria-hidden="true"
      />
      <span
        ref={dark}
        class="theme-color-resolver dark"
        data-theme-scope=""
        data-theme={preset}
        aria-hidden="true"
      />
      <section aria-labelledby={coreId} class="theme-color-core">
        <div class="theme-color-heading">
          <div>
            <h4 id={coreId} tabIndex={-1}>
              <PaletteIcon size={15} aria-hidden="true" />
              <BlockHeadingLink id={coreId}>Core colors</BlockHeadingLink>
              <span>·</span>
              <small>The palette at a glance</small>
            </h4>
            <p>
              Eight roles that set the tone. Explore a swatch, copy a value, then keep its matching
              text color with it.
            </p>
          </div>
          <div
            class="theme-color-mode"
            role="group"
            aria-label={`${label} core palette appearance`}
          >
            {schemes.map((mode) => {
              const Icon = mode === "light" ? SunIcon : MoonIcon;
              return (
                <button
                  key={mode}
                  type="button"
                  aria-pressed={scheme === mode}
                  onClick={() => setScheme(mode)}
                >
                  <Icon size={13} aria-hidden="true" />
                  {appearance(mode)}
                </button>
              );
            })}
          </div>
        </div>
        <div class="theme-color-copy-format">
          <span>
            <InfoIcon size={12} aria-hidden="true" />
            Hover or focus for the role, pairing and source.
          </span>
          <label htmlFor={formatId}>
            Copy as{" "}
            <select
              id={formatId}
              value={format}
              onInput={(event) => setFormat(event.currentTarget.value as Format)}
            >
              <option value="hex">HEX · sRGB</option>
              <option value="rgb">RGB · sRGB</option>
              <option value="css">Resolved CSS</option>
              <option value="variable">CSS variable</option>
            </select>
          </label>
        </div>
        <div class="theme-color-core-grid">
          {core.map((token) => (
            <article class="theme-color-swatch" key={token.name}>
              <button
                type="button"
                class="theme-color-swatch-inspect"
                {...inspectProps(token, scheme, true)}
              >
                <span
                  class={`theme-color-paint ${scheme}`}
                  data-theme-scope=""
                  data-theme={preset}
                  style={{ background: tokenColorExpression(token, scheme) }}
                  aria-hidden="true"
                >
                  <span style={{ color: `var(--${token.pair ?? "foreground"})` }}>Aa</span>
                </span>
                <span class="theme-color-swatch-label">
                  <strong>{token.label}</strong>
                  <InfoIcon size={13} aria-hidden="true" />
                  <code>--{token.name}</code>
                </span>
              </button>
              <div class="theme-color-swatch-value">
                <code>{colorValue(token, scheme, format, palette) ?? "Available in browser"}</code>
                <CopyButton
                  value={colorValue(token, scheme, format, palette) ?? ""}
                  disabled={!colorValue(token, scheme, format, palette)}
                  label={`Copy ${label} ${appearance(scheme).toLowerCase()} ${token.label} ${format}`}
                  subject={`${token.label} color`}
                  iconOnly
                />
              </div>
            </article>
          ))}
        </div>
        <p class="theme-color-note">
          The variable follows your app's appearance; fixed HEX and RGB values do not. Those exports
          are 8-bit sRGB conversions, with alpha preserved. Resolved CSS keeps the browser's color
          space.
        </p>
      </section>

      <section aria-labelledby={allId} class="theme-color-all">
        <div class="theme-color-heading">
          <div>
            <h4 id={allId} tabIndex={-1}>
              <DropletsIcon size={15} aria-hidden="true" />
              <BlockHeadingLink id={allId}>Every color</BlockHeadingLink>
              <span>·</span>
              <small>Light and dark, side by side</small>
            </h4>
            <p>
              All {tokens.filter((token) => !token.optional).length} semantic colors
              {tokens.some((token) => token.optional)
                ? ` and ${tokens.filter((token) => token.optional).length} optional source shades`
                : ""}
              , including text, focus and feedback. Choose a color below to inspect and copy it.
            </p>
          </div>
        </div>
        <div class="theme-color-filter-row">
          <label htmlFor={filterId}>
            <SearchIcon size={14} aria-hidden="true" />
            <input
              id={filterId}
              type="search"
              value={query}
              onInput={(event) => setQuery(event.currentTarget.value)}
              placeholder="Find a color or role…"
              aria-label={`Find a ${label} color`}
            />
          </label>
          <span aria-live="polite">
            {filtered.length} / {tokens.length} colors
          </span>
        </div>
        <div class="theme-color-token-groups">
          {colorGroups.map((group) => {
            const colors = filtered.filter((token) => token.group === group.id);
            if (!colors.length) return null;
            return (
              <section
                class="theme-color-token-group"
                key={group.id}
                aria-label={`${label} ${group.label}`}
              >
                <div class="theme-color-group-heading">
                  <h5>{group.label}</h5>
                  <p>{group.description}</p>
                  <span>{colors.length}</span>
                </div>
                <table>
                  <thead>
                    <tr>
                      <th scope="col">Role / token</th>
                      <th scope="col">
                        <SunIcon size={12} aria-hidden="true" /> Light
                      </th>
                      <th scope="col">
                        <MoonIcon size={12} aria-hidden="true" /> Dark
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {colors.map((token) => (
                      <Fragment key={token.name}>
                        <tr>
                          <th scope="row">
                            <span>{token.label}</span>
                            <code>--{token.name}</code>
                          </th>
                          {schemes.map((mode) => (
                            <td key={mode}>
                              <button
                                type="button"
                                class="theme-color-token-value"
                                aria-pressed={
                                  selected.name === token.name && selection.scheme === mode
                                }
                                {...inspectProps(token, mode)}
                              >
                                <span
                                  class={`theme-color-token-paint ${mode}`}
                                  data-theme-scope=""
                                  data-theme={preset}
                                  style={{ background: tokenColorExpression(token, mode) }}
                                  aria-hidden="true"
                                />
                                <code>
                                  {palette[mode][token.name]?.hex ??
                                    tokenColorExpression(token, mode)}
                                </code>
                                <InfoIcon size={12} aria-hidden="true" />
                              </button>
                            </td>
                          ))}
                        </tr>
                        {selected.name === token.name && (
                          <tr class="theme-color-inspector-row">
                            <td colSpan={3}>{inspector}</td>
                          </tr>
                        )}
                      </Fragment>
                    ))}
                  </tbody>
                </table>
              </section>
            );
          })}
          {filtered.length === 0 && (
            <p class="theme-color-empty">No matching color. Try “primary”, “text” or “sidebar”.</p>
          )}
        </div>
        <p class="theme-color-note">
          Each appearance is isolated from the page theme. Equal swatches can still have different
          roles. <code>bg-sidebar</code> maps to <code>--sidebar-background</code>;{" "}
          <code>ring-sidebar-ring</code> maps to <code>--sidebar-outline</code>. Optional source
          shades stay separate from the reusable semantic roles; Watson's source shades are the same
          in both appearances. Variable copies include a fallback for optional shades.
        </p>
      </section>
      {hover &&
        typeof document !== "undefined" &&
        createPortal(
          <Tooltip
            open
            onOpenChange={(open) => {
              if (!open) setHover(null);
            }}
            style={
              {
                position: "fixed",
                top: hover.rect.top,
                left: hover.rect.left,
                width: hover.rect.width,
                height: hover.rect.height,
                zIndex: 80,
                pointerEvents: "none",
              } as CSSProperties
            }
          >
            <TooltipContent
              id={tooltipId}
              class="theme-color-tooltip"
              side={hover.rect.top > window.innerHeight - hover.rect.bottom ? "top" : "bottom"}
              collisionPadding={12}
              onMouseEnter={keepOpen}
              onMouseLeave={closeSoon}
              style={{
                pointerEvents: "auto",
                maxHeight: `${Math.max(96, Math.max(hover.rect.top, window.innerHeight - hover.rect.bottom) - 20)}px`,
                overflowY: "auto",
              }}
            >
              <div class="theme-color-tooltip-title">
                <strong>{hover.token.label}</strong>
                <span>
                  {label} / {appearance(hover.scheme)}
                </span>
              </div>
              <code class="theme-color-tooltip-token">--{hover.token.name}</code>
              <p>{hover.token.description}</p>
              {hover.token.pair && (
                <p class="theme-color-tooltip-pair">
                  Pair with <code>--{hover.token.pair}</code>. Preview at the text size you intend
                  to use.
                </p>
              )}
              <dl>
                <div>
                  <dt>Source</dt>
                  <dd>{hover.token[hover.scheme].source}</dd>
                </div>
                <div>
                  <dt>Declared</dt>
                  <dd>
                    <code>{hover.token[hover.scheme].declaration}</code>
                  </dd>
                </div>
                <div>
                  <dt>Resolved</dt>
                  <dd>
                    <code>
                      {palette[hover.scheme][hover.token.name]?.css ??
                        tokenColorExpression(hover.token, hover.scheme)}
                    </code>
                  </dd>
                </div>
              </dl>
              <span class="theme-color-tooltip-hint">
                Click to inspect values and copy. HEX/RGB are converted to sRGB
                {(palette[hover.scheme][hover.token.name]?.alpha ?? 1) < 1
                  ? "; this color includes transparency"
                  : ""}
                .
              </span>
            </TooltipContent>
          </Tooltip>,
          document.body,
        )}
    </div>
  );
}
