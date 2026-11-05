import AxeBuilder from "@axe-core/playwright";
import { expect, type Frame, type Page } from "@playwright/test";
import type { AxeResults, Result } from "axe-core";

export const BLOCKING_A11Y_IMPACTS = ["critical", "serious"] as const;

type BlockingImpact = (typeof BLOCKING_A11Y_IMPACTS)[number];

export type AssertNoBlockingA11yOptions = {
  include?: string | string[];
  exclude?: string | string[];
};

function isBlockingImpact(impact: Result["impact"]): impact is BlockingImpact {
  return impact === "critical" || impact === "serious";
}

function formatTarget(target: Result["nodes"][number]["target"]): string {
  return target.map((part) => (Array.isArray(part) ? part.join(" ") : String(part))).join(" › ");
}

function formatBlockingViolations(context: string, violations: Result[]): string {
  const lines = violations.map((v) => {
    const targets = v.nodes.map((n) => formatTarget(n.target)).join("; ");
    return `- [${v.impact ?? "unknown"}] ${v.id}: ${v.help} (${v.helpUrl}) targets: ${targets}`;
  });
  return `Blocking a11y violations in ${context}:\n${lines.join("\n")}`;
}

export async function assertNoBlockingA11yViolations(
  page: Page,
  context: string,
  options: AssertNoBlockingA11yOptions = {},
): Promise<AxeResults> {
  let builder = new AxeBuilder({ page });

  const includes = options.include
    ? Array.isArray(options.include)
      ? options.include
      : [options.include]
    : [];
  for (const selector of includes) {
    builder = builder.include(selector);
  }

  const excludes = options.exclude
    ? Array.isArray(options.exclude)
      ? options.exclude
      : [options.exclude]
    : [];
  for (const selector of excludes) {
    builder = builder.exclude(selector);
  }

  const results = await builder.analyze();
  const blocking = results.violations.filter((v) => isBlockingImpact(v.impact));
  expect(blocking, formatBlockingViolations(context, blocking)).toEqual([]);
  return results;
}

/** Docs app shell is interactive once `pp-ready` is on `<html>`. */
export async function waitForDocsAppReady(page: Page) {
  await expect(page.locator("html")).toHaveClass(/pp-ready/);
}

/** First installation example renders inside a deferred iframe; `.preview` lives in the frame document. */
export async function waitForFirstInstallationPreview(page: Page) {
  const example = page.locator(".component-example").first();
  await example.scrollIntoViewIfNeeded();
  await expect(example.locator(".showcase-preview-surface")).toHaveAttribute("aria-busy", "false", {
    timeout: 30_000,
  });
  const preview = example.locator("iframe").contentFrame().locator(".preview").first();
  await expect(preview).toBeVisible({ timeout: 15_000 });
}

/** Live demo inside a component example iframe (optional `section#{id}` host). */
export async function componentExamplePreviewFrame(page: Page, sectionId?: string): Promise<Frame> {
  const iframe = sectionId
    ? page.locator(`section#${sectionId} iframe`)
    : page.locator(".component-example iframe").first();
  await iframe.scrollIntoViewIfNeeded();
  const busySurface = sectionId
    ? page.locator(`section#${sectionId} .showcase-preview-surface`)
    : page.locator(".component-example").first().locator(".showcase-preview-surface");
  await expect(busySurface).toHaveAttribute("aria-busy", "false", { timeout: 30_000 });
  const frame = iframe.contentFrame();
  await expect(frame.locator(".preview").first()).toBeVisible({ timeout: 15_000 });
  return frame;
}

/** Live demo for a docs section (`section#{id}`) inside its preview iframe. */
export async function sectionPreviewFrame(page: Page, sectionId: string): Promise<Frame> {
  return componentExamplePreviewFrame(page, sectionId);
}
