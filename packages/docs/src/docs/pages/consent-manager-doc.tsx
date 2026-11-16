import {
  Button,
  type ConsentCategory,
  ConsentManager,
  type ConsentManagerLabels,
  ConsentManagerTrigger,
  type ConsentStorage,
  useConsent,
} from "@kamod-ch/ui";
import type { ComponentChildren } from "preact";
import { useRef } from "preact/hooks";
import { ApiReference } from "../components/ApiReference";
import { CodeBlock } from "../components/CodeBlock";
import { ComponentDocSection } from "../components/component-detail/ComponentDocSection";
import type { DocPageModule } from "../types";

const categories: ConsentCategory[] = [
  {
    id: "necessary",
    title: "Necessary",
    description: "Keeps sign-in and your saved choice working.",
    required: true,
    details: "Session, security, and the consent record itself.",
  },
  {
    id: "statistics",
    title: "Statistics",
    description: "Anonymous measurement of which pages are used.",
    details: "Aggregated page views. No advertising profile.",
  },
  {
    id: "marketing",
    title: "Marketing",
    description: "Ads from partners, including on other sites.",
  },
];

const germanLabels: ConsentManagerLabels = {
  title: "Deine Privatsphäre, deine Wahl",
  description:
    "Wir nutzen Cookies, um die Seite zu betreiben, Nutzung zu messen und Inhalte sowie Werbung anzupassen. Notwendige Cookies sind immer aktiv. Alles andere entscheidest du.",
  acceptAll: "Alle akzeptieren",
  necessaryOnly: "Nur notwendige",
  settings: "Einstellungen",
  settingsTitle: "Cookie-Einstellungen",
  settingsDescription: "Wähle, welche Kategorien du erlaubst. Du kannst das jederzeit ändern.",
  save: "Auswahl speichern",
  back: "Zurück",
};

const germanCategories: ConsentCategory[] = [
  {
    id: "necessary",
    title: "Notwendig",
    description: "Login, Sicherheit und das Speichern deiner Auswahl.",
    required: true,
  },
  {
    id: "statistics",
    title: "Statistik",
    description: "Anonyme Messung, welche Seiten genutzt werden.",
  },
  {
    id: "marketing",
    title: "Marketing",
    description: "Werbung von Partnern, auch auf anderen Seiten.",
  },
];

const savedDecision = JSON.stringify({
  version: "2026-11",
  decidedAt: "2026-11-16T00:00:00.000Z",
  categories: { necessary: true, statistics: false, marketing: false },
});

function useMemoryStorage(initial: string | null) {
  const storage = useRef<ConsentStorage | null>(null);
  if (!storage.current) {
    let value = initial;
    storage.current = {
      get: () => value,
      set: (_key, next) => {
        value = next;
      },
    };
  }
  return storage.current;
}

function StandardExample() {
  const storage = useMemoryStorage(null);
  return (
    <ConsentManager version="2026-11" categories={categories} storage={storage}>
      <ConsentManagerTrigger>Cookie settings</ConsentManagerTrigger>
    </ConsentManager>
  );
}

function SettledExample({
  labels,
  items = categories,
  children,
}: {
  labels?: ConsentManagerLabels;
  items?: ConsentCategory[];
  children: ComponentChildren;
}) {
  const storage = useMemoryStorage(savedDecision);
  return (
    <ConsentManager
      version="2026-11"
      categories={items}
      labels={labels}
      storage={storage}
      storageKey="docs-consent-settled"
    >
      {children}
    </ConsentManager>
  );
}

function MarketingGate() {
  const { hasConsent } = useConsent();
  const allowed = hasConsent("marketing");
  return (
    <p class="text-sm text-foreground">
      {allowed ? "Marketing script can load." : "Marketing script is blocked."}
    </p>
  );
}

