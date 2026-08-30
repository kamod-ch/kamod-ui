import AxeBuilder from "@axe-core/playwright";
import { expect, type Page } from "@playwright/test";
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
