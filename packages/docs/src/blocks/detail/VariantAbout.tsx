/** Behavior, integration boundaries and accessibility guidance tailored to each composition. */
import { ExternalLinkIcon, InfoIcon } from "@kamod-ch/icons/lucide";
import { withBasePath } from "../../base-path";
import { BrandText } from "../../docs/components/brand/BrandText";
import { CodeBlock } from "../../docs/components/CodeBlock";
import { DocsCallout } from "../../docs/components/DocsCallout";
import { InlineCodeLink } from "../../docs/components/InlineCodeLink";
import { PathDisplay } from "../../docs/components/PathDisplay";
import { linkTitle } from "../../link-title";
import { getBlockOverviewDetails } from "../block-overview-details";
import { ShowcaseCodeLink } from "../ShowcaseCodeLink";
import { BlockDocSection, BlockGuideHeading } from "./BlockDocumentation";
import type { VariantGuide } from "./VariantDocumentation";

export function VariantBehavior({ guide }: { guide: VariantGuide }) {
  const { category, block, anchor, sidebar } = guide;
  const signup = category === "signup";
  return (
    <BlockDocSection
      id={anchor("behavior")}
      introduction={
        <p>
          <BrandText>
            {sidebar?.text ??
              (signup
                ? "Registration validates a name, email and password, and asks the user to accept the terms. This combines field feedback with an explicit consent step; it does not create an account or store legal acceptance by itself."
                : block.id === "login-05"
                  ? "This variant asks only for an email address. Its callback receives MagicLinkValues rather than a password. Connect an email-link service and provide the corresponding link-completion route; the block itself does not send an email."
                  : "The form validates an email and a password before awaiting onSubmit. GitHub and Google buttons call onSocialLogin independently. Your authentication service handles the session, provider redirect and post-login destination.")}
          </BrandText>
        </p>
      }
    >
      {sidebar ? (
        <DocsCallout class="docs-callout-spaced" title="Find the right file" icon={<InfoIcon />}>
          <p>
            Edit <code>{block.id}.tsx</code> for layout and <PathDisplay path={"data/"} /> for
            example content.
            {guide.files.some((file) => file.label.startsWith("components/")) && (
              <>
                {" "}
                Reusable interactions live in <PathDisplay path={"components/"} />.
              </>
            )}{" "}
            Each variant is an explicit composition; there is no configuration switch or dependency
            on another variant.
          </p>
        </DocsCallout>
      ) : (
        <>
          <dl class="blocks-doc-callouts">
            <div>
              <dt>{signup ? "Consent is separate from the payload" : "Callbacks are awaited"}</dt>
              <dd>
                {signup ? (
                  <>
                    The checkbox is validated locally, but <code>SignupValues</code> contains only
                    name, email and password. Extend your copied form and service contract if you
                    need to persist consent, policy version or acceptance time.
                  </>
                ) : (
                  <>
                    Return a promise from your callback so the form waits for completion. A
                    rejection enters its error state; replace the generic demo error with
                    appropriate application feedback. Do not log submitted passwords.
                  </>
                )}
              </dd>
            </div>
            <div>
              <dt>Social providers need a service</dt>
              <dd>
                {signup ? (
                  <>
                    The form defaults to hiding social buttons; this page{" "}
                    {block.id === "signup-05" ? "enables" : "does not enable"} them. Pass{" "}
                    <code>showSocial</code> and <code>onSocialSignup</code> to show and connect
                    GitHub and Google. That provider path does not run the email form’s field or
                    terms checks, so handle any required consent in the provider flow as well.
                  </>
                ) : (
                  <>
                    Connect <code>onSocialLogin</code> to your provider flow. Showing a provider
                    button alone does not configure OAuth or create a session.
                  </>
                )}
              </dd>
            </div>
          </dl>
          <CodeBlock
            code={
              signup
                ? "<SignupForm\n  showSocial\n  onSocialSignup={startProviderSignup}\n  onSubmit={createAccount}\n/>"
                : "<LoginForm\n  onSocialLogin={startProviderLogin}\n  onSubmit={" +
                  (block.id === "login-05" ? "requestSignInLink" : "signIn") +
                  "}\n/>"
            }
            language="tsx"
          />
          <DocsCallout class="docs-callout-spaced" title="Connect your service" icon={<InfoIcon />}>
            <p>
              The callback names above represent functions supplied by your app. Keep server-side
              validation and credential handling in your authentication service. Adapt the form’s
              demo messages to that service’s actual result.
            </p>
          </DocsCallout>
        </>
      )}
    </BlockDocSection>
  );
}

