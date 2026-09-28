/** Small source-backed reference for the copied helpers, not props on the zero-prop page wrappers. */

import authSource from "../../../../blocks/src/auth/shared/auth-utils.ts?raw";
import { sidebarBlockMetadata } from "../../../../blocks/src/sidebar/metadata";
import { getVariantFieldDescription } from "./variant-field-descriptions";

const sidebarSources = import.meta.glob<string>(
  [
    "../../../../blocks/src/sidebar/shared/*.{ts,tsx}",
    "../../../../blocks/src/sidebar/data/*.{ts,tsx}",
  ],
  { query: "?raw", import: "default", eager: true },
);

const forms = import.meta.glob<string>(
  [
    "../../../../blocks/src/login/*/login-form.tsx",
    "../../../../blocks/src/signup/*/signup-form.tsx",
  ],
  { query: "?raw", import: "default", eager: true },
);

export type GuideField = { name: string; type: string; required: boolean; description: string };
export type GuideType = {
  name: string;
  title: string;
  description: string;
  source: string;
  fields: GuideField[];
};

/** Only the checked-in, semicolon-terminated aliases used below are supported. Fail on source drift. */
function definition(source: string, name: string): string {
  const match = source.match(
    new RegExp(`^export type ${name} = (?:[^\\n]+;$|[^\\n]*\\{\\n[\\s\\S]*?^};)`, "m"),
  );
  if (!match) throw new Error(`Missing or unsupported guide type: ${name}`);
  return match[0];
}

function reference(source: string, name: string, title: string, description: string): GuideType {
  const text = definition(source, name);
  const body = text.includes("{")
    ? text.slice(text.indexOf("{") + 1, text.lastIndexOf("}")).replace(/\/\*[\s\S]*?\*\//g, "")
    : "";
  const fields = body
    .split(";")
    .map((field) => field.trim())
    .filter(Boolean)
    .map((field) => {
      const match = field.match(/^(\w+)(\?)?:\s*([\s\S]+)$/);
      if (!match) throw new Error(`Unsupported guide field: ${name}.${field}`);
      const type = match[3].replace(/\s+/g, " ").trim();
      return {
        name: match[1],
        required: !match[2],
        type,
        description: getVariantFieldDescription(name, match[1], type),
      };
    });
  return { name, title, description, source: text, fields };
}

/** Each form's own signature is read, so email-only login and social signup cannot drift silently. */
export function getVariantApi(category: "sidebar" | "login" | "signup", id: string): GuideType[] {
  if (category === "sidebar") {
    const files = sidebarBlockMetadata.find((block) => block.id === id)?.files;
    if (!files) throw new Error(`Unknown sidebar: ${id}`);
    return files.flatMap((file) => {
      const source = sidebarSources[`../../../../blocks/${file.path}`];
      if (!source) return [];
      return [...source.matchAll(/^export type (\w+) =/gm)].map((match) => {
        const name = match[1];
        return reference(
          source,
          name,
          name.replace(/([a-z])([A-Z])/g, "$1 $2"),
          name.endsWith("Props")
            ? `Local helper inputs from ${file.label}. These configure the helper inside the copied page, not the exported variant itself.`
            : `Data shape from ${file.label}. Supply real application values using the required and optional fields below.`,
        );
      });
    });
  }
  const source = forms[`../../../../blocks/src/${category}/${id}/${category}-form.tsx`];
  if (!source) throw new Error(`Missing form source: ${id}`);
  const signup = category === "signup";
  const values = signup ? "SignupValues" : id === "login-05" ? "MagicLinkValues" : "LoginValues";
  return [
    reference(
      source,
      signup ? "SignupFormProps" : "LoginFormProps",
      "Complete form signature",
      "The local form accepts optional callbacks and destination links. The exported page wrapper takes no props and does not forward these callbacks.",
    ),
    reference(
      authSource,
      values,
      "Submission values",
      signup
        ? "Passed to onSubmit after local validation. Terms acceptance is kept separately and is not included in this payload."
        : "Passed to onSubmit after local validation. Your service remains responsible for completing the authentication flow.",
    ),
    reference(
      authSource,
      "AuthProvider",
      "Social provider",
      "The shared union includes gitlab, but the current forms render only GitHub and Google buttons. Adding another provider requires adding its UI and handler.",
    ),
  ];
}
