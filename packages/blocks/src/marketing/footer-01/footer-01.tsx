import { BrandGithubIcon, BrandLinkedinIcon, BrandXIcon } from "@kamod-ch/icons/tabler/outline";
import { Button, Input, Separator } from "@kamod-ch/ui";
import { useState } from "preact/hooks";
import type { BlockLinkComponent } from "../../shared";
import { renderBlockLink } from "../../shared";
import { BrandMark } from "../shared/brand-mark";
import type { MarketingIcon, MarketingLink } from "../shared/types";

export type FooterColumn = {
  title: string;
  links: MarketingLink[];
};

export type FooterSocialLink = MarketingLink & { icon?: MarketingIcon };

export type Footer01Props = {
  brandName?: string;
  brandHref?: string;
  blurb?: string;
  columns?: FooterColumn[];
  social?: FooterSocialLink[];
  copyright?: string;
  onSubscribe?: (email: string) => void | Promise<void>;
  linkComponent?: BlockLinkComponent;
};

const defaultColumns: FooterColumn[] = [
  {
    title: "Product",
    links: [
      { href: "#features", label: "Features" },
      { href: "#pricing", label: "Pricing" },
      { href: "#changelog", label: "Changelog" },
      { href: "#roadmap", label: "Roadmap" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "#about", label: "About" },
      { href: "#blog", label: "Blog" },
      { href: "#careers", label: "Careers" },
      { href: "#contact", label: "Contact" },
    ],
  },
  {
    title: "Resources",
    links: [
      { href: "#docs", label: "Documentation" },
      { href: "#api", label: "API" },
      { href: "#help", label: "Help center" },
      { href: "#status", label: "Status" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "#terms", label: "Terms" },
      { href: "#privacy", label: "Privacy" },
      { href: "#security", label: "Security" },
      { href: "#dpa", label: "DPA" },
    ],
  },
];

const defaultSocial: FooterSocialLink[] = [
  { href: "#github", label: "GitHub", icon: BrandGithubIcon },
  { href: "#x", label: "X", icon: BrandXIcon },
  { href: "#linkedin", label: "LinkedIn", icon: BrandLinkedinIcon },
];

export const Footer01 = ({
  brandName = "Acme",
  brandHref = "#",
  blurb = "Built with Kamod UI. Get product updates monthly.",
  columns = defaultColumns,
  social = defaultSocial,
  copyright = "© 2026 Acme. All rights reserved.",
  onSubscribe,
  linkComponent,
}: Footer01Props) => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "pending" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const subscribe = async (event: SubmitEvent) => {
    event.preventDefault();
    if (!/\S+@\S+\.\S+/.test(email)) {
      setStatus("error");
      setMessage("Enter a valid email address.");
      return;
    }
    setStatus("pending");
    try {
      await onSubscribe?.(email);
      setStatus("success");
      setMessage("Thanks — check your inbox to confirm.");
      setEmail("");
    } catch {
      setStatus("error");
      setMessage("Subscription failed. Please try again.");
    }
  };

  return (
    <footer data-slot="block-footer-01" class="border-t bg-background text-foreground">
      <div class="mx-auto max-w-6xl px-6 py-16">
        <div class="grid gap-10 lg:grid-cols-12">
          <div class="space-y-4 lg:col-span-4">
            <BrandMark name={brandName} href={brandHref} />
            <p class="max-w-sm text-sm text-muted-foreground">{blurb}</p>
            <form class="flex max-w-sm gap-2" onSubmit={subscribe} noValidate>
              <Input
                type="email"
                value={email}
                required
                autocomplete="email"
                aria-label="Email address"
                placeholder="you@company.com"
                class="flex-1"
                aria-invalid={status === "error" ? "true" : undefined}
                onInput={(event) => setEmail(event.currentTarget.value)}
              />
              <Button type="submit" disabled={status === "pending"}>
                {status === "pending" ? "Sending…" : "Subscribe"}
              </Button>
            </form>
            {message ? (
              <p
                class={status === "error" ? "text-xs text-destructive" : "text-xs text-success"}
                role={status === "error" ? "alert" : "status"}
                aria-live="polite"
              >
                {message}
              </p>
            ) : null}
          </div>
          <div class="grid grid-cols-2 gap-6 sm:grid-cols-4 lg:col-span-8">
            {columns.map((column) => (
              <div key={column.title} class="space-y-3">
                <h3 class="text-sm font-semibold">{column.title}</h3>
                <ul class="space-y-2">
                  {column.links.map((link) => (
                    <li key={link.href + link.label}>
                      {renderBlockLink(linkComponent, {
                        href: link.href,
                        class:
                          "text-sm text-muted-foreground transition-colors hover:text-foreground",
                        children: link.label,
                      })}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <Separator class="my-10" />
        <div class="flex flex-wrap items-center justify-between gap-4">
          <p class="text-xs text-muted-foreground">{copyright}</p>
          <ul class="flex items-center gap-3">
            {social.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.label}>
                  {renderBlockLink(linkComponent, {
                    href: item.href,
                    "aria-label": item.label,
                    class: "text-muted-foreground transition-colors hover:text-foreground",
                    children: Icon ? <Icon size={16} /> : item.label,
                  })}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </footer>
  );
};
