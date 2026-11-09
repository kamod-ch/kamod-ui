import { XIcon } from "@kamod-ch/icons/lucide";
import { Button } from "@kamod-ch/ui";
import { trackGrowthEvent } from "../../analytics/growth-track";
import type { GrowthLocation } from "../../analytics/growth-types";
import { GITHUB_REPO_URL } from "../github";

type StarInvitationToastProps = {
  inviteLocation?: GrowthLocation;
  onDismiss: () => void;
};

export function StarInvitationToast({ inviteLocation, onDismiss }: StarInvitationToastProps) {
  return (
    <aside class="star-invitation-toast" role="note" aria-label="GitHub star invitation">
      <p class="star-invitation-toast-message">
        Found this useful? Support Kamod UI with a star on GitHub.
      </p>
      <div class="star-invitation-toast-actions">
        <Button
          size="sm"
          href={GITHUB_REPO_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() =>
            trackGrowthEvent("github_star_cta_click", {
              location: inviteLocation ?? "post_copy",
            })
          }
        >
          Star on GitHub
        </Button>
        <button
          type="button"
          class="star-invitation-toast-dismiss docs-icon-button"
          onClick={onDismiss}
          aria-label="Dismiss GitHub star invitation"
        >
          <XIcon size={16} aria-hidden="true" />
          <span class="star-invitation-toast-dismiss-label">Dismiss</span>
        </button>
      </div>
    </aside>
  );
}
