import { expect, test, type Page } from "@playwright/test";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
/** Repo-root `tmp/` (this file lives in `apps/demo/e2e/`). */
const REPO_TMP = join(__dirname, "../../../tmp");
const REPORT_PATH = join(REPO_TMP, "docs-components-link-audit.md");

type Severity = "blocker" | "error" | "warning" | "info";

type Finding = {
  severity: Severity;
  url?: string;
  detail: string;
};

const findings: Finding[] = [];

function addFinding(f: Finding) {
  findings.push(f);
}

function slugFromDocsPath(pathname: string): string | null {
  const m = pathname.match(/\/docs\/([^/]+)\//);
  return m?.[1] ?? null;
}

/** Third path segment for `/docs/{slug}/{section}`; null for overview. */
function docsSectionIdFromPath(path: string): string | null {
  const segs = path.split("?")[0].split("/").filter(Boolean);
  if (segs[0] !== "docs") return null;
  if (segs[1] === "components") return null;
  return segs[2] ?? null;
}

async function collectSectionIds(page: Page): Promise<string[]> {
  return page.locator("main section.docs-section[id]").evaluateAll((els) =>
    els.map((el) => el.getAttribute("id") ?? "").filter(Boolean),
  );
}

/** SPA: do not assert final URL — IntersectionObserver may rewrite the route after scroll. */
async function gotoDocsPath(
  page: Page,
  path: string,
  gotoTimeout = 90_000,
): Promise<Awaited<ReturnType<Page["goto"]>>> {
  const res = await page.goto(path, { waitUntil: "domcontentloaded", timeout: gotoTimeout });
  await page.locator("main.docs-content").waitFor({ state: "attached", timeout: 90_000 });
  const sectionId = docsSectionIdFromPath(path);
  if (sectionId) {
    await page
      .locator(`main section.docs-section#${sectionId}`)
      .first()
      .waitFor({ state: "attached", timeout: 90_000 });
  }
  return res;
}

function installGlobalDiagnostics(page: Page) {
  const pageErrors: { url: string; message: string }[] = [];
  const consoleErrors: { url: string; text: string }[] = [];
  const requestFailed: { url: string; failure: string; pageUrl: string }[] = [];

  const onPageError = (err: Error) => {
    pageErrors.push({ url: page.url(), message: err.message });
  };
  const onConsole = (msg: { type: () => string; text: () => string }) => {
    if (msg.type() === "error") consoleErrors.push({ url: page.url(), text: msg.text() });
  };
  const onRequestFailed = (req: {
    url: () => string;
    failure: () => { errorText: string } | null;
  }) => {
    const f = req.failure();
    requestFailed.push({
      url: req.url(),
      failure: f?.errorText ?? "unknown",
      pageUrl: page.url(),
    });
  };

  page.on("pageerror", onPageError);
  page.on("console", onConsole);
  page.on("requestfailed", onRequestFailed);

  return () => ({ pageErrors, consoleErrors, requestFailed });
}

function writeAuditMarkdown(opts: {
  startedAt: string;
  base: string;
  overviewPath: string;
  gridHrefsClean: string[];
  slugsFromGrid: Set<string>;
  sectionUrlsVisited: number;
  tallyStatus: number;
  tallyError: string;
  expectedSidebarEntries: number;
}) {
  mkdirSync(REPO_TMP, { recursive: true });
  const bySev = (s: Severity) => findings.filter((f) => f.severity === s);

  const lines: string[] = [
    "# Docs components link audit",
    "",
    `Generated: ${opts.startedAt} (ISO)`,
    "",
    "## Environment",
    "",
    `- **baseURL**: \`${opts.base}\``,
    `- **Overview**: [\`${opts.overviewPath}\`](${opts.base}${opts.overviewPath})`,
    `- **Grid links**: ${opts.gridHrefsClean.length} anchors`,
    `- **Distinct slugs (from grid)**: ${opts.slugsFromGrid.size}`,
    `- **Section deep-link URLs visited**: ${opts.sectionUrlsVisited}`,
    `- **Tally feedback (GET https://tally.so/r/ODYbWK)**: ${opts.tallyStatus || "n/a"}${opts.tallyError ? ` — error: ${opts.tallyError}` : ""}`,
    "",
    "## Executive summary",
    "",
    `- **Blockers**: ${bySev("blocker").length}`,
    `- **Errors**: ${bySev("error").length}`,
    `- **Warnings**: ${bySev("warning").length}`,
    `- **Info / UX notes**: ${bySev("info").length}`,
    "",
  ];

  const appendSection = (title: string, items: Finding[]) => {
    lines.push(`## ${title}`, "");
    if (items.length === 0) {
      lines.push("_None._", "");
      return;
    }
    for (const f of items) {
      const u = f.url ? ` **URL**: \`${f.url}\`` : "";
      lines.push(`- **${f.severity}**${u}: ${f.detail}`);
    }
    lines.push("");
  };

  appendSection("Blockers", bySev("blocker"));
  appendSection("Errors", bySev("error"));
  appendSection("Warnings / UX", bySev("warning"));
  appendSection("Info", bySev("info"));

  lines.push("## Static / coverage notes", "");
  lines.push(
    `- Sidebar vs grid: expected \`${opts.expectedSidebarEntries}\` sidebar/mobile entries (overview + each grid slug).`,
  );
  lines.push(
    `- Invalid slug \`/docs/__invalid_slug_xyz__/installation\` is handled by client redirect to the first registered doc (no 404 page).`,
  );
  lines.push(
    `- Per doc: all \`section.docs-section[id]\` are counted on the installation view; deep links are exercised for \`usage\`, \`api-reference\` (when present), and one mid-list example. Each doc uses a **fresh tab** (\`context.newPage()\`) so client-router state cannot accumulate across slugs.`,
  );
  lines.push("");
  lines.push("## Recommendations", "");
  lines.push(
    "- Unknown `/docs/{slug}/…` URLs redirect to the first registered doc instead of a 404 — consider an explicit “not found” page for clearer QA and SEO.",
  );
  lines.push(
    "- Re-run this audit after major docs or router changes: `pnpm exec playwright test e2e/docs-components-audit.spec.ts --config=playwright.docs-audit.config.ts` (dev server on `http://localhost:5174`).",
  );
  lines.push("");

  writeFileSync(REPORT_PATH, lines.join("\n"), "utf8");
}

function auditHasBlockers(): boolean {
  return findings.some((f) => f.severity === "blocker");
}

test.describe.configure({ mode: "serial" });

test("docs /docs/components full link audit (writes tmp report)", async ({ page, baseURL }) => {
  test.setTimeout(900_000);
  const startedAt = new Date().toISOString();
  const base = baseURL ?? "";
  const overviewPath = "/docs/components";
  let gridHrefsClean: string[] = [];
  let slugsFromGrid = new Set<string>();
  let sectionUrlsVisited = 0;
  let expectedSidebarEntries = 1;
  let tallyStatus = 0;
  let tallyError = "";

  const getDiagnostics = installGlobalDiagnostics(page);

  // --- External: feedback CTA target ---
  try {
    const tallyRes = await page.request.get("https://tally.so/r/ODYbWK", {
      timeout: 20_000,
      maxRedirects: 5,
    });
    tallyStatus = tallyRes.status();
    if (tallyStatus >= 400) {
      addFinding({
        severity: "error",
        url: "https://tally.so/r/ODYbWK",
        detail: `GET returned HTTP ${tallyStatus}`,
      });
    }
  } catch (e) {
    tallyError = e instanceof Error ? e.message : String(e);
    addFinding({
      severity: "warning",
      url: "https://tally.so/r/ODYbWK",
      detail: `GET failed: ${tallyError}`,
    });
  }

  try {
  let res = await gotoDocsPath(page, overviewPath, 90_000);
  if (!res?.ok()) {
    addFinding({
      severity: "blocker",
      url: base + overviewPath,
      detail: `Overview load failed: HTTP ${res?.status() ?? "no response"}`,
    });
  }
  await expect
    .soft(page.getByRole("heading", { level: 1, name: "Components", exact: true }))
    .toBeVisible();

  const gridHrefs = await page.locator("a.docs-component-item[href]").evaluateAll((as) =>
    as.map((a) => (a as HTMLAnchorElement).getAttribute("href") ?? ""),
  );
  gridHrefsClean = gridHrefs.filter(Boolean);

  if (gridHrefsClean.length === 0) {
    addFinding({
      severity: "blocker",
      url: base + overviewPath,
      detail: "No grid links found (a.docs-component-item[href])",
    });
  }

  slugsFromGrid = new Set<string>();
  for (const href of gridHrefsClean) {
    let path: string;
    try {
      path = new URL(href, base).pathname;
    } catch {
      addFinding({ severity: "error", detail: `Invalid grid href: ${href}` });
      continue;
    }
    const slug = slugFromDocsPath(`${path}/`);
    if (!slug) {
      addFinding({ severity: "error", url: href, detail: "Could not parse slug from grid href" });
      continue;
    }
    slugsFromGrid.add(slug);
    if (!path.endsWith("/installation")) {
      addFinding({
        severity: "warning",
        url: href,
        detail: `Expected path ending with /installation, got ${path}`,
      });
    }
  }

  expectedSidebarEntries = slugsFromGrid.size + 1;

  await gotoDocsPath(page, overviewPath);
  const sidebarButtons = page.locator('aside.docs-sidebar nav[aria-label="Docs components"] button');
  const sidebarCount = await sidebarButtons.count();
  if (sidebarCount !== expectedSidebarEntries) {
    addFinding({
      severity: "warning",
      url: base + overviewPath,
      detail: `Sidebar button count ${sidebarCount} !== grid slugs + overview (${expectedSidebarEntries})`,
    });
  }

  await page.setViewportSize({ width: 600, height: 900 });
  await gotoDocsPath(page, overviewPath);
  await page.getByRole("button", { name: "Open navigation menu" }).click();
  const mobileNav = page.locator(
    '[aria-label="Docs navigation panel"] nav[aria-label="Mobile docs navigation"]',
  );
  await expect.soft(mobileNav).toBeVisible();
  const mobileCount = await mobileNav.locator("button").count();
  if (mobileCount !== expectedSidebarEntries) {
    addFinding({
      severity: "warning",
      detail: `Mobile sheet button count ${mobileCount} !== expected ${expectedSidebarEntries}`,
    });
  }
  await page.keyboard.press("Escape");
  await page.setViewportSize({ width: 1440, height: 900 });

  await gotoDocsPath(page, overviewPath);
  const componentsTop = page.locator(".docs-topbar-links").getByRole("link", { name: "Components" });
  await expect.soft(componentsTop).toHaveAttribute("href", "/docs/components");

  await gotoDocsPath(page, overviewPath);
  await page.locator("a.docs-topbar-brand").click();
  await expect.soft(page.getByTestId("kitchen-sink")).toBeVisible({ timeout: 25_000 });

  res = await gotoDocsPath(page, "/docs/__invalid_slug_xyz__/installation");
  const finalPath = new URL(page.url()).pathname;
  if (finalPath.includes("__invalid_slug_xyz__")) {
    addFinding({
      severity: "warning",
      url: base + "/docs/__invalid_slug_xyz__/installation",
      detail: "Invalid slug was not redirected (still on invalid path)",
    });
  } else {
    addFinding({
      severity: "info",
      detail: `Invalid slug /docs/__invalid_slug_xyz__/installation redirected to ${finalPath} (silent recovery; no 404)`,
    });
  }

  sectionUrlsVisited = 0;
  const slugs = [...slugsFromGrid].sort();

  for (const slug of slugs) {
    const docPage = await page.context().newPage();
    try {
      const installPath = `/docs/${slug}/installation`;
      const logical = base + installPath;
      res = await gotoDocsPath(docPage, installPath, 90_000);
      if (!res?.ok()) {
        addFinding({
          severity: "error",
          url: logical,
          detail: `HTTP ${res?.status() ?? "no response"}`,
        });
        continue;
      }

      const ids = await collectSectionIds(docPage);
      if (ids.length === 0) {
        addFinding({
          severity: "error",
          url: logical,
          detail: "No section.docs-section[id] found in main",
        });
      }

      const uniqueIds = [...new Set(ids)];
      for (const sectionId of uniqueIds) {
        const el = docPage.locator(`main section.docs-section#${sectionId}`);
        const count = await el.count();
        if (count !== 1) {
          addFinding({
            severity: "error",
            url: logical,
            detail: `On installation view: expected one main section#${sectionId}, found ${count}`,
          });
        }
      }

      const deepIds = new Set<string>();
      if (uniqueIds.includes("usage")) deepIds.add("usage");
      if (uniqueIds.includes("api-reference")) deepIds.add("api-reference");
      const nonMeta = uniqueIds.filter(
        (id) => !["installation", "usage", "api-reference", "accessibility"].includes(id),
      );
      const midExample =
        nonMeta[Math.floor(nonMeta.length / 2)] ??
        uniqueIds[Math.floor(uniqueIds.length / 2)] ??
        "";
      if (midExample) deepIds.add(midExample);

      for (const sectionId of deepIds) {
        if (!uniqueIds.includes(sectionId)) continue;
        const spath = `/docs/${slug}/${sectionId}`;
        const surl = base + spath;
        res = await gotoDocsPath(docPage, spath, 90_000);
        sectionUrlsVisited += 1;
        if (!res?.ok()) {
          addFinding({ severity: "error", url: surl, detail: `HTTP ${res?.status()}` });
          continue;
        }
        const el = docPage.locator(`main section.docs-section#${sectionId}`);
        const cnt = await el.count();
        if (cnt !== 1) {
          addFinding({
            severity: "error",
            url: surl,
            detail: `Deep link: expected one main section#${sectionId}, found ${cnt}`,
          });
        }
      }
    } catch (e) {
      addFinding({
        severity: "error",
        url: base + `/docs/${slug}/`,
        detail: `Doc crawl (${slug}): ${e instanceof Error ? e.message : String(e)}`,
      });
    } finally {
      await docPage.close();
    }
  }

  const { pageErrors, consoleErrors, requestFailed } = getDiagnostics();

  const filterNoise = (text: string) => {
    if (text.includes("favicon")) return true;
    if (text.includes("net::ERR_ABORTED")) return true;
    if (text.includes("ResizeObserver loop")) return true;
    return false;
  };

  for (const e of pageErrors) {
    addFinding({ severity: "error", url: e.url, detail: `pageerror: ${e.message}` });
  }
  for (const c of consoleErrors) {
    if (filterNoise(c.text)) continue;
    addFinding({ severity: "warning", url: c.url, detail: `console: ${c.text}` });
  }
  for (const r of requestFailed) {
    if (filterNoise(r.failure) || filterNoise(r.url)) continue;
    addFinding({
      severity: "warning",
      url: r.url,
      detail: `requestfailed (${r.pageUrl}): ${r.failure}`,
    });
  }

  } catch (e) {
    addFinding({
      severity: "blocker",
      url: page.url(),
      detail: `Audit aborted: ${e instanceof Error ? e.message : String(e)}`,
    });
  } finally {
    writeAuditMarkdown({
      startedAt,
      base,
      overviewPath,
      gridHrefsClean,
      slugsFromGrid,
      sectionUrlsVisited,
      tallyStatus,
      tallyError,
      expectedSidebarEntries,
    });
  }

  const errorCount = findings.filter((f) => f.severity === "error").length;
  expect(errorCount, `Docs audit reported errors — see ${REPORT_PATH}`).toBe(0);
  expect(
    auditHasBlockers(),
    `Docs audit reported blockers — see ${REPORT_PATH}`,
  ).toBe(false);
});
