import { SmartAvatar } from "./SmartAvatar";

/** Stable demo seed — in apps, use your user id (never display name alone). */
export const SMART_AVATAR_DEMO_USER_ID = "usr_2k8Qm1P4xZ";

const WORKING_PHOTO = "https://github.com/shadcn.png";
const BROKEN_PHOTO = "https://invalid.kamod-ui.example/avatar-missing.jpg";

export function SmartAvatarGeneratedFallbackPreview() {
  return (
    <div class="grid w-full max-w-3xl grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6">
      <figure class="flex flex-col items-center gap-2 text-center">
        <SmartAvatar name={SMART_AVATAR_DEMO_USER_ID} />
        <figcaption class="text-muted-foreground text-xs leading-snug">No photo</figcaption>
      </figure>
      <figure class="flex flex-col items-center gap-2 text-center">
        <SmartAvatar name={SMART_AVATAR_DEMO_USER_ID} src={WORKING_PHOTO} />
        <figcaption class="text-muted-foreground text-xs leading-snug">Photo loads</figcaption>
      </figure>
      <figure class="flex flex-col items-center gap-2 text-center">
        <SmartAvatar name={SMART_AVATAR_DEMO_USER_ID} src={BROKEN_PHOTO} />
        <figcaption class="text-muted-foreground text-xs leading-snug">Broken URL</figcaption>
      </figure>
      <figure class="flex flex-col items-center gap-2 text-center">
        <SmartAvatar
          name={SMART_AVATAR_DEMO_USER_ID}
          src={WORKING_PHOTO}
          badge={<span class="sr-only">Online</span>}
        />
        <figcaption class="text-muted-foreground text-xs leading-snug">With badge</figcaption>
      </figure>
    </div>
  );
}

export function SmartAvatarAnimatedFallbackPreview() {
  return (
    <div class="flex w-full max-w-md flex-col items-center gap-3 px-2 text-center">
      <SmartAvatar name={SMART_AVATAR_DEMO_USER_ID} size="lg" blobatar={{ animate: "hover" }} />
      <p class="text-muted-foreground text-xs leading-relaxed">
        Hover the blobatar to preview idle motion. Browsers that honor{" "}
        <code class="text-foreground">prefers-reduced-motion: reduce</code> should skip the
        animation. This is opt-in via <code class="text-foreground">blobatar.animate</code> — the
        SmartAvatar recipe defaults to a static fallback.
      </p>
    </div>
  );
}

export const SMART_AVATAR_GENERATED_FALLBACK_CODE = `# Optional third-party fallback (not part of @kamod-ch/ui)
pnpm add blobatar @blobatar/preact

// Recipe source in this repo:
// packages/docs/src/docs/examples/avatar/SmartAvatar.tsx
import { SmartAvatar } from "./SmartAvatar";

const user = { id: "usr_2k8Qm1P4xZ", avatarUrl: "https://example.com/photo.jpg" };

/** Name visible in the UI — omit SmartAvatar \`label\` to avoid duplicate accessible names. */
export function ProfileRow() {
  return (
    <div class="flex items-center gap-3">
      <SmartAvatar name={user.id} src={user.avatarUrl} />
      <span>Ada Lovelace</span>
    </div>
  );
}

/** Standalone avatar — provide \`label\` when no adjacent text describes it. */
export function ToolbarAvatar() {
  return (
    <SmartAvatar
      name={user.id}
      src={user.avatarUrl}
      label="Ada Lovelace"
      badge={<span class="sr-only">Online</span>}
    />
  );
}`;

export const SMART_AVATAR_ANIMATED_FALLBACK_CODE = `// Requires blobatar/motion.css once in your app stylesheet (see kamod-ui docs global import).
import { SmartAvatar } from "./SmartAvatar";

const user = { id: "usr_2k8Qm1P4xZ" };

export function HoverBlobatar() {
  return <SmartAvatar name={user.id} blobatar={{ animate: "hover" }} />;
}`;
