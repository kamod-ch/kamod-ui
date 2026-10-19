import { withBasePath } from "../../base-path";
import { propDescriptions } from "../application-shell-api-data";
import type { ApplicationShellBlock } from "../application-shell-config";
import { applicationShellPropFields } from "../application-shell-type-source";
import { ShowcaseCodeLink } from "../ShowcaseCodeLink";
import { type ShellVariantId } from "./application-shell-profiles";
import { BlockDocSection, BlockGuideHeading } from "./BlockDocumentation";
import { BlockPropsTable } from "./BlockPropsTable";

/** Props guidance shared by the data-driven application shell variants. */
export function ShellVariantProps({ block }: { block: ApplicationShellBlock }) {
  const id = block.id as ShellVariantId;
  const number = id.split("-").at(-1);
  return (
    <BlockDocSection
      id="application-shell-props"
      introduction={
        <p>
          <strong>A Small, Typed Application Boundary.</strong> The variant entrypoint exports{" "}
          <code>ApplicationShell{number}</code> and <code>ApplicationShell{number}Props</code>. Data
          types reuse the source-backed Shell 1 contracts; the new frame adds a header action slot
          {number === "6"
            ? " and contextual inspector slots"
            : number === "7"
              ? " and contextual navigation"
              : number === "8"
                ? " and persistent action slots"
                : ""}
          .
        </p>
      }
    >
      <BlockGuideHeading id="application-shell-prop-reference" />
      <BlockPropsTable
        labelledBy="application-shell-prop-reference"
        caption={`ApplicationShell${number} props`}
        rows={[
          ...applicationShellPropFields
            .filter(
              (row) =>
                number !== "4" || !["open", "defaultOpen", "onOpenChange"].includes(row.name),
            )
            .map((row) => ({
              key: row.name,
              name: row.name,
              type: row.type,
              required: row.required,
              description:
                row.name === "defaultOpen"
                  ? `Initial desktop expansion: ${number === "3" ? "false (icon rail)" : "true (expanded)"}. Ignored when open is supplied. Mobile sheet state is independent.`
                  : row.name === "breadcrumbs"
                    ? "Ordered trail; its last entry is noninteractive. Earlier entries hide below 768px. Empty arrays omit the trail."
                    : propDescriptions[row.name],
            })),
          {
            key: "headerActions",
            name: "headerActions",
            type: "ComponentChildren",
            required: false,
            description:
              "Application-owned actions beside the breadcrumb trail. Keep labels compact; the header wraps at narrow widths.",
          },
          ...(number === "7"
            ? [
                {
                  key: "sectionLinks",
                  name: "sectionLinks",
                  type: "readonly ApplicationShellNavigationLink[]",
                  required: false,
                  description:
                    "Flat contextual destinations. Defaults to an empty list, which omits the navigation. Uses currentPath, active, disabled and onNavigate just like sidebar links.",
                },
                {
                  key: "sectionLabel",
                  name: "sectionLabel",
                  type: "string",
                  required: false,
                  description:
                    "Accessible navigation landmark name. Defaults to Section navigation. Choose a name distinct from the global Main navigation.",
                },
              ]
            : []),
          ...(number === "8"
            ? [
                {
                  key: "footerStatus",
                  name: "footerStatus",
                  type: "ComponentChildren",
                  required: false,
                  description:
                    "Application-owned status beside the footer actions. Add role=status to changing feedback when it should be announced; the shell does not create live-region behavior.",
                },
                {
                  key: "footerActions",
                  name: "footerActions",
                  type: "ComponentChildren",
                  required: false,
                  description:
                    "Sticky page actions, wrapping at narrow widths. Associate submit/reset buttons with a form using its unique id. Omitting both footer slots removes the footer.",
                },
              ]
            : []),
          ...(number === "6"
            ? [
                {
                  key: "inspector",
                  name: "inspector",
                  type: "ComponentChildren",
                  required: false,
                  description:
                    "Contextual content in a toggleable aside. Omit to remove the aside and toggle. Content unmounts while closed.",
                },
                {
                  key: "inspectorTitle",
                  name: "inspectorTitle",
                  type: "string",
                  required: false,
                  description:
                    "Visible panel heading and toggle label. Defaults to Details. Supply a short meaningful name.",
                },
              ]
            : []),
        ]}
      />
      <BlockGuideHeading id="application-shell-data-contracts" />
      <p>
        Navigation groups have stable <code>id</code> values, optional labels and ordered items.
        Each item has an <code>id</code> and <code>label</code>, optional <code>href</code>,{" "}
        <code>icon</code>, <code>active</code> and <code>disabled</code>, plus at most one level of{" "}
        <code>items</code>. A disabled parent disables its children; absent URLs create action
        buttons. Supply component references as icons, not already-rendered elements.
      </p>
      <p>
        See the complete{" "}
        <a
          href={withBasePath(
            "/blocks/application-shell/application-shell-1#application-shell-data-types",
          )}
        >
          Navigation, Brand, User and Callback Types
        </a>{" "}
        for individual fields. The authoritative copied definitions live in{" "}
        <code>application-shell-1/types.ts</code>; <code>shared/types.ts</code> extends them.
        Unknown DOM attributes are not forwarded to the frame.
      </p>
      <p>
        <ShowcaseCodeLink blockId={id} file={`${id}/application-shell-${number}.tsx`}>
          Inspect This Variant’s Public Entry
        </ShowcaseCodeLink>{" "}
        or read{" "}
        <ShowcaseCodeLink blockId={id} file="shared/shell-frame.tsx">
          The Shared Frame
        </ShowcaseCodeLink>{" "}
        to see where the layout choices are fixed.
      </p>
    </BlockDocSection>
  );
}
