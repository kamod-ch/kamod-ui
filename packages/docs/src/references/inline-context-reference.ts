import { basePrefix, withBasePath } from "../base-path";
import { parseCommand } from "./command-reference";
import type { CodeReferenceHelpRequest, InlineReferenceIndex } from "./types";

const own = (object: object, key: string) => Object.hasOwn(object, key);
const destination = (href: string) => (href.startsWith("/") ? withBasePath(href) : href);

/** Whole-label lookup only: commands and authored destinations never become import expressions. */
export function inlineContextReference(
  index: InlineReferenceIndex,
  label: string,
  href?: string,
): CodeReferenceHelpRequest | undefined {
  const text = label.trim();
  const leadingTool = text.match(/^(?:\$\s+)?([\w-]+)(?=\s)/)?.[1];
  const command = leadingTool && own(index.commands, leadingTool) ? parseCommand(text) : undefined;
  if (command && own(index.commands, command.tool))
    return {
      label,
      module: command.tool,
      referenceId: `command:${command.tool}`,
      href: href ?? index.commands[command.tool],
    };
  let key = text.toLowerCase();
  if (!own(index.aliases, key)) {
    const unversioned = key.replace(/ v?\d+(?:\.\d+)*(?:-[\w.]+)?$/, "");
    if (own(index.aliases, unversioned) && index.aliases[unversioned][0].startsWith("technology:"))
      key = unversioned;
  }
  if (own(index.aliases, key)) {
    const [referenceId, module, target] = index.aliases[key];
    return { label, module, referenceId, href: href ?? destination(target) };
  }
  // A section needs a verified owning page. An isolated #fragment cannot identify that page.
  // File/path labels cannot borrow a page identity from an unrelated authored link.
  // Verified package, technology and block aliases have already resolved above;
  // a real route can still identify itself below.
  const pathLabel =
    /[/\\]|\.[\w-]+(?:[?#].*)?$/.test(text) ||
    /^(?:Dockerfile|Makefile|Procfile|LICEN[CS]E|README)$/i.test(text);
  const target = href?.startsWith("/") && !pathLabel ? href : text;
  const prefix = basePrefix();
  const path = prefix && target.startsWith(`${prefix}/`) ? target.slice(prefix.length) : target;
  const [page, section, extra] = path.split("#");
  if (extra !== undefined) return;
  let canonical = page;
  if (!own(index.routes, canonical)) {
    const redirect = page.match(/^\/docs\/([^/]+)\/([^/]+)$/);
    if (!redirect) return;
    canonical = `/docs/${redirect[1]}/installation`;
    if (!own(index.routes, canonical) || !index.routes[canonical].includes(redirect[2])) return;
  }
  if (section !== undefined && !index.routes[canonical].includes(section)) return;
  return {
    label,
    module: canonical,
    referenceId: `page:${canonical}`,
    href: href ?? destination(path),
  };
}
