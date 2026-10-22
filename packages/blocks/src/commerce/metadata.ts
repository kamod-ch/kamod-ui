import { mapCatalogDefinitionsToMetadata } from "../shared/catalog-block-metadata";
import { definitions } from "./catalog-definitions";

export const commerceBlockMetadata = mapCatalogDefinitionsToMetadata(
  definitions,
  "@kamod-ch/blocks/commerce",
);
