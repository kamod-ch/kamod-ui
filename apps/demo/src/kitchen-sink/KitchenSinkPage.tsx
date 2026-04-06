import { useState } from "preact/hooks";
import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarImage,
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Checkbox,
  Dropdown,
  DropdownContent,
  DropdownGroup,
  DropdownItem,
  DropdownSeparator,
  DropdownSub,
  DropdownSubContent,
  DropdownSubTrigger,
  DropdownTrigger,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  Label,
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  RadioGroup,
  SelectableCard,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Separator,
  Slider,
  Spinner,
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
  Switch,
  Textarea,
  ThemeToggle,
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from "@kamod-ui/core";
import {
  ArrowUp,
  AtSign,
  BookOpen,
  Calendar,
  Check,
  Crosshair,
  FileText,
  Globe,
  Info,
  LayoutDashboard,
  LayoutGrid,
  Lightbulb,
  Menu,
  Mic,
  MoreHorizontal,
  Paperclip,
  Plus,
  Search,
  SunMoon,
  Target,
  Users,
  Wallet
} from "lucide-preact";
import { docsBySlug, docsPages, docsUpdatedComponentSlugs } from "../docs/registry";
import { DemoShell, demoTopNavItems } from "../layout/DemoShell";
import { ThemePresetSelect } from "../theme/ThemePresetSelect";

const sortedDocPages = [...docsPages].sort((a, b) => a.title.localeCompare(b.title));

const docFirstSectionHref = (slug: string) => {
  const first = docsBySlug[slug]?.sections[0]?.id ?? "installation";
  return `/docs/${slug}/${first}`;
};

const PRICE_RANGE_MIN = 0;
const PRICE_RANGE_MAX = 1000;
const PRICE_RANGE_STEP = 10;
const PRICE_RANGE_SPAN = PRICE_RANGE_MAX - PRICE_RANGE_MIN;

const snapPriceStep = (value: number) =>
  PRICE_RANGE_MIN +
  Math.round((value - PRICE_RANGE_MIN) / PRICE_RANGE_STEP) * PRICE_RANGE_STEP;

/** Dual-thumb price range slider demo for the live kitchen sink. */
const KitchenSinkSliderShowcase = () => {
  const [budget, setBudget] = useState(() => [
    snapPriceStep(PRICE_RANGE_MIN + 0.26 * PRICE_RANGE_SPAN),
    snapPriceStep(PRICE_RANGE_MIN + 0.74 * PRICE_RANGE_SPAN)
  ]);

  return (
    <div class="grid gap-4">
      <div class="landing-price-range-block">
        <h3 class="landing-price-range-title">Price range</h3>
        <p class="muted text-sm">
          Budget ${budget[0]} – ${budget[1]} (dual-thumb <code class="text-xs">Slider</code>).
        </p>
        <Slider
          value={budget}
          onValueChange={setBudget}
          min={PRICE_RANGE_MIN}
          max={PRICE_RANGE_MAX}
          step={PRICE_RANGE_STEP}
          class="w-full"
          aria-label="Budget range"
        />
      </div>
    </div>
  );
};

const CHAT_COMPOSER_MODES = ["Auto", "Agent", "Manual"] as const;
type ChatComposerMode = (typeof CHAT_COMPOSER_MODES)[number];

