/** @vitest-environment jsdom */
import { cleanup, fireEvent, render, within } from "@testing-library/preact";
import { renderToString } from "preact-render-to-string";
import { afterEach, expect, it } from "vitest";
import { ThemingOutro } from "./ThemingOutro";

afterEach(cleanup);

it("labels server-rendered reviews uniquely and keeps progress within each mounted instance", () => {
  const document = new DOMParser().parseFromString(
    renderToString(
      <>
        <ThemingOutro />
        <ThemingOutro />
      </>,
    ),
    "text/html",
  );
  const sections = [...document.querySelectorAll("section[aria-labelledby]")];
  const ids = sections.map((section) => section.getAttribute("aria-labelledby"));
  expect(sections).toHaveLength(2);
  expect(new Set(ids).size).toBe(2);
  for (const id of ids) expect(document.getElementById(id!)?.textContent).toBe("Before you ship");
  expect(document.querySelectorAll("input:checked")).toHaveLength(0);

  const view = render(
    <>
      <ThemingOutro />
      <ThemingOutro />
    </>,
  );
  const [first, second] = view
    .getAllByRole("region", { name: "Before you ship" })
    .map((section) => within(section));
  fireEvent.click(second.getByRole("checkbox", { name: /^Read it in both modes/ }));
  expect(second.getByRole("status")).toHaveTextContent("1 of 3 checks reviewed.");
  expect(first.getByRole("status")).toHaveTextContent("0 of 3 checks reviewed.");
  for (const check of second.getAllByRole("checkbox").slice(1)) fireEvent.click(check);
  expect(second.getByRole("status")).toHaveTextContent("Review complete.");
  fireEvent.click(second.getByRole("checkbox", { name: /^Read it in both modes/ }));
  expect(second.getByRole("status")).toHaveTextContent("2 of 3 checks reviewed.");
  view.unmount();

  const fresh = render(<ThemingOutro />);
  expect(fresh.getByRole("status")).toHaveTextContent("0 of 3 checks reviewed.");
  expect(
    fresh.getAllByRole("checkbox").every((check) => !(check as HTMLInputElement).checked),
  ).toBe(true);
  fireEvent.click(fresh.getByRole("checkbox", { name: /^Build the real thing/ }));
  expect(fresh.getByRole("status")).toHaveTextContent("1 of 3 checks reviewed.");
});
