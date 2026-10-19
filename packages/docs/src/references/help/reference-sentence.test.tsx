/** @vitest-environment jsdom */
import { cleanup, render } from "@testing-library/preact";
import { afterEach, expect, it, vi } from "vitest";
import { ReferenceSentence } from "./reference-sentence";

vi.mock("../../base-path", () => ({
  basePrefix: () => "/site",
  withBasePath: (path: string) => `/site${path}`,
}));
afterEach(cleanup);

it("applies deployment prefixes once to both authored and source-derived prose links", () => {
  const { getByRole } = render(
    <ReferenceSentence text="[Styles](/docs/theming/css-setup) and [Usage](/site/docs/dialog/installation#usage); [Official](https://example.com/reference)." />,
  );
  expect(getByRole("link", { name: "Styles" })).toHaveAttribute(
    "href",
    "/site/docs/theming/css-setup",
  );
  expect(getByRole("link", { name: "Usage" })).toHaveAttribute(
    "href",
    "/site/docs/dialog/installation#usage",
  );
  expect(getByRole("link", { name: "Official" })).toHaveAttribute(
    "href",
    "https://example.com/reference",
  );
});
