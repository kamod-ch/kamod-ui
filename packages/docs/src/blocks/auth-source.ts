/** Loaded only when an authentication source file is requested. */
import type { AuthBlockId } from "@kamod-ch/blocks";
import { loginBlockMetadata } from "../../../blocks/src/login/metadata";
import { signupBlockMetadata } from "../../../blocks/src/signup/metadata";
import { sourceFromManifest } from "./source-manifest";

const sources = import.meta.glob<string>(
  [
    "../../../blocks/src/login/*/{page,login-form}.tsx",
    "../../../blocks/src/signup/*/{page,signup-form}.tsx",
    "../../../blocks/src/auth/shared/*.{ts,tsx,svg}",
  ],
  { query: "?raw", import: "default", eager: true },
);
const blocks = [...loginBlockMetadata, ...signupBlockMetadata];

export function getAuthBlockSource(id: AuthBlockId, label: string): string {
  const block = blocks.find((entry) => entry.id === id);
  return sourceFromManifest(block?.files ?? [], label, sources);
}
