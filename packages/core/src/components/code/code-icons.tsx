import type { ComponentChildren, SVGAttributes } from "preact";

type CodeIconProps = SVGAttributes<SVGSVGElement> & { size?: number };

/** Local stroke icons keep the standalone reader independent of an icon catalogue. */
function Icon({ size = 16, children, ...props }: CodeIconProps & { children: ComponentChildren }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {children}
    </svg>
  );
}

export const ChevronIcon = (props: CodeIconProps) => (
  <Icon {...props}>
    <path d="m9 6 6 6-6 6" />
  </Icon>
);
export const WrapIcon = (props: CodeIconProps) => (
  <Icon {...props}>
    <path d="M4 6h16M4 10h12a4 4 0 0 1 0 8h-3m3-3-3 3 3 3M4 14h4M4 18h4" />
  </Icon>
);
export const FoldIcon = (props: CodeIconProps) => (
  <Icon {...props}>
    <path d="M2 12h6m-3-3 3 3-3 3m17-3h-6m3-3-3 3 3 3M12 3v2m0 6v2m0 6v2" />
  </Icon>
);
export const ImportIcon = (props: CodeIconProps) => (
  <Icon {...props}>
    <path d="m12 3 8 4.5v5M12 3 4 7.5v9l8 4.5v-9m-8-4.5 8 4.5 8-4.5M17 15l-3 3 3 3m-3-3h8" />
  </Icon>
);
export const SourceIcon = (props: CodeIconProps) => (
  <Icon {...props}>
    <path d="m7 8-4 4 4 4m10-8 4 4-4 4m-4-11-2 14" />
  </Icon>
);
export const TerminalIcon = (props: CodeIconProps) => (
  <Icon {...props}>
    <path d="m5 7 5 5-5 5m8 0h6" />
  </Icon>
);
export const FileIcon = (props: CodeIconProps) => (
  <Icon {...props}>
    <path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9Zm0 0v6h6M8 13h8m-8 4h5" />
  </Icon>
);
