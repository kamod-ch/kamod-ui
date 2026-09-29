import { Kbd, KbdGroup } from "../kbd";
import type { ShortcutKeyToken, ShortcutPlatform } from "./shortcuts-help-types";
import { displayKeyToken, formatShortcutAccessibleLabel } from "./shortcuts-help-utils";

export type KeyboardShortcutKeysProps = {
  keys: ShortcutKeyToken[];
  platform: ShortcutPlatform;
};

export const KeyboardShortcutKeys = ({ keys, platform }: KeyboardShortcutKeysProps) => {
  const accessibleLabel = formatShortcutAccessibleLabel(keys, platform);

  return (
    <KbdGroup aria-label={accessibleLabel}>
      {keys.map((token, index) => (
        <Kbd key={`${token}-${index}`} size="sm">
          {displayKeyToken(token, platform)}
        </Kbd>
      ))}
    </KbdGroup>
  );
};
