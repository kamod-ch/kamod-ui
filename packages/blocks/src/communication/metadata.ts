import { mapCatalogDefinitionsToMetadata } from "../shared/catalog-block-metadata";
import { definitions } from "./catalog-definitions";

export const communicationBlockMetadata = mapCatalogDefinitionsToMetadata(
  definitions,
  "@kamod-ch/blocks/communication",
);
