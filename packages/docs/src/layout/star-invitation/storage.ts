export const STAR_INVITATION_STORAGE_KEY = "kamod-ui:star-invitation:v1";
export const STAR_INVITATION_COOLDOWN_MS = 30 * 24 * 60 * 60 * 1000;

export function parseLastShown(raw: string | null): number | null {
  if (raw == null) return null;
  const value = Number(raw);
  if (!Number.isFinite(value) || value <= 0) return null;
  return value;
}

export function readLastShown(): number | null {
  try {
    return parseLastShown(localStorage.getItem(STAR_INVITATION_STORAGE_KEY));
  } catch {
    return null;
  }
}

export function recordShown(at = Date.now()): boolean {
  try {
    localStorage.setItem(STAR_INVITATION_STORAGE_KEY, String(at));
    return true;
  } catch {
    return false;
  }
}

export function shouldShowInvitation(
  now = Date.now(),
  lastShown: number | null = readLastShown(),
): boolean {
  if (lastShown == null || !Number.isFinite(lastShown) || lastShown <= 0) return true;
  if (lastShown > now) return true;
  return now - lastShown >= STAR_INVITATION_COOLDOWN_MS;
}
