import { describe, expect, it } from "vitest";
import {
  appSidebarBlocks,
  authBlocks,
  canUseDOM,
  catalogAuthBlocks,
  commerceBlocks,
  communicationBlocks,
  dashboardBlocks,
  marketingBlocks,
  NativeLink,
  toDateKey,
} from "../index";

describe("root barrel includes shared foundations", () => {
  it("still exposes the existing auth registry", () => {
    expect(authBlocks).toHaveLength(10);
  });

  it("exposes the marketing registry", () => {
    expect(marketingBlocks).toHaveLength(14);
  });

  it("exposes the catalog auth registry", () => {
    expect(catalogAuthBlocks).toHaveLength(7);
  });

  it("exposes the dashboard registry", () => {
    expect(dashboardBlocks).toHaveLength(15);
  });

  it("exposes the communication registry", () => {
    expect(communicationBlocks).toHaveLength(4);
  });

  it("exposes the commerce registry", () => {
    expect(commerceBlocks).toHaveLength(3);
  });

  it("exposes the app-sidebar registry without replacing the existing sidebar catalog", () => {
    expect(appSidebarBlocks).toHaveLength(7);
  });

  it("exports shared helpers from the package root", () => {
    expect(typeof canUseDOM).toBe("function");
    expect(typeof NativeLink).toBe("function");
    expect(toDateKey(new Date("2026-08-14T00:00:00.000Z"), "UTC")).toBe("2026-08-14");
  });

  it("covers the live uipkge 50-block catalog with Preact install paths", () => {
    const uipkge = [
      ...catalogAuthBlocks,
      ...commerceBlocks,
      ...communicationBlocks,
      ...dashboardBlocks,
      ...marketingBlocks,
      ...appSidebarBlocks,
    ];
    expect(uipkge).toHaveLength(50);
    const ids = uipkge.map((block) => block.id);
    expect(new Set(ids).size).toBe(50);
    expect(ids).toEqual([
      "auth-mfa",
      "auth-password-reset",
      "auth-sign-in",
      "auth-sign-up",
      "login-01",
      "login-02",
      "register-01",
      "payment-form",
      "saved-cards-list",
      "checkout-flow",
      "chat-thread",
      "chat-two-pane",
      "inbox",
      "ai-llm-chat",
      "analytics-overview",
      "command-palette",
      "conversion-funnel",
      "cost-breakdown",
      "dashboard-layout",
      "event-calendar",
      "event-list",
      "kanban-board",
      "metrics-grid",
      "notifications-popover",
      "profile-menu",
      "progress-breakdown",
      "quick-actions",
      "theme-customize",
      "toggle-setting-list",
      "bento-01",
      "contact-01",
      "contact-us",
      "cta-01",
      "faq-01",
      "features-01",
      "footer-01",
      "header-01",
      "hero-01",
      "logos-01",
      "logos-02",
      "logos-03",
      "pricing-01",
      "testimonials-01",
      "sidebar-01",
      "sidebar-02",
      "sidebar-03",
      "sidebar-04",
      "sidebar-05",
      "sidebar-06",
      "sidebar-07",
    ]);

    for (const block of uipkge) {
      expect(block.source).toBe("uipkge");
      expect(block.installCommand.startsWith("@kamod-ch/blocks/")).toBe(true);
      expect(block.installCommand).not.toMatch(/npx |shadcn|react-dom|lucide-react/);
      expect(block.component).toBeTypeOf("function");
      expect(block.catalogUrl).toBe(`https://uipkge.dev/react/blocks/${block.id}`);
    }
  });
});
