import type { ComponentChildren } from "preact";
import { useState } from "preact/hooks";
import { usePrefersReducedMotion } from "./motion";

export type LogoItem = {
  label: string;
  href?: string;
  children?: ComponentChildren;
};

export const defaultLogos: LogoItem[] = [
  { label: "Northwind" },
  { label: "Helio" },
  { label: "Pixel" },
  { label: "Atlas" },
  { label: "Orbit" },
  { label: "Lumen" },
];

export const LogoMark = ({ logo }: { logo: LogoItem }) => (
  <span class="inline-flex items-center gap-2 text-foreground/60 transition-colors hover:text-foreground">
    {logo.children ?? (
      <span
        aria-hidden="true"
        class="flex size-8 items-center justify-center rounded-md border border-border font-mono text-xs font-semibold"
      >
        {logo.label.slice(0, 2).toUpperCase()}
      </span>
    )}
    <span class="text-base font-semibold tracking-tight">{logo.label}</span>
  </span>
);

export const LogoMarqueeTrack = ({
  logos,
  duration,
  reverse = false,
  label = "Partner logos",
}: {
  logos: LogoItem[];
  duration: string;
  reverse?: boolean;
  label?: string;
}) => {
  const reduce = usePrefersReducedMotion();
  const [paused, setPaused] = useState(false);
  const animationName = reverse ? "kamod-logos-marquee-right" : "kamod-logos-marquee-left";

  return (
    <div
      class="relative overflow-hidden"
      style={{
        maskImage: "linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent)",
      }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusIn={() => setPaused(true)}
      onFocusOut={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setPaused(false);
        }
      }}
    >
      <div
        data-kamod-marquee
        tabIndex={0}
        role="region"
        aria-label={`${label}. Animation pauses while hovered or focused.`}
        class="flex w-max gap-12 outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
        style={{
          animationName: reduce ? "none" : animationName,
          animationDuration: duration,
          animationTimingFunction: "linear",
          animationIterationCount: "infinite",
          animationPlayState: paused || reduce ? "paused" : "running",
        }}
      >
        {logos.map((logo) => (
          <div key={logo.label} class="shrink-0">
            {logo.href ? (
              <a href={logo.href} class="inline-flex" aria-label={logo.label}>
                <LogoMark logo={logo} />
              </a>
            ) : (
              <LogoMark logo={logo} />
            )}
          </div>
        ))}
        {reduce
          ? null
          : logos.map((logo) => (
              <div key={`${logo.label}-dup`} class="shrink-0" aria-hidden="true">
                <LogoMark logo={logo} />
              </div>
            ))}
      </div>
    </div>
  );
};

export const logoMarqueeStyles = `
  @keyframes kamod-logos-marquee-left {
    from { transform: translateX(0); }
    to { transform: translateX(-50%); }
  }
  @keyframes kamod-logos-marquee-right {
    from { transform: translateX(-50%); }
    to { transform: translateX(0); }
  }
  @media (prefers-reduced-motion: reduce) {
    [data-kamod-marquee] {
      animation: none !important;
      transform: none !important;
    }
  }
`;
