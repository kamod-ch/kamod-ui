import type { ComponentType } from "preact";

export type MarketingIcon = ComponentType<{
  size?: number | string;
  class?: string;
  title?: string;
}>;

export type MarketingLink = {
  href: string;
  label: string;
};

export type MarketingAction = {
  label: string;
  href?: string;
  onClick?: () => void;
  variant?: "default" | "outline" | "ghost" | "secondary";
};

export type ContactRow = {
  label: string;
  value: string;
  href?: string;
  icon?: MarketingIcon;
};
