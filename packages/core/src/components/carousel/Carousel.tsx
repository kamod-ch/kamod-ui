import { signal } from "@preact/signals";
import EmblaCarousel, {
  type EmblaCarouselType,
  type EmblaOptionsType,
  type EmblaPluginType,
} from "embla-carousel";
import Autoplay from "embla-carousel-autoplay";
import type { ComponentChildren, JSX } from "preact";
import { createContext } from "preact";
import { useCallback, useContext, useLayoutEffect, useMemo, useRef, useState } from "preact/hooks";
import { cn } from "../../lib/utils";

export type CarouselApi = EmblaCarouselType;

export type CarouselOrientation = "horizontal" | "vertical";

type CarouselContextValue = {
  setCarouselViewport: (el: HTMLDivElement | null) => void;
  embla: ReturnType<typeof signal<EmblaCarouselType | null>>;
  canScrollPrev: ReturnType<typeof signal<boolean>>;
  canScrollNext: ReturnType<typeof signal<boolean>>;
  scrollPrev: () => void;
  scrollNext: () => void;
  orientation: CarouselOrientation;
  autoplayPluginRef: { current: EmblaPluginType | null };
};

const CarouselContext = createContext<CarouselContextValue | null>(null);

export const useCarousel = (strict = true) => {
  const context = useContext(CarouselContext);
  if (!context && strict) throw new Error("Carousel subcomponents must be used within Carousel");
  return context;
};

export type CarouselProps = Omit<JSX.HTMLAttributes<HTMLDivElement>, "dir"> & {
  opts?: EmblaOptionsType;
  orientation?: CarouselOrientation;
  setApi?: (api: CarouselApi | null) => void;
  plugins?: EmblaPluginType[];
  /** When `plugins` is omitted, adds `embla-carousel-autoplay`. Ignored if `plugins` is set. */
  autoplay?: boolean | { delay?: number; stopOnInteraction?: boolean };
  /** Accessible name for the carousel region. */
  label?: string;
  dir?: "ltr" | "rtl";
  children?: ComponentChildren;
};

export const Carousel = ({
  opts,
  orientation = "horizontal",
  setApi,
  plugins,
  autoplay = false,
  label,
  dir,
  class: className,
  children,
  "aria-label": ariaLabel,
  ...rest
}: CarouselProps) => {
  const [viewport, setViewport] = useState<HTMLDivElement | null>(null);
  const lastViewport = useRef<HTMLDivElement | null>(null);
  const setCarouselViewport = useCallback((el: HTMLDivElement | null) => {
    if (lastViewport.current === el) return;
    lastViewport.current = el;
    setViewport(el);
  }, []);
  const signalsRef = useRef<{
    embla: ReturnType<typeof signal<EmblaCarouselType | null>>;
    canScrollPrev: ReturnType<typeof signal<boolean>>;
    canScrollNext: ReturnType<typeof signal<boolean>>;
  } | null>(null);
  if (!signalsRef.current) {
    signalsRef.current = {
      embla: signal<EmblaCarouselType | null>(null),
      canScrollPrev: signal(false),
      canScrollNext: signal(false),
    };
  }
  const { embla, canScrollPrev, canScrollNext } = signalsRef.current;
  const autoplayPluginRef = useRef<EmblaPluginType | null>(null);

  const optsKey = JSON.stringify(opts ?? {});

  const mergedOpts = useMemo<EmblaOptionsType>(() => {
    const base = opts ?? {};
    return {
      ...base,
      align: base.align ?? (orientation === "vertical" ? "start" : "center"),
      axis: orientation === "vertical" ? "y" : "x",
      ...(dir ? { direction: dir } : {}),
    };
  }, [optsKey, orientation, dir]);

  const effectivePlugins = useMemo<EmblaPluginType[]>(() => {
    autoplayPluginRef.current = null;
    if (plugins !== undefined) return plugins;
    if (!autoplay) return [];
    const plugin = Autoplay(typeof autoplay === "object" ? autoplay : {});
    autoplayPluginRef.current = plugin;
    return [plugin];
  }, [plugins, autoplay]);

  const pluginsKey = useMemo(
    () => effectivePlugins.map((p) => p.name).join(","),
    [effectivePlugins],
  );

  useLayoutEffect(() => {
    if (!viewport) return;

    const api = EmblaCarousel(viewport, mergedOpts, effectivePlugins);
    embla.value = api;

    const updateScroll = () => {
      canScrollPrev.value = api.canScrollPrev();
      canScrollNext.value = api.canScrollNext();
    };

    const onSelect = () => updateScroll();
    const onReInit = () => updateScroll();

    api.on("select", onSelect);
    api.on("reInit", onReInit);
    updateScroll();
    setApi?.(api);

    return () => {
      api.off("select", onSelect);
      api.off("reInit", onReInit);
      setApi?.(null);
      api.destroy();
      embla.value = null;
      canScrollPrev.value = false;
      canScrollNext.value = false;
    };
  }, [viewport, mergedOpts, pluginsKey, optsKey, orientation, dir]);

  return (
    <CarouselContext.Provider
      value={{
        setCarouselViewport,
        embla,
        canScrollPrev,
        canScrollNext,
        scrollPrev: () => embla.value?.scrollPrev(),
        scrollNext: () => embla.value?.scrollNext(),
        orientation,
        autoplayPluginRef,
      }}
    >
      <div
        role="region"
        aria-roledescription="carousel"
        aria-label={label ?? ariaLabel}
        data-slot="carousel"
        data-carousel-orientation={orientation}
        class={cn("relative", className)}
        dir={dir}
        {...rest}
      >
        {children}
      </div>
    </CarouselContext.Provider>
  );
};
