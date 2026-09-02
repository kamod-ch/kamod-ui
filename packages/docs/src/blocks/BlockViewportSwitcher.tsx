import { MonitorIcon, SmartphoneIcon, TabletIcon } from "@kamod-ch/icons/shadcn";
import { ToggleGroup, ToggleGroupItem } from "@kamod-ch/ui";

export type BlockPreviewViewport = "desktop" | "tablet" | "mobile";

type BlockViewportSwitcherProps = {
  value: BlockPreviewViewport;
  onValueChange: (value: BlockPreviewViewport) => void;
};

const VIEWPORTS = [
  { value: "mobile" as const, label: "Mobile view", Icon: SmartphoneIcon },
  { value: "tablet" as const, label: "Tablet view", Icon: TabletIcon },
  { value: "desktop" as const, label: "Desktop view", Icon: MonitorIcon },
];

export const BlockViewportSwitcher = ({ value, onValueChange }: BlockViewportSwitcherProps) => (
  <ToggleGroup
    type="single"
    value={value}
    size="sm"
    spacing="none"
    class="blocks-preview-viewport-switcher"
    aria-label="Preview viewport"
    onValueChange={(next) => {
      if (next === "desktop" || next === "tablet" || next === "mobile") {
        onValueChange(next);
      }
    }}
  >
    {VIEWPORTS.map(({ value: viewport, label, Icon }) => (
      <ToggleGroupItem key={viewport} value={viewport} aria-label={label} title={label}>
        <Icon size={16} />
      </ToggleGroupItem>
    ))}
  </ToggleGroup>
);
