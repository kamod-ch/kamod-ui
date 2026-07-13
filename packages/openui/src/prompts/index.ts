import type { Library } from "@openuidev/react-lang";
import { kamodOpenUILibrary } from "../library/createLibrary";

export type CreateKamodOpenUISystemPromptOptions = {
  library?: Library;
  includeExamples?: boolean;
  additionalInstructions?: string[];
  preamble?: string;
};

const DEFAULT_PREAMBLE = `You generate user interfaces using OpenUI Lang for the Kamod UI design system.
Only emit OpenUI Lang. Do not wrap output in Markdown code fences.
Only use registered components. Do not invent components, HTML tags, CSS classes, or JavaScript.
Prefer simple structures over complex nesting.
Actions must stay declarative (event/submit/navigate). Never emit executable code.`;

const DEFAULT_EXAMPLES = [
  `root = Stack([card], "md")
card = Card([badge, text, progress, btn], "Status")
badge = Badge("Healthy", "success")
text = Text("All systems operational.")
progress = Progress(80)
btn = Button("Refresh", "default", "md", false, { type: "event", name: "refresh" })`,
  `root = Form("contact", [email, message, consent, submit])
email = Input("email", "Email", "email")
message = Textarea("message", "Message")
consent = Checkbox("consent", "I agree to be contacted")
submit = SubmitButton("Send")`,
];

/**
 * Build a system prompt from a Kamod OpenUI library.
 * Delegates to `library.prompt()` from `@openuidev/react-lang`.
 */
export function createKamodOpenUISystemPrompt(
  options: CreateKamodOpenUISystemPromptOptions = {},
): string {
  const library = options.library ?? kamodOpenUILibrary;
  return library.prompt({
    preamble: options.preamble ?? DEFAULT_PREAMBLE,
    additionalRules: [
      "Do not invent unknown components.",
      "Do not emit Markdown code blocks.",
      "Do not use free-form className, style, or arbitrary CSS.",
      "Prefer relative navigate targets; external URLs may be blocked.",
      "Keep forms simple: named fields, required flags, and SubmitButton.",
      ...(options.additionalInstructions ?? []),
    ],
    examples: options.includeExamples === false ? undefined : DEFAULT_EXAMPLES,
    toolCalls: false,
    bindings: true,
  });
}

/** Static prompt for the default library (server/CLI friendly). */
export const kamodOpenUISystemPrompt = createKamodOpenUISystemPrompt({
  includeExamples: true,
});
