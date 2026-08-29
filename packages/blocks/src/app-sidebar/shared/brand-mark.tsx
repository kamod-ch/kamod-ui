export const AppBrandMark = ({ size = "md" }: { size?: "sm" | "md" }) => (
  <svg
    viewBox="0 0 24 24"
    class={size === "sm" ? "size-3.5" : "size-4"}
    fill="currentColor"
    aria-hidden="true"
  >
    <rect x="2" y="2" width="9" height="9" rx="1.5" />
    <rect x="13" y="2" width="9" height="9" rx="1.5" opacity="0.55" />
    <rect x="2" y="13" width="9" height="9" rx="1.5" opacity="0.55" />
    <rect x="13" y="13" width="9" height="9" rx="1.5" />
  </svg>
);
