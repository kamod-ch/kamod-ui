import { mapCatalogDefinitionsToMetadata } from "../shared/catalog-block-metadata";
import { definitions } from "./catalog-definitions";

export const marketingBlockMetadata = mapCatalogDefinitionsToMetadata(
  definitions,
  "@kamod-ch/blocks/marketing",
);
