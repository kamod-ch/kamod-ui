import { cloneElement, type SVGAttributes, type VNode } from "preact";
import "./state-icon.css";

/** Keep decorative SVG nodes mounted while one state is visible, without effects or timers. */
export function StateIcon({
  active,
  class: className = "",
  children,
}: {
  active: number;
  class?: string;
  children: readonly VNode<SVGAttributes<SVGSVGElement>>[];
}) {
  return (
    <span class={`docs-state-icon ${className}`.trim()} aria-hidden="true">
      {children.map((icon, index) =>
        cloneElement(icon, {
          class: `${icon.props.class ?? ""} docs-state-icon-item`.trim(),
          "data-active": index === active,
          "aria-hidden": true,
          focusable: false,
        }),
      )}
    </span>
  );
}
