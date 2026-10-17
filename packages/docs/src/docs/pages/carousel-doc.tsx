import {
  Card,
  CardContent,
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  DirectionProvider,
} from "@kamod-ch/ui";
import { useEffect, useState } from "preact/hooks";
import { createGenericDocPage } from "./create-generic-doc-page";

const slides = [1, 2, 3, 4, 5];

const CarouselDemoPreview = () => (
  <div class="mx-auto w-full max-w-[12rem] px-12 sm:max-w-xs">
    <Carousel class="w-full">
      <CarouselContent>
        {slides.map((n) => (
          <CarouselItem key={n}>
            <div class="p-1">
              <Card>
                <CardContent class="flex aspect-square items-center justify-center p-6">
                  <span class="text-4xl font-semibold">{n}</span>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  </div>
);

const CarouselSizesPreview = () => (
  <div class="mx-auto w-full max-w-[12rem] px-12 sm:max-w-xs md:max-w-sm">
    <Carousel opts={{ align: "start" }} class="w-full">
      <CarouselContent>
        {slides.map((n) => (
          <CarouselItem key={n} class="basis-1/2 lg:basis-1/3">
            <div class="p-1">
              <Card>
                <CardContent class="flex aspect-square items-center justify-center p-6">
                  <span class="text-3xl font-semibold">{n}</span>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  </div>
);

const CarouselSpacingPreview = () => (
  <div class="mx-auto w-full max-w-[12rem] px-12 sm:max-w-xs md:max-w-sm">
    <Carousel class="w-full">
      <CarouselContent class="-ml-1">
        {slides.map((n) => (
          <CarouselItem key={n} class="basis-1/2 pl-1 lg:basis-1/3">
            <div class="p-1">
              <Card>
                <CardContent class="flex aspect-square items-center justify-center p-6">
                  <span class="text-2xl font-semibold">{n}</span>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  </div>
);

const CarouselOrientationPreview = () => (
  <div class="mx-auto w-full max-w-xs px-6 py-14">
    <Carousel orientation="vertical" class="w-full">
      <CarouselContent class="-mt-1 h-[270px] min-h-0">
        {slides.map((n) => (
          <CarouselItem key={n} class="basis-1/2 pt-1">
            <div class="p-1">
              <Card>
                <CardContent class="flex items-center justify-center p-6">
                  <span class="text-3xl font-semibold">{n}</span>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  </div>
);

const CarouselOptsPreview = () => (
  <div class="mx-auto w-full max-w-[12rem] px-12 sm:max-w-xs">
    <Carousel opts={{ align: "start", loop: true }} class="w-full">
      <CarouselContent>
        {slides.map((n) => (
          <CarouselItem key={n}>
            <div class="p-1">
              <Card>
                <CardContent class="flex aspect-square items-center justify-center p-6">
                  <span class="text-4xl font-semibold">{n}</span>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  </div>
);

const CarouselApiPreview = () => {
  const [api, setApi] = useState<CarouselApi | null>(null);
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) return;
    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);
    const onSelect = () => setCurrent(api.selectedScrollSnap() + 1);
    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  return (
    <div class="mx-auto w-full max-w-[10rem] px-12 sm:max-w-xs">
      <Carousel setApi={setApi} class="w-full max-w-xs">
        <CarouselContent>
          {slides.map((n) => (
            <CarouselItem key={n}>
              <Card class="m-px">
                <CardContent class="flex aspect-square items-center justify-center p-6">
                  <span class="text-4xl font-semibold">{n}</span>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
      <div class="text-muted-foreground py-2 text-center text-sm">
        Slide {current} of {count}
      </div>
    </div>
  );
};

const CarouselAutoplayPreview = () => (
  <div class="mx-auto w-full max-w-[10rem] px-12 sm:max-w-xs">
    <Carousel autoplay={{ delay: 2000, stopOnInteraction: true }} class="w-full">
      <CarouselContent>
        {slides.map((n) => (
          <CarouselItem key={n}>
            <div class="p-1">
              <Card>
                <CardContent class="flex aspect-square items-center justify-center p-6">
                  <span class="text-4xl font-semibold">{n}</span>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  </div>
);

type Lang = "en" | "ar" | "he";

const rtlCopy: Record<Lang, { dir: "ltr" | "rtl"; label: string }> = {
  en: { dir: "ltr", label: "English (LTR)" },
  ar: { dir: "rtl", label: "العربية (RTL)" },
  he: { dir: "rtl", label: "עברית (RTL)" },
};

const CarouselRtlPreview = () => {
  const [lang, setLang] = useState<Lang>("ar");
  const t = rtlCopy[lang];

  return (
    <div class="flex w-full flex-col items-center gap-3">
      <div class="flex flex-wrap justify-center gap-2">
        {(["en", "ar", "he"] as const).map((key) => (
          <button
            key={key}
            type="button"
            class={
              lang === key
                ? "bg-foreground text-background rounded-md border px-3 py-1.5 text-sm font-medium"
                : "hover:bg-muted rounded-md border px-3 py-1.5 text-sm font-medium"
            }
            onClick={() => setLang(key)}
          >
            {rtlCopy[key].label}
          </button>
        ))}
      </div>
      <DirectionProvider direction={t.dir} class="w-full max-w-[12rem] px-12 sm:max-w-xs">
        <Carousel dir={t.dir} opts={{ direction: t.dir }} class="w-full">
          <CarouselContent>
            {slides.map((n) => (
              <CarouselItem key={n}>
                <div class="p-1">
                  <Card dir={t.dir}>
                    <CardContent class="flex aspect-square items-center justify-center p-6">
                      <span class="text-4xl font-semibold">{n}</span>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </DirectionProvider>
    </div>
  );
};

export const carouselDocPage = createGenericDocPage({
  slug: "carousel",
  title: "Carousel",
  usageLabel: "Carousel displays swipeable or button-driven slide content (Embla Carousel).",
  installationText:
    "Depends on `embla-carousel` and optional `embla-carousel-autoplay` (used when `autoplay` is set). Import primitives from `@/components/kamod-ui/carousel`.",
  usageText:
    "Wrap slides in CarouselContent; each slide is a CarouselItem. Place CarouselPrevious and CarouselNext as siblings of CarouselContent inside Carousel. Use opts for Embla options (align, loop, direction). Use setApi to read scrollSnapList, selectedScrollSnap, and events.",
  previewCode: `import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/kamod-ui/carousel";

export const Example = () => (
  <div class="mx-auto w-full max-w-xs px-12">
    <Carousel class="w-full">
      <CarouselContent>
        {[1, 2, 3, 4, 5].map((n) => (
          <CarouselItem key={n}>
            <div class="p-1">…</div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  </div>
);`,
  exampleSections: [
    {
      id: "carousel-demo",
      title: "Demo",
      text: "**Keep Slide Navigation Discoverable.** Compose `CarouselItem` slides with previous and next controls around the viewport. Each slide remains a card-like content unit; the carousel manages which part of the sequence is visible and how readers move through it.\n\nMake each slide useful independently, and avoid putting essential sequential instructions into a carousel that encourages readers to skip directly between items.",
      code: `// See previewCode hero — CarouselContent + Items + Prev/Next.`,
      renderPreview: () => <CarouselDemoPreview />,
    },
    {
      id: "carousel-sizes",
      title: "Sizes",
      text: "**Show Enough of the Next Item to Suggest Continuation.** Use `basis-*` utilities on `CarouselItem` to control how many slides fit at once. Set `opts.align` to `start` when the leading edge should anchor each scroll position rather than centering the selected slide.\n\nCheck the longest content at each breakpoint, and keep the chosen alignment consistent with how the surrounding page reads.",
      code: `<Carousel opts={{ align: "start" }} class="w-full max-w-sm">
  <CarouselContent>
    {items.map((n) => (
      <CarouselItem key={n} class="basis-1/2 lg:basis-1/3">…</CarouselItem>
    ))}
  </CarouselContent>
  <CarouselPrevious />
  <CarouselNext />
</Carousel>`,
      renderPreview: () => <CarouselSizesPreview />,
    },
    {
      id: "carousel-spacing",
      title: "Spacing",
      text: "**Treat Spacing as a Paired Adjustment.** Pair a negative margin on `CarouselContent` with matching padding on each item. This creates regular gaps between slides while keeping the first slide aligned with the outer viewport boundary.\n\nChange both sides consistently, and inspect the outer edges so the carousel does not appear indented or clipped relative to nearby content.",
      code: `<CarouselContent class="-ml-1">
  <CarouselItem class="basis-1/2 pl-1 lg:basis-1/3">…</CarouselItem>
</CarouselContent>`,
      renderPreview: () => <CarouselSpacingPreview />,
    },
    {
      id: "carousel-orientation",
      title: "Orientation",
      text: "**Give the Vertical Viewport an Explicit Boundary.** A vertical carousel needs a constrained height as well as an orientation change. Size `CarouselContent`, allow its viewport to shrink with `min-h-0`, and reserve space for the controls above and below the slides.\n\nTest wheel, touch and keyboard interaction when the carousel sits inside another scrolling region. Avoid trapping long slide text in a viewport too short to read, and confirm that both navigation controls remain reachable.",
      code: `<div class="py-14">
  <Carousel orientation="vertical" class="max-w-xs">
    <CarouselContent class="-mt-1 h-[270px] min-h-0">
      <CarouselItem class="basis-1/2 pt-1">…</CarouselItem>
    </CarouselContent>
    <CarouselPrevious />
    <CarouselNext />
  </Carousel>
</div>`,
      renderPreview: () => <CarouselOrientationPreview />,
    },
    {
      id: "carousel-opts",
      title: "Options",
      text: "**Choose Movement Rules for the Content.** Pass behavior options such as `loop` through `opts` to configure the underlying Embla instance. The wrapper combines those settings with its own orientation and direction, keeping the outer component responsible for the layout contract.\n\nReview the forwarded options alongside the [API Reference](#api-reference), and test boundary navigation after changing alignment, direction or looping.",
      code: `<Carousel opts={{ align: "start", loop: true }}>…</Carousel>`,
      renderPreview: () => <CarouselOptsPreview />,
    },
    {
      id: "carousel-api",
      title: "API",
      text: "**Observe the Carousel without Duplicating Its State.** Use `setApi` to access the carousel instance when an external counter or control needs its current position. Subscribe to selection changes to keep the supporting UI synchronized with dragging as well as button navigation.\n\nRemove event listeners when the instance changes or the component unmounts, and initialize derived text before the first user interaction so it does not start out stale.",
      code: `const [api, setApi] = useState<CarouselApi | null>(null);
// useEffect: api.scrollSnapList().length, api.selectedScrollSnap(), api.on("select", …)
<Carousel setApi={setApi}>…</Carousel>`,
      renderPreview: () => <CarouselApiPreview />,
    },
    {
      id: "carousel-autoplay",
      title: "Autoplay",
      text: "**Keep Automatic Movement under User Control.** Use the `autoplay` prop for the built-in playback option, or supply `plugins` when the integration needs additional Embla behavior. Movement should remain understandable alongside the same manual previous and next controls.\n\nProvide an appropriate pause strategy, consider reduced-motion preferences, and stop any application-owned timers during cleanup; use manual navigation when the content requires sustained attention.",
      code: `<Carousel autoplay={{ delay: 2000, stopOnInteraction: true }}>…</Carousel>`,
      renderPreview: () => <CarouselAutoplayPreview />,
    },
    {
      id: "carousel-rtl",
      title: "RTL",
      text: "**Check the Whole Pattern in Its Reading Direction.** Keep `dir`, the carousel options and `DirectionProvider` consistent for RTL content. This lets slide movement and the previous/next symbols communicate the same reading order instead of mirroring only the text.\n\nKeep values and keyboard behavior meaningful in the translated interface, and follow [Direction](/docs/direction/installation) when the page and its portaled controls need a shared direction.",
      code: `<Carousel dir={dir} opts={{ direction: dir }}>…</Carousel>`,
      renderPreview: () => <CarouselRtlPreview />,
    },
  ],
  apiRows: [
    { prop: "opts", type: "EmblaOptionsType", defaultValue: "undefined" },
    { prop: "orientation", type: '"horizontal" | "vertical"', defaultValue: '"horizontal"' },
    { prop: "setApi", type: "(api: CarouselApi | null) => void", defaultValue: "undefined" },
    { prop: "plugins", type: "EmblaPluginType[]", defaultValue: "undefined" },
    { prop: "autoplay", type: "boolean | { delay?, stopOnInteraction? }", defaultValue: "false" },
    { prop: "dir", type: '"ltr" | "rtl"', defaultValue: "undefined" },
    { prop: "children", type: "CarouselContent, items, controls", defaultValue: "required" },
  ],
  accessibilityText:
    "Region is marked as carousel; items use group/slide roles. Pass label or aria-label on Carousel for an accessible name. When autoplay is enabled, add CarouselAutoplayPause so users can stop motion. Match reading direction with dir and opts.direction.",
});