/** “All Sources” panel: toggles, nested workspace list, footer — compact / fine UI. */
const AiPromptSourcesMenu = () => {
  const [webSearch, setWebSearch] = useState(true);
  const [appsIntegrations, setAppsIntegrations] = useState(true);

  const row = "flex cursor-default select-none items-center gap-1.5 rounded-md px-1.5 py-1 text-xs font-normal leading-tight outline-none";
  const item = "gap-1.5 py-1 text-xs font-normal leading-tight [&_svg:not([class*='size-'])]:size-3";

  return (
    <Dropdown>
      <DropdownTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="xs"
          class="h-6 gap-1 rounded-full border-border/70 px-2 text-[11px] font-normal leading-none text-muted-foreground shadow-none hover:bg-muted/40"
          aria-label="Search sources"
        >
          <Globe class="size-3 opacity-80" strokeWidth={1.75} />
          All Sources
        </Button>
      </DropdownTrigger>
      <DropdownContent
        side="top"
        align="center"
        sideOffset={4}
        class="landing-ai-sources-menu !max-h-none min-w-[15rem] w-[15rem] overflow-visible rounded-lg border border-border/55 bg-popover p-0 py-1 text-xs shadow-md"
      >
        <div class="flex flex-col gap-px px-0.5">
          <div role="menuitem" class={row}>
            <Globe class="size-3 shrink-0 text-muted-foreground" strokeWidth={1.75} />
            <span class="min-w-0 flex-1 text-left">Web Search</span>
            <Switch
              checked={webSearch}
              onCheckedChange={setWebSearch}
              size="sm"
              class="origin-right scale-90 shrink-0 data-[state=checked]:bg-foreground data-[state=checked]:saturate-100"
              aria-label="Web Search"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          <div role="menuitem" class={row}>
            <LayoutGrid class="size-3 shrink-0 text-muted-foreground" strokeWidth={1.75} />
            <span class="min-w-0 flex-1 text-left">Apps and Integrations</span>
            <Switch
              checked={appsIntegrations}
              onCheckedChange={setAppsIntegrations}
              size="sm"
              class="origin-right scale-90 shrink-0 data-[state=checked]:bg-foreground data-[state=checked]:saturate-100"
              aria-label="Apps and Integrations"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          <DropdownItem class={item}>
            <Crosshair class="size-3 text-muted-foreground" strokeWidth={1.75} />
            All Sources I can access
          </DropdownItem>
          <DropdownSub>
            <DropdownSubTrigger class={`${item} gap-1.5 py-1 [&_svg]:size-3`}>
              <Avatar class="size-5 shrink-0 rounded-[5px]">
                <AvatarFallback class="rounded-[5px] bg-gradient-to-br from-violet-500 via-fuchsia-500 to-cyan-400 text-[9px] font-semibold text-white">
                  S
                </AvatarFallback>
              </Avatar>
              shadcn
            </DropdownSubTrigger>
            <DropdownSubContent
              side="inline-start"
              class="landing-ai-sources-submenu w-[min(14.5rem,calc(100vw-2rem))] rounded-lg border border-border/55 bg-popover p-1.5 text-xs shadow-md"
            >
              <InputGroup class="mb-1.5 rounded-full border border-border/45 bg-muted/35 shadow-none">
                <InputGroupText class="pl-2 text-muted-foreground">
                  <Search class="size-3 shrink-0 opacity-70" strokeWidth={1.75} />
                </InputGroupText>
                <InputGroupInput
                  placeholder="Find or use knowledge in…"
                  class="h-6 border-0 bg-transparent py-1 text-[11px] shadow-none placeholder:text-muted-foreground/75 focus-visible:ring-0"
                />
              </InputGroup>
              <div class="flex flex-col gap-px">
                <DropdownItem class={item}>
                  <Avatar class="size-6 shrink-0">
                    <AvatarFallback class="bg-gradient-to-br from-violet-500 via-fuchsia-500 to-cyan-400 text-[9px] text-white">
                      S
                    </AvatarFallback>
                  </Avatar>
                  shadcn - Workspace
                </DropdownItem>
                <DropdownItem class={item}>
                  <Avatar class="size-6 shrink-0">
                    <AvatarImage
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&q=80"
                      alt=""
                    />
                    <AvatarFallback>M</AvatarFallback>
                  </Avatar>
                  maxleiter - Workspace
                </DropdownItem>
                <DropdownItem class={item}>
                  <Avatar class="size-6 shrink-0 bg-muted">
                    <AvatarFallback class="text-sm leading-none">🐰</AvatarFallback>
                  </Avatar>
                  evilrabbit - Workspace
                </DropdownItem>
              </div>
            </DropdownSubContent>
          </DropdownSub>
          <DropdownItem class={item}>
            <BookOpen class="size-3 text-muted-foreground" strokeWidth={1.75} />
            Help Center
          </DropdownItem>
        </div>
        <DropdownSeparator class="my-1.5 bg-border/70" />
        <div class="px-0.5 pb-0.5">
          <DropdownItem class={item}>
            <Plus class="size-3 text-muted-foreground" strokeWidth={1.75} />
            Connect Apps
          </DropdownItem>
          <p class="px-1.5 pb-0.5 pt-1 text-[10px] leading-snug text-muted-foreground">
            {"We'll only search in the sources selected here."}
          </p>
        </div>
      </DropdownContent>
    </Dropdown>
  );
};

