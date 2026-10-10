import {
  ArrowRightIcon,
  ArrowUpRightIcon,
  BookOpenIcon,
  BracesIcon,
  CheckIcon,
  CodeIcon,
  ComponentIcon,
  ContrastIcon,
  PaletteIcon,
  RocketIcon,
  WandSparklesIcon,
} from "@kamod-ch/icons/lucide";
import { BrandGithubIcon } from "@kamod-ch/icons/tabler/filled";
import { Button, ThemeToggle } from "@kamod-ch/ui";
import type { ComponentChildren } from "preact";
import { withBasePath } from "../base-path";
import { BrandLink, BrandText } from "../docs/components/brand/BrandText";
import { ShowcaseCodePane } from "../docs/components/ShowcaseCodePane";
import { FormOverviewPreview } from "../docs/overview/OverviewPreviews";
import { DemoShell, demoTopNavItems } from "../layout/DemoShell";
import { DocsTopbarActions } from "../layout/DocsTopbarActions";
import { ThemePresetPicker } from "../theme/ThemePresetPicker";
import { HomeComponentDirectory } from "./HomeComponentDirectory";
import { HomeBlockExamples, WorkspaceExample } from "./HomeExamples";
import { HomeFooter } from "./HomeFooter";
import { ecosystemEntries, guideEntries, libraryEntries } from "./home-content";

const buttonExample = `import { Button } from "@kamod-ch/ui";

export function SaveAction({ onSave }: {
  onSave: () => void;
}) {
  return (
    <Button type="button" onClick={onSave}>
      Save Changes
    </Button>
  );
}`;

function Text({ children }: { children: ComponentChildren }) {
  return (
    <div class="home-prose block-guide-prose">
      <BrandText>{children}</BrandText>
    </div>
  );
}
function Link({ href, children }: { href: string; children: ComponentChildren }) {
  return (
    <a class="home-text-link" href={withBasePath(href)}>
      {children}
      <ArrowRightIcon size={16} aria-hidden="true" />
    </a>
  );
}
function SectionHeading({
  step,
  label,
  title,
  id,
}: {
  step: string;
  label: string;
  title: ComponentChildren;
  id: string;
}) {
  return (
    <div class="home-section-heading">
      <p class="home-section-kicker">
        <span>{step}</span>
        <span aria-hidden="true">/</span>
        {label}
      </p>
      <h2 id={id}>{title}</h2>
    </div>
  );
}

