import {
  ArrowUpRightIcon,
  DatabaseIcon,
  FileCodeIcon,
  LayersIcon,
  PaletteIcon,
  ScanIcon,
  ShieldCheckIcon,
  SlidersHorizontalIcon,
  SunMoonIcon,
  ZapIcon,
} from "@kamod-ch/icons/lucide";
import type { Tokens } from "marked";
import { renderToString } from "preact-render-to-string";
import type { GuideTableRenderer } from "../../blocks/guides/guide-markdown";

const icons = {
  ThemeProvider: LayersIcon,
  defaultPreset: PaletteIcon,
  defaultScheme: SunMoonIcon,
  "useTheme()": SlidersHorizontalIcon,
  isThemePresetId: ShieldCheckIcon,
  storage: DatabaseIcon,
  ThemeScript: ZapIcon,
  getThemeInitScript: FileCodeIcon,
  attributeTarget: ScanIcon,
};

/** Decorate authored API links with the same code treatment as other inline references. */
export const renderThemeRuntimeTable: GuideTableRenderer = (table, inline) => {
  if (
    table.header.length !== 2 ||
    table.header[0].text !== "API" ||
    table.header[1].text !== "Purpose"
  )
    return;
  const rows = table.rows.map(([api, purpose]) => {
    const link = api.tokens.find((token): token is Tokens.Link => token.type === "link");
    const name =
      link?.tokens.find((token): token is Tokens.Codespan => token.type === "codespan")?.text ?? "";
    return { link, name, purpose };
  });
  if (rows.some(({ link, name }) => !link?.href.startsWith("#") || !Object.hasOwn(icons, name)))
    return;
  return renderToString(
    <div class="block-guide-table theme-runtime-table">
      <table aria-label="Theme runtime API shortcuts">
        <thead>
          <tr>
            <th scope="col">API</th>
            <th scope="col">Purpose</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(({ link, name, purpose }) => {
            const Icon = icons[name as keyof typeof icons];
            return (
              <tr key={name}>
                <th scope="row">
                  <a class="docs-inline-code-link" href={link!.href}>
                    <code class="docs-reference-code">
                      <Icon class="docs-reference-icon" size="1em" aria-hidden="true" />
                      <span>{name}</span>
                      <ArrowUpRightIcon
                        class="docs-reference-arrow"
                        size="1em"
                        aria-hidden="true"
                      />
                    </code>
                  </a>
                </th>
                <td dangerouslySetInnerHTML={{ __html: inline(purpose.tokens) }} />
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>,
  );
};
