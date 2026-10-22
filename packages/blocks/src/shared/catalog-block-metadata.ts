import type { CatalogBlockFile } from "./types";

/** Shape shared by catalog registries before components are attached. */
export type CatalogBlockDefinitionData = {
  id: string;
  title: string;
  description: string;
  category: string;
  catalogUrl?: string;
  files: CatalogBlockFile[];
  dependencies: readonly string[];
  uiComponents?: readonly string[];
  tags: readonly string[];
  features?: readonly string[];
  preview: { height: number; fullWidth?: boolean };
  props?: { name: string; type: string; description: string }[];
  usage?: string;
};

/** Docs overview entries without importing live demo components. */
export function mapCatalogDefinitionsToMetadata(
  definitions: readonly CatalogBlockDefinitionData[],
  installPrefix: string,
) {
  return definitions.map((block) => ({
    id: block.id,
    title: block.title,
    description: block.description,
    category: block.category,
    files: block.files.map((file) => ({ label: file.label, path: file.path, kind: file.kind })),
    dependencies: block.dependencies,
    tags: block.tags,
    features: block.features,
    preview: block.preview,
    installCommand: `${installPrefix}/${block.id}`,
    props: block.props ?? [],
    usage: block.usage ?? "",
  }));
}