const heroCode = `import { ConsentManager, ConsentManagerTrigger } from "@/components/kamod-ui/consent-manager";

const categories = [
  { id: "necessary", title: "Necessary", description: "Keeps sign-in and your saved choice working.", required: true },
  { id: "statistics", title: "Statistics", description: "Anonymous measurement of which pages are used." },
  { id: "marketing", title: "Marketing", description: "Ads from partners, including on other sites." },
];

export const Example = () => (
  <ConsentManager version="2026-11" categories={categories}>
    <ConsentManagerTrigger>Cookie settings</ConsentManagerTrigger>
  </ConsentManager>
);`;

const germanCode = `import { ConsentManager, ConsentManagerTrigger } from "@/components/kamod-ui/consent-manager";

const labels = {
  title: "Deine Privatsphäre, deine Wahl",
  description: "Wir nutzen Cookies, um die Seite zu betreiben, Nutzung zu messen und Inhalte sowie Werbung anzupassen. Notwendige Cookies sind immer aktiv. Alles andere entscheidest du.",
  acceptAll: "Alle akzeptieren",
  necessaryOnly: "Nur notwendige",
  settings: "Einstellungen",
  settingsTitle: "Cookie-Einstellungen",
  settingsDescription: "Wähle, welche Kategorien du erlaubst. Du kannst das jederzeit ändern.",
  save: "Auswahl speichern",
  back: "Zurück",
};

export const Example = () => (
  <ConsentManager version="2026-11" categories={categories} labels={labels}>
    <ConsentManagerTrigger>Cookie-Einstellungen</ConsentManagerTrigger>
  </ConsentManager>
);`;

const scriptCode = `import { ConsentManager, ConsentManagerTrigger, useConsent } from "@/components/kamod-ui/consent-manager";

function MarketingGate() {
  const { hasConsent } = useConsent();
  if (!hasConsent("marketing")) return <p>Marketing script is blocked.</p>;
  return <p>Marketing script can load.</p>;
}

export const Example = () => (
  <ConsentManager version="2026-11" categories={categories}>
    <MarketingGate />
    <ConsentManagerTrigger>Cookie settings</ConsentManagerTrigger>
  </ConsentManager>
);`;

const footerCode = `import { Button, ConsentManager, ConsentManagerTrigger } from "@/components/kamod-ui/consent-manager";

export const Example = () => (
  <ConsentManager version="2026-11" categories={categories}>
    <footer class="flex items-center justify-between gap-4 border-t border-border bg-muted px-4 py-3">
      <p class="text-sm text-muted-foreground">Example site</p>
      <ConsentManagerTrigger asChild>
        <Button variant="link">Cookie settings</Button>
      </ConsentManagerTrigger>
    </footer>
  </ConsentManager>
);`;

