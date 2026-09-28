/** Separate the demo page, reusable form and application-owned authentication flow. */
import { CodeBlock } from "../../docs/components/CodeBlock";
import { ShowcaseCodeLink } from "../ShowcaseCodeLink";
import { BlockDocSection, BlockGuideHeading } from "./BlockDocumentation";
import type { VariantGuide } from "./VariantDocumentation";
import { integrationExample, variantImport } from "./variant-examples";

export function AuthUsage({ guide }: { guide: VariantGuide }) {
  const { anchor, component, category, block } = guide;
  const signup = category === "signup";
  const form = signup ? "SignupForm" : "LoginForm";
  return (
    <BlockDocSection
      id={anchor("usage")}
      className="blocks-doc-usage"
      introduction={
        <p>
          Start by rendering the supplied page to check its appearance, then connect its local form
          to your application. <code>{component}</code> takes <strong>no props</strong>; callbacks
          belong to <code>{form}</code> inside the copied page. The form owns its input and feedback
          state, while your app owns the authenticated session and destination after success.
        </p>
      }
    >
      <section aria-labelledby={anchor("render")}>
        <BlockGuideHeading id={anchor("render")} />
        <CodeBlock
          code={`${variantImport(guide)}\n\nexport const App = () => <${component} />;`}
          language="tsx"
        />
        <p>
          This renders a complete page with its own <code>main</code> landmark. To preserve this
          variant’s layout, edit the <code>{form}</code> call in your copied{" "}
          <ShowcaseCodeLink blockId={block.id} file={`app/${category}/page.tsx`}>
            <code>page.tsx</code>
          </ShowcaseCodeLink>
          . To embed the form in an existing page or dialog, import the form directly instead of
          nesting another full page. Its heading is an <code>h1</code>; adjust that level and the
          field IDs if your host page already has a heading or another instance of this form.
        </p>
      </section>
      <section aria-labelledby={anchor("connect-app")}>
        <BlockGuideHeading id={anchor("connect-app")} />
        <p>
          The example below wraps the form in a component that receives your service functions. Pass
          the same callbacks to the form in <code>page.tsx</code> if you keep the original layout.
          The imported value types describe the submitted payload; they are not configuration props
          on <code>{component}</code>. See <a href={`#${anchor("prop-reference")}`}>Form props</a>{" "}
          for each callback and link destination.
        </p>
        <CodeBlock code={integrationExample(guide)} language="tsx" />
        <dl class="blocks-doc-callouts">
          <div>
            <dt>Report the actual result</dt>
            <dd>
              Return the request’s promise so loading lasts until it settles. If your service
              resolves with an error result rather than rejecting, handle that result explicitly;
              the form otherwise treats completion as success. Map useful messages to the local
              error/status state in <code>{category}-form.tsx</code>. A callback’s return value does
              not automatically populate field errors or navigate to another page.
            </dd>
          </div>
          <div>
            <dt>Replace the demo before connecting users</dt>
            <dd>
              Remove <code>sleep()</code>, <code>demoRejects()</code> and the simulated
              success/error messages. Without a callback, the demo can still report success. Supply
              real account links and implement your success destination; the block does not create a
              session or redirect on its own.{" "}
              {block.id === "login-05" &&
                "For email-only sign-in, this also includes sending and completing the one-time link."}
            </dd>
          </div>
        </dl>
      </section>
      <section aria-labelledby={anchor("verify-flow")}>
        <BlockGuideHeading id={anchor("verify-flow")} />
        <ul class="blocks-doc-integration-notes">
          <li>
            <strong>Invalid and valid submissions.</strong> Check the first invalid field receives
            focus, correct its input, then verify a successful request and a rejected request. Local
            field errors are recomputed on submission, not cleared as each character is typed.
          </li>
          <li>
            <strong>Pending requests.</strong> Buttons disable while loading, but inputs remain
            editable. Decide whether your app should freeze those fields and prevent repeated submit
            events; a disabled button alone is not a complete request guard. Handle cancellation if
            the form can unmount while a request is pending.
          </li>
          <li>
            <strong>Alternative paths.</strong> Test every visible provider button and account link.
            {signup
              ? " Social signup bypasses the email form’s terms and field checks; apply any required consent step in that flow too."
              : " Provider sign-in runs independently of the credential fields; a failed email form should not be mistaken for a failed provider request."}
          </li>
        </ul>
        <p class="blocks-doc-note">
          The <a href={`#${anchor("behavior")}`}>variant details</a> explain this form’s payload and
          provider behavior. Finish with the{" "}
          <a href={`#${anchor("accessibility")}`}>accessibility checks</a> using your real labels,
          errors and service responses.
        </p>
      </section>
    </BlockDocSection>
  );
}