function authLayout(guide: VariantGuide) {
  const number = guide.block.id.slice(-2);
  if (number === "02")
    return (
      <>
        A <strong>two-column page</strong> pairs a constrained form with a cover image. The{" "}
        <code>lg:grid-cols-2</code> layout starts at <code>1024px</code>; below it, the image is
        hidden and the form keeps the available width. Branding remains above the form.
      </>
    );
  if (number === "03")
    return (
      <>
        A <strong>centered card</strong> sits on a muted page background with a brand link above.
        Its maximum width keeps fields readable, while outer padding reduces on smaller screens. Use
        the <InlineCodeLink href="/docs/card/installation">Card</InlineCodeLink> surface for
        grouping, and keep essential instructions inside the form.
      </>
    );
  if (number === "04")
    return (
      <>
        The form and cover share a <strong>single centered card</strong>. The{" "}
        <code>md:grid-cols-2</code> arrangement starts at <code>768px</code>; below it, the image
        column disappears and the form uses the full card width. Keep essential instructions in text
        rather than in the illustration.
      </>
    );
  return (
    <>
      A <strong>centered, constrained form</strong> uses fluid outer padding. On narrow screens it
      fills the available content width without a fixed desktop canvas. Its compact layout works
      well when the form itself is the page’s main task.
    </>
  );
}