export function HomePage() {
  return (
    <DemoShell
      brand="Kamod UI"
      topNavItems={demoTopNavItems}
      topbarActions={<DocsTopbarActions />}
      rootClassName="docs-shell home-shell"
      footer={<HomeFooter />}
      mainContent={
        <div class="home-page" data-testid="home-page">
          <header class="home-hero" aria-labelledby="home-title">
            <div class="home-hero-copy">
              <p class="home-hero-badge">
                <BookOpenIcon size={36} strokeWidth={2.5} aria-hidden="true" />
                <span class="home-hero-badge-label">
                  <span>Kamod UI</span>
                  <span class="home-hero-badge-dot" aria-hidden="true">
                    ·
                  </span>
                  <span>The Documentation</span>
                </span>
              </p>
              <h1 id="home-title" tabIndex={-1}>
                Good Interfaces.
                <br />
                Clear Foundations.
                <br />
                <span>Your Next Project.</span>
              </h1>
              <Text>
                <p>
                  Build with{" "}
                  <strong>Preact Components, Complete Blocks and a Shared Design Language</strong>.
                  Explore working examples, understand the code, and shape an interface that feels
                  like your product.
                </p>
                <p class="home-hero-secondary">
                  A practical home for <code>TypeScript</code>, <code>Tailwind CSS</code> and the
                  Kamod stack. Start small. Learn each piece. Build with confidence.
                </p>
              </Text>
              <div class="home-hero-actions">
                <Button
                  class="home-primary-cta"
                  size="lg"
                  href={withBasePath("/docs/getting-started")}
                >
                  <RocketIcon size={19} aria-hidden="true" />
                  <span class="home-cta-label">Get Started</span>
                  <span class="home-cta-arrow" aria-hidden="true">
                    <ArrowRightIcon size={18} />
                  </span>
                </Button>
                <Link href="/docs/components">
                  <ComponentIcon size={17} aria-hidden="true" />
                  Explore Components
                </Link>
              </div>
              <p class="home-hero-note">
                <CheckIcon size={14} aria-hidden="true" /> Open Source{" "}
                <span aria-hidden="true">·</span> Preact Native <span aria-hidden="true">·</span>{" "}
                Yours to Adapt
              </p>
            </div>
            <div class="home-hero-example">
              <WorkspaceExample />
              <p class="home-example-note">
                Try the controls, explore the code, or reset and start again. Theme changes stay in
                this preview.
              </p>
            </div>
          </header>
          <hr class="page-intro-divider" />

          <nav class="home-library-map" aria-label="Explore the Kamod UI documentation">
            {libraryEntries.map((item, index) => (
              <a key={item.title} href={withBasePath(item.href)}>
                <span class="home-entry-label">
                  0{index + 1} <span aria-hidden="true">·</span> {item.label}
                </span>
                <span class="home-entry-title">
                  {item.title}
                  <ArrowUpRightIcon size={18} aria-hidden="true" />
                </span>
                <span class="home-entry-description">{item.text}</span>
              </a>
            ))}
          </nav>

          <section class="home-section" aria-labelledby="home-components">
            <div class="home-split">
              <div>
                <SectionHeading
                  step="01"
                  label="Components"
                  title="Start Small. Make It Work."
                  id="home-components"
                />
                <Text>
                  <p>
                    A good interface begins with a clear action. Use <code>Button</code> for the
                    next step, <code>Input</code> for a value, and <code>Dialog</code> when a
                    decision needs focus. Kamod gives these pieces a consistent foundation while{" "}
                    <strong>Your Application Owns the Behavior</strong>.
                  </p>
                  <p>
                    Each component guide brings together{" "}
                    <strong>Live Variants, Copyable Source and an API Reference</strong>. Try the
                    interaction first, then inspect the props and adapt the example to your data.
                  </p>
                  <p>
                    The example beside this text keeps the save operation in the parent. When that
                    operation becomes asynchronous, add pending and error feedback at the same
                    boundary; the{" "}
                    <a href={withBasePath("/docs/getting-started#give-state-one-owner")}>
                      State Ownership Guide
                    </a>{" "}
                    explains the pattern.
                  </p>
                </Text>
                <Link href="/docs/button/installation">Explore the Button Guide</Link>
              </div>
              <div class="home-code-example">
                <div class="home-example-heading showcase-heading">
                  <strong>
                    <CodeIcon size={16} strokeWidth={1.75} aria-hidden="true" />
                    <span>A Small, Reusable Action</span>
                  </strong>
                  <span class="showcase-heading-hint">
                    <span aria-hidden="true">·</span>
                    <span>Your Save Logic</span>
                  </span>
                  <span class="showcase-heading-hint home-code-heading-detail">
                    <BrandLink>Preact</BrandLink>
                    <span aria-hidden="true">·</span>
                    <BrandLink>TypeScript</BrandLink>
                  </span>
                </div>
                <div class="home-action-source">
                  <ShowcaseCodePane
                    code={buttonExample}
                    filename="SaveAction.tsx"
                    filePath="src/components/SaveAction.tsx"
                  />
                </div>
                <p class="home-small-note">
                  After{" "}
                  <a href={withBasePath("/docs/getting-started#set-up-your-app")}>
                    Setting Up Your App
                  </a>
                  , import a component and give it one useful job. Use <code>type="submit"</code>{" "}
                  when the action submits a form.
                </p>
              </div>
            </div>
            <HomeComponentDirectory />
          </section>

          <section class="home-section" aria-labelledby="home-theming">
            <div class="home-split home-theme-layout">
              <div>
                <SectionHeading
                  step="02"
                  label="A Shared Foundation"
                  title="One Theme. Every Piece Belongs."
                  id="home-theming"
                />
                <Text>
                  <p>
                    Give the first component a home before adding the next. Load{" "}
                    <strong>Shared Styles and Semantic Tokens</strong> once, then let buttons, form
                    fields and whole layouts speak the same visual language.
                  </p>
                  <p>
                    Use roles such as <code>bg-background</code>, <code>text-foreground</code> and{" "}
                    <code>border-border</code> instead of repeating fixed colors. Pair a primary
                    action’s background with <code>text-primary-foreground</code>, and let the theme
                    supply the values.
                  </p>
                  <p>
                    <strong>Try a Different Palette Here.</strong> This page and its examples follow
                    the selected preset and color scheme. The{" "}
                    <a href={withBasePath("/docs/theming/provider-controls")}>
                      Appearance Controls Guide
                    </a>{" "}
                    covers saved choices and system preferences.
                  </p>
                </Text>
                <div class="home-inline-actions">
                  <Link href="/docs/theming/installation">Understand the Theme</Link>
                  <ThemePresetPicker showLabel />
                </div>
              </div>
              <div class="home-theme-sample">
                <div class="home-example-heading home-theme-heading">
                  <div class="home-theme-heading-copy">
                    <span class="home-theme-heading-context">
                      Semantic Tokens{" "}
                      <span class="home-theme-dot" aria-hidden="true">
                        ·
                      </span>
                    </span>
                    <strong class="home-theme-heading-label">
                      <PaletteIcon size={16} strokeWidth={1.9} aria-hidden="true" />
                      <span>Color by Responsibility</span>
                    </strong>
                  </div>
                  <div class="home-theme-controls">
                    <ThemeToggle class="docs-icon-button site-icon-button" />
                    <ThemePresetPicker showLabel />
                  </div>
                </div>
                <div class="home-token-grid">
                  {["background", "card", "muted", "primary"].map((token) => (
                    <div key={token}>
                      <span class={`home-token-swatch home-token-${token}`} aria-hidden="true">
                        Aa
                      </span>
                      <code>--{token}</code>
                    </div>
                  ))}
                </div>
                <div class="home-theme-sample-copy">
                  <h3>A Theme Is More than an Accent</h3>
                  <p>
                    Keep surfaces, text, borders and focus feedback in balance. Review the same
                    screen in both modes, including its empty, disabled and error states.
                  </p>
                  <div class="home-theme-resources">
                    <nav class="home-theme-resource-links" aria-label="Theme resources">
                      <a
                        class="home-theme-text-link"
                        href={withBasePath("/docs/theming/token-overrides")}
                      >
                        <WandSparklesIcon size={14} aria-hidden="true" />
                        Customize Theme Tokens
                        <ArrowUpRightIcon size={14} aria-hidden="true" />
                      </a>
                      <span class="home-theme-resource-item">
                        <span class="home-theme-dot" aria-hidden="true">
                          ·
                        </span>
                        <a
                          class="home-theme-text-link"
                          href={withBasePath("/docs/theming/css-setup")}
                        >
                          <BracesIcon size={14} aria-hidden="true" />
                          CSS Setup
                          <ArrowUpRightIcon size={14} aria-hidden="true" />
                        </a>
                      </span>
                      <span class="home-theme-resource-item">
                        <span class="home-theme-dot" aria-hidden="true">
                          ·
                        </span>
                        <a
                          class="home-theme-text-link"
                          href={withBasePath("/docs/theming/accessibility")}
                        >
                          <ContrastIcon size={14} aria-hidden="true" />
                          Check Contrast
                          <ArrowUpRightIcon size={14} aria-hidden="true" />
                        </a>
                      </span>
                    </nav>
                    <a
                      class="docs-icon-button home-theme-source"
                      href="https://github.com/kamod-ch/kamod-ui/tree/main/packages/themes/src"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Theme source on GitHub"
                    >
                      <BrandGithubIcon size={17} aria-hidden="true" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section class="home-section" aria-labelledby="home-blocks">
            <div class="home-section-intro">
              <div>
                <SectionHeading
                  step="03"
                  label="Complete Blocks"
                  title="Give Your Feature a Place to Live."
                  id="home-blocks"
                />
                <Text>
                  <p>
                    Move from individual controls to a complete screen. Start with an{" "}
                    <a href={withBasePath("/blocks/application-shell")}>Application Shell</a>,
                    explore <a href={withBasePath("/blocks/sidebar")}>Sidebar Layouts</a>, or build
                    an entry point with <a href={withBasePath("/blocks/login")}>Login</a> and{" "}
                    <a href={withBasePath("/blocks/signup")}>Signup Blocks</a>. The detail pages
                    connect each live preview to its{" "}
                    <strong>Source Files, Setup Instructions and Integration Guidance</strong>.
                  </p>
                </Text>
              </div>
              <Link href="/blocks">Browse Block Collections</Link>
            </div>
            <HomeBlockExamples />
            <div class="home-three-notes">
              <div>
                <span>01 / Explore</span>
                <h3>Try the Whole Interaction</h3>
                <p>
                  Open navigation, resize the screen and follow the keyboard path. Choose a layout
                  for its behavior as well as its appearance.
                </p>
              </div>
              <div>
                <span>02 / Understand</span>
                <h3>Read the Supporting Files</h3>
                <p>
                  A block can include data, helpers and shared components. Use the file tree to
                  understand the composition before copying it.
                </p>
              </div>
              <div>
                <span>03 / Adapt</span>
                <h3>Connect Your Application</h3>
                <p>
                  Replace example routes and content, wire your service boundaries, then follow the{" "}
                  <a href={withBasePath("/blocks/getting-started")}>Block Setup Guide</a> to verify
                  the result.
                </p>
              </div>
            </div>
          </section>

          <section class="home-section" aria-labelledby="home-forms">
            <div class="home-split">
              <div>
                <SectionHeading
                  step="04"
                  label="Forms & Feedback"
                  title="Make Every Step Understandable."
                  id="home-forms"
                />
                <Text>
                  <p>
                    Forms connect the interface to a real task. Start with{" "}
                    <strong>A Label, a Value and a Clear Next Action</strong>. Native{" "}
                    <code>required</code> and <code>type="email"</code> constraints are a useful
                    first layer; useful errors and predictable submission complete the journey.
                  </p>
                  <p>
                    As rules grow, add a reusable schema. The{" "}
                    <a href={withBasePath("/docs/formisch/installation")}>Formisch Guide</a>{" "}
                    connects <code>valibot</code> schemas to field values, validation and submission
                    while Kamod supplies the controls.
                  </p>
                  <p>
                    Keep <strong>Field Validation</strong> distinct from{" "}
                    <strong>Service Feedback</strong>. Preserve entered values when a save fails and
                    give people a way to try again. Learn more about{" "}
                    <a href={withBasePath("/docs/forms#form-submission")}>
                      Submission and Recovery
                    </a>
                    .
                  </p>
                </Text>
                <Link href="/docs/forms">Build a Better Form</Link>
              </div>
              <div class="home-form-example">
                <div class="home-example-heading">
                  <span class="home-live-label">
                    <i aria-hidden="true" /> Native Form Example
                  </span>
                  <code>Input + Label</code>
                </div>
                <div class="home-form-body">
                  <h3>Start with One Field</h3>
                  <p>
                    Try an invalid address, correct it, then submit. The browser checks the field
                    before the local success message appears.
                  </p>
                  <FormOverviewPreview />
                </div>
                <p class="home-form-footer">
                  Ready for shared rules?{" "}
                  <a href={withBasePath("/docs/formisch/installation#schema-and-setup")}>
                    Connect a Schema <ArrowUpRightIcon size={13} aria-hidden="true" />
                  </a>
                </p>
              </div>
            </div>
          </section>

          <section class="home-section" aria-labelledby="home-guides">
            <div class="home-section-intro">
              <div>
                <SectionHeading
                  step="05"
                  label="Practical References"
                  title="The Details That Make It Fit Together."
                  id="home-guides"
                />
                <Text>
                  <p>
                    The special guides explain decisions shared by every component and block. Read
                    them when you reach that step, then return to your feature with a clearer model
                    of <strong>Setup, Composition and Appearance</strong>.
                  </p>
                </Text>
              </div>
              <Link href="/docs/getting-started">Follow the Complete Guide</Link>
            </div>
            <div class="home-guide-grid">
              {guideEntries.map((entry) => (
                <article key={entry.href}>
                  <span class="home-guide-tag">{entry.tag}</span>
                  <h3>
                    <a href={withBasePath(entry.href)}>
                      {entry.title}
                      <ArrowUpRightIcon size={16} aria-hidden="true" />
                    </a>
                  </h3>
                  <p>{entry.text}</p>
                </article>
              ))}
            </div>
            <aside class="home-reading-note" aria-labelledby="home-reading-note-title">
              <BookOpenIcon size={17} strokeWidth={1.75} aria-hidden="true" />
              <div>
                <h3 id="home-reading-note-title">Read the Example. Check the API.</h3>
                <p>
                  Examples show the <strong>composition</strong>; the API explains supported{" "}
                  <strong>props and events</strong>. Read them side by side when connecting your own
                  data, and check package versions if something differs.
                </p>
                <nav aria-label="Example and API reading links">
                  <a href={withBasePath("/docs/button/installation#component-preview")}>
                    Button Example <ArrowUpRightIcon size={12} aria-hidden="true" />
                  </a>
                  <a href={withBasePath("/docs/button/installation#api-reference")}>
                    Button API <ArrowUpRightIcon size={12} aria-hidden="true" />
                  </a>
                  <a href={withBasePath("/docs/packages#package-installation")}>
                    Versions &amp; Peers <ArrowUpRightIcon size={12} aria-hidden="true" />
                  </a>
                </nav>
              </div>
            </aside>
          </section>

          <section class="home-section" aria-labelledby="home-ecosystem">
            <div class="home-section-intro">
              <div>
                <SectionHeading
                  step="06"
                  label="The Kamod Ecosystem"
                  title="A Focused Tool for the Next Responsibility."
                  id="home-ecosystem"
                />
                <Text>
                  <p>
                    Keep the UI at the center and add the capabilities your feature needs. These
                    companion projects cover{" "}
                    <strong>Behavior, State, Language and Visual Communication</strong>. Each has
                    its own source and documentation; you do not need to install the entire stack.
                  </p>
                </Text>
              </div>
              <Link href="/docs/packages">Explore the Package Guides</Link>
            </div>
            <div class="home-ecosystem-grid">
              {ecosystemEntries.map((entry) => (
                <article key={entry.repo}>
                  <div class="home-repo-heading">
                    <BrandGithubIcon size={18} aria-hidden="true" />
                    <h3>
                      <a href={`https://github.com/kamod-ch/${entry.repo}`}>
                        {entry.name}
                        <ArrowUpRightIcon size={14} aria-hidden="true" />
                      </a>
                    </h3>
                  </div>
                  <BrandText>
                    <code>{`@kamod-ch/${entry.package}`}</code>
                  </BrandText>
                  <p>{entry.text}</p>
                  {entry.guide ? (
                    <Link href={`/docs/${entry.guide}/installation`}>Read the Guide</Link>
                  ) : (
                    <a class="home-text-link" href={`https://github.com/kamod-ch/${entry.repo}`}>
                      Explore the Repository <ArrowUpRightIcon size={14} aria-hidden="true" />
                    </a>
                  )}
                </article>
              ))}
            </div>
            <Text>
              <p class="home-ecosystem-note">
                For the interface itself, <code>@kamod-ch/ui</code> and{" "}
                <code>@kamod-ch/themes</code> provide the core components and theme foundation.
                Before sharing state or persisting a value, read about{" "}
                <a href={withBasePath("/docs/packages#package-boundaries")}>
                  Package Responsibilities
                </a>{" "}
                and{" "}
                <a href={withBasePath("/docs/packages#package-ssr")}>The Server and First Render</a>
                . Find more projects in{" "}
                <a href="https://github.com/orgs/kamod-ch/repositories">All Kamod Repositories</a>.
              </p>
              <p class="home-ecosystem-followup">
                <strong>Start with one responsibility and one clear owner.</strong> Keep temporary
                input close to its component, persist only the preferences that should survive a
                visit, and introduce shared state when multiple parts of your feature need it. The{" "}
                <a href={withBasePath("/docs/getting-started#packages")}>
                  Getting Started package examples
                </a>{" "}
                show these choices in small, working compositions. Before adding a dependency, check
                its{" "}
                <a href={withBasePath("/docs/packages#package-installation")}>
                  Versions and Peer Dependencies
                </a>
                , then verify the behavior in your own application—including keyboard use, light and
                dark themes, and the first server-rendered page.
              </p>
            </Text>
          </section>

          <section class="home-section home-next" aria-labelledby="home-next">
            <div>
              <SectionHeading
                step="07"
                label="Your Next Step"
                title={
                  <>
                    One Useful Screen.
                    <br />A Foundation You Understand.
                  </>
                }
                id="home-next"
              />
              <Text>
                <p>
                  You have the map:{" "}
                  <strong>
                    Components for the Interaction, Blocks for the Layout, Forms for the Task and
                    Packages for the Supporting Behavior
                  </strong>
                  . Bring them together one decision at a time.
                </p>
                <p>
                  The Getting Started guide takes you from installing the foundation to your first
                  working screen, then through integration and delivery. Keep it nearby while you
                  build.
                </p>
              </Text>
              <Button
                class="home-primary-cta"
                size="lg"
                href={withBasePath("/docs/getting-started")}
              >
                <RocketIcon size={20} strokeWidth={2.5} aria-hidden="true" />
                <span class="home-cta-label">Open the Getting Started Guide</span>
                <span class="home-cta-arrow" aria-hidden="true">
                  <ArrowRightIcon size={18} />
                </span>
              </Button>
            </div>
            <ol class="home-next-steps">
              <li>
                <span>01</span>
                <div>
                  <h3>Make One Thing Work</h3>
                  <p>Load the styles, render a control and connect a local interaction.</p>
                  <a href={withBasePath("/docs/getting-started#your-first-working-screen")}>
                    Your First Working Screen <ArrowUpRightIcon size={13} aria-hidden="true" />
                  </a>
                </div>
              </li>
              <li>
                <span>02</span>
                <div>
                  <h3>Build the Complete Journey</h3>
                  <p>Add navigation, useful feedback and recovery around the happy path.</p>
                  <a href={withBasePath("/docs/getting-started#ship-a-complete-feature")}>
                    Ship a Complete Feature <ArrowUpRightIcon size={13} aria-hidden="true" />
                  </a>
                </div>
              </li>
              <li>
                <span>03</span>
                <div>
                  <h3>Check What People Will Use</h3>
                  <p>
                    Review keyboard access, narrow layouts, both color schemes and failure states.
                  </p>
                  <a href={withBasePath("/docs/getting-started#verify-the-whole-journey")}>
                    Verify the Whole Journey <ArrowUpRightIcon size={13} aria-hidden="true" />
                  </a>
                </div>
              </li>
            </ol>
          </section>
        </div>
      }
    />
  );
}
