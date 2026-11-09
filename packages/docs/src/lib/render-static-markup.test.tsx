import { signal } from "@preact/signals";
import { h } from "preact";
import { renderToString } from "preact-render-to-string";
import { describe, expect, it } from "vitest";
import { renderStaticMarkup } from "./render-static-markup";

describe("renderStaticMarkup", () => {
  it("serializes without joining the outer signals render graph", () => {
    const count = signal(0);
    const Nested = () => <span>{count.value}</span>;
    expect(() =>
      renderToString(
        <div
          dangerouslySetInnerHTML={{
            __html: renderStaticMarkup(<Nested />),
          }}
        />,
      ),
    ).not.toThrow();
  });
});
