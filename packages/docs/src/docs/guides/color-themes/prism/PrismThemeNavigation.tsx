import { ChevronDownIcon, CodeIcon, MoonIcon, SearchIcon, SunIcon } from "@kamod-ch/icons/lucide";
import { useEffect, useId, useMemo, useRef, useState } from "preact/hooks";
import { prismThemeId, prismThemes } from "./prism-theme-catalog";
import "./prism-theme-navigation.css";

/** The last palette link opens an index; searching never hides the actual study destinations. */
export function PrismThemeNavigation() {
  const root = useRef<HTMLDetailsElement>(null);
  const search = useRef<HTMLInputElement>(null);
  const searchId = useId();
  const [query, setQuery] = useState("");
  const [canvas, setCanvas] = useState("all");
  const matches = useMemo(() => {
    const words = query.toLocaleLowerCase().trim().split(/\s+/);
    return prismThemes.filter(
      (theme) =>
        (canvas === "all" || theme.canvas === canvas) &&
        words.every((word) =>
          `${theme.label} ${theme.author} ${theme.id}`.toLocaleLowerCase().includes(word),
        ),
    );
  }, [query, canvas]);
  useEffect(() => {
    const reveal = () => {
      const route = window.location.pathname.replace(/\/+$/, "").split("/").at(-1) ?? "";
      if (
        (/^#prism-(?:theme-|color-themes)/.test(window.location.hash) ||
          /^prism-(?:theme-|color-themes)/.test(route)) &&
        root.current
      )
        root.current.open = true;
    };
    reveal();
    window.addEventListener("hashchange", reveal);
    return () => window.removeEventListener("hashchange", reveal);
  }, []);
  return (
    <details class="prism-theme-index" id="prism-theme-index" ref={root}>
      <summary>
        <span class="prism-theme-index-title">
          <CodeIcon size={15} aria-hidden="true" />
          Prism syntax themes
        </span>
        <span class="prism-theme-index-summary">{prismThemes.length} palettes for your code</span>
        <ChevronDownIcon class="prism-theme-index-chevron" size={15} aria-hidden="true" />
      </summary>
      <div class="prism-theme-index-body">
        <div class="prism-theme-index-tools">
          <label class="prism-theme-index-search" for={searchId}>
            <SearchIcon size={14} aria-hidden="true" />
            <span class="sr-only">Find a Prism theme</span>
            <input
              id={searchId}
              ref={search}
              type="search"
              value={query}
              placeholder="Find a theme or author…"
              onInput={(event) => setQuery(event.currentTarget.value)}
            />
          </label>
          <select
            aria-label="Prism code canvas"
            value={canvas}
            onChange={(event) => setCanvas(event.currentTarget.value)}
          >
            <option value="all">All canvases</option>
            <option value="light">Light canvases</option>
            <option value="dark">Dark canvases</option>
          </select>
        </div>
        <ul class="prism-theme-index-links">
          {matches.map((theme) => (
            <li key={theme.id}>
              <a href={`#${prismThemeId(theme.id)}`}>
                {theme.canvas === "light" ? (
                  <SunIcon size={12} aria-hidden="true" />
                ) : (
                  <MoonIcon size={12} aria-hidden="true" />
                )}
                <span>{theme.label}</span>
              </a>
            </li>
          ))}
        </ul>
        {matches.length === 0 && (
          <p class="prism-theme-index-empty">
            No theme matches.{" "}
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setCanvas("all");
                search.current?.focus();
              }}
            >
              Clear filters
            </button>
          </p>
        )}
        <div class="prism-theme-index-footer">
          <span>
            {matches.length} of {prismThemes.length}
          </span>
          <a href="#prism-color-themes">Start the collection</a>
          <a href="#prism-theme-resources">Sources &amp; adaptation</a>
        </div>
      </div>
    </details>
  );
}