const ADD_CONTEXT_PAGES = [
  { id: "notes", label: "Meeting Notes", Icon: FileText },
  { id: "dashboard", label: "Project Dashboard", Icon: LayoutDashboard },
  { id: "ideas", label: "Ideas & Brainstorming", Icon: Lightbulb },
  { id: "calendar", label: "Calendar & Events", Icon: Calendar },
  { id: "docs", label: "Documentation", Icon: BookOpen },
  { id: "goals", label: "Goals & Objectives", Icon: Target },
  { id: "budget", label: "Budget Planning", Icon: Wallet },
  { id: "team", label: "Team Directory", Icon: Users }
] as const;

/** @ Add context — compact overlay: search + Pages list (Notion-style). */
const AiPromptAddContextMenu = () => {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string>("dashboard");

  const q = query.trim().toLowerCase();
  const filtered = ADD_CONTEXT_PAGES.filter((p) => p.label.toLowerCase().includes(q));

  return (
    <Dropdown>
      <DropdownTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="xs"
          class="landing-ai-prompt-context h-6 gap-1 rounded-md border-border/70 bg-muted/25 px-2 text-[11px] font-normal leading-none text-foreground shadow-none hover:bg-muted/45"
          aria-label="Add context"
          aria-haspopup="menu"
        >
          <AtSign class="size-3 text-muted-foreground" strokeWidth={1.75} />
          Add context
        </Button>
      </DropdownTrigger>
      <DropdownContent
        side="bottom"
        align="start"
        sideOffset={5}
        class="landing-ai-add-context-menu !max-h-none w-[min(13.75rem,calc(100vw-1.5rem))] overflow-hidden rounded-[10px] border border-border/55 bg-popover p-1.5 text-xs shadow-md"
      >
        <InputGroup class="mb-1.5 rounded-full border border-border/40 bg-muted/35 shadow-none">
          <InputGroupText class="pl-2 text-muted-foreground">
            <Search class="size-3 shrink-0 opacity-70" strokeWidth={1.75} />
          </InputGroupText>
          <InputGroupInput
            placeholder="Search pages..."
            value={query}
            onInput={(e) => setQuery((e.currentTarget as HTMLInputElement).value)}
            class="h-6 border-0 bg-transparent py-1 text-[11px] shadow-none placeholder:text-muted-foreground/70 focus-visible:ring-0"
            aria-label="Search pages"
          />
        </InputGroup>
        <p class="mb-0.5 px-1.5 text-[10px] font-medium uppercase tracking-[0.06em] text-muted-foreground">
          Pages
        </p>
        <div class="max-h-[min(14rem,42dvh)] overflow-y-auto overscroll-contain">
          {filtered.length === 0 ? (
            <p class="px-2 py-2 text-center text-[10px] leading-snug text-muted-foreground">No pages match</p>
          ) : (
            <div class="flex flex-col gap-px">
              {filtered.map((page) => {
                const Icon = page.Icon;
                const isActive = selectedId === page.id;
                return (
                  <DropdownItem
                    key={page.id}
                    class={`gap-1.5 rounded-md py-1 pl-1.5 pr-1.5 text-[12px] font-normal leading-tight [&_svg]:size-3 ${
                      isActive ? "bg-muted/70 text-foreground" : ""
                    }`}
                    onClick={() => setSelectedId(page.id)}
                  >
                    <Icon class="shrink-0 text-muted-foreground opacity-90" strokeWidth={1.75} />
                    <span class="min-w-0 text-left">{page.label}</span>
                  </DropdownItem>
                );
              })}
            </div>
          )}
        </div>
      </DropdownContent>
    </Dropdown>
  );
};

