import type { PackageTeaserConfig } from "../../pages/kamod-package-doc-factory";
import { packageGuideDetails } from "./package-guide-details";
import { packageGuidePractices } from "./package-guide-practices";
import { packageGuideRecipes } from "./package-guide-recipes";

/** Generate one portable reference from the same content displayed in the guide. */
export function packageGuideReference(config: PackageTeaserConfig): string {
  const details = packageGuideDetails[config.slug];
  const practice = packageGuidePractices[config.slug];
  const recipe = packageGuideRecipes[config.slug];
  return (
    [
      `# ${config.title} — integration reference`,
      config.lead,
      `Package: ${config.packagePath}`,
      "## Choose an approach",
      details.purpose,
      ...practice.choices.map(
        ({ need, approach, boundary }) => `### ${need}\n\n${approach}\n\n${boundary}`,
      ),
      "## Installation",
      config.installationText,
      `\`\`\`bash\n${config.command}\n\`\`\``,
      "## Starting example",
      `\`\`\`tsx\n${config.quickStart.import}\n\n${config.quickStart.usage}\n\`\`\``,
      ...recipe.steps.map(
        ({ title, code, note }) => `### ${title}\n\n${note}\n\n\`\`\`tsx\n${code}\n\`\`\``,
      ),
      `## ${recipe.title}`,
      recipe.introduction,
      `File: ${recipe.file}\n\n\`\`\`tsx\n${recipe.code}\n\`\`\``,
      recipe.result,
      "## Ownership and environment",
      practice.ownership,
      practice.environment,
      details.outcome,
      "## Troubleshooting",
      ...practice.failures.map(({ symptom, check }) => `### ${symptom}\n\n${check}`),
      "## Resources",
      `- [Documentation](${config.externalDocsUrl})\n- [Source](${config.githubUrl})\n- [npm](${config.npmUrl})`,
      "attribution" in practice
        ? `## Attribution\n\n${practice.attribution.text}\n\n[${practice.attribution.label}](${practice.attribution.href})`
        : "",
    ]
      .filter(Boolean)
      .join("\n\n") + "\n"
  );
}
