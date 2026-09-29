import { ArrowUpRightIcon, HouseIcon, MenuIcon, PaletteIcon, XIcon } from "@kamod-ch/icons/lucide";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@kamod-ch/ui";
import { useEffect, useId, useRef, useState } from "preact/hooks";
import { withBasePath } from "../../base-path";
import { ThemePresetPicker } from "../../theme/ThemePresetPicker";
import { GithubRepoLink } from "../GithubRepoLink";
import { NavigationDirectory } from "./NavigationDirectory";
import { navigationGroups } from "./navigation-data";

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
    const desktop = window.matchMedia("(min-width: 980px)");
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
          class="site-navigation-trigger site-icon-button"
          aria-label="Open navigation menu"
          aria-haspopup="dialog"
          aria-controls={open ? id : undefined}
        >
          <MenuIcon size={20} aria-hidden="true" />
        </button>
      </SheetTrigger>
      <SheetContent id={id} class="site-navigation-panel" side="left" showCloseButton={false}>
        <div class="site-navigation-head">
          <div class="site-navigation-heading">
            <div>
              <span class="site-navigation-eyebrow">KAMOD UI / DOCUMENTATION</span>
              <SheetTitle>Explore Kamod</SheetTitle>
            </div>
            <SheetClose class="site-navigation-icon-button" aria-label="Close navigation menu">
              <XIcon size={19} aria-hidden="true" />
            </SheetClose>
          </div>
          <SheetDescription>
            Components, complete layouts and the tools to build with them.
          </SheetDescription>
        </div>
        <div class="site-navigation-body">
          <nav class="site-navigation-quick-links" aria-label="Start here">
            <SheetClose asChild>
              <a href={withBasePath("/")}>
                <HouseIcon size={16} aria-hidden="true" />
                Home
              </a>
            </SheetClose>
            <SheetClose asChild>
              <a href={withBasePath("/docs/theming/installation")}>
                <PaletteIcon size={16} aria-hidden="true" />
                Theming
              </a>
            </SheetClose>
          </nav>
          <div class="site-navigation-directory-heading">
            <span>Browse the library</span>
            <span>Built for Preact</span>
          </div>
          <NavigationDirectory groups={navigationGroups} pathname={pathname} closeOnNavigate />
        </div>
        <footer class="site-navigation-footer">
          <nav class="site-navigation-secondary-links" aria-label="Useful links">
            <SheetClose asChild>
              <a href={withBasePath("/docs/theming/css-setup")}>CSS setup</a>
            </SheetClose>
            <a href="https://github.com/kamod-ch/kamod-ui/issues" target="_blank" rel="noreferrer">
              Feedback
              <ArrowUpRightIcon size={12} aria-hidden="true" />
            </a>
          </nav>
          <div class="site-navigation-footer-bottom">
            <span>Open source. Yours to shape.</span>
            <div class="site-navigation-footer-actions">
              <ThemePresetPicker side="top" />
              <GithubRepoLink />
            </div>
          </div>
        </footer>
      </SheetContent>
    </Sheet>
  );
}