/** Multi-line prompt with @ Add context, attach / mode / source toolbar — reference AI search UI. */
const KitchenSinkAiPromptComposer = () => {
  return (
    <div class="landing-ai-prompt" data-testid="kitchen-sink-ai-prompt">
      <AiPromptAddContextMenu />
      <Textarea
        id="lp-context"
        placeholder="Ask, search, or make anything…"
        rows={2}
        class="landing-ai-prompt-textarea min-h-0 resize-none text-xs leading-snug placeholder:text-muted-foreground/75"
      />
      <div class="landing-ai-prompt-toolbar" role="toolbar" aria-label="Prompt actions">
        <div class="landing-ai-prompt-toolbar-left">
          <Button
            type="button"
            size="icon-xs"
            variant="ghost"
            class="h-6 w-6 shrink-0 border border-border/70 text-muted-foreground hover:bg-muted/40 hover:text-foreground"
            aria-label="Attach file"
          >
            <Paperclip class="size-3.5" strokeWidth={1.75} />
          </Button>
          <ChatComposerModeDropdown compact />
        </div>
        <div class="landing-ai-prompt-toolbar-center">
          <AiPromptSourcesMenu />
        </div>
        <div class="landing-ai-prompt-toolbar-right">
          <Button
            type="button"
            size="icon-xs"
            class="landing-ai-prompt-send h-[1.375rem] w-[1.375rem] min-h-[1.375rem] min-w-[1.375rem] shrink-0 rounded-full bg-foreground p-0 text-background shadow-none hover:bg-foreground/90 [&_svg]:size-3"
            aria-label="Submit"
          >
            <ArrowUp strokeWidth={1.75} />
          </Button>
        </div>
      </div>
    </div>
  );
};

/** Mode selector in the landing chat composer toolbar (opens above the trigger). */
const ChatComposerModeDropdown = ({ compact }: { compact?: boolean } = {}) => {
  const [mode, setMode] = useState<ChatComposerMode>("Auto");
  return (
    <Dropdown>
      <DropdownTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="xs"
          class={
            compact
              ? "h-4 min-h-4 shrink-0 rounded-full border-0 bg-muted/50 px-1.5 text-[10px] font-normal leading-none text-muted-foreground shadow-none hover:bg-muted/70 hover:text-foreground aria-expanded:bg-muted/70"
              : "h-5 shrink-0 rounded-full border-0 bg-muted/55 px-2 text-[11px] font-normal leading-none text-foreground shadow-none hover:bg-muted/75 aria-expanded:bg-muted/75"
          }
          aria-label={`Chat mode: ${mode}`}
        >
          {mode}
        </Button>
      </DropdownTrigger>
      <DropdownContent
        side="top"
        align="start"
        sideOffset={compact ? 2 : 3}
        class={
          compact
            ? "min-w-[4.75rem] gap-0 rounded-md border border-border/55 bg-popover p-0.5 shadow-sm"
            : "min-w-[5.75rem] gap-0 rounded-lg border border-border/60 bg-popover shadow-sm"
        }
      >
        <DropdownGroup>
          {CHAT_COMPOSER_MODES.map((m) => (
            <DropdownItem
              key={m}
              class={
                compact
                  ? "rounded px-1.5 py-0.5 text-[10px] font-normal leading-tight"
                  : "rounded-md px-2 py-1 text-[11px] font-normal leading-tight"
              }
              onClick={() => setMode(m)}
            >
              {m}
            </DropdownItem>
          ))}
        </DropdownGroup>
      </DropdownContent>
    </Dropdown>
  );
};

const GpuStepper = () => {
  const [n, setN] = useState(2);
  return (
    <div class="landing-gpu-stepper">
      <Button
        type="button"
        size="icon"
        variant="outline"
        aria-label="Decrease GPUs"
        onClick={() => setN((v) => Math.max(0, v - 1))}
      >
        −
      </Button>
      <span class="landing-gpu-stepper-value tabular-nums">{n}</span>
      <Button
        type="button"
        size="icon"
        variant="outline"
        aria-label="Increase GPUs"
        onClick={() => setN((v) => v + 1)}
      >
        +
      </Button>
    </div>
  );
};

const HEAR_ABOUT_OPTIONS = [
  { id: "social", label: "Social Media" },
  { id: "search", label: "Search Engine" },
  { id: "referral", label: "Referral" },
  { id: "other", label: "Other" }
] as const;

type HearAboutId = (typeof HEAR_ABOUT_OPTIONS)[number]["id"];

