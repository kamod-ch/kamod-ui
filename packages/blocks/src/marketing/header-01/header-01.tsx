import { MenuIcon, XIcon } from "@kamod-ch/icons/lucide";
import {
  Button,
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@kamod-ch/ui";
import type { BlockLinkComponent } from "../../shared";
import { renderBlockLink, useControllableState } from "../../shared";
import { BrandMark } from "../shared/brand-mark";
import type { MarketingAction, MarketingIcon, MarketingLink } from "../shared/types";

export type Header01Props = {
  brandName?: string;
  brandHref?: string;
  brandIcon?: MarketingIcon;
  links?: MarketingLink[];
  signIn?: MarketingAction;
  trial?: MarketingAction;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  linkComponent?: BlockLinkComponent;
};

const defaultLinks: MarketingLink[] = [
  { href: "#features", label: "Features" },
  { href: "#pricing", label: "Pricing" },
  { href: "#customers", label: "Customers" },
  { href: "#docs", label: "Docs" },
  { href: "#blog", label: "Blog" },
];

const NavLinks = ({
  links,
  class: className,
  onNavigate,
  linkComponent,
}: {
  links: MarketingLink[];
  class?: string;
  onNavigate?: () => void;
  linkComponent?: BlockLinkComponent;
}) => (
  <ul class={className}>
    {links.map((link) => (
      <li key={link.href + link.label}>
        {renderBlockLink(linkComponent, {
          href: link.href,
          class:
            "rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
          onClick: onNavigate,
          children: link.label,
        })}
      </li>
    ))}
  </ul>
);

export const Header01 = ({
  brandName = "Acme",
  brandHref = "#",
  brandIcon,
  links = defaultLinks,
  signIn = { label: "Sign in", href: "#signin", variant: "ghost" },
  trial = { label: "Start free trial", href: "#trial" },
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  linkComponent,
}: Header01Props) => {
  const [open, setOpen] = useControllableState({
    value: openProp,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });

  return (
    <header
      data-slot="block-header-01"
      class="sticky top-0 z-40 border-b bg-background/80 text-foreground backdrop-blur supports-[backdrop-filter]:bg-background/60"
    >
      <div class="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <BrandMark name={brandName} href={brandHref} icon={brandIcon} />
        <nav class="hidden md:block" aria-label="Primary">
          <NavLinks class="flex items-center gap-1" links={links} linkComponent={linkComponent} />
        </nav>
        <div class="hidden items-center gap-2 md:flex">
          {signIn.href ? (
            <Button
              href={signIn.href}
              size="sm"
              variant={signIn.variant ?? "ghost"}
              onClick={signIn.onClick}
            >
              {signIn.label}
            </Button>
          ) : (
            <Button
              type="button"
              size="sm"
              variant={signIn.variant ?? "ghost"}
              onClick={signIn.onClick}
            >
              {signIn.label}
            </Button>
          )}
          {trial.href ? (
            <Button href={trial.href} size="sm" onClick={trial.onClick}>
              {trial.label}
            </Button>
          ) : (
            <Button type="button" size="sm" onClick={trial.onClick}>
              {trial.label}
            </Button>
          )}
        </div>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" class="md:hidden" aria-label="Open menu">
              <MenuIcon size={20} />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" class="w-72 p-0" showCloseButton={false}>
            <SheetHeader class="sr-only">
              <SheetTitle>Site menu</SheetTitle>
              <SheetDescription>Primary navigation and account actions</SheetDescription>
            </SheetHeader>
            <div class="flex h-full flex-col">
              <div class="flex items-center justify-between border-b px-4 py-3">
                <BrandMark name={brandName} href={brandHref} icon={brandIcon} size="sm" />
                <SheetClose asChild>
                  <Button variant="ghost" size="icon" class="size-8" aria-label="Close menu">
                    <XIcon size={16} />
                  </Button>
                </SheetClose>
              </div>
              <nav class="flex-1 p-4" aria-label="Mobile">
                <NavLinks
                  class="flex flex-col gap-1"
                  links={links}
                  linkComponent={linkComponent}
                  onNavigate={() => setOpen(false)}
                />
              </nav>
              <div class="flex flex-col gap-2 border-t p-4">
                {signIn.href ? (
                  <Button
                    href={signIn.href}
                    variant="outline"
                    class="w-full"
                    onClick={() => setOpen(false)}
                  >
                    {signIn.label}
                  </Button>
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    class="w-full"
                    onClick={() => {
                      signIn.onClick?.();
                      setOpen(false);
                    }}
                  >
                    {signIn.label}
                  </Button>
                )}
                {trial.href ? (
                  <Button href={trial.href} class="w-full" onClick={() => setOpen(false)}>
                    {trial.label}
                  </Button>
                ) : (
                  <Button
                    type="button"
                    class="w-full"
                    onClick={() => {
                      trial.onClick?.();
                      setOpen(false);
                    }}
                  >
                    {trial.label}
                  </Button>
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};
