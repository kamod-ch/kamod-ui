import { mapCatalogDefinitionsToMetadata } from "../shared/catalog-block-metadata";
import { definitions } from "./catalog-definitions";

export const dashboardBlockMetadata = mapCatalogDefinitionsToMetadata(
  definitions,
  "@kamod-ch/blocks/dashboard",
);
