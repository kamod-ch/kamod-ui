import { ChevronLeftIcon, ChevronRightIcon, QuoteIcon } from "@kamod-ch/icons/lucide";
import { Avatar, AvatarFallback, Button, Card, CardContent, cn } from "@kamod-ch/ui";
import { useControllableState } from "../../shared";
import { usePrefersReducedMotion } from "../shared/motion";

export type Testimonial = {
  quote: string;
  name: string;
  role: string;
  company: string;
  initials: string;
};

export type Testimonials01Props = {
  eyebrow?: string;
  heading?: string;
  items?: Testimonial[];
  index?: number;
  defaultIndex?: number;
  onIndexChange?: (index: number) => void;
  previousLabel?: string;
  nextLabel?: string;
};

const defaultItems: Testimonial[] = [
  {
    quote:
      "We replaced four spreadsheets and two SaaS tools with this. Onboarding time dropped from 6 days to under 4 hours.",
    name: "Aisha Rahman",
    role: "Head of People",
    company: "Northwind Logistics",
    initials: "AR",
  },
  {
    quote:
      "The audit trail alone is worth it. SOC2 evidence collection went from a quarterly nightmare to a one-click export.",
    name: "Marco Vidal",
    role: "Director of Compliance",
    company: "Helio Health",
    initials: "MV",
  },
  {
    quote:
      "My favourite part is how fast it is. No spinners, no loading states. Search returns instantly across the entire org.",
    name: "Tomoko Saito",
    role: "IT Operations",
    company: "Pixel & Co",
    initials: "TS",
  },
];

export const Testimonials01 = ({
  eyebrow = "Testimonials",
  heading = "Loved by teams everywhere",
  items = defaultItems,
  index,
  defaultIndex = 0,
  onIndexChange,
  previousLabel = "Previous testimonial",
  nextLabel = "Next testimonial",
}: Testimonials01Props) => {
  const reduceMotion = usePrefersReducedMotion();
  const [active, setActive] = useControllableState({
    value: index,
    defaultValue: defaultIndex,
    onChange: onIndexChange,
  });
  const current = items[active] ?? items[0];
  if (!current) return null;

  const go = (next: number) => {
    const bounded = ((next % items.length) + items.length) % items.length;
    setActive(bounded);
  };

  return (
    <section data-slot="block-testimonials-01" class="bg-muted/30 text-foreground">
      <div class="mx-auto max-w-4xl px-6 py-24">
        <div class="text-center">
          <p class="text-sm font-medium tracking-widest text-primary uppercase">{eyebrow}</p>
          <h2 class="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">{heading}</h2>
        </div>
        <Card class="mt-10">
          <CardContent class="space-y-6 p-8 text-center">
            <QuoteIcon class="mx-auto text-primary" size={32} />
            <p
              class={cn(
                "text-xl leading-relaxed text-foreground sm:text-2xl",
                reduceMotion ? "" : "transition-opacity duration-200",
              )}
            >
              “{current.quote}”
            </p>
            <div class="flex flex-col items-center gap-2">
              <Avatar class="size-12">
                <AvatarFallback>{current.initials}</AvatarFallback>
              </Avatar>
              <div>
                <p class="text-sm font-semibold">{current.name}</p>
                <p class="text-xs text-muted-foreground">
                  {current.role} · {current.company}
                </p>
              </div>
            </div>
            <p class="sr-only" aria-live="polite">
              Showing testimonial {active + 1} of {items.length} from {current.name}
            </p>
          </CardContent>
        </Card>
        <div
          class="mt-6 flex items-center justify-center gap-3"
          onKeyDown={(event) => {
            if (event.key === "ArrowLeft") {
              event.preventDefault();
              go(active - 1);
            }
            if (event.key === "ArrowRight") {
              event.preventDefault();
              go(active + 1);
            }
          }}
        >
          <Button
            type="button"
            size="icon"
            variant="outline"
            aria-label={previousLabel}
            onClick={() => go(active - 1)}
          >
            <ChevronLeftIcon size={16} />
          </Button>
          <div class="flex justify-center gap-2">
            {items.map((item, itemIndex) => (
              <button
                key={item.name}
                type="button"
                aria-label={`Show testimonial from ${item.name}`}
                aria-current={itemIndex === active ? "true" : undefined}
                class={cn(
                  "size-2 rounded-full motion-reduce:transition-none",
                  reduceMotion ? "" : "transition-all duration-200",
                  itemIndex === active
                    ? "w-6 bg-primary"
                    : "bg-muted-foreground/30 hover:bg-muted-foreground/60",
                )}
                onClick={() => setActive(itemIndex)}
              />
            ))}
          </div>
          <Button
            type="button"
            size="icon"
            variant="outline"
            aria-label={nextLabel}
            onClick={() => go(active + 1)}
          >
            <ChevronRightIcon size={16} />
          </Button>
        </div>
      </div>
    </section>
  );
};
