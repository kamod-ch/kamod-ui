import { renderToString } from "preact-render-to-string";
import { describe, expect, it } from "vitest";
import { SIMPLE_CARD_LANG } from "../examples/fixtures";
import { KamodOpenUIRenderer } from "../renderer/KamodOpenUIRenderer";

describe("SSR", () => {
  it("renders OpenUI content to string without throwing", () => {
    const html = renderToString(<KamodOpenUIRenderer content={SIMPLE_CARD_LANG} />);
    expect(html).toContain("Welcome");
    expect(html).toContain("kamod-openui-renderer");
  });
});