/** Pill chips with optional checkmark — matches multi-select “how did you hear about us” pattern. */
const HearAboutUsChips = () => {
  const [selected, setSelected] = useState<Record<HearAboutId, boolean>>({
    social: true,
    search: true,
    referral: false,
    other: false
  });

  return (
    <div
      role="group"
      aria-labelledby="hear-about-label"
      aria-describedby="hear-about-desc"
      class="flex flex-wrap gap-1.5"
    >
      {HEAR_ABOUT_OPTIONS.map(({ id, label }) => {
        const checked = selected[id];
        return (
          <label
            key={id}
            data-slot="kitchen-hear-about-chip"
            data-state={checked ? "checked" : "unchecked"}
            class={`inline-flex cursor-pointer items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium transition-colors select-none ${
              checked ? "border-border bg-muted text-foreground" : "border-border/60 bg-background text-foreground"
            }`}
          >
            <input
              type="checkbox"
              class="sr-only"
              checked={checked}
              aria-label={label}
              onChange={() => setSelected((s) => ({ ...s, [id]: !s[id] }))}
            />
            {checked ? (
              <span
                data-slot="kitchen-hear-about-chip-indicator"
                class="flex size-3 shrink-0 items-center justify-center rounded-full bg-foreground text-background dark:bg-background dark:text-foreground"
                aria-hidden="true"
              >
                <Check class="size-2" strokeWidth={2.5} />
              </span>
            ) : null}
            <span>{label}</span>
          </label>
        );
      })}
    </div>
  );
};

