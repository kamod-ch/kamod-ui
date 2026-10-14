import type { ComponentType } from "preact";
import { CodeColorModeGuide } from "./code-guide-color-mode";
import { CodeInstallationGuide, CodeUsageGuide } from "./code-guide-foundations";
import {
  CodeCustomizationGuide,
  CodePerformanceGuide,
  CodeTroubleshootingGuide,
} from "./code-guide-integration";
import { CodeLanguageGuide } from "./code-guide-languages";
import { CodeModularityGuide } from "./code-guide-modularity";
import { CodeCopyGuide, CodeReadingGuide } from "./code-guide-reading";
import { CodeReferenceGuide } from "./code-guide-references";
import { CodeSyntaxThemeGuide } from "./code-guide-themes";

const guides: Readonly<Record<string, ComponentType | undefined>> = {
  installation: CodeInstallationGuide,
  usage: CodeUsageGuide,
  modularity: CodeModularityGuide,
  "language-detection": CodeLanguageGuide,
  "color-mode": CodeColorModeGuide,
  "syntax-themes": CodeSyntaxThemeGuide,
  "reading-behavior": CodeReadingGuide,
  "source-links": CodeReferenceGuide,
  "copy-and-content": CodeCopyGuide,
  customization: CodeCustomizationGuide,
  performance: CodePerformanceGuide,
  troubleshooting: CodeTroubleshootingGuide,
};

/** Resolve only the requested guide; examples and API sections supply their own content. */
export function CodeGuideContent({ sectionId }: { sectionId: string }) {
  const Guide = Object.hasOwn(guides, sectionId) ? guides[sectionId] : undefined;
  return Guide ? <Guide /> : null;
}
