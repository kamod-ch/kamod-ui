import {
  Button,
  Dropdown,
  DropdownCheckboxItem,
  DropdownContent,
  DropdownGroup,
  DropdownItem,
  DropdownLabel,
  DropdownRadioGroup,
  DropdownRadioItem,
  DropdownSeparator,
  DropdownShortcut,
  DropdownSub,
  DropdownSubContent,
  DropdownSubTrigger,
  DropdownTrigger,
} from "@kamod-ch/ui";
import { createGenericDocPage } from "./create-generic-doc-page";

const UserIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    aria-hidden
  >
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const SettingsIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    aria-hidden
  >
    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

export const dropdownDocPage = createGenericDocPage({
  slug: "dropdown",
  title: "Dropdown",
  usageLabel:
    "Context menu from a trigger — dismiss layer, positioning, asChild trigger, submenus, shortcuts, checkbox and radio items (shadcn Dropdown Menu pattern).",
  installationText: "Import Dropdown primitives from `@/components/kamod-ui/dropdown`.",
  usageText:
    'Use DropdownTrigger to toggle, DropdownContent for the panel (side, align, sideOffset). Optional DropdownSub / DropdownSubTrigger / DropdownSubContent for nested menus; DropdownSubContent supports side="inline-end" (default) or side="inline-start" to open toward the inline end or start (use inline-start when the trigger is near the viewport edge to avoid horizontal page scroll). Checkbox and radio items do not use DropdownItem’s auto-close behavior where noted.',
  exampleSections: [
    {
      id: "basic-dropdown",
      title: "Basic",
      text: "**Keep the Menu Focused on Related Commands.** Pair the default dropdown trigger with a short menu of related operations. Each menu item should represent an action available from that trigger, giving the reader a predictable set of choices when the popup opens.\n\nEssential actions should have a discoverable trigger, and navigation items should retain link semantics where appropriate; a menu's visual grouping does not replace the behavior of its individual entries.",
      code: `import { Dropdown, DropdownContent, DropdownItem, DropdownTrigger } from "@/components/kamod-ui/dropdown";

export const Example = () => (
  <Dropdown>
    <DropdownTrigger>Open menu</DropdownTrigger>
    <DropdownContent>
      <DropdownItem>Profile</DropdownItem>
      <DropdownItem>Settings</DropdownItem>
    </DropdownContent>
  </Dropdown>
);`,
      renderPreview: () => (
        <Dropdown>
          <DropdownTrigger>Open menu</DropdownTrigger>
          <DropdownContent>
            <DropdownItem>Profile</DropdownItem>
            <DropdownItem>Settings</DropdownItem>
          </DropdownContent>
        </Dropdown>
      ),
    },
    {
      id: "as-child",
      title: "Trigger asChild",
      text: "**Make the Existing Control the Actual Trigger.** Use `asChild` to make a `Button` or another compatible element the dropdown trigger. The child keeps its chosen presentation while receiving the behavior needed to open and control the associated menu.\n\nPreserve a meaningful accessible name, forwarded attributes and focus styling, and choose a label that explains the menu rather than the visual symbol used to open it.",
      code: `import { Button } from "@/components/kamod-ui/button"
import { Dropdown, DropdownContent, DropdownItem, DropdownTrigger } from "@/components/kamod-ui/dropdown";

export const Example = () => (
  <Dropdown>
    <DropdownTrigger asChild>
      <Button variant="outline">Open</Button>
    </DropdownTrigger>
    <DropdownContent>
      <DropdownItem>Item</DropdownItem>
    </DropdownContent>
  </Dropdown>
);`,
      renderPreview: () => (
        <Dropdown>
          <DropdownTrigger asChild>
            <Button variant="outline">Open</Button>
          </DropdownTrigger>
          <DropdownContent>
            <DropdownItem>Item</DropdownItem>
          </DropdownContent>
        </Dropdown>
      ),
    },
    {
      id: "grouped-shortcuts-icons",
      title: "Groups, Shortcuts, Icons",
      text: "**Add Structure Only Where It Helps Scanning.** Organize a longer dropdown with labels, separators and recognizable icons, reserving trailing space for shortcut hints. These elements explain the hierarchy of the actions without changing the operation attached to each item.\n\nKeep these cues secondary to the command text, and do not show a shortcut unless your application actually registers and maintains that behavior.",
      code: `import { Dropdown, DropdownContent, DropdownGroup, DropdownItem, DropdownLabel, DropdownSeparator, DropdownShortcut, DropdownTrigger } from "@/components/kamod-ui/dropdown";

export const Example = () => (
  <Dropdown>
    <DropdownTrigger>Actions</DropdownTrigger>
    <DropdownContent class="w-56">
      <DropdownGroup>
        <DropdownLabel>My account</DropdownLabel>
        <DropdownItem>Profile <DropdownShortcut>⇧⌘P</DropdownShortcut></DropdownItem>
        <DropdownItem>Settings <DropdownShortcut>⌘S</DropdownShortcut></DropdownItem>
      </DropdownGroup>
      <DropdownSeparator />
      <DropdownItem variant="destructive">Sign out</DropdownItem>
    </DropdownContent>
  </Dropdown>
);`,
      renderPreview: () => (
        <Dropdown>
          <DropdownTrigger>Actions</DropdownTrigger>
          <DropdownContent class="w-56">
            <DropdownGroup>
              <DropdownLabel>My account</DropdownLabel>
              <DropdownItem>
                <UserIcon />
                Profile <DropdownShortcut>⇧⌘P</DropdownShortcut>
              </DropdownItem>
              <DropdownItem>
                <SettingsIcon />
                Settings <DropdownShortcut>⌘S</DropdownShortcut>
              </DropdownItem>
            </DropdownGroup>
            <DropdownSeparator />
            <DropdownItem variant="destructive">Sign out</DropdownItem>
          </DropdownContent>
        </Dropdown>
      ),
    },
    {
      id: "submenu",
      title: "Submenu",
      text: "**Keep Less Frequent Choices under a Clear Category.** Place related secondary actions in a submenu opened from a labeled sub-trigger. This keeps the main dropdown shorter while giving the reader a meaningful category to enter before choosing the nested operation.\n\nLimit nesting and verify keyboard access to every level; users should be able to predict the child choices from the parent label before opening another panel.",
      code: `import { Dropdown, DropdownContent, DropdownItem, DropdownSub, DropdownSubContent, DropdownSubTrigger, DropdownTrigger } from "@/components/kamod-ui/dropdown";

export const Example = () => (
  <Dropdown>
    <DropdownTrigger>More</DropdownTrigger>
    <DropdownContent>
      <DropdownItem>Back</DropdownItem>
      <DropdownSub>
        <DropdownSubTrigger>Invite</DropdownSubTrigger>
        <DropdownSubContent>
          <DropdownItem>Email</DropdownItem>
          <DropdownItem>Message</DropdownItem>
        </DropdownSubContent>
      </DropdownSub>
    </DropdownContent>
  </Dropdown>
);`,
      renderPreview: () => (
        <Dropdown>
          <DropdownTrigger>More</DropdownTrigger>
          <DropdownContent>
            <DropdownItem>Back</DropdownItem>
            <DropdownSub>
              <DropdownSubTrigger>Invite</DropdownSubTrigger>
              <DropdownSubContent>
                <DropdownItem>Email</DropdownItem>
                <DropdownItem>Message</DropdownItem>
              </DropdownSubContent>
            </DropdownSub>
          </DropdownContent>
        </Dropdown>
      ),
    },
    {
      id: "checkbox-items",
      title: "Checkbox Items",
      text: "**Use Checkmarks for Independent Settings.** Use checkbox menu items for independent settings that can be changed without closing the root menu. Their checked values should describe the same state used by the rest of the interface after the menu is dismissed.\n\nBind each checked value to the actual application state and make the effect of each label clear; a checked menu item should reflect a setting, not merely the last command clicked.",
      code: `import { Dropdown, DropdownCheckboxItem, DropdownContent, DropdownLabel, DropdownSeparator, DropdownTrigger } from "@/components/kamod-ui/dropdown";

export const Example = () => (
  <Dropdown>
    <DropdownTrigger>View</DropdownTrigger>
    <DropdownContent>
      <DropdownLabel>Appearance</DropdownLabel>
      <DropdownCheckboxItem defaultChecked>Show sidebar</DropdownCheckboxItem>
      <DropdownCheckboxItem>Show counts</DropdownCheckboxItem>
      <DropdownSeparator />
      <DropdownCheckboxItem defaultChecked>Compact</DropdownCheckboxItem>
    </DropdownContent>
  </Dropdown>
);`,
      renderPreview: () => (
        <Dropdown>
          <DropdownTrigger>View</DropdownTrigger>
          <DropdownContent>
            <DropdownLabel>Appearance</DropdownLabel>
            <DropdownCheckboxItem defaultChecked>Show sidebar</DropdownCheckboxItem>
            <DropdownCheckboxItem>Show counts</DropdownCheckboxItem>
            <DropdownSeparator />
            <DropdownCheckboxItem defaultChecked>Compact</DropdownCheckboxItem>
          </DropdownContent>
        </Dropdown>
      ),
    },
    {
      id: "radio-items",
      title: "Radio Group",
      text: "**Represent One Current Choice.** Use `DropdownRadioItem` within a radio group for one choice among alternatives. Selecting an item updates the chosen value and closes the menu, so the trigger or surrounding interface should make the result visible.\n\nReopen the menu after changing the setting elsewhere in the application to verify that the marked option follows parent state. Use stable option values, keeping translated labels separate from the data used to apply the preference.",
      code: `import { Dropdown, DropdownContent, DropdownLabel, DropdownRadioGroup, DropdownRadioItem, DropdownTrigger } from "@/components/kamod-ui/dropdown";

export const Example = () => (
  <Dropdown>
    <DropdownTrigger>Position</DropdownTrigger>
    <DropdownContent>
      <DropdownLabel>Panel</DropdownLabel>
      <DropdownRadioGroup defaultValue="bottom">
        <DropdownRadioItem value="top">Top</DropdownRadioItem>
        <DropdownRadioItem value="bottom">Bottom</DropdownRadioItem>
        <DropdownRadioItem value="right">Right</DropdownRadioItem>
      </DropdownRadioGroup>
    </DropdownContent>
  </Dropdown>
);`,
      renderPreview: () => (
        <Dropdown>
          <DropdownTrigger>Position</DropdownTrigger>
          <DropdownContent>
            <DropdownLabel>Panel</DropdownLabel>
            <DropdownRadioGroup defaultValue="bottom">
              <DropdownRadioItem value="top">Top</DropdownRadioItem>
              <DropdownRadioItem value="bottom">Bottom</DropdownRadioItem>
              <DropdownRadioItem value="right">Right</DropdownRadioItem>
            </DropdownRadioGroup>
          </DropdownContent>
        </Dropdown>
      ),
    },
    {
      id: "positioning",
      title: "Positioning",
      text: "**Position for the Available Space.** Set `side`, `align` and `sideOffset` on `DropdownContent` to position the menu relative to its trigger. These choices tune the available space around the popup without changing the labels or behavior of its actions.\n\nTest triggers near each edge and within scrolling containers, and avoid using large offsets that make the menu feel disconnected from its source.",
      code: `import { Dropdown, DropdownContent, DropdownItem, DropdownTrigger } from "@/components/kamod-ui/dropdown";

export const Example = () => (
  <Dropdown>
    <DropdownTrigger>Top / end</DropdownTrigger>
    <DropdownContent side="top" align="end" sideOffset={8}>
      <DropdownItem>One</DropdownItem>
    </DropdownContent>
  </Dropdown>
);`,
      renderPreview: () => (
        <Dropdown>
          <DropdownTrigger>Top / end</DropdownTrigger>
          <DropdownContent side="top" align="end" sideOffset={8}>
            <DropdownItem>One</DropdownItem>
            <DropdownItem>Two</DropdownItem>
          </DropdownContent>
        </Dropdown>
      ),
    },
  ],
  apiRows: [
    { prop: "defaultOpen", type: "boolean", defaultValue: "false" },
    { prop: "DropdownTrigger asChild", type: "boolean", defaultValue: "false" },
    { prop: "DropdownContent forceMount", type: "boolean", defaultValue: "false" },
    {
      prop: "DropdownContent side",
      type: '"top" | "bottom" | "left" | "right"',
      defaultValue: '"bottom"',
    },
    { prop: "DropdownContent align", type: '"start" | "center" | "end"', defaultValue: '"start"' },
    { prop: "DropdownContent sideOffset", type: "number", defaultValue: "4" },
    { prop: "DropdownItem variant", type: '"default" | "destructive"', defaultValue: '"default"' },
    { prop: "DropdownItem inset", type: "boolean", defaultValue: "false" },
    { prop: "DropdownLabel inset", type: "boolean", defaultValue: "false" },
  ],
  accessibilityText:
    'Trigger exposes aria-haspopup="menu", aria-expanded, and aria-controls. Content is role="menu" with role="menuitem" (and menuitemcheckbox / menuitemradio where used). Escape closes the menu and returns focus to the trigger.',
});
