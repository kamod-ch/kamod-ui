import { MonitorIcon, SmartphoneIcon, TabletIcon } from "@kamod-ch/icons/shadcn";
import { ToggleGroup, ToggleGroupItem } from "@kamod-ch/ui";

export type BlockPreviewViewport = "desktop" | "tablet" | "mobile";

/** Mobile fits narrower containers; tablet uses its 768px frame, desktop the docs' 980px breakpoint. */
export const BLOCK_VIEWPORT_MIN_WIDTH = { mobile: 0, tablet: 768, desktop: 980 } as const;

/** Clamp the rendered mode without replacing the user's saved preference when the page narrows. */
export function fitBlockViewport(value: BlockPreviewViewport, width: number): BlockPreviewViewport {
  if (width >= BLOCK_VIEWPORT_MIN_WIDTH[value]) return value;
  return width >= BLOCK_VIEWPORT_MIN_WIDTH.tablet ? "tablet" : "mobile";
}

type BlockViewportSwitcherProps = {
  value: BlockPreviewViewport;
  availableWidth?: number;
  onValueChange: (value: BlockPreviewViewport) => void;
};

const VIEWPORTS = [
  { value: "mobile" as const, label: "Mobile view", Icon: SmartphoneIcon },
  { value: "tablet" as const, label: "Tablet view", Icon: TabletIcon },
  { value: "desktop" as const, label: "Desktop view", Icon: MonitorIcon },
];

export const BlockViewportSwitcher = ({
  value,
  availableWidth = Infinity,
  onValueChange,
}: BlockViewportSwitcherProps) => (
  <ToggleGroup
    type="single"
    value={value}
    size="sm"
    spacing="none"
    class="blocks-preview-viewport-switcher"
    aria-label="Preview viewport"
    aria-orientation={undefined} // A named group does not support aria-orientation.
    onValueChange={(next) => {
      if (next === "desktop" || next === "tablet" || next === "mobile") {
        onValueChange(next);
      }
    }}
  >
    {VIEWPORTS.map(({ value: viewport, label, Icon }) => {
      const disabled = availableWidth < BLOCK_VIEWPORT_MIN_WIDTH[viewport];
      return (
        <ToggleGroupItem
          key={viewport}
          value={viewport}
          aria-label={label}
          disabled={disabled}
          title={
            disabled
              ? `${label} requires at least ${BLOCK_VIEWPORT_MIN_WIDTH[viewport]}px of showcase space`
              : label
          }
        >
          <Icon size={16} aria-hidden="true" />
        </ToggleGroupItem>
      );
    })}
  </ToggleGroup>
);
