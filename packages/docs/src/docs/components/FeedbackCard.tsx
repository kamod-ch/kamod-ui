import { XIcon } from "@kamod-ch/icons/lucide";
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from "@kamod-ch/ui";
import { useEffect, useState } from "preact/hooks";

const DISMISSED_KEY = "kamod:feedback-dismissed";
const feedbackUrl =
  (import.meta.env.VITE_PRO_FEEDBACK_FORM_URL ?? "").trim() || "https://tally.so/r/ODYbWK";

/** Shared feedback invitation; dismissal applies to every docs route on this origin. */
export function FeedbackCard() {
  // Wait for browser storage before showing the card, avoiding a flash after dismissal.
  const [dismissed, setDismissed] = useState<boolean | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Keep the browser reference for cleanup. Preact may flush passive-effect cleanup
    // after a test environment has removed `window` from the global scope.
    const browserWindow = window;
    const readPreference = () => {
      try {
        setDismissed(browserWindow.localStorage.getItem(DISMISSED_KEY) === "true");
      } catch {
        setDismissed(false);
      }
    };
    const syncPreference = (event: StorageEvent) => {
      if (event.key === DISMISSED_KEY || event.key === null) readPreference();
    };
    readPreference();
    browserWindow.addEventListener("storage", syncPreference);
    return () => browserWindow.removeEventListener("storage", syncPreference);
  }, []);

  const dismiss = () => {
    setDismissed(true);
    try {
      localStorage.setItem(DISMISSED_KEY, "true");
    } catch {
      // Closing still works when browser storage is unavailable.
    }
  };

  if (dismissed !== false) return null;

  return (
    <Card class="docs-promo feedback-card" role="region" aria-label="Straight talk">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        class="feedback-card-close"
        aria-label="Dismiss feedback card"
        onClick={dismiss}
      >
        <XIcon size={15} aria-hidden="true" />
      </Button>
      <CardHeader class="gap-1.5">
        <CardTitle class="pr-5 text-base leading-snug">Straight talk</CardTitle>
        <CardDescription class="grid gap-2.5 text-sm leading-snug">
          <span class="text-foreground/90">
            We&apos;re planning a Pro tier with individually unlockable components.
          </span>
          <span class="font-medium text-foreground">Would that matter to you?</span>
        </CardDescription>
      </CardHeader>
      <CardContent class="grid gap-2.5">
        <Button
          href={feedbackUrl}
          target="_blank"
          rel="noopener noreferrer"
          size="sm"
          variant="default"
          class="w-full"
        >
          2-minute feedback
        </Button>
      </CardContent>
    </Card>
  );
}
