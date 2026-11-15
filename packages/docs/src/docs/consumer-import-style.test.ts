import { describe, expect, it } from "vitest";
import { initialConsumerImportStyle, presentConsumerImports } from "./consumer-import-style";

const slugs = ["alert-dialog", "button", "dialog"];

describe("presentConsumerImports", () => {
  it("turns the docs alias into the barrel and subpath package imports", () => {
    const source = `import { ArrowUp } from "lucide-preact";
import { Button } from "@/components/kamod-ui/button";

export const Example = () => <Button />;`;
    expect(initialConsumerImportStyle(source)).toBe("barrel");
    expect(presentConsumerImports(source, "barrel", slugs))
      .toBe(`import { ArrowUp } from "lucide-preact";
import { Button } from "@kamod-ch/ui";

export const Example = () => <Button />;`);
    expect(presentConsumerImports(source, "subpath", slugs))
      .toBe(`import { ArrowUp } from "lucide-preact";
import { Button } from "@kamod-ch/ui/button";

export const Example = () => <Button />;`);
  });

  it("splits a barrel import and leaves symbols without a component slug on the package root", () => {
    const source = 'import { Button, Dialog, Custom } from "@kamod-ch/ui"';
    expect(presentConsumerImports(source, "subpath", slugs)).toBe(
      `import { Button } from "@kamod-ch/ui/button"
import { Dialog } from "@kamod-ch/ui/dialog"
import { Custom } from "@kamod-ch/ui"`,
    );
  });

  it("keeps an existing subpath and install commands unchanged", () => {
    const utils = 'import { cn } from "@kamod-ch/ui/utils";';
    expect(initialConsumerImportStyle(utils)).toBe("subpath");
    expect(presentConsumerImports(utils, "subpath", slugs)).toBe(utils);
    expect(presentConsumerImports(utils, "barrel", slugs)).toBe(
      'import { cn } from "@kamod-ch/ui";',
    );
    expect(presentConsumerImports("pnpm add @kamod-ch/ui", "barrel", slugs)).toBe(
      "pnpm add @kamod-ch/ui",
    );
  });

  it("ignores a commented import", () => {
    const source = `import { Code } from "@kamod-ch/ui/code";
// import { Code } from "@kamod-ch/ui";`;
    expect(initialConsumerImportStyle(source)).toBe("subpath");
    expect(presentConsumerImports(source, "subpath", slugs)).toBe(source);
  });
});
