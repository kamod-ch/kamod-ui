import { MenuIcon } from "@kamod-ch/icons/lucide";
import { Sheet, SheetContent, SheetTrigger } from "@kamod-ch/ui";
import { useEffect, useId, useRef, useState } from "preact/hooks";
import { NavigationDirectory } from "./NavigationDirectory";
import { NavigationHeader } from "./NavigationHeader";
import { NavigationMenuHeader } from "./NavigationMenuHeader";
import { NavigationScrollArea } from "./NavigationScrollArea";
import { navigationGroups } from "./navigation-data";
import { SidebarResources } from "./SidebarResources";

/** One responsive navigation surface for home, documentation and every block detail page. */
export function SiteNavigation() {
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);
  const [pathname, setPathname] = useState("");
  const triggerRef = useRef<HTMLButtonElement>(null);
  const id = useId();

  // Static pages paint before hydration; don't offer an inert trigger during that interval.
  useEffect(() => setReady(true), []);

  const changeOpen = (next: boolean) => {
    setOpen(next);
    if (next) {
      setPathname(window.location.pathname);
    }
  };

  useEffect(() => {
    if (open || !pathname) return;
    // A backdrop pointerdown can blur the focus restored by Sheet before its click finishes.
    const frame = requestAnimationFrame(() => {
      if (document.activeElement === document.body && triggerRef.current?.offsetParent) {
        triggerRef.current.focus({ preventScroll: true });
      }
    });
    return () => cancelAnimationFrame(frame);
  }, [open, pathname]);

  useEffect(() => {
    if (!open) return;
    // Crossing into the desktop layout must also release the modal's scroll lock.
    const desktop = window.matchMedia("(min-width: 940px)");
    const closeOnDesktop = () => {
      if (desktop.matches) setOpen(false);
    };
    const close = () => setOpen(false);
    desktop.addEventListener("change", closeOnDesktop);
    window.addEventListener("popstate", close);
    closeOnDesktop();
    return () => {
      desktop.removeEventListener("change", closeOnDesktop);
      window.removeEventListener("popstate", close);
    };
  }, [open]);

  return (
    <Sheet class="site-navigation" open={open} onOpenChange={changeOpen}>
      {/* Open on click so the incoming panel cannot intercept the trigger's pointer sequence. */}
      <SheetTrigger asChild onPointerDown={(event) => event.preventDefault()}>
        <button
          onClick={(event) => {
            triggerRef.current = event.currentTarget;
          }}
          type="button"
          disabled={!ready}
          class="docs-icon-button site-navigation-trigger site-icon-button"
          aria-label="Open navigation menu"
          aria-haspopup="dialog"
          aria-controls={open ? id : undefined}
        >
          <MenuIcon size={20} aria-hidden="true" />
        </button>
      </SheetTrigger>
      <SheetContent id={id} class="site-navigation-panel" side="left" showCloseButton={false}>
        <NavigationMenuHeader />
        <NavigationScrollArea mode="mobile" class="site-navigation-body">
          <NavigationHeader pathname={pathname} closeOnNavigate />
          <NavigationDirectory groups={navigationGroups} pathname={pathname} closeOnNavigate />
        </NavigationScrollArea>
        <SidebarResources />
      </SheetContent>
    </Sheet>
  );
}
