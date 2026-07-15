import type { ComponentType } from "preact";

export type AuthBlockCategory = "login" | "signup";
export type LoginBlockId = "login-01" | "login-02" | "login-03" | "login-04" | "login-05";
export type SignupBlockId = "signup-01" | "signup-02" | "signup-03" | "signup-04" | "signup-05";
export type AuthBlockId = LoginBlockId | SignupBlockId;

export type BlockFile = {
  path: string;
  label: string;
  kind: "component" | "support" | "registry" | "page" | "asset";
};

export type BlockDefinition = {
  id: AuthBlockId;
  title: string;
  description: string;
  category: AuthBlockCategory;
  component: ComponentType;
  files: BlockFile[];
  dependencies: string[];
  uiComponents: string[];
  tags: string[];
  features: string[];
  preview: { height: number; fullWidth: boolean };
  installCommand: string;
};
