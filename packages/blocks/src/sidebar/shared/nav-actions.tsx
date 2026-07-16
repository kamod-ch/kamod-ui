import { EllipsisIcon, StarIcon, Trash2Icon } from "@kamod-ch/icons/lucide";
import {
  Button,
  Dropdown,
  DropdownContent,
  DropdownItem,
  DropdownSeparator,
  DropdownTrigger,
} from "@kamod-ch/ui";
import { stopNavigation } from "./sample-data";

export const NavActions = () => (
  <div class="flex items-center gap-2 text-muted-foreground">
    <Button variant="ghost" size="icon-sm" aria-label="Add to favorites">
      <StarIcon />
    </Button>
    <Button variant="ghost" size="icon-sm" aria-label="Delete">
      <Trash2Icon />
    </Button>
    <Dropdown>
      <DropdownTrigger asChild>
        <Button variant="ghost" size="icon-sm" aria-label="More actions">
          <EllipsisIcon />
        </Button>
      </DropdownTrigger>
      <DropdownContent align="end" class="w-48">
        <DropdownItem onClick={stopNavigation}>Copy link</DropdownItem>
        <DropdownItem onClick={stopNavigation}>Duplicate</DropdownItem>
        <DropdownSeparator />
        <DropdownItem onClick={stopNavigation}>Move to project</DropdownItem>
      </DropdownContent>
    </Dropdown>
  </div>
);
