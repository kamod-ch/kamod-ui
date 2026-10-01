import { useToggle } from "@kamod-ch/hooks";
import { Button, Input, Label } from "@kamod-ch/ui";
import { useState } from "preact/hooks";

/** Local-only form exercise: native validity gates submission and nothing is transmitted. */
export function FormOverviewPreview() {
  const [submitted, setSubmitted] = useState(false);
  return (
    <form
      class="overview-form-preview"
      aria-label="Email form demo"
      onInput={() => setSubmitted(false)}
      onReset={() => setSubmitted(false)}
      onSubmit={(event) => {
        event.preventDefault();
        setSubmitted(true);
      }}
    >
      <Label htmlFor="overview-demo-email">Email address</Label>
      <Input
        id="overview-demo-email"
        name="email"
        type="email"
        required
        autoComplete="off"
        placeholder="you@example.com"
        aria-describedby="overview-demo-help"
      />
      <p id="overview-demo-help">Try a sample address. This demo sends and saves nothing.</p>
      <div class="overview-demo-actions">
        <Button type="submit" size="sm">
          Check form
        </Button>
        <Button type="reset" size="sm" variant="outline">
          Reset
        </Button>
      </div>
      <p role="status">
        {submitted ? "The form is valid. Nothing was sent." : "Ready to check your input."}
      </p>
    </form>
  );
}

/** Demonstrates a real hook without creating storage, timers or network requests. */
export function PackageOverviewPreview() {
  const [open, { toggle }] = useToggle(false);
  return (
    <div class="overview-hook-preview">
      <Button
        type="button"
        size="sm"
        variant="outline"
        onClick={toggle}
        aria-expanded={open}
        aria-controls="overview-package-details"
      >
        {open ? "Hide package details" : "Show package details"}
      </Button>
      <p id="overview-package-details" hidden={!open}>
        A hook owns behavior; a component presents the interaction. Both stay in your Preact app.
      </p>
    </div>
  );
}
