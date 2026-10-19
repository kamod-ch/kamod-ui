import type { ComponentChildren } from "preact";
import { withBasePath } from "../../base-path";

export type FormWalkthrough = {
  title: string;
  introduction: ComponentChildren;
  stages: { title: string; context: string; body: ComponentChildren }[];
  takeaway: ComponentChildren;
  href: string;
  link: string;
};

/** Reading order follows the data: accept input, process it, then handle the result. */
export const formWalkthroughs: Record<string, FormWalkthrough> = {
  native: {
    title: "Start with the Browser, Then Connect Your App",
    introduction: (
      <>
        Keep the first form small: a <strong>Visible Label</strong>, a named input and a clear
        action. Let native checks handle missing or malformed values before you add your own
        <a href="#form-submission"> Submission Behavior</a>.
      </>
    ),
    stages: [
      {
        title: "Make the Input Easy to Understand",
        context: "Before submission",
        body: (
          <>
            Keep the label visible while typing and connect it with matching <code>htmlFor</code>{" "}
            and <code>id</code> values. Use <code>required</code> and <code>type="email"</code> to
            let the browser explain missing or malformed input. Try both cases before connecting a
            service.
          </>
        ),
      },
      {
        title: "Follow the Value into Your Handler",
        context: "On submit",
        body: (
          <>
            Enter <code>reader@example.com</code> and press <kbd>Enter</kbd>. In the copied example,{" "}
            <code>FormData</code> reads the input’s <code>name="email"</code> and passes the value
            to <code>onSave</code>. The live preview only confirms validity; it does not send or
            store data.
          </>
        ),
      },
      {
        title: "Keep the Form Usable as It Grows",
        context: "When integrating",
        body: (
          <>
            Give repeated form instances unique input and help-text IDs. Once saving becomes
            asynchronous, show a <strong>Pending State</strong> and keep the entered value if the
            request fails. The <a href="#form-review">Review Checklist</a> covers keyboard order,
            focus and recovery.
          </>
        ),
      },
    ],
    takeaway: (
      <>
        A successful browser check means the value can be submitted. Confirm <strong>Saved</strong>{" "}
        only after your service reports success.
      </>
    ),
    href: "#form-submission",
    link: "Submission & Recovery",
  },
  schema: {
    title: "Turn Incoming Values into Data You Can Use",
    introduction: (
      <>
        A schema gives validation a <strong>Single Definition</strong>. Follow the example from
        unknown input to parsed output, then turn any issues into{" "}
        <a href="#validation-messages">Useful Field Messages</a>.
      </>
    ),
    stages: [
      {
        title: "Describe What You Accept",
        context: "At the input boundary",
        body: (
          <>
            <code>ContactSchema</code> expects an object with an email string. The pipe trims
            whitespace, rejects an empty value and checks the email format. Try a missing property,
            a number and a malformed address to check each part of the contract.
          </>
        ),
      },
      {
        title: "Use the Parsed Result",
        context: "After validation",
        body: (
          <>
            Pass <code>{'"  reader@example.com  "'}</code> to <code>parseContact</code> as the email
            value. When <code>result.success</code> is true, use <code>result.output.email</code>:
            it contains the trimmed value. Continuing with the original input would discard that
            normalization.
          </>
        ),
      },
      {
        title: "Bring Errors Back to the Field",
        context: "When validation fails",
        body: (
          <>
            Map issues to the field that needs attention and explain how to correct the value. Keep
            the entered text available while the user edits. For coordinated validation and
            submission, the <a href={withBasePath("/docs/formisch/installation")}>Formisch Guide</a>{" "}
            connects a schema to Kamod controls.
          </>
        ),
      },
    ],
    takeaway: (
      <>
        A <strong>Type</strong> describes data at compile time; a <strong>Schema</strong> checks it
        at runtime. Validate incoming values again on the server.
      </>
    ),
    href: "#validation-messages",
    link: "Writing Useful Error Messages",
  },
  formisch: {
    title: "Guide the User from First Input to a Saved Result",
    introduction: (
      <>
        Treat the form as one continuous interaction: <strong>Help the User Correct a Value</strong>
        , make the save state clear, and leave a way to recover. The example connects these steps
        through <code>useForm</code>; your application provides the{" "}
        <a href="#form-submission">Saving Behavior</a>.
      </>
    ),
    stages: [
      {
        title: "Show Feedback When It Helps",
        context: "While editing",
        body: (
          <>
            With <code>validate: "submit"</code>, the first submit checks the values. After that,{" "}
            <code>revalidate: "input"</code> lets feedback respond as the user corrects a field.
            Keep the message beside its input and update <code>aria-invalid</code> with the error
            state. Try an invalid address, submit, then correct it without leaving the field.
          </>
        ),
      },
      {
        title: "Make the Save State Clear",
        context: "During submission",
        body: (
          <>
            Return the promise from <code>onSave</code> so Formisch can track the request. While{" "}
            <code>form.isSubmitting.value</code> is true, the example disables the submit button and
            displays “Saving…”. Test with a slow response so the <strong>Pending State</strong> is
            easy to recognize and repeated submissions are prevented.
          </>
        ),
      },
      {
        title: "Finish with Confirmation or a Way to Retry",
        context: "After the response",
        body: (
          <>
            On success, explain what was saved. On failure, keep the entered values and provide an
            actionable message near the submit action. A valid email and a failed request are
            different problems: use <strong>Field Errors</strong> for input corrections and{" "}
            <strong>Service Feedback</strong> for save failures. Add this result handling in your
            app; the snippet does not implement it.
          </>
        ),
      },
    ],
    takeaway: (
      <>
        Walk through <strong>Invalid Input</strong>, a <strong>Slow Save</strong> and a{" "}
        <strong>Failed Request</strong> before adding more fields. Each state should explain what
        the user can do next.
      </>
    ),
    href: "/docs/formisch/installation#usage",
    link: "The Full Formisch Integration",
  },
};