/** Authentication guides retain their form-specific explanation; sidebars use SidebarAbout. */
export function VariantAbout({ guide }: { guide: VariantGuide }) {
  const { anchor, category, block } = guide;
  const signup = category === "signup";
  const magicLink = block.id === "login-05";
  const form = signup ? "SignupForm" : "LoginForm";
  const formFile = `components/${category}-form.tsx`;
  return (
    <BlockDocSection
      id={anchor("about")}
      className="blocks-doc-explanation"
      introduction={
        <p>
          <strong>The page provides the setting; the form owns the interaction.</strong> This
          composition combines{" "}
          <InlineCodeLink href="/docs/input/installation">Input</InlineCodeLink>,{" "}
          <InlineCodeLink href="/docs/label/installation">Label</InlineCodeLink>,{" "}
          <InlineCodeLink href="/docs/button/installation">Button</InlineCodeLink> and{" "}
          <InlineCodeLink href="/docs/alert/installation">Alert</InlineCodeLink> into a complete{" "}
          {signup ? "registration" : magicLink ? "email-link request" : "sign-in"} interface. Your
          application supplies the <strong>authentication service and real destinations</strong>; a
          successful preview interaction does not create a session.
        </p>
      }
    >
      <section aria-labelledby={anchor("structure")}>
        <BlockGuideHeading id={anchor("structure")} />
        <p>
          Edit{" "}
          <ShowcaseCodeLink blockId={block.id} file={`app/${category}/page.tsx`}>
            <code>page.tsx</code>
          </ShowcaseCodeLink>{" "}
          for centering, surfaces, branding and any cover image. Edit{" "}
          <ShowcaseCodeLink blockId={block.id} file={formFile}>
            <code>{category}-form.tsx</code>
          </ShowcaseCodeLink>{" "}
          for fields and submission. The full-page wrapper takes{" "}
          <strong>no configuration props</strong>; pass callbacks to <code>{form}</code> inside that
          page. See <a href={`#${anchor("render")}`}>Render the Page or Form</a> for both entry
          points.
        </p>
        <p>
          Shared <PathDisplay path="auth/shared" /> helpers supply validation and provider artwork;
          optional branding lives in <PathDisplay path="shared/branding" />. Keep imported helpers
          when reusing the form elsewhere. Its values are <strong>local component state</strong>:
          there is no public <code>value</code> or <code>initialValues</code> prop. To add a field
          or prefill values, update state, validation and the{" "}
          <a href={`#${anchor("data-types")}`}>payload type</a> together.
        </p>
        <p>
          <strong>
            {signup
              ? "Consent and account data are separate."
              : magicLink
                ? "An email request is only the first half of sign-in."
                : "Wait for the actual sign-in result."}
          </strong>{" "}
          {signup ? (
            <>
              The local terms check is not included in <code>SignupValues</code>, whose fields are{" "}
              <code>name</code>, <code>email</code> and <code>password</code>. If your app records
              acceptance, extend the copied form and service payload deliberately.
            </>
          ) : magicLink ? (
            <>
              <code>MagicLinkValues</code> contains only <code>email</code>. Your service must send
              the link and handle its completion route; the form’s success message is not proof that
              a session exists.
            </>
          ) : (
            <>
              The <code>LoginValues</code> payload contains <code>email</code> and{" "}
              <code>password</code>. Return your service promise so pending feedback lasts until the
              operation completes.
            </>
          )}
        </p>
        <p>
          This line in the{" "}
          <ShowcaseCodeLink blockId={block.id} file={formFile}>
            submission handler
          </ShowcaseCodeLink>{" "}
          is the handoff to your application, after local validation:
        </p>
        <CodeBlock
          code={magicLink ? "await onSubmit?.({ email });" : "await onSubmit?.(values);"}
          language="tsx"
        />
        <p>
          The optional callback means the demo can show success <em>without a connected service</em>
          . A rejected promise enters the form’s error state; a resolved error object does not do so
          automatically. Follow{" "}
          <a href={`#${anchor("connect-app")}`}>Connect Your Authentication Service</a> to map your
          service’s result and replace the demo messages.
        </p>
      </section>
      <section aria-labelledby={anchor("responsive")}>
        <BlockGuideHeading id={anchor("responsive")} />
        <p>{authLayout(guide)}</p>
        <p>
          <strong>Let the page grow when feedback appears.</strong> The full-page wrappers use{" "}
          <code>min-h-svh</code>, not a fixed content height. Keep labels, legal links and errors
          able to wrap, and test with the on-screen keyboard open. When embedding the form in a{" "}
          <InlineCodeLink href="/docs/dialog/installation">Dialog</InlineCodeLink>, preserve its
          scroll area and keep the submit button reachable.
        </p>
        <p>
          Pair <code>bg-background</code> with <code>text-foreground</code> and card surfaces with
          their matching foreground token. The{" "}
          <a href={withBasePath("/blocks/theming")}>block theming guide</a> explains how to keep
          fields, errors and loading states legible in both modes. Review replacement images at each
          breakpoint; decorative art should not carry instructions or duplicate the form’s text
          alternative.
        </p>
      </section>
      <section aria-labelledby={anchor("accessibility")}>
        <BlockGuideHeading id={anchor("accessibility")} />
        <dl class="blocks-doc-callouts">
          <div>
            <dt>Preserve the field’s complete identity</dt>
            <dd>
              Keep the <InlineCodeLink href="/docs/label/installation">Label</InlineCodeLink>{" "}
              associated with its control’s <code>id</code>, retain <code>aria-invalid</code> and
              link help/errors through <code>aria-describedby</code>. A placeholder is secondary
              guidance, not a label. If you render two instances, give labels, inputs and messages
              distinct ID prefixes.
            </dd>
          </div>
          <div>
            <dt>Make failure recoverable</dt>
            <dd>
              Local validation calls <code>focusFirstError</code> before sending data. Include new
              inputs in that logic and keep messages beside the field they explain. Server failures
              need a clear retry path without exposing sensitive account details; review the{" "}
              <a href={withBasePath("/docs/input/installation")}>input accessibility guidance</a>{" "}
              when extending feedback.
            </dd>
          </div>
          <div>
            <dt>Keep pending and completion states connected</dt>
            <dd>
              <code>loading</code> disables submission controls, while <code>role="status"</code>{" "}
              and <code>aria-live="polite"</code> announce messages. Preserve these cues when
              changing button copy. If the next step navigates away, your application should also
              manage focus in the destination page.
            </dd>
          </div>
        </dl>
        <DocsCallout class="docs-callout-spaced" title="Check the full flow" icon={<InfoIcon />}>
          <p>
            Invalid input → correction → pending request → success or a recoverable failure. Repeat
            at <code>320px</code>, <code>768px</code>, <code>1024px</code> and <code>1440px</code>,
            with keyboard-only input, 200% zoom and both color modes. Use{" "}
            <a href={`#${anchor("verify-flow")}`}>Check the Complete Flow</a> for the integration
            checklist.
          </p>
        </DocsCallout>
      </section>
      <section aria-labelledby={anchor("production")}>
        <BlockGuideHeading id={anchor("production")} />
        <p>
          <strong>Replace simulation before connecting real users.</strong> Remove{" "}
          <code>sleep()</code>
          and <code>demoRejects()</code>, rewrite the success/error messages and provide real
          account and legal URLs. Check <a href={`#${anchor("prop-reference")}`}>Form Props</a> for
          the destinations this variant exposes. Branded layouts also need a real home destination
          on <code>KamodBrandLink</code>, whose fallback is <code>#</code>.
        </p>
        <p>
          {signup ? (
            <>
              If enabling <code>showSocial</code>, connect <code>onSocialSignup</code> and handle
              any required consent in that provider flow too. Provider buttons do not run the email
              form’s field or terms checks.
            </>
          ) : (
            <>
              Connect <code>onSocialLogin</code> separately from <code>onSubmit</code>. Provider
              buttons start their own flow; displaying GitHub or Google does not configure an OAuth
              service.
            </>
          )}{" "}
          The <a href={`#${anchor("behavior")}`}>variant behavior notes</a> explain these callback
          boundaries.
        </p>
        <p>
          Keep <strong>server validation, sessions and recovery</strong> in your application’s
          service layer. Reuse the form’s visual structure while adapting its messages and next
          steps to your actual product. Finish with the{" "}
          <a href={withBasePath("/docs/getting-started#verify-the-whole-journey")}>
            whole-journey review
          </a>
          , including a slow request and a failed one.
        </p>
      </section>
    </BlockDocSection>
  );
}

