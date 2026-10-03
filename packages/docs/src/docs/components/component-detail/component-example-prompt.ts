import type { BlockPromptMode } from "../../../blocks/block-prompts";

export type ComponentPromptContext = {
  title: string;
  description: string;
  command: string;
  documentationUrl: string;
  sourceUrl: string;
  filePath: string;
  codeSnippet: string;
};

/** Use the displayed snippet verbatim; do not imply abbreviated examples are complete source files. */
export function createComponentExamplePrompt(
  context: ComponentPromptContext,
  mode: BlockPromptMode,
) {
  const { title, description, command, documentationUrl, sourceUrl, filePath, codeSnippet } =
    context;
  // A longer fence keeps examples containing Markdown fences intact when copied or rendered.
  const fence = "`".repeat(
    Math.max(3, ...[...codeSnippet.matchAll(/`+/g)].map(([run]) => run.length + 1)),
  );
  return `# ${title} — ${mode === "setup" ? "Set up and integrate" : "Adapt an existing example"}

${description}

${
  mode === "setup"
    ? `Integrate this ${title} example into my existing Preact application. Use the reference snippet below and inspect the linked documentation before completing any omitted code.`
    : `Adapt my existing ${title} implementation using the reference snippet below.\n\n- Requested change: [describe the outcome]\n- Keep unchanged: [existing behavior and styling]\n- Application data and callbacks: [describe the integration]`
}

## Inspect the project first
1. Read the project instructions, package.json, existing components, routes and global styles. Preserve unrelated work and use the project's package manager.
2. This example uses TypeScript and Preact. Verify installed component APIs and imports; do not add React-only replacements or invent unsupported props.
3. Reuse existing Kamod components. The documented installation command is \`${command}\`; inspect existing dependencies and install only what is missing. Local \`@/components/kamod-ui/*\` imports require matching files or adaptation to the installed package exports.

## ${mode === "setup" ? "Set up the example" : "Make the focused change"}
1. ${mode === "setup" ? `Use ${filePath} as a suggested destination, adapting it to the app's conventions. Mount the example in an appropriate existing screen.` : "Locate the existing implementation and preserve its state, callbacks and public API unless the requested change requires otherwise."}
2. The snippet may be an excerpt, include placeholders or reference helpers from the documentation. Resolve those from the linked source; do not treat this as a complete component source bundle.
3. Preserve the existing Tailwind CSS v4 and Kamod theme setup. If setup is missing, follow the theming and CSS guides; import the global theme once and confirm source detection.
4. Replace sample data and callbacks with the app's real integration. Keep semantic color tokens, accessible names, focus behavior and keyboard interaction. For forms, preserve validation and error handling; demo success is not a real submission service.

## Verify the result
- Check narrow and wide containers, light and dark appearance, keyboard navigation and visible focus.
- Exercise relevant disabled, loading, empty and error states. Verify overlay positioning and focus return where applicable.
- Run the project's relevant type, lint and test checks. Summarize the changed files, remaining placeholders and any setup steps.

## References
- Component documentation: ${documentationUrl}
- Source reference: ${sourceUrl}
- Theming and Tailwind: https://ui.kamod.ch/docs/theming/installation
- CSS setup: https://ui.kamod.ch/docs/theming/css-setup

## Example snippet — ${filePath}
${fence}tsx
${codeSnippet}
${fence}
`;
}
