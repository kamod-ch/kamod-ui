import {
  BookOpenIcon,
  ChartNoAxesCombinedIcon,
  ComponentIcon,
  DatabaseIcon,
  LanguagesIcon,
  LayersIcon,
  MousePointerClickIcon,
  PaletteIcon,
  ShapesIcon,
  SparklesIcon,
  TypeIcon,
  WorkflowIcon,
} from "@kamod-ch/icons/lucide";
import { BrandGithubIcon } from "@kamod-ch/icons/tabler/filled";
import {
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@kamod-ch/ui";
import type { Tokens } from "marked";
import { renderToString } from "preact-render-to-string";
import { withBasePath } from "../../base-path";
import type { GuideTableRenderer } from "../../blocks/guides/guide-markdown";
import { InlineCodeLink } from "../components/InlineCodeLink";

const projects = {
  "@kamod-ch/ui": { title: "UI Components", icon: ComponentIcon },
  "@kamod-ch/blocks": { title: "Complete Blocks", icon: LayersIcon },
  "@kamod-ch/themes": { title: "Themes & Tokens", icon: PaletteIcon },
  "@kamod-ch/typeset": { title: "Content Typography", icon: TypeIcon },
  "@kamod-ch/icons": { title: "Icons", icon: ShapesIcon },
  "@kamod-ch/hooks": { title: "Reusable Hooks", icon: MousePointerClickIcon },
  "@kamod-ch/signals": { title: "Persisted Signals", icon: DatabaseIcon },
  "@kamod-ch/state": { title: "State & Transitions", icon: WorkflowIcon },
  "@kamod-ch/i18n": { title: "Language & Formatting", icon: LanguagesIcon },
  "@kamod-ch/motion": { title: "Motion", icon: SparklesIcon },
  "@kamod-ch/ui-motion": { title: "Animated UI Variants", icon: SparklesIcon },
  "@kamod-ch/charts": { title: "Data Visualization", icon: ChartNoAxesCombinedIcon },
  "@kamod-ch/preactpress": { title: "PreactPress", icon: BookOpenIcon },
  "@kamod-ch/openui": { title: "OpenUI Integration", icon: ComponentIcon },
};

const linkIn = (cell: Tokens.TableCell | undefined) =>
  cell?.tokens.find((token): token is Tokens.Link => token.type === "link");
const linkHref = (href: string) => (href.startsWith("/") ? withBasePath(href) : href);

const renderProjectCards: GuideTableRenderer = (table, inline) => {
  const entries = table.rows.map(([project, role, description, guide, source]) => ({
    project: linkIn(project),
    role,
    description,
    guide: linkIn(guide),
    source: linkIn(source),
  }));
  if (entries.some(({ project, guide, source }) => !project || !guide || !source)) return;
  return renderToString(
    <div class="ecosystem-projects">
      {entries.map(({ project, role, description, guide, source }) => {
        if (!project || !guide || !source) return null;
        const identity = projects[project.text as keyof typeof projects];
        if (!identity) return null;
        const Icon = identity.icon;
        const id = `ecosystem-${project.text.replace("@kamod-ch/", "")}`;
        return (
          <Card key={id} size="sm" class="ecosystem-project" role="group" aria-labelledby={id}>
            <CardHeader>
              <div class="ecosystem-project-heading">
                <Icon size={17} strokeWidth={1.75} aria-hidden="true" />
                <h3 id={id}>{identity.title}</h3>
              </div>
              <p
                class="ecosystem-project-role"
                dangerouslySetInnerHTML={{ __html: inline(role.tokens) }}
              />
            </CardHeader>
            <CardContent>
              <InlineCodeLink href={project.href} size="compact">
                {project.text}
              </InlineCodeLink>
              <p
                class="ecosystem-project-description"
                dangerouslySetInnerHTML={{ __html: inline(description.tokens) }}
              />
            </CardContent>
            <CardFooter>
              <Button
                class="docs-icon-button"
                variant="ghost"
                size="sm"
                href={linkHref(guide.href)}
              >
                <BookOpenIcon size={14} aria-hidden="true" />
                {guide.text}
              </Button>
              <Button
                class="docs-icon-button"
                variant="ghost"
                size="sm"
                href={source.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                <BrandGithubIcon size={14} aria-hidden="true" />
                {source.text}
              </Button>
            </CardFooter>
          </Card>
        );
      })}
    </div>,
  );
};

const renderSourceCard: GuideTableRenderer = (table, inline) => {
  const repository = linkIn(table.rows[0]?.[0]);
  if (!repository || table.rows.length !== 1) return;
  return renderToString(
    <Card class="ecosystem-source" size="sm">
      <CardHeader>
        <div class="ecosystem-project-heading">
          <BrandGithubIcon size={22} aria-hidden="true" />
          <h3>{repository.text}</h3>
        </div>
        <p class="ecosystem-project-role">Source, releases and conversations</p>
      </CardHeader>
      <CardContent>
        <p dangerouslySetInnerHTML={{ __html: inline(table.rows[0][1].tokens) }} />
      </CardContent>
      <CardFooter>
        <Button
          class="docs-icon-button"
          variant="ghost"
          size="sm"
          href={repository.href}
          target="_blank"
          rel="noopener noreferrer"
        >
          <BrandGithubIcon size={15} aria-hidden="true" />
          All Repositories
        </Button>
        <a href="https://github.com/kamod-ch/kamod-ui">UI Source</a>
        <a href="https://github.com/kamod-ch/kamod-ui/issues">UI Issues</a>
      </CardFooter>
    </Card>,
  );
};

const renderReferenceTable: GuideTableRenderer = (table, inline) =>
  renderToString(
    <Table
      class="blocks-doc-table ecosystem-reference-table"
      role="region"
      aria-label={table.header.map(({ text }) => text).join(", ")}
      tabIndex={0}
    >
      <TableHeader>
        <TableRow>
          {table.header.map((cell) => (
            <TableHead scope="col" key={cell.text}>
              {cell.text}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {table.rows.map((row, index) => (
          <TableRow key={index}>
            {row.map((cell, index) =>
              index === 0 ? (
                <TableHead
                  scope="row"
                  key={index}
                  dangerouslySetInnerHTML={{ __html: inline(cell.tokens) }}
                />
              ) : (
                <TableCell key={index} dangerouslySetInnerHTML={{ __html: inline(cell.tokens) }} />
              ),
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>,
  );

/** Enhance checked-in guide tables; keep prose and destinations in a single source. */
export const renderEcosystemTable: GuideTableRenderer = (table, inline) => {
  const columns = table.header.map(({ text }) => text).join("|");
  if (columns === "Project|Role|Good fit|Guide|Source") return renderProjectCards(table, inline);
  if (columns === "Repository|Explore") return renderSourceCard(table, inline);
  return renderReferenceTable(table, inline);
};