export function VariantSource({ guide }: { guide: VariantGuide }) {
  const { block, category, anchor } = guide;
  const { sourceUrl, displayName } = getBlockOverviewDetails(category, block);
  return (
    <BlockDocSection
      id={anchor("source")}
      className="blocks-doc-reference"
      introduction={
        <p>
          Use the{" "}
          <a class="underline" href={sourceUrl} target="_blank" rel="noreferrer noopener">
            Checked-in Kamod Implementation
          </a>{" "}
          as your reference when adapting this variant. The{" "}
          <ShowcaseCodeLink blockId={block.id}>showcase’s Code tab</ShowcaseCodeLink> includes its
          supporting files, and the{" "}
          <a class="underline" href={`#${anchor("installation")}`}>
            Setup Instructions
          </a>{" "}
          explain where to place them and how to keep their imports intact. Before changing a
          helper, trace where it is used in the composition and check its inputs in the{" "}
          <a class="underline" href={`#${anchor("props")}`}>
            Props and Data Reference
          </a>
          . This helps you adapt one part of the block without overlooking the files or behavior it
          depends on.
        </p>
      }
    >
      <div class="blocks-doc-attribution">
        <div class="blocks-doc-attribution-header">
          <p class="blocks-doc-attribution-title">
            <BrandText>
              Source:{" "}
              <a
                class="blocks-doc-attribution-source"
                href={sourceUrl}
                target="_blank"
                rel="noreferrer noopener"
              >
                {linkTitle(displayName)} on GitHub
                <span class="blocks-doc-attribution-icon" aria-hidden="true">
                  <ExternalLinkIcon size={16} strokeWidth={2} />
                </span>
              </a>
            </BrandText>
          </p>
        </div>
        <p>
          Keep your local copy focused on the layout and interactions your app actually uses. Start
          with the data and content, then adjust composition and styling using the same semantic
          theme tokens.
        </p>
        <p class="blocks-doc-attribution-note">
          Ready to integrate? Follow <a href={`#${anchor("installation")}`}>Add This Block</a> and
          the <a href={`#${anchor("usage")}`}>Local Usage Example</a>.
        </p>
      </div>
    </BlockDocSection>
  );
}
