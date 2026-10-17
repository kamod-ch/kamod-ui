import type { CodeReferenceHelp } from "../src/references/types";

type Resources = NonNullable<CodeReferenceHelp["related"]>;

/**
 * Authored snapshots reviewed against the official guides on 2026-10-17.
 * These links are provenance and continuation destinations, never fetch instructions.
 * Chapters live in the technology catalogs and are serialized into the lazy help family.
 */
const resources: Record<string, Resources> = {
  Tailwind: [
    {
      label: "Getting started",
      href: "https://tailwindcss.com/docs/installation/using-vite",
      kind: "guide",
    },
    {
      label: "Tailwind CLI",
      href: "https://tailwindcss.com/docs/installation/tailwind-cli",
      kind: "guide",
    },
    {
      label: "Utility classes",
      href: "https://tailwindcss.com/docs/styling-with-utility-classes",
      kind: "guide",
    },
    {
      label: "Theme variables",
      href: "https://tailwindcss.com/docs/theme",
      kind: "guide",
    },
    {
      label: "Source detection",
      href: "https://tailwindcss.com/docs/detecting-classes-in-source-files",
      kind: "guide",
    },
  ],
  Vite: [
    { label: "Getting started", href: "https://vite.dev/guide/", kind: "guide" },
    { label: "Features", href: "https://vite.dev/guide/features", kind: "guide" },
    { label: "CLI", href: "https://vite.dev/guide/cli", kind: "guide" },
    { label: "Configuration", href: "https://vite.dev/config/", kind: "guide" },
    { label: "Plugins", href: "https://vite.dev/guide/using-plugins", kind: "guide" },
    {
      label: "Environments",
      href: "https://vite.dev/guide/api-environment#environments-configuration",
      kind: "guide",
    },
  ],
  Valibot: [
    {
      label: "Introduction",
      href: "https://valibot.dev/guides/introduction/",
      kind: "guide",
    },
    {
      label: "Installation",
      href: "https://valibot.dev/guides/installation/",
      kind: "guide",
    },
    { label: "API reference", href: "https://valibot.dev/api/", kind: "guide" },
    {
      label: "Quick start",
      href: "https://valibot.dev/guides/quick-start/",
      kind: "guide",
    },
    {
      label: "Parse data",
      href: "https://valibot.dev/guides/parse-data/",
      kind: "guide",
    },
  ],
};

export function technologyReferenceResources(name: string): Resources {
  return Object.hasOwn(resources, name) ? resources[name] : [];
}
