export type NavigationPolicy = {
  allowExternal?: boolean;
  allowedOrigins?: string[];
  allowedProtocols?: Array<"https:" | "http:">;
};

export type NavigationDecision =
  | { allowed: true; href: string; external: boolean }
  | { allowed: false; reason: string };

const DEFAULT_PROTOCOLS: Array<"https:" | "http:"> = ["https:", "http:"];

/**
 * Validate a navigate/open_url target against a host navigation policy.
 * Relative internal URLs are allowed by default; external URLs are blocked.
 */
export function validateNavigationTarget(
  target: string,
  policy: NavigationPolicy = {},
  baseOrigin?: string,
): NavigationDecision {
  const trimmed = target.trim();
  if (!trimmed) {
    return { allowed: false, reason: "Empty navigation target" };
  }

  const lower = trimmed.toLowerCase();
  if (
    lower.startsWith("javascript:") ||
    lower.startsWith("data:") ||
    lower.startsWith("vbscript:") ||
    lower.startsWith("blob:")
  ) {
    return { allowed: false, reason: `Blocked protocol in URL: ${trimmed.slice(0, 32)}` };
  }

  // Relative / same-app paths and hash links
  if (trimmed.startsWith("/") || trimmed.startsWith("#") || trimmed.startsWith("?")) {
    return { allowed: true, href: trimmed, external: false };
  }

  // Protocol-relative URLs are treated as external
  if (trimmed.startsWith("//")) {
    if (!policy.allowExternal) {
      return { allowed: false, reason: "External URLs are not allowed" };
    }
  }

  let parsed: URL;
  try {
    parsed = new URL(trimmed, baseOrigin ?? "https://localhost");
  } catch {
    return { allowed: false, reason: "Invalid URL" };
  }

  const protocols = policy.allowedProtocols ?? DEFAULT_PROTOCOLS;
  const isAbsolute = /^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(trimmed) || trimmed.startsWith("//");

  if (!isAbsolute) {
    // Path-like relative without leading slash (e.g. "settings")
    return { allowed: true, href: trimmed, external: false };
  }

  if (!protocols.includes(parsed.protocol as "https:" | "http:")) {
    return { allowed: false, reason: `Protocol not allowed: ${parsed.protocol}` };
  }

  const origin = parsed.origin;
  const isExternal = baseOrigin ? origin !== new URL(baseOrigin).origin : true;

  if (isExternal) {
    if (!policy.allowExternal) {
      return { allowed: false, reason: "External URLs are not allowed" };
    }
    if (policy.allowedOrigins && policy.allowedOrigins.length > 0) {
      if (!policy.allowedOrigins.includes(origin)) {
        return { allowed: false, reason: `Origin not in allowlist: ${origin}` };
      }
    }
  }

  return { allowed: true, href: parsed.href, external: isExternal };
}

export type MediaUrlDecision = { allowed: true; href: string } | { allowed: false; reason: string };

/**
 * Validate image/video/avatar media URLs.
 * Allows https/http absolute URLs and relative paths; blocks javascript/data/blob/vbscript.
 */
export function validateMediaUrl(target: string, policy: NavigationPolicy = {}): MediaUrlDecision {
  const decision = validateNavigationTarget(target, {
    allowExternal: policy.allowExternal ?? true,
    allowedOrigins: policy.allowedOrigins,
    allowedProtocols: policy.allowedProtocols ?? ["https:", "http:"],
  });
  if (!decision.allowed) {
    return { allowed: false, reason: decision.reason };
  }
  return { allowed: true, href: decision.href };
}
