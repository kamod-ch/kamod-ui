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
import type { Tokens } from "marked";
import { renderToString } from "preact-render-to-string";
import type { GuideTableRenderer } from "../../blocks/guides/guide-markdown";
import { EcosystemProjectCard } from "./EcosystemProjectCard";
import { renderEcosystemReferenceTable } from "./EcosystemReferenceTable";
import { EcosystemSourceCard } from "./EcosystemSourceCard";

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
        return (
          <EcosystemProjectCard
            key={project.text}
            title={identity.title}
            Icon={identity.icon}
            name={project.text}
            href={project.href}
            role={inline(role.tokens)}
            description={inline(description.tokens)}
            guide={guide}
            source={source}
          />
        );
      })}
    </div>,
  );
};

const renderSourceCard: GuideTableRenderer = (table, inline) => {
  const repository = linkIn(table.rows[0]?.[0]);
  if (!repository || table.rows.length !== 1) return;
  return renderToString(
    <EcosystemSourceCard
      title={repository.text}
      href={repository.href}
      description={inline(table.rows[0][1].tokens)}
    />,
  );
};

/** Enhance checked-in guide tables; keep prose and destinations in a single source. */
export const renderEcosystemTable: GuideTableRenderer = (table, inline) => {
  const columns = table.header.map(({ text }) => text).join("|");
  if (columns === "Project|Role|Good fit|Guide|Source") return renderProjectCards(table, inline);
  if (columns === "Repository|Explore") return renderSourceCard(table, inline);
  if (
    columns === "Your next task|Start with|Add when needed" ||
    columns === "Check|What to try|A useful result"
  ) {
    return renderEcosystemReferenceTable(table, inline);
  }
};
