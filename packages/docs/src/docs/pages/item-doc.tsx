import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Dropdown,
  DropdownContent,
  DropdownItem,
  DropdownTrigger,
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemGroup,
  ItemHeader,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
} from "@kamod-ch/ui";
import {
  BadgeCheck,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Inbox,
  Plus,
  ShieldAlert,
} from "lucide-preact";
import { createGenericDocPage } from "./create-generic-doc-page";

const music = [
  {
    title: "Midnight City Lights",
    artist: "Neon Dreams",
    album: "Electric Nights",
    duration: "3:45",
  },
  {
    title: "Coffee Shop Conversations",
    artist: "The Morning Brew",
    album: "Urban Stories",
    duration: "4:05",
  },
  { title: "Digital Rain", artist: "Cyber Symphony", album: "Binary Beats", duration: "3:30" },
];

const people = [
  { username: "shadcn", avatar: "https://github.com/shadcn.png", email: "shadcn@vercel.com" },
  {
    username: "maxleiter",
    avatar: "https://github.com/maxleiter.png",
    email: "maxleiter@vercel.com",
  },
  {
    username: "evilrabbit",
    avatar: "https://github.com/evilrabbit.png",
    email: "evilrabbit@vercel.com",
  },
];

const models = [
  {
    name: "v0-1.5-sm",
    description: "Everyday tasks and UI generation.",
    image:
      "https://images.unsplash.com/photo-1650804068570-7fb2e3dbf888?q=80&w=640&auto=format&fit=crop",
  },
  {
    name: "v0-1.5-lg",
    description: "Advanced thinking or reasoning.",
    image:
      "https://images.unsplash.com/photo-1610280777472-54133d004c8c?q=80&w=640&auto=format&fit=crop",
  },
  {
    name: "v0-2.0-mini",
    description: "Open source model for everyone.",
    image:
      "https://images.unsplash.com/photo-1602146057681-08560aee8cde?q=80&w=640&auto=format&fit=crop",
  },
];