/** Full composite demos: forms, inputs, feedback, and navigation patterns in one grid. */
const KitchenSinkShowcase = () => (
  <div
    class="landing-showcase landing-showcase--flat kitchen-sink-showcase"
    aria-label="Kitchen sink — composite component examples"
    data-testid="kitchen-sink-showcase"
  >
    <div class="landing-showcase-grid--4">
      {/* —— Column 1: Payment form (shadcn-style sections) —— */}
      <div class="landing-showcase-panel landing-payment-panel" data-testid="kitchen-sink-payment-panel">
        {/* Section: Payment Method */}
        <div class="landing-payment-block">
          <h3 class="landing-payment-title">Payment Method</h3>
          <p class="muted">All transactions are secure and encrypted</p>
        </div>
        <div class="landing-showcase-field">
          <Label for="lp-name">Name on Card</Label>
          <Input id="lp-name" placeholder="John Doe" autoComplete="off" />
        </div>
        <div class="landing-payment-card-cvv-row">
          <div class="landing-showcase-field landing-payment-card-field">
            <Label for="lp-num">Card Number</Label>
            <Input id="lp-num" placeholder="1234 5678 9012 3456" autoComplete="off" />
            <p class="landing-payment-hint">Enter your 16-digit number.</p>
          </div>
          <div class="landing-showcase-field landing-payment-cvv-field">
            <Label for="lp-cvv">CVV</Label>
            <Input id="lp-cvv" placeholder="123" autoComplete="off" />
          </div>
        </div>
        <div class="landing-payment-expiry-row">
          <div class="landing-showcase-field landing-payment-expiry-field">
            <Label class="landing-payment-expiry-label">Month</Label>
            <Select>
              <SelectTrigger class="landing-payment-select-trigger">
                <SelectValue placeholder="MM" />
              </SelectTrigger>
              <SelectContent class="max-h-44">
                <SelectItem value="01">01</SelectItem>
                <SelectItem value="02">02</SelectItem>
                <SelectItem value="03">03</SelectItem>
                <SelectItem value="04">04</SelectItem>
                <SelectItem value="05">05</SelectItem>
                <SelectItem value="06">06</SelectItem>
                <SelectItem value="07">07</SelectItem>
                <SelectItem value="08">08</SelectItem>
                <SelectItem value="09">09</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="11">11</SelectItem>
                <SelectItem value="12">12</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div class="landing-showcase-field landing-payment-expiry-field">
            <Label class="landing-payment-expiry-label">Year</Label>
            <Select>
              <SelectTrigger class="landing-payment-select-trigger">
                <SelectValue placeholder="YYYY" />
              </SelectTrigger>
              <SelectContent class="max-h-44">
                <SelectItem value="2025">2025</SelectItem>
                <SelectItem value="2026">2026</SelectItem>
                <SelectItem value="2027">2027</SelectItem>
                <SelectItem value="2028">2028</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Separator class="landing-payment-separator" />

        {/* Section: Billing Address */}
        <div class="landing-payment-block">
          <h4 class="landing-payment-section-title">Billing Address</h4>
          <p class="muted">The billing address associated with your payment method</p>
        </div>
        <label class="flex cursor-pointer items-center gap-2.5 text-sm">
          <Checkbox id="lp-ship" defaultChecked class="shrink-0" />
          <span class="text-foreground leading-snug">Same as shipping address</span>
        </label>

        <Separator class="landing-payment-separator" />

        {/* Section: Comments */}
        <div class="landing-payment-block">
          <h4 class="landing-payment-section-title">Comments</h4>
        </div>
        <Textarea
          id="lp-comments"
          rows={2}
          placeholder="Add any additional comments"
          class="landing-payment-comments min-h-0 resize-none text-sm"
        />

        <div class="flex flex-wrap gap-2 pt-1">
          <Button>Submit</Button>
          <Button variant="outline">Cancel</Button>
        </div>
      </div>

      {/* —— Column 2 —— */}
      <div class="landing-showcase-panel landing-showcase-col2">
        <div class="landing-empty-state-card">
          <AvatarGroup class="justify-center">
            <Avatar size="sm">
              <AvatarImage
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&q=80"
                alt=""
              />
              <AvatarFallback class="text-xs">A</AvatarFallback>
            </Avatar>
            <Avatar size="sm">
              <AvatarImage
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&q=80"
                alt=""
              />
              <AvatarFallback class="text-xs">B</AvatarFallback>
            </Avatar>
            <Avatar size="sm">
              <AvatarImage
                src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&q=80"
                alt=""
              />
              <AvatarFallback class="text-xs">C</AvatarFallback>
            </Avatar>
          </AvatarGroup>
          <h3 class="landing-empty-state-heading">No Team Members</h3>
          <p class="muted landing-empty-state-copy">Invite your team to collaborate on this project.</p>
          <Button type="button" size="sm" class="landing-invite-members-btn rounded-full">
            <Plus class="size-3.5" strokeWidth={2.5} />
            Invite Members
          </Button>
        </div>

        <div class="flex flex-wrap gap-2">
          <Badge variant="default" size="sm" class="gap-1.5 font-normal">
            <Spinner size="xs" />
            Syncing
          </Badge>
          <Badge variant="outline" size="sm" class="gap-1.5 font-normal">
            <Spinner size="xs" tone="muted" />
            Updating
          </Badge>
          <Badge variant="outline" size="sm" class="gap-1.5 font-normal">
            <Spinner size="xs" tone="muted" />
            Loading
          </Badge>
        </div>

        <div class="landing-message-bar">
          <Button type="button" size="icon" variant="outline" class="rounded-full shrink-0 shadow-xs" aria-label="Add">
            <Plus class="size-4" strokeWidth={2} />
          </Button>
          <InputGroup class="min-w-0 flex-1 rounded-full shadow-xs">
            <InputGroupInput placeholder="Send a message..." class="text-sm" />
            <Tooltip>
              <TooltipTrigger asChild>
                <InputGroupButton type="button" size="icon-sm" variant="ghost" aria-label="Voice input">
                  <Mic class="size-4 opacity-60" strokeWidth={2} />
                </InputGroupButton>
              </TooltipTrigger>
              <TooltipContent side="top">Voice input</TooltipContent>
            </Tooltip>
          </InputGroup>
        </div>

        <KitchenSinkSliderShowcase />

        <InputGroup class="rounded-full shadow-xs">
          <InputGroupText class="pl-3 text-muted-foreground">
            <Search class="size-4 shrink-0 opacity-70" strokeWidth={2} />
          </InputGroupText>
          <InputGroupInput placeholder="Search..." class="text-sm" />
          <InputGroupText class="pr-3 text-xs text-muted-foreground tabular-nums">12 results</InputGroupText>
        </InputGroup>

        <InputGroup class="rounded-full shadow-xs">
          <InputGroupText class="select-none pl-3 text-sm text-muted-foreground">https://</InputGroupText>
          <InputGroupInput class="text-sm text-foreground" defaultValue="example.com" />
          <Tooltip>
            <TooltipTrigger asChild>
              <InputGroupButton type="button" size="icon-sm" variant="ghost" class="text-muted-foreground" aria-label="Info">
                <Info class="size-4 opacity-80" strokeWidth={2} />
              </InputGroupButton>
            </TooltipTrigger>
            <TooltipContent side="top">This is content in a tooltip.</TooltipContent>
          </Tooltip>
        </InputGroup>

        <div class="landing-chat-composer">
          <Textarea
            placeholder="Ask, Search or Chat..."
            rows={2}
            class="landing-chat-composer-field min-h-0 resize-none text-xs leading-snug placeholder:text-muted-foreground/75"
          />
          <div class="landing-chat-composer-toolbar">
            <Button
              type="button"
              size="icon-xs"
              variant="outline"
              class="landing-chat-composer-icon-btn shrink-0 rounded-full border-border/70 bg-background shadow-none"
              aria-label="Add"
            >
              <Plus class="size-3" strokeWidth={1.5} />
            </Button>
            <ChatComposerModeDropdown />
            <span class="min-w-0 flex-1" />
            <span class="landing-chat-composer-usage tabular-nums">52% used</span>
            <span class="landing-chat-composer-toolbar-sep" aria-hidden />
            <Button
              type="button"
              size="icon-xs"
              variant="default"
              class="landing-chat-composer-send shrink-0 rounded-full shadow-none"
              aria-label="Send"
            >
              <ArrowUp class="size-3" strokeWidth={1.75} />
            </Button>
          </div>
        </div>

        <InputGroup class="rounded-full shadow-xs">
          <InputGroupInput defaultValue="@shadcn" class="text-sm" />
          <InputGroupAddon align="inline-end">
            <Badge
              variant="default"
              size="xxs"
              class="h-5 min-h-5 min-w-5 justify-center p-0 shadow-none [&_svg]:size-2.5"
              role="status"
              aria-label="Selected"
            >
              <Check strokeWidth={2.5} />
            </Badge>
          </InputGroupAddon>
        </InputGroup>
      </div>

      {/* —— Column 3 —— */}
      <div class="landing-showcase-panel">
        <div class="landing-showcase-row items-center">
          <div>
            <h3 class="!mb-0">Two-factor authentication</h3>
            <p class="muted">Verify via email or phone number.</p>
          </div>
          <Button variant="outline">Enable</Button>
        </div>
        <div class="flex items-start gap-2.5 rounded-lg border border-border bg-muted/25 px-3 py-2.5">
          <span class="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
            <Check class="size-3.5" strokeWidth={2.5} />
          </span>
          <p class="text-sm leading-snug">Your profile has been verified.</p>
        </div>
        <Separator />
        <p class="muted mb-1.5">Compute Environment</p>
        <p class="text-xs text-muted-foreground mb-2">Select the compute environment for your cluster.</p>
        <RadioGroup defaultValue="k8s" class="landing-showcase-radio-stack">
          <SelectableCard value="k8s">
            <span class="grid gap-0.5 text-left">
              <span class="text-sm font-medium leading-tight">Kubernetes</span>
              <span class="text-xs font-normal text-muted-foreground leading-snug">
                Run GPU workloads on a K8s configured cluster. This is the default.
              </span>
            </span>
          </SelectableCard>
          <SelectableCard value="vm">
            <span class="grid gap-0.5 text-left">
              <span class="text-sm font-medium leading-tight">Virtual Machine</span>
              <span class="text-xs font-normal text-muted-foreground leading-snug">
                Access a VM configured cluster to run workloads.
              </span>
            </span>
          </SelectableCard>
        </RadioGroup>
        <div class="landing-showcase-field">
          <Label>Number of GPUs</Label>
          <p class="text-xs text-muted-foreground">You can add more later.</p>
          <GpuStepper />
        </div>
        <Separator />
        <div class="landing-showcase-row items-center">
          <div>
            <p class="text-sm font-medium leading-none">Appearance Settings</p>
            <p class="muted mt-1">Wallpaper Tinting</p>
            <p class="text-xs text-muted-foreground">Allow the wallpaper to be tinted.</p>
          </div>
          <Switch
            defaultChecked
            aria-label="Wallpaper tinting"
            size="sm"
            class="data-[state=checked]:bg-foreground data-[state=checked]:saturate-100"
          />
        </div>
      </div>

      {/* —— Column 4 —— */}
      <div class="landing-showcase-panel">
        <KitchenSinkAiPromptComposer />
        <div class="flex flex-wrap items-center gap-1">
          <Button variant="outline">Archive</Button>
          <Button variant="outline">Report</Button>
          <Button variant="outline">Snooze</Button>
          <Button size="icon" variant="ghost" aria-label="More">
            <MoreHorizontal class="size-4" />
          </Button>
        </div>
        <label class="flex cursor-pointer items-start gap-2 text-sm">
          <Checkbox defaultChecked class="mt-0.5 shrink-0" aria-label="Agree to terms" />
          <span class="text-muted-foreground leading-snug">I agree to the terms and conditions</span>
        </label>
        <Pagination class="kitchen-sink-pagination-h8 justify-start">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive>
                2
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">3</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
        <Card size="sm" class="w-full min-w-0">
          <CardHeader>
            <CardTitle id="hear-about-label" class="text-sm font-semibold leading-snug">
              How did you hear about us?
            </CardTitle>
            <CardDescription id="hear-about-desc">
              Select the option that best describes how you heard about us.
            </CardDescription>
          </CardHeader>
          <CardContent class="pt-0">
            <HearAboutUsChips />
          </CardContent>
        </Card>
        <div class="rounded-lg border border-border bg-muted/20 px-4 py-6 text-center">
          <Spinner class="mx-auto mb-3" size="md" tone="primary" />
          <p class="text-sm font-medium">Processing your request</p>
          <p class="muted mt-1 mb-3">Please wait while we process your request. Do not refresh the page.</p>
          <Button variant="outline">Cancel</Button>
        </div>
      </div>
    </div>
  </div>
);

