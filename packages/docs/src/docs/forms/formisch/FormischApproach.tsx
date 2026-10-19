import { ArrowRightIcon } from "@kamod-ch/icons/tabler/outline";
import { InlineCodeLink } from "../../components/InlineCodeLink";

const layers = [
  {
    role: "Define",
    owner: "Valibot",
    title: "Start with the Data",
    body: (
      <>
        Describe accepted values and useful error messages in a <strong>Shared Schema</strong>.
        Infer the submitted type with <code>v.InferOutput</code> so your handler stays connected to
        the same rules as your fields.
      </>
    ),
    href: "#schema-and-setup",
    link: "Schema and Setup",
  },
  {
    role: "Coordinate",
    owner: "Formisch",
    title: "Keep State in One Place",
    body: (
      <>
        Create the store with <code>useForm</code>. Read each field’s value and errors from that
        store, then choose <strong>When to Validate</strong> with <code>validate</code> and{" "}
        <code>revalidate</code>. Reset and submission use that same state.
      </>
    ),
    href: "#validation-modes",
    link: "Validation Timing",
  },
  {
    role: "Present",
    owner: "Kamod UI",
    title: "Make Every State Clear",
    body: (
      <>
        Compose a visible label, control and feedback with{" "}
        <InlineCodeLink href="/docs/field/installation">Field</InlineCodeLink>. Connect error
        messages to the input and set <code>aria-invalid</code> when needed. Preserve{" "}
        <strong>Labels and Keyboard Behavior</strong> as you refine the layout.
      </>
    ),
    href: "#displaying-errors",
    link: "Field Feedback",
  },
  {
    role: "Connect",
    owner: "Your Application",
    title: "Carry the Result through",
    body: (
      <>
        Use <code>onSubmit</code> to connect validated output to your request. Your service handles
        authorization and server validation; your interface explains pending, success and failure
        states. <strong>Keep Entered Values</strong> available after a failed save so the person can
        retry.
      </>
    ),
    href: "#demo",
    link: "Submission Example",
  },
];

/** Integration responsibilities followed by the state boundary shared by every example. */
export function FormischApproach() {
  return (
    <div class="formisch-approach block-guide-prose">
      <div class="formisch-approach-grid">
        {layers.map(({ role, owner, title, body, href, link }) => (
          <section key={role} class="formisch-approach-layer">
            <div class="formisch-approach-meta">
              <span>{role}</span>
              <span aria-hidden="true">·</span>
              <span>{owner}</span>
            </div>
            <h3>{title}</h3>
            <p>{body}</p>
            <a class="formisch-approach-link" href={href}>
              {link}
              <ArrowRightIcon size={13} aria-hidden="true" />
            </a>
          </section>
        ))}
      </div>
      <aside class="formisch-approach-takeaway" aria-labelledby="formisch-state-boundary">
        <h3 id="formisch-state-boundary">One Field, One Source of Truth</h3>
        <p>
          Let Formisch own the field value instead of mirroring it in another <code>useState</code>.{" "}
          For native inputs, preserve <code>field.props</code>; for composite controls, connect
          their value callback to <code>field.onChange</code>. Keep separate state for application
          feedback, such as a failed request, and clear it deliberately when resetting.
        </p>
        <div class="formisch-approach-bindings">
          <span>See the Bindings</span>
          <span aria-hidden="true">·</span>
          <InlineCodeLink href="#input" title="Connect native input props to Formisch">
            Input
          </InlineCodeLink>
          <InlineCodeLink href="#select" title="Connect a composite control’s value callback">
            Select
          </InlineCodeLink>
          <InlineCodeLink href="#resetting-form" title="Restore initial values and clear feedback">
            reset(form)
          </InlineCodeLink>
        </div>
      </aside>
    </div>
  );
}
