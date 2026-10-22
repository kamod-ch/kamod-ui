import { mapCatalogDefinitionsToMetadata } from "../shared/catalog-block-metadata";
import { definitions } from "./catalog-definitions";

export const catalogAuthBlockMetadata = mapCatalogDefinitionsToMetadata(
  definitions,
  "@kamod-ch/blocks/auth",
);
