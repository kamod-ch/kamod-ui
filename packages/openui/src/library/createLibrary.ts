import { createLibrary, type DefinedComponent, type Library } from "@openuidev/react-lang";
import {
  accordionComponent,
  alertComponent,
  badgeComponent,
  buttonComponent,
  cardComponent,
  checkboxComponent,
  dividerComponent,
  fieldComponent,
  formComponent,
  gridComponent,
  headingComponent,
  inlineComponent,
  inputComponent,
  linkComponent,
  progressComponent,
  selectComponent,
  skeletonComponent,
  stackComponent,
  submitButtonComponent,
  switchComponent,
  tabsComponent,
  textareaComponent,
  textComponent,
} from "../components";
import {
  type KamodOpenUISecurityPolicy,
  type ResolvedSecurityPolicy,
  resolveSecurityPolicy,
} from "../security/limits";
import type { NavigationPolicy } from "../security/navigation";

export type KamodOpenUIComponentKey =
  | "stack"
  | "inline"
  | "grid"
  | "card"
  | "heading"
  | "text"
  | "divider"
  | "alert"
  | "badge"
  | "progress"
  | "skeleton"
  | "button"
  | "link"
  | "tabs"
  | "accordion"
  | "form"
  | "field"
  | "input"
  | "textarea"
  | "select"
  | "checkbox"
  | "switch"
  | "submitButton";

// OpenUI's DefinedComponent default props type is Record<string, unknown>; cast for the registry map.
const ALL_COMPONENTS: Record<KamodOpenUIComponentKey, DefinedComponent<any>> = {
  stack: stackComponent,
  inline: inlineComponent,
  grid: gridComponent,
  card: cardComponent,
  heading: headingComponent,
  text: textComponent,
  divider: dividerComponent,
  alert: alertComponent,
  badge: badgeComponent,
  progress: progressComponent,
  skeleton: skeletonComponent,
  button: buttonComponent,
  link: linkComponent,
  tabs: tabsComponent,
  accordion: accordionComponent,
  form: formComponent,
  field: fieldComponent,
  input: inputComponent,
  textarea: textareaComponent,
  select: selectComponent,
  checkbox: checkboxComponent,
  switch: switchComponent,
  submitButton: submitButtonComponent,
};

export type KamodOpenUIConfig = {
  components?: Partial<Record<KamodOpenUIComponentKey, boolean>>;
  security?: KamodOpenUISecurityPolicy;
  navigation?: NavigationPolicy;
  root?: string;
  extend?: DefinedComponent<any>[];
};

export type KamodOpenUILibrary = Library & {
  security: ResolvedSecurityPolicy;
  navigation: NavigationPolicy;
};

function selectComponents(config: KamodOpenUIConfig = {}): DefinedComponent<any>[] {
  const flags = config.components;
  const selected = (Object.keys(ALL_COMPONENTS) as KamodOpenUIComponentKey[])
    .filter((key) => flags?.[key] !== false)
    .map((key) => ALL_COMPONENTS[key]);

  if (config.extend?.length) {
    return [...selected, ...config.extend];
  }
  return selected;
}

/**
 * Create a Kamod OpenUI library. Does not mutate the default library.
 */
export function createKamodOpenUILibrary(config: KamodOpenUIConfig = {}): KamodOpenUILibrary {
  const components = selectComponents(config);
  const library = createLibrary({
    components,
    root: config.root ?? "Stack",
    componentGroups: [
      {
        name: "Layout",
        components: ["Stack", "Inline", "Grid", "Card"],
        notes: ["Prefer Stack for vertical sections. Avoid deep nesting beyond a few levels."],
      },
      {
        name: "Content",
        components: ["Heading", "Text", "Divider"],
      },
      {
        name: "Feedback",
        components: ["Alert", "Badge", "Progress", "Skeleton"],
      },
      {
        name: "Actions",
        components: ["Button", "Link", "Tabs", "Accordion"],
      },
      {
        name: "Forms",
        components: [
          "Form",
          "Field",
          "Input",
          "Textarea",
          "Select",
          "Checkbox",
          "Switch",
          "SubmitButton",
        ],
        notes: ["Use Form with named fields and a SubmitButton. No custom validators or regex."],
      },
    ],
  }) as KamodOpenUILibrary;

  library.security = resolveSecurityPolicy(config.security);
  library.navigation = config.navigation ?? { allowExternal: false };

  return library;
}

/** Default secure Kamod OpenUI library with the full MVP component set. */
export const kamodOpenUILibrary = createKamodOpenUILibrary();

export { ALL_COMPONENTS };
