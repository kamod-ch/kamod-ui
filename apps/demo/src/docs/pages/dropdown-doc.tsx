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
  DropdownTrigger
} from "@kamod-ui/core";
import { createGenericDocPage } from "./create-generic-doc-page";

const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden>
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const SettingsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden>
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
    "Use DropdownTrigger to toggle, DropdownContent for the panel (side, align, sideOffset). Optional DropdownSub / DropdownSubTrigger / DropdownSubContent for nested menus. Checkbox and radio items do not use DropdownItem’s auto-close behavior where noted.",
  exampleSections: [
    {
      id: "basic-dropdown",
      title: "Basic",
      text: "Default trigger styling and menu items.",
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
      )
    },
    {
      id: "as-child",
      title: "Trigger asChild",
      text: "Use a Button (or other element) as the trigger.",
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
      )
    },
    {
      id: "grouped-shortcuts-icons",
      title: "Groups, shortcuts, icons",
      text: "Labels, separators, keyboard hints, and leading icons.",
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
      )
    },
    {
      id: "submenu",
      title: "Submenu",
      text: "Nested menu; open via hover or click on the sub trigger.",
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
      )
    },
    {
      id: "checkbox-items",
      title: "Checkbox items",
      text: "Toggle state without closing the root menu.",
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
      )
    },
    {
      id: "radio-items",
      title: "Radio group",
      text: "Single selection; menu closes after choosing (DropdownRadioItem).",
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
      )
    },
    {
      id: "positioning",
      title: "Positioning",
      text: "side, align, and sideOffset on DropdownContent.",
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
      )
    }
  ],
  apiRows: [
    { prop: "defaultOpen", type: "boolean", defaultValue: "false" },
    { prop: "DropdownTrigger asChild", type: "boolean", defaultValue: "false" },
    { prop: "DropdownContent forceMount", type: "boolean", defaultValue: "false" },
    { prop: "DropdownContent side", type: '"top" | "bottom" | "left" | "right"', defaultValue: '"bottom"' },
    { prop: "DropdownContent align", type: '"start" | "center" | "end"', defaultValue: '"start"' },
    { prop: "DropdownContent sideOffset", type: "number", defaultValue: "4" },
    { prop: "DropdownItem variant", type: '"default" | "destructive"', defaultValue: '"default"' },
    { prop: "DropdownItem inset", type: "boolean", defaultValue: "false" },
    { prop: "DropdownLabel inset", type: "boolean", defaultValue: "false" }
  ],
  accessibilityText:
    "Trigger exposes aria-haspopup=\"menu\", aria-expanded, and aria-controls. Content is role=\"menu\" with role=\"menuitem\" (and menuitemcheckbox / menuitemradio where used). Escape closes the menu and returns focus to the trigger."
});