export const consentManagerDocPage: DocPageModule = {
  slug: "consent-manager",
  title: "Consent Manager",
  command: "pnpm add @kamod-ch/ui",
  usageLabel:
    "A two-level cookie dialog. The summary asks for a decision, and settings change each category. It opens on its own until a decision for the current version is stored.",
  sections: [
    {
      id: "installation",
      title: "Installation",
      text: "Import the consent manager from `@/components/kamod-ui/consent-manager`. Labels default to English. Pass `labels` for another language.",
    },
    {
      id: "usage",
      title: "Usage",
      text: "Give each category an id, title and description. Mark the categories that must stay on with `required`. Raise `version` when the policy changes so an older decision is asked for again. Read the result with [useConsent](/docs/consent-manager/installation) inside the provider, and load optional scripts only after `hasConsent` returns true.",
    },
    {
      id: "standard",
      title: "Standard",
      text: "**Ask for a Decision Before Optional Scripts Run.** `ConsentManager` opens on the summary until a decision for this `version` is stored. Accept all and Necessary only are both full-width actions, with Necessary only immediately after Accept all. Settings switches to the category list in the same dialog.\n\nEscape and the overlay do not dismiss it. Compare [Dialog](/docs/dialog/installation) for panels that should close without a decision.",
    },
    {
      id: "german",
      title: "German",
      text: "**Keep the Legal Copy Outside the Component.** Pass `labels` and category text in the voice of the product. The default copy is English. This example uses German du-form, sentence case, and no exclamation marks.\n\nChanging a label does not change what is stored. The stored record is the category ids, the version and the time of the decision.",
    },
    {
      id: "script",
      title: "Gate a Script",
      text: "**Load Optional Code Only After Consent.** Call `useConsent().hasConsent(id)` from a child of `ConsentManager`. Required categories are allowed before a decision. Optional categories stay off until they are saved as enabled.\n\nA missing or unreadable record is treated as no decision. The hook throws when it is called outside the provider.",
    },
    {
      id: "footer",
      title: "Footer Trigger",
      text: "**Let People Change the Decision Later.** `ConsentManagerTrigger` opens the settings level with the saved switches. Put it on a real control, or use `asChild` with [Button](/docs/button/installation) in the footer.\n\n`useConsent().open()` does the same from your own event handler.",
    },
    {
      id: "accessibility",
      title: "Accessibility",
      text: "The dialog keeps focus inside, names every switch, and does not offer a close control.",
    },
    { id: "api-reference", title: "API Reference", text: "Props overview." },
  ],
  renderMain: (context) => {
    const renderSectionBody = (sectionId: string) => {
      if (sectionId === "api-reference") {
        return <ApiReference component="consent-manager" />;
      }
      if (sectionId === "installation") {
        return (
          <CodeBlock
            code={`import { ConsentManager, ConsentManagerTrigger, useConsent } from "@/components/kamod-ui/consent-manager";`}
            language="tsx"
          />
        );
      }
      if (sectionId === "usage") {
        return (
          <CodeBlock
            code={`<ConsentManager version="2026-11" categories={categories} onConsentChange={saveDecision}>
  <ConsentManagerTrigger>Cookie settings</ConsentManagerTrigger>
</ConsentManager>`}
            language="tsx"
          />
        );
      }
      if (sectionId === "accessibility") return null;
      if (sectionId === "standard") {
        return context.renderPreviewAndCodeTabs({
          preview: (
            <SettledExample>
              <ConsentManagerTrigger>Cookie settings</ConsentManagerTrigger>
            </SettledExample>
          ),
          codeSnippet: heroCode,
          previewClass: "overflow-x-auto",
        });
      }
      if (sectionId === "german") {
        return context.renderPreviewAndCodeTabs({
          preview: (
            <SettledExample labels={germanLabels} items={germanCategories}>
              <ConsentManagerTrigger>Cookie-Einstellungen</ConsentManagerTrigger>
            </SettledExample>
          ),
          codeSnippet: germanCode,
          previewClass: "overflow-x-auto",
        });
      }
      if (sectionId === "script") {
        return context.renderPreviewAndCodeTabs({
          preview: (
            <SettledExample>
              <div class="flex w-full max-w-md flex-col items-start gap-3">
                <MarketingGate />
                <ConsentManagerTrigger asChild>
                  <Button variant="outline">Cookie settings</Button>
                </ConsentManagerTrigger>
              </div>
            </SettledExample>
          ),
          codeSnippet: scriptCode,
          previewClass: "overflow-x-auto",
        });
      }
      if (sectionId === "footer") {
        return context.renderPreviewAndCodeTabs({
          preview: (
            <SettledExample>
              <footer class="flex w-full items-center justify-between gap-4 border-t border-border bg-muted px-4 py-3">
                <p class="text-sm text-muted-foreground">Example site</p>
                <ConsentManagerTrigger asChild>
                  <Button variant="link">Cookie settings</Button>
                </ConsentManagerTrigger>
              </footer>
            </SettledExample>
          ),
          codeSnippet: footerCode,
          previewClass: "overflow-x-auto",
        });
      }
      return null;
    };

    return (
      <>
        {context.renderTitleRow()}
        {context.renderPreviewAndCodeTabs({
          preview: <StandardExample />,
          codeSnippet: heroCode,
          previewClass: "overflow-x-auto",
        })}
        {context.sections.map((docSection) => (
          <ComponentDocSection key={docSection.id} section={docSection}>
            {context.renderSectionExtraContent(docSection.id)}
            {renderSectionBody(docSection.id)}
          </ComponentDocSection>
        ))}
      </>
    );
  },
};
