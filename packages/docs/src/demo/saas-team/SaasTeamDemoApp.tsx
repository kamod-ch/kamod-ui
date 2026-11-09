import { LayoutDashboardIcon, SettingsIcon, UsersIcon } from "@kamod-ch/icons/lucide";
import type { ComponentChildren, TargetedMouseEvent } from "preact";
import { useEffect, useState } from "preact/hooks";
import { ApplicationShell1 } from "../../../../blocks/src/application-shell/application-shell-1/application-shell-1";
import { consumeDemoEntryLocation } from "../../analytics/growth-meta";
import { trackGrowthEvent } from "../../analytics/growth-track";
import { withBasePath } from "../../base-path";
import "./saas-team-demo.css";
import { SaasTeamOverview, SaasTeamSettings, SaasTeamTeamView } from "./SaasTeamDemoViews";
import { useSaasTeamDemo } from "./use-saas-team-demo";

export type SaasTeamSection = "overview" | "team" | "settings";

const sectionFromHash = (): SaasTeamSection => {
  if (typeof window === "undefined") return "overview";
  const hash = window.location.hash.replace(/^#/, "");
  if (hash === "team" || hash === "settings") return hash;
  return "overview";
};

type SaasTeamDemoAppProps = {
  /** App path segment for shareable hash links, e.g. `/demo/saas-team` or `/`. */
  baseRoute?: string;
  /** Optional top chrome (docs site theme and GitHub controls). */
  topChrome?: ComponentChildren;
  /** Link label when top chrome is shown. */
  homeHref?: string;
};

export function SaasTeamDemoApp({
  baseRoute = "/demo/saas-team",
  topChrome,
  homeHref = "/",
}: SaasTeamDemoAppProps) {
  const demo = useSaasTeamDemo();
  const [section, setSection] = useState<SaasTeamSection>("overview");
  const [workspaceName, setWorkspaceName] = useState("Kamod SaaS Demo");

  const pathForSection = (target: SaasTeamSection) => {
    const base = withBasePath(baseRoute.replace(/\/$/, "") || "/");
    return `${base}${target === "overview" ? "" : `#${target}`}`;
  };

  useEffect(() => {
    const sync = () => setSection(sectionFromHash());
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  useEffect(() => {
    trackGrowthEvent(
      "demo_open",
      {
        location: consumeDemoEntryLocation(),
        templateId: "saas-team-demo",
        displayMode: sectionFromHash(),
      },
      { oncePerSession: true, dedupeKey: "demo_open:saas-team-demo" },
    );
  }, []);

  const navigationGroups = [
    {
      id: "workspace",
      label: "Workspace",
      items: [
        {
          id: "overview",
          label: "Overview",
          href: pathForSection("overview"),
          icon: LayoutDashboardIcon,
          active: section === "overview",
        },
        {
          id: "team",
          label: "Team",
          href: pathForSection("team"),
          icon: UsersIcon,
          active: section === "team",
        },
        {
          id: "settings",
          label: "Settings",
          href: pathForSection("settings"),
          icon: SettingsIcon,
          active: section === "settings",
        },
      ],
    },
  ] as const;

  const breadcrumbs = [
    { label: "Demo", href: pathForSection("overview") },
    {
      label: section === "overview" ? "Overview" : section === "team" ? "Team" : "Settings",
    },
  ];

  const handleNavigate = (
    dest: { href?: string; label: string },
    event: TargetedMouseEvent<HTMLAnchorElement | HTMLButtonElement>,
  ) => {
    if (!dest.href) return;
    const normalized = withBasePath(baseRoute.replace(/\/$/, "") || "/");
    if (!dest.href.startsWith(normalized) && !dest.href.includes("#")) return;
    event.preventDefault();
    const hash = dest.href.split("#")[1];
    const next: SaasTeamSection = hash === "team" || hash === "settings" ? hash : "overview";
    window.location.hash = next === "overview" ? "" : next;
    setSection(next);
  };

  return (
    <div class="saas-team-demo" data-testid="saas-team-demo">
      {topChrome ? (
        <div class="docs-topbar docs-topbar--demo-only border-b border-border">
          <div class="docs-topbar-inner">
            <a class="docs-topbar-brand font-medium" href={withBasePath(homeHref)}>
              Kamod UI
            </a>
            <div class="docs-topbar-actions">{topChrome}</div>
          </div>
        </div>
      ) : null}
      <ApplicationShell1
        brand={{
          name: workspaceName,
          description: "Demo workspace",
          href: pathForSection("overview"),
        }}
        navigationGroups={navigationGroups}
        user={{ name: "Alex Morgan", email: "alex@kamod-demo.test" }}
        breadcrumbs={breadcrumbs}
        currentPath={pathForSection(section)}
        onNavigate={handleNavigate}
      >
        <div class="saas-team-demo-main">
          <p class="saas-team-demo-banner" role="note">
            <strong>Demo data only.</strong> Search, invites, and edits stay in this browser tab.
            Nothing is sent to a server.
          </p>
          {section === "overview" ? <SaasTeamOverview metrics={demo.metrics} /> : null}
          {section === "team" ? <SaasTeamTeamView {...demo} /> : null}
          {section === "settings" ? (
            <SaasTeamSettings
              workspaceName={workspaceName}
              onWorkspaceNameChange={setWorkspaceName}
              onReset={demo.resetDemo}
            />
          ) : null}
        </div>
      </ApplicationShell1>
    </div>
  );
}
