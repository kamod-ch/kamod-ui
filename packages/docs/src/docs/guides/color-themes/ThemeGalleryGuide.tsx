import { withBasePath } from "../../../base-path";
import { BlockHeadingLink } from "../../../blocks/BlockHeadingLink";
import { CodeBlock } from "../../components/CodeBlock";
import { presetStudies, presetStudyId } from "./preset-studies";

/** Explain the comparison once so each preset can concentrate on its own design decisions. */
export function ThemeGalleryIntroduction() {
  return (
    <div class="theme-gallery-introduction">
      <ol class="theme-gallery-reading-key" aria-label="Explore the color theme presets">
        <li>
          <span aria-hidden="true">01</span>
          <a href={`#${presetStudyId("kamod")}`}>Compare the colors</a>
        </li>
        <li>
          <span aria-hidden="true">02</span>
          <a
            href={withBasePath("/docs/theming/token-overrides#refine-radius-typography-and-motion")}
          >
            Review type &amp; shape
          </a>
        </li>
        <li>
          <span aria-hidden="true">03</span>
          <a href="#themes-on-this-page">Apply a preset</a>
        </li>
      </ol>
      <nav class="theme-gallery-index" aria-label="Jump to a color theme">
        {presetStudies.map(({ id, label }) => (
          <a key={id} href={`#${presetStudyId(id)}`}>
            {label}
            <span aria-hidden="true">↗</span>
          </a>
        ))}
      </nav>
      <p class="theme-gallery-comparison-note">
        Compare <strong>real theme tokens</strong> such as <code>--primary</code> and{" "}
        <code>--card</code>, in both appearances. Layouts and native type stay fixed, so{" "}
        <em>color relationships</em> lead. Expand <strong>Text, focus &amp; feedback</strong> for
        more roles, or review the{" "}
        <a href={withBasePath("/docs/theming/token-overrides#work-with-semantic-token-pairs")}>
          surface and text pairings
        </a>{" "}
        before refining a palette.
      </p>
    </div>
  );
}

export function ThemeGalleryGuide() {
  return (
    <section class="theme-study-page-guide block-guide-prose" aria-labelledby="themes-on-this-page">
      <h3 id="themes-on-this-page" tabIndex={-1}>
        <BlockHeadingLink id="themes-on-this-page">How Themes Work on This Page</BlockHeadingLink>
      </h3>
      <p>
        <strong>Compare locally. Apply deliberately.</strong> The sketches keep their own preset and
        explicit light/dark appearance, even when the rest of the documentation changes. “Use theme”
        applies a preset to this page and saves <code>theme-preset</code>; it keeps your Light, Dark
        or System preference. A manual appearance is stored separately as <code>theme</code>.
      </p>
      <div class="theme-gallery-next-steps">
        <section>
          <h4>1. Choose the application preset</h4>
          <p>
            After the <a href={withBasePath("/docs/theming/css-setup")}>CSS setup</a>, use the
            public runtime to choose a built-in preset. It does not force a light/dark choice. Keep
            initialization and persistence at your application boundary; follow the{" "}
            <a href={withBasePath("/docs/theming/provider-controls")}>appearance guide</a> for a
            complete first-render setup.
          </p>
        </section>
        <CodeBlock
          language="typescript"
          code={
            'import { setThemePreset } from "@kamod-ch/themes";\n\n// For example, inside your existing theme selection handler.\nsetThemePreset("ocean");'
          }
        />
        <section>
          <h4>2. Adapt the role, keep the relationship</h4>
          <p>
            Change a surface together with its intended foreground, then check navigation, focus and
            feedback in both appearances. The{" "}
            <a href={withBasePath("/docs/theming/token-overrides#work-with-semantic-token-pairs")}>
              token pairs
            </a>{" "}
            and{" "}
            <a
              href={withBasePath(
                "/docs/theming/token-overrides#understand-the-sidebar-token-family",
              )}
            >
              sidebar family
            </a>{" "}
            explain the shared contract. A third-party palette may use different names; translate
            its roles before copying values.
          </p>
        </section>
        <section>
          <h4>3. Bring your type and test real content</h4>
          <p>
            The type panels describe declared stacks, not downloaded fonts. This site uses native
            system fonts across presets to keep reading stable. If your product loads a named face,
            review its weights, fallbacks and long labels too. Check the{" "}
            <a href={withBasePath("/docs/theming/accessibility#finish-with-a-theme-review")}>
              theme review
            </a>{" "}
            with your real controls; a skeleton study is not an accessibility certification.
          </p>
        </section>
      </div>
      <div class="theme-gallery-continuation">
        <div>
          <strong>The same palette can reach further.</strong>
          <p>
            Keep source coloring connected with <code>Code</code>’s opt-in{" "}
            <code>syntaxTheme="theme"</code>, or carry the shared foundation into a complete layout.
          </p>
        </div>
        <div>
          <a href={withBasePath("/docs/code/installation#code-theme-tokens")}>
            Explore syntax colors ↗
          </a>
          <a href={withBasePath("/blocks/theming")}>Theme a complete block ↗</a>
        </div>
      </div>
    </section>
  );
}
