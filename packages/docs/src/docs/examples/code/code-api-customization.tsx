import type { ApiReferenceSection } from "../../components/ApiReference";

/** Keep the opt-in composition API together rather than scattering it across legacy rows. */
export const codeCustomizationApi: readonly ApiReferenceSection[] = [
  {
    title: "Code",
    description: "Modularity: hide presentation, share state or replace individual controls.",
    rows: [
      {
        prop: "showToolbar",
        type: "boolean",
        defaultValue: "true",
        description: (
          <>
            Show the header, file label and Copy action. When false, eligible reading controls
            remain in their own row. <code>renderToolbar</code> is not called.
          </>
        ),
      },
      {
        prop: "highlight",
        type: "boolean",
        defaultValue: "true",
        description: (
          <>
            Allow deferred syntax highlighting. False preserves escaped source, selected language,
            copying and reading behavior without loading the highlighter for this instance.
          </>
        ),
      },
      {
        prop: "syntaxTheme",
        type: "CodeSyntaxTheme",
        defaultValue: '"default"',
        description: (
          <>
            One of <code>default</code>, <code>dusk</code>, <code>forest</code> or{" "}
            <code>monochrome</code>. Changes source token styling; surface variants and application
            appearance remain independent.
          </>
        ),
      },
      {
        prop: "wrapped",
        type: "boolean",
        defaultValue: "Uncontrolled",
        description: (
          <>
            Control wrapping externally. Takes precedence over <code>defaultWrapped</code>; works
            even with the wrap control hidden.
          </>
        ),
      },
      {
        prop: "onWrappedChange",
        type: "(wrapped: boolean) => void",
        defaultValue: "—",
        description: (
          <>
            Receives a requested wrap change in either ownership mode. In controlled mode, update{" "}
            <code>wrapped</code> to apply it.
          </>
        ),
      },
      {
        prop: "importsCollapsed",
        type: "boolean",
        defaultValue: "Uncontrolled",
        description: (
          <>
            Control eligible import folding externally. Takes precedence over its default and
            survives source changes. <code>showImportControl=false</code> disables folding.
          </>
        ),
      },
      {
        prop: "onImportsCollapsedChange",
        type: "(collapsed: boolean) => void",
        defaultValue: "—",
        description: (
          <>
            Receives a requested folding change. Automatic uncontrolled resets on source changes do
            not call it.
          </>
        ),
      },
      {
        prop: "renderImportControl",
        type: "(context: CodeImportControlContext) => ComponentChildren",
        defaultValue: "Standard import button",
        description: (
          <>
            Replace or decorate an eligible import control. Return <code>null</code> to hide the
            button while retaining controlled folding.
          </>
        ),
      },
      {
        prop: "renderWrapControl",
        type: "(context: CodeWrapControlContext) => ComponentChildren",
        defaultValue: "Standard wrap switch",
        description: (
          <>
            Replace or decorate an eligible wrap control. Return <code>null</code> to omit its
            presentation without changing the preference.
          </>
        ),
      },
      {
        prop: "renderCopyAction",
        type: "(context: CodeCopyActionContext) => ComponentChildren",
        defaultValue: "Standard copy button",
        description: (
          <>
            Replace the clipboard button while retaining Code’s clipboard lifecycle and live status
            region. Requires both <code>showCopy</code> and <code>showToolbar</code>.
          </>
        ),
      },
      {
        prop: "beforeCode / afterCode",
        type: "ComponentChildren",
        defaultValue: "—",
        description: (
          <>
            Prepared Preact content around the source or rendered document. The before slot follows
            the reading controls. Slot content is never copied.
          </>
        ),
      },
    ],
  },
  {
    title: "Code",
    description: "Renderer contexts: use the supplied action once and preserve accessible labels.",
    rows: [
      {
        prop: "codeId",
        type: "string",
        defaultValue: "Generated per instance",
        description: (
          <>
            Source element ID available to every renderer. Use it for <code>aria-controls</code> in
            source views.
          </>
        ),
      },
      {
        prop: "defaultControl",
        type: "ComponentChildren",
        defaultValue: "Built-in control",
        description: (
          <>
            Render the default button or switch once to add surrounding context without rebuilding
            it. Do not nest it inside another interactive control.
          </>
        ),
      },
      {
        prop: "collapsed / count / onCollapsedChange",
        type: "CodeImportControlContext",
        defaultValue: "Current import state",
        description: (
          <>
            Current collapsed preference, complete statement count and change action. Use{" "}
            <code>{"aria-expanded={!collapsed}"}</code> on a replacement disclosure.
          </>
        ),
      },
      {
        prop: "wrapped / onWrappedChange",
        type: "CodeWrapControlContext",
        defaultValue: "Current wrap state",
        description: (
          <>
            Current preference and change action. A custom toggle button should expose{" "}
            <code>aria-pressed</code>.
          </>
        ),
      },
      {
        prop: "status / statusId / copy",
        type: "CodeCopyActionContext",
        defaultValue: '"idle"',
        description: (
          <>
            Copy status is <code>idle | copying | copied | error</code>. Call{" "}
            <code>copy(): Promise&lt;void&gt;</code> to use the existing clipboard flow.{" "}
            <code>statusId</code> identifies its retained live region.
          </>
        ),
      },
    ],
  },
];
