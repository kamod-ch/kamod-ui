import type { PreviewAppearance } from "../blocks/preview-appearance";
import { ShowcaseLoading } from "../docs/components/ShowcaseLoading";

export function WorkspaceLoading({
  view,
  appearance,
}: {
  view: "preview" | "code" | "prompt";
  appearance: PreviewAppearance;
}) {
  return <ShowcaseLoading appearance={appearance} view={view} className="home-workspace-loading" />;
}
