/** Behavior, integration boundaries and accessibility guidance tailored to each composition. */
import { ExternalLinkIcon } from "@kamod-ch/icons/lucide";
import { CodeBlock } from "../../docs/components/CodeBlock";
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
          {sidebar?.text ??
            (signup
              ? "Registration validates a name, email and password, and asks the user to accept the terms. This combines field feedback with an explicit consent step; it does not create an account or store legal acceptance by itself."
              : block.id === "login-05"
                ? "This variant asks only for an email address. Its callback receives MagicLinkValues rather than a password. Connect an email-link service and provide the corresponding link-completion route; the block itself does not send an email."
                : "The form validates an email and a password before awaiting onSubmit. GitHub and Google buttons call onSocialLogin independently. Your authentication service handles the session, provider redirect and post-login destination.")}
        </p>
      }
    >
      {sidebar ? (
        <p class="blocks-doc-note">
          Edit <code>{block.id}.tsx</code> for layout and <code>data/</code> for example content.
          {guide.files.some((file) => file.label.startsWith("components/")) && (
            <>
              {" "}
              Reusable interactions live in <code>components/</code>.
            </>
          )}{" "}
          Each variant is an explicit composition; there is no configuration switch or dependency on
          another variant.
        </p>
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
          <p class="blocks-doc-note">
            The callback names above represent functions supplied by your app. Keep server-side
            validation and credential handling in your authentication service. Adapt the form’s demo
            messages to that service’s actual result.
          </p>
        </>
      )}
    </BlockDocSection>
  );
}

function authLayout(guide: VariantGuide): string {
  const number = guide.block.id.slice(-2);
  if (number === "02")
    return "A two-column page pairs a constrained form with a cover image. Below 1024px the image is hidden and the form takes the available width; branding remains above it.";
  if (number === "03")
    return "A centered card sits on a muted page background with a brand link above. Its maximum width keeps fields readable, while outer padding reduces on smaller screens.";
  if (number === "04")
    return "The form and cover share a centered card. Below 768px the image column is hidden, leaving the form at full card width. The illustration is decorative and should not carry essential instructions.";
  return "A centered, constrained form uses fluid outer padding. On a narrow screen it fills the available content width without requiring a fixed desktop canvas.";
}

/** Authentication guides retain their form-specific explanation; sidebars use SidebarAbout. */
export function VariantAbout({ guide }: { guide: VariantGuide }) {
  const { anchor, category } = guide;
  return (
    <BlockDocSection
      id={anchor("about")}
      className="blocks-doc-explanation"
      introduction={
        <p>
          This block separates page presentation from form interaction. Its Preact form owns input,
          validation, loading and feedback state, while your application supplies authentication and
          real destinations. Shared Kamod primitives provide the visual language and basic
          interactions.
        </p>
      }
    >
      <section aria-labelledby={anchor("structure")}>
        <BlockGuideHeading id={anchor("structure")} />
        <p>
          The copied <code>page.tsx</code> owns centering, background, branding and any cover image.
          Its sibling <code>{category}-form.tsx</code> owns the form. Shared helpers in{" "}
          <code>auth/shared</code> supply validation and provider artwork; optional branding lives
          separately in <code>shared/branding</code>. You can reuse the form inside another page
          without copying the original page layout, but keep the form’s imported helpers. The form
          stores values internally; adding a value or initialValues prop requires changing that
          implementation. Change field names, payload types and validation together when adapting
          the form, and keep the service contract aligned with them.
        </p>
      </section>
      <section aria-labelledby={anchor("responsive")}>
        <BlockGuideHeading id={anchor("responsive")} />
        <p>{authLayout(guide)}</p>
        <p>
          Keep labels, validation text and legal links able to wrap. Test with the on-screen
          keyboard open and a long error message, not only an empty form. Light and dark colors
          follow your application’s Kamod theme. The full-page wrappers use <code>min-h-svh</code>,
          so they can grow when content needs more height. Preserve that flexibility instead of
          forcing a fixed height that clips error messages or the submit button.
        </p>
      </section>
      <section aria-labelledby={anchor("accessibility")}>
        <BlockGuideHeading id={anchor("accessibility")} />
        <dl class="blocks-doc-callouts">
          <div>
            <dt>Labels and errors</dt>
            <dd>
              Preserve each field’s label, <code>aria-invalid</code> and error association. Failed
              local validation focuses the first invalid field. If you add inputs, give them unique
              IDs and names, and include them in the error-focus logic. Multiple instances of the
              same copied form need distinct ID prefixes on labels, controls, help text and errors.
              A placeholder is not a replacement for a label.
            </dd>
          </div>
          <div>
            <dt>Submission feedback</dt>
            <dd>
              Loading disables submission controls, and status messages use a polite live region.
              Preserve this feedback when connecting a real service. Replace demo wording with a
              clear result and a recovery action that does not expose sensitive account details.
            </dd>
          </div>
        </dl>
        <p class="blocks-doc-note">
          Before shipping your adaptation, check 320px, 768px, 1024px and 1440px, keyboard-only
          operation, 200% zoom, both color modes and your longest real content. These checks apply
          to your finished integration; the demo cannot guarantee accessibility after its structure
          or behavior changes.
        </p>
      </section>
      <section aria-labelledby={anchor("production")}>
        <BlockGuideHeading id={anchor("production")} />
        <p>
          Remove the artificial <code>sleep()</code> delay and <code>demoRejects()</code> rule,
          replace the demo success/error messages, and supply real account and legal URLs. Local
          validation is feedback, not a security boundary. The backend must validate input and own
          account creation, sessions and recovery. Branded layouts also need a real home destination
          on <code>KamodBrandLink</code>, which otherwise points to <code>#</code>. If you replace
          the cover, review its alt text: use an empty alternative for purely decorative artwork and
          meaningful text only when it communicates useful information.
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
            checked-in Kamod implementation
          </a>{" "}
          as your reference when adapting this variant. The{" "}
          <ShowcaseCodeLink blockId={block.id}>showcase’s Code tab</ShowcaseCodeLink> includes its
          supporting files, and the{" "}
          <a class="underline" href={`#${anchor("installation")}`}>
            setup instructions
          </a>{" "}
          explain where to place them and how to keep their imports intact. Before changing a
          helper, trace where it is used in the composition and check its inputs in the{" "}
          <a class="underline" href={`#${anchor("props")}`}>
            Props and data reference
          </a>
          . This helps you adapt one part of the block without overlooking the files or behavior it
          depends on.
        </p>
      }
    >
      <div class="blocks-doc-attribution">
        <div class="blocks-doc-attribution-header">
          <p class="blocks-doc-attribution-title">
            Source:{" "}
            <a
              class="blocks-doc-attribution-source"
              href={sourceUrl}
              target="_blank"
              rel="noreferrer noopener"
            >
              {displayName} on GitHub
              <span class="blocks-doc-attribution-icon" aria-hidden="true">
                <ExternalLinkIcon size={16} strokeWidth={2} />
              </span>
            </a>
          </p>
        </div>
        <p>
          Keep your local copy focused on the layout and interactions your app actually uses. Start
          with the data and content, then adjust composition and styling using the same semantic
          theme tokens.
        </p>
        <p class="blocks-doc-attribution-note">
          Ready to integrate? Follow <a href={`#${anchor("installation")}`}>Add this block</a> and
          the <a href={`#${anchor("usage")}`}>local usage example</a>.
        </p>
      </div>
    </BlockDocSection>
  );
}
