import { useEffect, useState } from "preact/hooks";
import {
  Card,
  CardContent,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  DirectionProvider,
  type CarouselApi
} from "@kamod-ui/core";
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
  he: { dir: "rtl", label: "עברית (RTL)" }
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
  installationText: "Depends on `embla-carousel` and optional `embla-carousel-autoplay` (used when `autoplay` is set). Import primitives from @kamod-ui/core.",
  usageText:
    "Wrap slides in CarouselContent; each slide is a CarouselItem. Place CarouselPrevious and CarouselNext as siblings of CarouselContent inside Carousel. Use opts for Embla options (align, loop, direction). Use setApi to read scrollSnapList, selectedScrollSnap, and events.",
  previewCode: `import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@kamod-ui/core";

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
      text: "Card slides with previous and next controls (shadcn-style layout).",
      code: `// See previewCode hero — CarouselContent + Items + Prev/Next.`,
      renderPreview: () => <CarouselDemoPreview />
    },
    {
      id: "carousel-sizes",
      title: "Sizes",
      text: "Use basis utilities on CarouselItem; align slides with opts.align \"start\".",
      code: `<Carousel opts={{ align: "start" }} class="w-full max-w-sm">
  <CarouselContent>
    {items.map((n) => (
      <CarouselItem key={n} class="basis-1/2 lg:basis-1/3">…</CarouselItem>
    ))}
  </CarouselContent>
  <CarouselPrevious />
  <CarouselNext />
</Carousel>`,
      renderPreview: () => <CarouselSizesPreview />
    },
    {
      id: "carousel-spacing",
      title: "Spacing",
      text: "Negative margin on CarouselContent and matching padding on items (shadcn spacing pattern).",
      code: `<CarouselContent class="-ml-1">
  <CarouselItem class="basis-1/2 pl-1 lg:basis-1/3">…</CarouselItem>
</CarouselContent>`,
      renderPreview: () => <CarouselSpacingPreview />
    },
    {
      id: "carousel-orientation",
      title: "Orientation",
      text: "Vertical axis: set a fixed height (or h-full inside a sized parent) on CarouselContent, use min-h-0 on the viewport, basis + pt on items, and vertical padding on the wrapper so top/bottom arrows stay visible.",
      code: `<div class="py-14">
  <Carousel orientation="vertical" class="max-w-xs">
    <CarouselContent class="-mt-1 h-[270px] min-h-0">
      <CarouselItem class="basis-1/2 pt-1">…</CarouselItem>
    </CarouselContent>
    <CarouselPrevious />
    <CarouselNext />
  </Carousel>
</div>`,
      renderPreview: () => <CarouselOrientationPreview />
    },
    {
      id: "carousel-opts",
      title: "Options",
      text: "opts forwards to Embla (e.g. loop). axis and direction are merged from orientation and dir.",
      code: `<Carousel opts={{ align: "start", loop: true }}>…</Carousel>`,
      renderPreview: () => <CarouselOptsPreview />
    },
    {
      id: "carousel-api",
      title: "API",
      text: "setApi receives the Embla instance for slide counts and select events.",
      code: `const [api, setApi] = useState<CarouselApi | null>(null);
// useEffect: api.scrollSnapList().length, api.selectedScrollSnap(), api.on("select", …)
<Carousel setApi={setApi}>…</Carousel>`,
      renderPreview: () => <CarouselApiPreview />
    },
    {
      id: "carousel-autoplay",
      title: "Autoplay",
      text: "Use autoplay prop or pass plugins when you need full Embla plugin control (see core Carousel).",
      code: `<Carousel autoplay={{ delay: 2000, stopOnInteraction: true }}>…</Carousel>`,
      renderPreview: () => <CarouselAutoplayPreview />
    },
    {
      id: "carousel-rtl",
      title: "RTL",
      text: "Set dir on Carousel and direction in opts to match DirectionProvider (logical prev/next + chevron rotation).",
      code: `<Carousel dir={dir} opts={{ direction: dir }}>…</Carousel>`,
      renderPreview: () => <CarouselRtlPreview />
    }
  ],
  apiRows: [
    { prop: "opts", type: "EmblaOptionsType", defaultValue: "undefined" },
    { prop: "orientation", type: "\"horizontal\" | \"vertical\"", defaultValue: "\"horizontal\"" },
    { prop: "setApi", type: "(api: CarouselApi | null) => void", defaultValue: "undefined" },
    { prop: "plugins", type: "EmblaPluginType[]", defaultValue: "undefined" },
    { prop: "autoplay", type: "boolean | { delay?, stopOnInteraction? }", defaultValue: "false" },
    { prop: "dir", type: "\"ltr\" | \"rtl\"", defaultValue: "undefined" },
    { prop: "children", type: "CarouselContent, items, controls", defaultValue: "required" }
  ],
  accessibilityText:
    "Region is marked as carousel; items use group/slide roles. Provide pausable autoplay when motion may distract; match reading direction with dir and opts.direction."
});
