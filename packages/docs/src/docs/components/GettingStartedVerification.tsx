import {
  ArrowUpRightIcon,
  BlocksIcon,
  ListChecksIcon,
  PackageCheckIcon,
  PaletteIcon,
  RocketIcon,
  RouteIcon,
} from "@kamod-ch/icons/lucide";
import type { Tokens } from "marked";
import { renderToString } from "preact-render-to-string";
import { withBasePath } from "../../base-path";
import type { GuideTableRenderer } from "../../blocks/guides/guide-markdown";

const icons = {
  Installation: PackageCheckIcon,
  Styles: PaletteIcon,
  Composition: BlocksIcon,
  "Input and save": ListChecksIcon,
  Navigation: RouteIcon,
  Delivery: RocketIcon,
};

/** Keep content and destinations in Markdown; enhance only the verification table. */
export const renderGettingStartedTable: GuideTableRenderer = (table, inline) => {
  if (
    table.header.length !== 2 ||
    table.header[0].text !== "Check" ||
    table.header[1].text !== "A useful verification"
  )
    return;
  const rows = table.rows.map(([check, description]) => ({
    link: check.tokens.find((token): token is Tokens.Link => token.type === "link"),
    description,
  }));
  if (rows.some(({ link }) => !link || !/^(\/[^/]|#)/.test(link.href))) return;
  return renderToString(
    <div class="getting-started-checks">
      <table aria-labelledby="verify-the-whole-journey">
        <colgroup>
          <col class="getting-started-check-column" />
          <col />
        </colgroup>
        <thead>
          <tr>
            <th scope="col">Check</th>
            <th scope="col">A useful verification</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(({ link, description }) => {
            if (!link) return null;
            const Icon = icons[link.text as keyof typeof icons] ?? ListChecksIcon;
            return (
              <tr key={link.text}>
                <th scope="row">
                  <a
                    class="getting-started-check-link"
                    href={link.href.startsWith("/") ? withBasePath(link.href) : link.href}
                  >
                    <Icon size={15} strokeWidth={1.8} aria-hidden="true" />
                    <span>{link.text}</span>
                    <ArrowUpRightIcon size={12} strokeWidth={1.8} aria-hidden="true" />
                  </a>
                </th>
                <td>
                  <p dangerouslySetInnerHTML={{ __html: inline(description.tokens) }} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>,
  );
};