export const itemDocPage = createGenericDocPage({
  slug: "item",
  title: "Item",
  usageLabel:
    "Item composes media, title, description, and actions in a flexible row — aligned with shadcn/ui item patterns.",
  installationText:
    "Import Item and subcomponents (ItemMedia, ItemContent, ItemTitle, ItemDescription, ItemActions, ItemGroup, …) from `@/components/kamod-ui/item`.",
  usageText:
    "Use variant (default, outline, muted) and size (default, sm, xs). Use asChild to render a link or other host with item styles. Prefer Field when the row wraps a form control (input, checkbox, select); use Item for read-only rows, lists, and actions.",
  exampleSections: [
    {
      id: "item-demo",
      title: "Basic Patterns",
      text: "**Choose the Interaction before the Surface.** Compose outlined items with supporting text and actions, then compare a compact item rendered as a link through `asChild`. The examples distinguish a row containing actions from a row whose entire surface is one destination.\n\nKeep those patterns distinct so users know where clicking will lead, and avoid nesting independent buttons inside an anchor that already makes the entire row interactive.",
      code: `import { Button } from "@/components/kamod-ui/button"
import { Item, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle } from "@/components/kamod-ui/item";
import { BadgeCheck, ChevronRight } from "lucide-preact";

export const Example = () => (
  <div class="flex w-full max-w-md flex-col gap-6">
    <Item variant="outline">
      <ItemContent>
        <ItemTitle>Basic Item</ItemTitle>
        <ItemDescription>A simple item with title and description.</ItemDescription>
      </ItemContent>
      <ItemActions>
        <Button variant="outline" size="sm">Action</Button>
      </ItemActions>
    </Item>
    <Item variant="outline" size="sm" asChild>
      <a href="#item-demo">
        <ItemMedia>
          <BadgeCheck class="size-5" />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Your profile has been verified.</ItemTitle>
        </ItemContent>
        <ItemActions>
          <ChevronRight class="size-4" />
        </ItemActions>
      </a>
    </Item>
  </div>
);`,
      renderPreview: () => (
        <div class="flex w-full max-w-md flex-col gap-6">
          <Item variant="outline">
            <ItemContent>
              <ItemTitle>Basic Item</ItemTitle>
              <ItemDescription>A simple item with title and description.</ItemDescription>
            </ItemContent>
            <ItemActions>
              <Button variant="outline" size="sm">
                Action
              </Button>
            </ItemActions>
          </Item>
          <Item variant="outline" size="sm" asChild>
            <a href="#item-demo">
              <ItemMedia>
                <BadgeCheck class="size-5" />
              </ItemMedia>
              <ItemContent>
                <ItemTitle>Your Profile Has Been Verified.</ItemTitle>
              </ItemContent>
              <ItemActions>
                <ChevronRight class="size-4" />
              </ItemActions>
            </a>
          </Item>
        </div>
      ),
    },
    {
      id: "item-usage",
      title: "Usage",
      text: "**Give Each Region a Clear Role.** Use `ItemMedia`, `ItemTitle`, `ItemDescription` and an action to structure a single list entry. Each region has a clear role, keeping the subject and its explanation readable before the user encounters the associated control.\n\nKeep the primary label readable at narrow widths, and omit regions that add no useful information rather than filling every slot by default.",
      code: `import { Button } from "@/components/kamod-ui/button"
import { Item, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle } from "@/components/kamod-ui/item";
import { Inbox } from "lucide-preact";

export const Example = () => (
  <Item>
    <ItemMedia variant="icon">
      <Inbox />
    </ItemMedia>
    <ItemContent>
      <ItemTitle>Title</ItemTitle>
      <ItemDescription>Description</ItemDescription>
    </ItemContent>
    <ItemActions>
      <Button size="sm">Action</Button>
    </ItemActions>
  </Item>
);`,
      renderPreview: () => (
        <Item variant="outline" class="max-w-md">
          <ItemMedia variant="icon">
            <Inbox />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>Title</ItemTitle>
            <ItemDescription>Description</ItemDescription>
          </ItemContent>
          <ItemActions>
            <Button size="sm">Action</Button>
          </ItemActions>
        </Item>
      ),
    },
    {
      id: "item-variants",
      title: "Variants",
      text: "**Use Surface Weight to Establish Hierarchy.** Choose the transparent default, outlined or muted item treatment according to how much separation the list needs. The `variant` changes the surface while the title, description and actions retain the same structural relationship.\n\nKeep equivalent items styled consistently, and preserve focus and selected-state distinctions when the row is interactive.",
      code: `import { Item, ItemContent, ItemDescription, ItemMedia, ItemTitle } from "@/components/kamod-ui/item";
import { Inbox } from "lucide-preact";

export const Example = () => (
  <div class="flex w-full max-w-md flex-col gap-6">
    <Item>
      <ItemMedia variant="icon">
        <Inbox />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>Default Variant</ItemTitle>
        <ItemDescription>Transparent background with no border.</ItemDescription>
      </ItemContent>
    </Item>
    <Item variant="outline">
      <ItemMedia variant="icon">
        <Inbox />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>Outline Variant</ItemTitle>
        <ItemDescription>Outlined style with a visible border.</ItemDescription>
      </ItemContent>
    </Item>
    <Item variant="muted">
      <ItemMedia variant="icon">
        <Inbox />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>Muted Variant</ItemTitle>
        <ItemDescription>Muted background for secondary content.</ItemDescription>
      </ItemContent>
    </Item>
  </div>
);`,
      renderPreview: () => (
        <div class="flex w-full max-w-md flex-col gap-6">
          <Item>
            <ItemMedia variant="icon">
              <Inbox />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>Default Variant</ItemTitle>
              <ItemDescription>Transparent background with no border.</ItemDescription>
            </ItemContent>
          </Item>
          <Item variant="outline">
            <ItemMedia variant="icon">
              <Inbox />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>Outline Variant</ItemTitle>
              <ItemDescription>Outlined style with a visible border.</ItemDescription>
            </ItemContent>
          </Item>
          <Item variant="muted">
            <ItemMedia variant="icon">
              <Inbox />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>Muted Variant</ItemTitle>
              <ItemDescription>Muted background for secondary content.</ItemDescription>
            </ItemContent>
          </Item>
        </div>
      ),
    },
    {
      id: "item-sizes",
      title: "Sizes",
      text: '**Increase Density without Losing the Title.** Use `size="sm"` or `size="xs"` for denser item collections where the content remains concise. The size coordinates padding and gaps, letting related rows share one rhythm instead of individually tightened spacing.\n\nCheck the longest realistic label and media combination before reducing size, and avoid using a dense variant for content that needs several explanatory lines.',
      code: `import { Item, ItemContent, ItemDescription, ItemMedia, ItemTitle } from "@/components/kamod-ui/item";
import { Inbox } from "lucide-preact";

export const Example = () => (
  <div class="flex w-full max-w-md flex-col gap-6">
    <Item variant="outline">
      <ItemMedia variant="icon">
        <Inbox />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>Default Size</ItemTitle>
        <ItemDescription>The standard size for most use cases.</ItemDescription>
      </ItemContent>
    </Item>
    <Item variant="outline" size="sm">
      <ItemMedia variant="icon">
        <Inbox />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>Small Size</ItemTitle>
        <ItemDescription>A compact size for dense layouts.</ItemDescription>
      </ItemContent>
    </Item>
    <Item variant="outline" size="xs">
      <ItemMedia variant="icon">
        <Inbox />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>Extra Small</ItemTitle>
        <ItemDescription>The most compact size available.</ItemDescription>
      </ItemContent>
    </Item>
  </div>
);`,
      renderPreview: () => (
        <div class="flex w-full max-w-md flex-col gap-6">
          <Item variant="outline">
            <ItemMedia variant="icon">
              <Inbox />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>Default Size</ItemTitle>
              <ItemDescription>The standard size for most use cases.</ItemDescription>
            </ItemContent>
          </Item>
          <Item variant="outline" size="sm">
            <ItemMedia variant="icon">
              <Inbox />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>Small Size</ItemTitle>
              <ItemDescription>A compact size for dense layouts.</ItemDescription>
            </ItemContent>
          </Item>
          <Item variant="outline" size="xs">
            <ItemMedia variant="icon">
              <Inbox />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>Extra Small</ItemTitle>
              <ItemDescription>The most compact size available.</ItemDescription>
            </ItemContent>
          </Item>
        </div>
      ),
    },
    {
      id: "item-icon",
      title: "Icon Media",
      text: '**Use the Media Tile as a Recognition Cue.** Set `variant="icon"` on `ItemMedia` to place a symbol in a consistent muted tile. This gives neighboring items a common visual anchor even when their individual icon shapes have different proportions.\n\nKeep decorative symbols hidden from assistive technology and avoid choosing different icons merely for variety when the items represent the same kind of record.',
      code: `import { Button } from "@/components/kamod-ui/button"
import { Item, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle } from "@/components/kamod-ui/item";
import { ShieldAlert } from "lucide-preact";

export const Example = () => (
  <Item variant="outline" class="max-w-lg">
    <ItemMedia variant="icon">
      <ShieldAlert />
    </ItemMedia>
    <ItemContent>
      <ItemTitle>Security Alert</ItemTitle>
      <ItemDescription>New login detected from unknown device.</ItemDescription>
    </ItemContent>
    <ItemActions>
      <Button size="sm" variant="outline">Review</Button>
    </ItemActions>
  </Item>
);`,
      renderPreview: () => (
        <Item variant="outline" class="max-w-lg">
          <ItemMedia variant="icon">
            <ShieldAlert />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>Security Alert</ItemTitle>
            <ItemDescription>New login detected from unknown device.</ItemDescription>
          </ItemContent>
          <ItemActions>
            <Button size="sm" variant="outline">
              Review
            </Button>
          </ItemActions>
        </Item>
      ),
    },
    {
      id: "item-avatar",
      title: "Avatar Media",
      text: "**Connect the Row to an Identifiable Person.** Use the default `ItemMedia` treatment for an `Avatar` or a custom identity composition. The media identifies the subject, leaving the title and description to explain the row's purpose and supporting information.\n\nPlan for image failure and initials fallback, and keep any status badge understandable in text when availability or identity matters to the action at the end of the row.",
      code: `import { Avatar, AvatarFallback, AvatarImage } from "@/components/kamod-ui/avatar"
import { Button } from "@/components/kamod-ui/button"
import { Item, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle } from "@/components/kamod-ui/item";
import { Plus } from "lucide-preact";

export const Example = () => (
  <div class="flex w-full max-w-lg flex-col gap-6">
    <Item variant="outline">
      <ItemMedia>
        <Avatar class="size-10">
          <AvatarImage src="https://github.com/evilrabbit.png" />
          <AvatarFallback>ER</AvatarFallback>
        </Avatar>
      </ItemMedia>
      <ItemContent>
        <ItemTitle>Evil Rabbit</ItemTitle>
        <ItemDescription>Last seen 5 months ago</ItemDescription>
      </ItemContent>
      <ItemActions>
        <Button size="icon-sm" variant="outline" class="rounded-full" aria-label="Invite">
          <Plus />
        </Button>
      </ItemActions>
    </Item>
  </div>
);`,
      renderPreview: () => (
        <div class="flex w-full max-w-lg flex-col gap-6">
          <Item variant="outline">
            <ItemMedia>
              <Avatar class="size-10">
                <AvatarImage src="https://github.com/evilrabbit.png" />
                <AvatarFallback>ER</AvatarFallback>
              </Avatar>
            </ItemMedia>
            <ItemContent>
              <ItemTitle>Evil Rabbit</ItemTitle>
              <ItemDescription>Last seen 5 months ago</ItemDescription>
            </ItemContent>
            <ItemActions>
              <Button size="icon-sm" variant="outline" class="rounded-full" aria-label="Invite">
                <Plus />
              </Button>
            </ItemActions>
          </Item>
          <Item variant="outline">
            <ItemMedia>
              <div class="flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:ring-background *:data-[slot=avatar]:grayscale">
                <Avatar class="hidden sm:flex">
                  <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <Avatar class="hidden sm:flex">
                  <AvatarImage src="https://github.com/maxleiter.png" alt="@maxleiter" />
                  <AvatarFallback>LR</AvatarFallback>
                </Avatar>
                <Avatar>
                  <AvatarImage src="https://github.com/evilrabbit.png" alt="@evilrabbit" />
                  <AvatarFallback>ER</AvatarFallback>
                </Avatar>
              </div>
            </ItemMedia>
            <ItemContent>
              <ItemTitle>No Team Members</ItemTitle>
              <ItemDescription>Invite your team to collaborate on this project.</ItemDescription>
            </ItemContent>
            <ItemActions>
              <Button size="sm" variant="outline">
                Invite
              </Button>
            </ItemActions>
          </Item>
        </div>
      ),
    },
    {
      id: "item-image",
      title: "Image Media",
      text: "**Keep Thumbnails Consistent Across a Collection.** Use the image media variant for bounded cover artwork beside item text. Combine `ItemGroup` and `asChild` links when the collection represents navigable resources, keeping the image and label part of the same destination.\n\nPreserve a readable text title and make the destination explicit when using `asChild`; compare [Image](/docs/image/installation) for smaller media compositions.",
      code: `import { Item, ItemContent, ItemDescription, ItemGroup, ItemMedia, ItemTitle } from "@/components/kamod-ui/item";

const tracks = [{ title: "Song A", artist: "Artist", album: "Album", duration: "3:45" }];

export const Example = () => (
  <ItemGroup class="max-w-md gap-4">
    {tracks.map((song) => (
      <Item key={song.title} variant="outline" asChild role="listitem">
        <a href="#item-image">
          <ItemMedia variant="image">
            <img
              src={\`https://avatar.vercel.sh/\${song.title}\`}
              alt={song.title}
              width={32}
              height={32}
              class="object-cover grayscale"
            />
          </ItemMedia>
          <ItemContent>
            <ItemTitle class="line-clamp-1">
              {song.title} — <span class="text-muted-foreground">{song.album}</span>
            </ItemTitle>
            <ItemDescription>{song.artist}</ItemDescription>
          </ItemContent>
          <ItemContent class="flex-none text-center">
            <ItemDescription>{song.duration}</ItemDescription>
          </ItemContent>
        </a>
      </Item>
    ))}
  </ItemGroup>
);`,
      renderPreview: () => (
        <ItemGroup class="max-w-md gap-4">
          {music.map((song) => (
            <Item key={song.title} variant="outline" asChild role="listitem">
              <a href="#item-image">
                <ItemMedia variant="image">
                  <img
                    src={`https://avatar.vercel.sh/${encodeURIComponent(song.title)}`}
                    alt={song.title}
                    width={32}
                    height={32}
                    class="object-cover grayscale"
                  />
                </ItemMedia>
                <ItemContent>
                  <ItemTitle class="line-clamp-1">
                    {song.title} — <span class="text-muted-foreground">{song.album}</span>
                  </ItemTitle>
                  <ItemDescription>{song.artist}</ItemDescription>
                </ItemContent>
                <ItemContent class="flex-none text-center">
                  <ItemDescription>{song.duration}</ItemDescription>
                </ItemContent>
              </a>
            </Item>
          ))}
        </ItemGroup>
      ),
    },
    {
      id: "item-group",
      title: "Group",
      text: "**Present Related Records as a Coherent List.** Wrap related rows in `ItemGroup` to express a list and coordinate their visual arrangement. Outlined items can remain distinct, while optional separators provide another way to establish boundaries in a denser composition.\n\nUse stable keys for dynamic records and keep separators secondary; a list should remain understandable when descriptions wrap or some rows have actions and others do not.",
      code: `import { Avatar, AvatarFallback, AvatarImage } from "@/components/kamod-ui/avatar"
import { Button } from "@/components/kamod-ui/button"
import { Item, ItemActions, ItemContent, ItemDescription, ItemGroup, ItemMedia, ItemTitle } from "@/components/kamod-ui/item";

export const Example = () => (
  <ItemGroup class="max-w-sm">
    {/* map people … */}
  </ItemGroup>
);`,
      renderPreview: () => (
        <ItemGroup class="max-w-sm">
          {people.map((person) => (
            <Item key={person.username} variant="outline">
              <ItemMedia>
                <Avatar>
                  <AvatarImage src={person.avatar} class="grayscale" />
                  <AvatarFallback>{person.username.charAt(0)}</AvatarFallback>
                </Avatar>
              </ItemMedia>
              <ItemContent class="gap-1">
                <ItemTitle>{person.username}</ItemTitle>
                <ItemDescription>{person.email}</ItemDescription>
              </ItemContent>
              <ItemActions>
                <Button variant="ghost" size="icon" class="rounded-full">
                  <Plus />
                </Button>
              </ItemActions>
            </Item>
          ))}
        </ItemGroup>
      ),
    },
    {
      id: "item-header-footer",
      title: "Header and Footer",
      text: "**Use Full-Width Regions for Shared Context.** Use `ItemHeader` for content that spans the row above its main regions and `ItemFooter` for supporting content below. This accommodates wider metadata without squeezing it into the title, media or action column.\n\nKeep the primary title and action easy to identify, and avoid turning every item into a miniature page with several competing headings.",
      code: `import { Item, ItemContent, ItemDescription, ItemFooter, ItemHeader, ItemTitle } from "@/components/kamod-ui/item";

export const Example = () => (
  <Item variant="outline" class="max-w-xl">
    <ItemHeader>
      <ItemTitle>Team workspace</ItemTitle>
      <ItemDescription>Shared access for your team projects.</ItemDescription>
    </ItemHeader>
    <ItemContent>Updated 2 hours ago</ItemContent>
    <ItemFooter>Owner only</ItemFooter>
  </Item>
);`,
      renderPreview: () => (
        <div class="flex w-full max-w-xl flex-col gap-6">
          <ItemGroup class="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {models.map((model) => (
              <Item key={model.name} variant="outline">
                <ItemHeader>
                  <img
                    src={model.image}
                    alt={model.name}
                    width={128}
                    height={128}
                    class="aspect-square w-full rounded-sm object-cover"
                  />
                </ItemHeader>
                <ItemContent>
                  <ItemTitle>{model.name}</ItemTitle>
                  <ItemDescription>{model.description}</ItemDescription>
                </ItemContent>
              </Item>
            ))}
          </ItemGroup>
          <Item variant="outline">
            <ItemHeader>
              <ItemTitle>Team Workspace</ItemTitle>
              <ItemDescription>Shared access for your team projects.</ItemDescription>
            </ItemHeader>
            <ItemContent>Updated 2 hours ago</ItemContent>
            <ItemFooter>Owner only</ItemFooter>
          </Item>
        </div>
      ),
    },
    {
      id: "item-link",
      title: "Link (asChild)",
      text: "**Make the Destination the Real Interactive Element.** Set `asChild` on `Item` with an anchor when the entire row should navigate. The link receives the row's hover and focus treatment, creating one coherent target instead of a decorative container around a small text link.\n\nUse a meaningful `href`, keep the link's label clear and avoid nesting other interactive controls inside it; separate actions belong in a non-link item composition.",
      code: `import { Item, ItemActions, ItemContent, ItemDescription, ItemTitle } from "@/components/kamod-ui/item";
import { ChevronRight, ExternalLink } from "lucide-preact";

export const Example = () => (
  <div class="flex w-full max-w-md flex-col gap-4">
    <Item asChild>
      <a href="#item-link">
        <ItemContent>
          <ItemTitle>Visit our documentation</ItemTitle>
          <ItemDescription>Learn how to get started with our components.</ItemDescription>
        </ItemContent>
        <ItemActions>
          <ChevronRight class="size-4" />
        </ItemActions>
      </a>
    </Item>
    <Item variant="outline" asChild>
      <a href="#item-link" target="_blank" rel="noopener noreferrer">
        <ItemContent>
          <ItemTitle>External resource</ItemTitle>
          <ItemDescription>Opens in a new tab with security attributes.</ItemDescription>
        </ItemContent>
        <ItemActions>
          <ExternalLink class="size-4" />
        </ItemActions>
      </a>
    </Item>
  </div>
);`,
      renderPreview: () => (
        <div class="flex w-full max-w-md flex-col gap-4">
          <Item asChild>
            <a href="#item-link">
              <ItemContent>
                <ItemTitle>Visit Our Documentation</ItemTitle>
                <ItemDescription>Learn how to get started with our components.</ItemDescription>
              </ItemContent>
              <ItemActions>
                <ChevronRight class="size-4" />
              </ItemActions>
            </a>
          </Item>
          <Item variant="outline" asChild>
            <a href="#item-link" target="_blank" rel="noopener noreferrer">
              <ItemContent>
                <ItemTitle>External Resource</ItemTitle>
                <ItemDescription>Opens in a new tab with security attributes.</ItemDescription>
              </ItemContent>
              <ItemActions>
                <ExternalLink class="size-4" />
              </ItemActions>
            </a>
          </Item>
        </div>
      ),
    },
    {
      id: "item-separator",
      title: "Separator",
      text: "**Create Rhythm without Boxing Every Row.** Insert `ItemSeparator` between neighboring rows when a shared list needs quiet visual divisions. The horizontal rule follows the item group's rhythm without requiring each row to carry a complete card-like outline.\n\nMatch the surrounding spacing and avoid redundant borders when using outlined items; separators should clarify grouping rather than dominate it.",
      code: `import { Item, ItemContent, ItemGroup, ItemSeparator, ItemTitle } from "@/components/kamod-ui/item";

export const Example = () => (
  <ItemGroup class="max-w-sm">
    <Item variant="outline">
      <ItemContent>
        <ItemTitle>First</ItemTitle>
      </ItemContent>
    </Item>
    <ItemSeparator />
    <Item variant="outline">
      <ItemContent>
        <ItemTitle>Second</ItemTitle>
      </ItemContent>
    </Item>
  </ItemGroup>
);`,
      renderPreview: () => (
        <ItemGroup class="max-w-sm">
          <Item variant="outline">
            <ItemContent>
              <ItemTitle>First</ItemTitle>
            </ItemContent>
          </Item>
          <ItemSeparator />
          <Item variant="outline">
            <ItemContent>
              <ItemTitle>Second</ItemTitle>
            </ItemContent>
          </Item>
        </ItemGroup>
      ),
    },
    {
      id: "item-dropdown",
      title: "Inside Dropdown",
      text: "**Keep Rich Menu Rows Compact and Selectable.** Use an extra-small `Item` at full width inside `DropdownItem` for richer menu content. Keep the menu item's activation behavior clear, avoiding nested independent actions inside a row that already behaves as a command.\n\nPreserve the dropdown's keyboard semantics and avoid adding nested focusable controls that compete with row selection.",
      code: `import { Avatar, AvatarFallback, AvatarImage } from "@/components/kamod-ui/avatar"
import { Button } from "@/components/kamod-ui/button"
import { Dropdown, DropdownContent, DropdownItem, DropdownTrigger } from "@/components/kamod-ui/dropdown"
import { Item, ItemContent, ItemDescription, ItemMedia, ItemTitle } from "@/components/kamod-ui/item";
import { ChevronDown } from "lucide-preact";

export const Example = () => (
  <Dropdown>
    <DropdownTrigger>
      <Button variant="outline" class="gap-2">
        Select <ChevronDown class="size-4" />
      </Button>
    </DropdownTrigger>
    <DropdownContent class="min-w-48 p-1">
      {/* map people into DropdownItem + Item size="xs" */}
    </DropdownContent>
  </Dropdown>
);`,
      renderPreview: () => (
        <Dropdown>
          <DropdownTrigger>
            <Button variant="outline" class="gap-2">
              Select <ChevronDown class="size-4" />
            </Button>
          </DropdownTrigger>
          <DropdownContent class="min-w-48 p-1">
            {people.map((person) => (
              <DropdownItem key={person.username} class="h-auto rounded-md p-0">
                <Item size="xs" class="w-full cursor-pointer p-2">
                  <ItemMedia>
                    <Avatar class="size-6">
                      <AvatarImage src={person.avatar} class="grayscale" />
                      <AvatarFallback>{person.username.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </ItemMedia>
                  <ItemContent class="gap-0">
                    <ItemTitle>{person.username}</ItemTitle>
                    <ItemDescription class="leading-none">{person.email}</ItemDescription>
                  </ItemContent>
                </Item>
              </DropdownItem>
            ))}
          </DropdownContent>
        </Dropdown>
      ),
    },
    {
      id: "item-rtl",
      title: "RTL",
      text: '**Check the Whole Pattern in Its Reading Direction.** Set `dir="rtl"` on the surrounding item collection and preserve logical spacing. Media, text and trailing actions then follow the reading direction while any `asChild` link continues to represent the same destination.\n\nKeep values and keyboard behavior meaningful in the translated interface, and follow [Direction](/docs/direction/installation) when the page and its portaled controls need a shared direction.',
      code: `import { Item, ItemContent, ItemDescription, ItemMedia, ItemTitle } from "@/components/kamod-ui/item";
import { Inbox } from "lucide-preact";

export const Example = () => (
  <div dir="rtl" class="max-w-md">
    <Item variant="outline">
      <ItemMedia variant="icon">
        <Inbox />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>عنصر القائمة</ItemTitle>
        <ItemDescription>وصف قصير بمحاذاة منطقية.</ItemDescription>
      </ItemContent>
    </Item>
  </div>
);`,
      renderPreview: () => (
        <div dir="rtl" class="max-w-md">
          <Item variant="outline">
            <ItemMedia variant="icon">
              <Inbox />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>عنصر القائمة</ItemTitle>
              <ItemDescription>وصف قصير بمحاذاة منطقية.</ItemDescription>
            </ItemContent>
          </Item>
        </div>
      ),
    },
  ],
  apiRows: [
    { prop: "Item variant", type: '"default" | "outline" | "muted"', defaultValue: '"default"' },
    { prop: "Item size", type: '"default" | "sm" | "xs"', defaultValue: '"default"' },
    { prop: "Item asChild", type: "boolean", defaultValue: "false" },
    { prop: "ItemMedia variant", type: '"default" | "icon" | "image"', defaultValue: '"default"' },
    { prop: "ItemGroup", type: "container (role=list)", defaultValue: "—" },
    { prop: "ItemSeparator", type: "horizontal Separator", defaultValue: "—" },
    {
      prop: "ItemContent / ItemTitle / ItemDescription / ItemActions",
      type: "layout slots",
      defaultValue: "optional",
    },
    { prop: "ItemHeader / ItemFooter", type: "full-width rows", defaultValue: "optional" },
  ],
  accessibilityText:
    "ItemGroup exposes role=list; use listitem on interactive rows when appropriate. Keep ItemTitle text meaningful; for icon-only actions set aria-label on controls.",
});
