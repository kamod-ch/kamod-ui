import { renderToString } from "preact-render-to-string";
import { describe, expect, it } from "vitest";
import { SidebarMenuSkeleton } from "./SidebarMenu";

const readSkeletonWidth = (html: string) => {
  const match = html.match(/--skeleton-width:\s*([^;"']+)/);
  expect(match, html).not.toBeNull();
  return match![1]!.trim();
};

describe("SidebarMenuSkeleton SSR", () => {
  it("renders the same skeleton text width on consecutive server renders", () => {
    const first = renderToString(<SidebarMenuSkeleton />);
    const second = renderToString(<SidebarMenuSkeleton />);

    const widthFirst = readSkeletonWidth(first);
    const widthSecond = readSkeletonWidth(second);
    expect(widthFirst).toBe(widthSecond);

    const percent = Number.parseInt(widthFirst, 10);
    expect(percent).toBeGreaterThanOrEqual(50);
    expect(percent).toBeLessThanOrEqual(90);
  });
});
