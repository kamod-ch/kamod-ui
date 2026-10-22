import type {
  CatalogAuthBlockId,
  CommerceBlockId,
  CommunicationBlockId,
  DashboardBlockId,
  MarketingBlockId,
} from "@kamod-ch/blocks";
import type { AppSidebarBlockId } from "@kamod-ch/blocks/app-sidebar";
import { getAppSidebarBlockSource } from "./app-sidebar-source";
import { BlockVariantDetail, type VariantSourceLoader } from "./BlockVariantDetail";
import { type BlockCategory, blockCategories, isCatalogBlockCategory } from "./block-categories";
import { getCatalogAuthBlockSource } from "./catalog-auth-source";
import { getCommerceBlockSource } from "./commerce-source";
import { getCommunicationBlockSource } from "./communication-source";
import { getDashboardBlockSource } from "./dashboard-source";
import { getMarketingBlockSource } from "./marketing-source";

const loadCatalogSource: Record<
  import("./block-categories").CatalogBlockCategory,
  (blockId: string, file: string) => Promise<string>
> = {
  "app-sidebar": (blockId, file) =>
    Promise.resolve(getAppSidebarBlockSource(blockId as AppSidebarBlockId, file)),
  auth: (blockId, file) =>
    Promise.resolve(getCatalogAuthBlockSource(blockId as CatalogAuthBlockId, file)),
  marketing: (blockId, file) =>
    Promise.resolve(getMarketingBlockSource(blockId as MarketingBlockId, file)),
  dashboard: (blockId, file) =>
    Promise.resolve(getDashboardBlockSource(blockId as DashboardBlockId, file)),
  communication: (blockId, file) =>
    Promise.resolve(getCommunicationBlockSource(blockId as CommunicationBlockId, file)),
  commerce: (blockId, file) =>
    Promise.resolve(getCommerceBlockSource(blockId as CommerceBlockId, file)),
};

export const BlocksCatalogDetailContent = ({
  category,
  blockId,
}: {
  category: BlockCategory;
  blockId?: string;
}) => {
  if (!isCatalogBlockCategory(category)) {
    return <p>Block not found.</p>;
  }
  const registry = blockCategories[category].blocks.find((entry) => entry.id === blockId);
  const block = registry
    ? ({
        ...registry,
        category,
        files: registry.files ?? [],
        preview: registry.preview ?? { height: 720 },
      } as typeof registry & {
        category: typeof category;
        files: NonNullable<typeof registry.files>;
        preview: { height: number };
      })
    : undefined;
  const loadSource: VariantSourceLoader<string> = (id, file) =>
    loadCatalogSource[category](id, file);
  return <BlockVariantDetail category={category} block={block} loadSource={loadSource} />;
};