export const KitchenSinkPage = () => (
  <DemoShell
    brand="Kamod UI"
    rootClassName="docs-shell landing-shell landing-shell--shadcn"
    topNavItems={demoTopNavItems}
    topNavLinksTestId="kitchen-sink-nav"
    topbarLeading={
      <Sheet class="docs-mobile-menu" lockBodyScroll>
        <SheetTrigger aria-label="Open navigation menu" class="docs-mobile-menu-trigger">
          <Menu size={18} />
        </SheetTrigger>
        <SheetContent class="docs-mobile-sheet" side="left" aria-label="Docs navigation panel">
          <div class="docs-mobile-sheet-head">
            <h2>Components</h2>
          </div>
          <nav aria-label="Mobile docs navigation" class="docs-mobile-sheet-nav">
            <SheetClose asChild>
              <a href="/docs/components" class="docs-nav-button">
                <span>Components overview</span>
              </a>
            </SheetClose>
            {sortedDocPages.map((doc) => (
              <SheetClose key={doc.slug} asChild>
                <a href={docFirstSectionHref(doc.slug)} class="docs-nav-button">
                  <span>{doc.title}</span>
                  {docsUpdatedComponentSlugs.has(doc.slug) ? <Badge variant="success">updated</Badge> : null}
                </a>
              </SheetClose>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
    }
    topbarActions={
      <>
        <ThemePresetSelect class="docs-theme-preset" selectClass="docs-theme-preset-select" />
        <ThemeToggle class="docs-topbar-theme-toggle">
          <SunMoon />
        </ThemeToggle>
      </>
    }
    mainContent={
      <div id="kitchen-sink" class="landing-shadcn-main" data-testid="kitchen-sink">
        <section class="landing-shadcn-intro" aria-labelledby="kitchen-sink-title">
          <div>
            <p class="landing-shadcn-intro-eyebrow">Kitchen Sink</p>
            <h1 id="kitchen-sink-title">Own your UI. Built for Preact.</h1>
            <p class="landing-shadcn-intro-lead">
              A set of beautifully designed components that you can customize, extend, and build on. Open Source. Open Code.
            </p>
            <div class="landing-shadcn-intro-ctas">
              <Button href="/docs/button/installation">Get Started</Button>
              <Button href="/docs/components" variant="outline">
                View Components
              </Button>
            </div>
          </div>
          <div class="landing-shadcn-subnav-bar2" />
        </section>

        <KitchenSinkShowcase />

        <p class="landing-shadcn-footer-note">
          This route is the{" "}
          <span class="font-medium text-foreground">demo kitchen sink</span>. Layout inspired by{" "}
          <a href="https://ui.shadcn.com/" target="_blank" rel="noreferrer">
            ui.shadcn.com
          </a>{" "}
          — built with Kamod UI + Tailwind.
        </p>
      </div>
    }
    rightSidebar={null}
  />
);
