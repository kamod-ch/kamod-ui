import { withBasePath } from "../../base-path";
import { CodeBlock } from "../../docs/components/CodeBlock";
import type { ApplicationShellBlock } from "../application-shell-config";
import { ShowcaseCodeLink } from "../ShowcaseCodeLink";
import { type ShellVariantId, shellVariantGuides } from "./application-shell-profiles";
import { BlockDocSection, BlockGuideHeading } from "./BlockDocumentation";

/** About guidance shared by the data-driven application shell variants. */
export function ShellVariantAbout({ block }: { block: ApplicationShellBlock }) {
  const id = block.id as ShellVariantId;
  const profile = shellVariantGuides[id];
  return (
    <BlockDocSection
      id="application-shell-about"
      className="blocks-doc-explanation"
      introduction={<p>{profile.purpose}</p>}
    >
      <BlockGuideHeading id="application-shell-fit" />
      <p>{profile.fit}</p>
      <BlockGuideHeading id="application-shell-structure" />
      <p>{profile.structure}</p>
      <p>
        <strong>The layout choice is deliberately small.</strong> This excerpt from the{" "}
        <ShowcaseCodeLink blockId={id} file={`${id}/${id}.tsx`}>
          variant entrypoint
        </ShowcaseCodeLink>{" "}
        selects a composition in{" "}
        <ShowcaseCodeLink blockId={id} file="shared/shell-frame.tsx">
          <code>ShellFrame</code>
        </ShowcaseCodeLink>
        . It is implementation context, not an additional component you need to mount.
      </p>
      <CodeBlock
        code={`return <ShellFrame {...props} layout="${profile.layout}" />;`}
        language="tsx"
        defaultWrapped
      />
      <p>
        <strong>One Owner for Each Interaction.</strong> The core sidebar owns desktop and mobile
        visibility; the{" "}
        <ShowcaseCodeLink blockId={id} file="application-shell-1/menu.tsx">
          menu adapters
        </ShowcaseCodeLink>{" "}
        own keyboard navigation inside dropdowns; your route owns <code>currentPath</code>,{" "}
        <code>breadcrumbs</code> and data. Keep those boundaries when adapting the copy instead of
        adding another overlay or a duplicate active-item state.
      </p>
      <p>
        Start with <a href="#application-shell-usage">the working example</a>, then use{" "}
        <a href="#application-shell-prop-reference">Component Props</a> to add only the controls
        this workspace needs. <code>children</code> receives the page, and{" "}
        <code>headerActions</code> receives optional tools such as a save button. Keep draft state
        in the page or its parent when it must survive navigation.
      </p>
      <BlockGuideHeading id="application-shell-appearance" />
      <p>{profile.styling}</p>
      <p>
        Use{" "}
        <a href={withBasePath("/blocks/theming#understand-the-sidebar-token-family")}>
          Sidebar Tokens
        </a>{" "}
        for the frame and{" "}
        <a href={withBasePath("/blocks/styles#start-with-supported-variants-and-sizes")}>
          Supported Variants and Sizes
        </a>{" "}
        for its controls. The composition follows the host’s theme; it does not create another
        provider or persist a separate appearance preference. Pair <code>bg-sidebar</code> with{" "}
        <code>text-sidebar-foreground</code>; use <code>bg-background</code> and{" "}
        <code>text-foreground</code> for the page. Verify those pairs with actual form fields and
        empty/error states, not only the preview’s filled panels.
      </p>
      <BlockGuideHeading id="application-shell-review" />
      <p>{profile.review}</p>
      <p>
        <strong>Verify the whole navigation journey.</strong> Test at <code>320px</code>,{" "}
        <code>768px</code>, <code>1024px</code> and <code>1440px</code> with light and dark themes,
        long labels and real page content. Open and close the menu twice, follow a nested
        destination and exercise the account menu using the keyboard. Confirm focus return after
        Escape, visible active states and no document-wide horizontal overflow. The preview’s
        search, selection and action messages are <strong>local demonstrations</strong>, not backend
        operations. Use the <a href="#application-shell-connect">service integration guidance</a>{" "}
        for callbacks, and <a href="#application-shell-state">responsive state notes</a> for the
        controls available in this variant.
      </p>
      <p>
        {profile.next} Compare{" "}
        <a href={withBasePath("/blocks/application-shell")}>All Application Shells</a>, then use{" "}
        <a href={withBasePath("/docs/getting-started#verify-the-whole-journey")}>
          The Complete Journey Check
        </a>{" "}
        before shipping your integration.
      </p>
    </BlockDocSection>
  );
}
