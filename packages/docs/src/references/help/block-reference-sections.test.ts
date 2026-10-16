import { expect, it } from "vitest";
import { blockReferenceSections } from "../../../.preactpress/block-reference-sections";

it("combines the registered block setup with local-helper props without inventing wrapper props", () => {
  const sections = blockReferenceSections(
    "sidebar",
    {
      id: "sidebar-01",
      title: "sidebar-01",
      description: "Sidebar",
      installCommand: "@kamod-ch/blocks/sidebar/sidebar-01",
      dependencies: ["@kamod-ch/ui", "preact"],
      tags: [],
    },
    [
      {
        file: "packages/blocks/src/sidebar/shared/nav-main.tsx",
        source: `export type NavigationItem = { title: string };
      export type NavMainProps = {
        /** Ordered destinations. */
        items: NavigationItem[];
      };
      export const NavMain = (props: NavMainProps) => <nav />;`,
      },
      {
        file: "packages/blocks/src/sidebar/sidebar-01.tsx",
        source: "export const Sidebar01 = () => <NavMain />;",
      },
    ],
  );
  expect(sections[0]).toMatchObject({
    title: "Dependencies & setup",
    source: { href: "/blocks/sidebar/sidebar-01#sidebar-01-styles" },
    code: { value: 'import { Sidebar01 } from "./components/blocks/sidebar-01";' },
    rows: [{ value: "`pnpm add @kamod-ch/ui preact @kamod-ch/themes @preact/signals`" }],
  });
  expect(sections[1]).toMatchObject({
    contractName: "NavMainProps",
    fields: [
      {
        name: "items",
        type: "NavigationItem[]",
        required: true,
        description: "Ordered destinations.",
      },
    ],
  });
  expect(sections[1].note).toContain("demonstration page has no public props");
  expect(sections[2].definitions).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        name: "NavigationItem",
        code: "export type NavigationItem = { title: string };",
      }),
      expect.objectContaining({
        name: "NavMainProps",
        source: {
          href: "https://github.com/kamod-ch/kamod-ui/blob/main/packages/blocks/src/sidebar/shared/nav-main.tsx",
          label: "NavMainProps source",
        },
      }),
    ]),
  );
});
