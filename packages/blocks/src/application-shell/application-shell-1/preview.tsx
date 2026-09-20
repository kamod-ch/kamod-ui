/**
 * @file Interactive documentation demo for Application Shell 1.
 * Fixture selection and status messages stay here so the reusable shell has no demo state.
 *
 * @see https://www.shadcnblocks.com/block/application-shell1 — reference layout for the demo.
 */
import { useState } from "preact/hooks";
import { ApplicationShell1 } from "./application-shell-1";
import {
  applicationShell1Brand,
  applicationShell1Breadcrumbs,
  applicationShell1Navigation,
  applicationShell1User,
} from "./demo-data";

/**
 * Demonstrates navigation, active links and account actions using local state.
 * Ordinary clicks update the preview instead of following fixture hashes; modified clicks
 * retain native browser behavior. A status region announces selections without a backend.
 *
 * @returns A complete shell preview, suitable for embedding or its standalone docs route.
 */
export const ApplicationShell1Preview = () => {
  const [currentPath, setCurrentPath] = useState("#history");
  const [notice, setNotice] = useState("");
  return (
    <ApplicationShell1
      brand={applicationShell1Brand}
      navigationGroups={applicationShell1Navigation}
      user={applicationShell1User}
      breadcrumbs={applicationShell1Breadcrumbs}
      currentPath={currentPath}
      onNavigate={(destination, event) => {
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0)
          return;
        event.preventDefault();
        if (destination.href) setCurrentPath(destination.href);
        setNotice(`Selected ${destination.label}`);
      }}
      onUserAction={(action) => setNotice(`Selected ${action === "logout" ? "Log out" : action}`)}
    >
      <div class="grid auto-rows-min gap-4 md:grid-cols-3" aria-hidden="true">
        <div class="aspect-video rounded-xl bg-muted/50" />
        <div class="aspect-video rounded-xl bg-muted/50" />
        <div class="aspect-video rounded-xl bg-muted/50" />
      </div>
      <div class="min-h-80 flex-1 rounded-xl bg-muted/50 p-4">
        <p role="status" class="text-sm text-muted-foreground">
          {notice}
        </p>
      </div>
    </ApplicationShell1>
  );
};
