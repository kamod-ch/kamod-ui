import { signal } from "@preact/signals";
import type { JSX } from "preact";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "preact/hooks";
import { cn } from "../../lib/utils";

export type SliderPrimitiveValue = number | number[];

export type SliderProps = Omit<
  JSX.InputHTMLAttributes<HTMLInputElement>,
  "value" | "defaultValue" | "type"
> & {
  defaultValue?: SliderPrimitiveValue;
  value?: SliderPrimitiveValue;
  /** Called with the current thumb values (always a sorted array, length ≥ 1). Matches shadcn/Radix-style callbacks. */
  onValueChange?: (value: number[]) => void;
  /** Fires when the user finishes a drag or commits via keyboard (native `change` event). Matches Radix `onValueCommit`. */
  onValueCommit?: (value: number[]) => void;
  orientation?: "horizontal" | "vertical";
  class?: string;
};

const toNumber = (value: unknown, fallback: number) => {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return fallback;
};

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

const normalizeIncoming = (
  raw: SliderPrimitiveValue | undefined,
  fallbackSingle: number,
  min: number,
  max: number
): number[] => {
  if (raw === undefined) return [clamp(fallbackSingle, min, max)];
  let arr = Array.isArray(raw) ? raw : [raw];
  if (arr.length === 0) return [clamp(fallbackSingle, min, max)];
  if (arr.length > 1) {
    arr = [...arr].sort((a, b) => toNumber(a, min) - toNumber(b, min));
  }
  return arr.map((v, i) => {
    const fb = i === 0 ? fallbackSingle : toNumber(arr[i - 1], min);
    return clamp(toNumber(v, fb), min, max);
  });
};

const enforceOrder = (vals: number[], min: number, max: number, step: number): number[] => {
  const n = vals.length;
  if (n <= 1) return vals;
  const out = [...vals];
  out[0] = clamp(out[0], min, max);
  for (let i = 1; i < n; i++) {
    const gap = step > 0 ? step : 0;
    out[i] = clamp(out[i], out[i - 1] + gap, max);
  }
  for (let i = n - 2; i >= 0; i--) {
    const gap = step > 0 ? step : 0;
    out[i] = clamp(out[i], min, out[i + 1] - gap);
  }
  return out;
};

/** Matches `size-3` thumbs: centers fill/track on native thumb positions (inset at min/max). */
const SLIDER_THUMB_HALF = "0.375rem";
const SLIDER_THUMB_FULL = "0.75rem";

/**
 * Radix/shadcn-style thumb: border-ring, ring-3, no shadow. `group-data-[dragging]` avoids transition lag while dragging.
 */
const overlayThumbStyles = [
  "[&::-webkit-slider-thumb]:size-3 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full",
  /* WebKit: vertically center thumb on h-1 track (thumb 12px, track 4px → -4px). */
  "[&::-webkit-slider-thumb]:-mt-[4px]",
  "[&::-webkit-slider-thumb]:border [&::-webkit-slider-thumb]:border-ring [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:dark:bg-card",
  "[&::-webkit-slider-thumb]:transition-[color,box-shadow]",
  "[&::-webkit-slider-thumb]:active:transition-none",
  "group-data-[dragging]:[&::-webkit-slider-thumb]:transition-none",
  "[&::-webkit-slider-thumb]:ring-1 [&::-webkit-slider-thumb]:ring-ring/50",
  "[&::-webkit-slider-thumb]:hover:ring-3 [&::-webkit-slider-thumb]:focus-visible:ring-3 [&::-webkit-slider-thumb]:active:ring-3",
  "group-data-[dragging]:[&::-webkit-slider-thumb]:hover:ring-1 group-data-[dragging]:[&::-webkit-slider-thumb]:focus-visible:ring-1 group-data-[dragging]:[&::-webkit-slider-thumb]:active:ring-1",
  "[&::-webkit-slider-thumb]:focus-visible:outline-none",
  "[&::-moz-range-thumb]:size-3 [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:rounded-full",
  "[&::-moz-range-thumb]:border [&::-moz-range-thumb]:border-ring [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:dark:bg-card",
  "[&::-moz-range-thumb]:transition-[color,box-shadow]",
  "[&::-moz-range-thumb]:active:transition-none",
  "group-data-[dragging]:[&::-moz-range-thumb]:transition-none",
  "[&::-moz-range-thumb]:ring-1 [&::-moz-range-thumb]:ring-ring/50",
  "[&::-moz-range-thumb]:hover:ring-3 [&::-moz-range-thumb]:focus-visible:ring-3 [&::-moz-range-thumb]:active:ring-3",
  "group-data-[dragging]:[&::-moz-range-thumb]:hover:ring-1 group-data-[dragging]:[&::-moz-range-thumb]:focus-visible:ring-1 group-data-[dragging]:[&::-moz-range-thumb]:active:ring-1",
  "[&::-moz-range-thumb]:focus-visible:outline-none"
].join(" ");

const overlayInputHorizontal = cn(
  "absolute inset-0 m-0 h-6 max-h-none w-full min-w-0 cursor-pointer appearance-none border-0 bg-transparent p-0 outline-none",
  "focus:outline-none focus-visible:outline-none",
  "disabled:pointer-events-none disabled:cursor-not-allowed",
  "[&::-webkit-slider-runnable-track]:h-1 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-transparent",
  "[&::-moz-range-track]:h-1 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-transparent",
  "[&::-moz-range-progress]:h-1 [&::-moz-range-progress]:rounded-full [&::-moz-range-progress]:bg-transparent",
  overlayThumbStyles
);

/**
 * Vertical native range: WebKit uses slider-vertical + bt-lr so min sits at the bottom (matches our fill).
 * Thumb centered on 4px track: (12 − 4) / 2 = 4px offset on the cross axis.
 */
const overlayInputVertical = cn(
  "absolute inset-0 m-0 h-full max-h-none w-full min-w-0 cursor-pointer appearance-none border-0 bg-transparent p-0 outline-none",
  "[writing-mode:bt-lr] [-webkit-appearance:slider-vertical] appearance-none",
  "focus:outline-none focus-visible:outline-none",
  "disabled:pointer-events-none disabled:cursor-not-allowed",
  "[&::-webkit-slider-runnable-track]:w-1 [&::-webkit-slider-runnable-track]:h-full [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-transparent",
  "[&::-webkit-slider-thumb]:ml-[-4px]",
  "[&::-moz-range-track]:w-1 [&::-moz-range-track]:h-full [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-transparent",
  "[&::-moz-range-progress]:w-1 [&::-moz-range-progress]:bg-transparent",
  overlayThumbStyles
);

const multiThumbInputHorizontal = overlayInputHorizontal;

const multiThumbInputVertical = overlayInputVertical;

const pct = (v: number, min: number, max: number) => {
  const span = max - min || 1;
  return Math.min(100, Math.max(0, ((v - min) / span) * 100));
};

/** Sync primary range fill without waiting for React (smooth drag). */
function applySingleHorizontalRangeFill(el: HTMLElement, fillPercent: number) {
  el.style.left = SLIDER_THUMB_HALF;
  el.style.right = `calc(${SLIDER_THUMB_HALF} + (100% - ${SLIDER_THUMB_FULL}) * ${(100 - fillPercent) / 100})`;
}

function applySingleVerticalRangeFill(el: HTMLElement, fillPercent: number) {
  el.style.bottom = SLIDER_THUMB_HALF;
  el.style.height = `calc((100% - ${SLIDER_THUMB_FULL}) * ${fillPercent} / 100)`;
}

export const Slider = ({
  defaultValue = 50,
  value: controlledValue,
  onInput,
  onValueChange,
  onValueCommit,
  onChange: userOnChange,
  onPointerDown: userPointerDown,
  class: className,
  min: minProp,
  max: maxProp,
  step: stepProp,
  disabled,
  orientation = "horizontal",
  id,
  /** Applied to the native range input(s). Kept out of `rest` so `{...rest}` cannot wipe stacking/pointer rules on multi-thumb. */
  style: inputStyleProp,
  ...rest
}: SliderProps) => {
  const minValue = toNumber(minProp, 0);
  const maxValue = toNumber(maxProp, 100);
  const stepValue = toNumber(stepProp, 1);

  const localValues = useMemo(
    () =>
      signal<number[]>(
        enforceOrder(
          normalizeIncoming(defaultValue, 50, minValue, maxValue),
          minValue,
          maxValue,
          stepValue
        )
      ),
    []
  );

  const isControlled = controlledValue !== undefined;
  const values = isControlled
    ? enforceOrder(
        normalizeIncoming(controlledValue, 50, minValue, maxValue),
        minValue,
        maxValue,
        stepValue
      )
    : localValues.value;

  const onValueChangeRef = useRef(onValueChange);
  onValueChangeRef.current = onValueChange;
  const localValuesRef = useRef(localValues);
  localValuesRef.current = localValues;
  const isControlledRef = useRef(isControlled);
  isControlledRef.current = isControlled;

  const singleRangeHorizontalRef = useRef<HTMLSpanElement>(null);
  const singleRangeVerticalRef = useRef<HTMLSpanElement>(null);
  /** Single-thumb controlled: do not pass `value=` (Preact would reset the native control every commit and block drag/click/keyboard). Sync via ref + layout effect instead. */
  const singleThumbInputRef = useRef<HTMLInputElement | null>(null);

  const [dragging, setDragging] = useState(false);
  /**
   * Controlled sliders: parent `value` often updates one frame late vs the native thumb, which feels janky.
   * While dragging, mirror the thumb in local state so `value` + decorative fill stay in sync with the input.
   */
  const [dragDraft, setDragDraft] = useState<number | null>(null);

  /** Fire `onValueChange` in the same turn as the native `input` so controlled `value` matches the DOM (single- and multi-thumb). */
  const emitValueChange = useCallback((payload: number[]) => {
    onValueChangeRef.current?.(payload);
  }, []);

  useEffect(() => {
    if (!dragging) return;
    const end = () => {
      setDragging(false);
    };
    window.addEventListener("pointerup", end);
    window.addEventListener("pointercancel", end);
    return () => {
      window.removeEventListener("pointerup", end);
      window.removeEventListener("pointercancel", end);
    };
  }, [dragging]);

  const singleThumbProp = values.length === 1 ? values[0] : null;
  useLayoutEffect(() => {
    if (!isControlled || dragging || singleThumbProp === null) return;
    const el = singleThumbInputRef.current;
    if (!el || el.disabled) return;
    const next = String(singleThumbProp);
    if (el.value !== next) el.value = next;
  }, [isControlled, dragging, singleThumbProp, minValue, maxValue, stepValue, disabled]);

  const setValues = (next: number[]) => {
    const ordered = enforceOrder(next, minValue, maxValue, stepValue);
    if (!isControlled) localValues.value = ordered;
    emitValueChange(ordered);
  };

  const [topIndex, setTopIndex] = useState(0);
  /** Multi-thumb: stacked full-width inputs would always hit the same layer; route pointer to the thumb nearest the cursor. */
  const sliderRootRef = useRef<HTMLSpanElement>(null);

  const updateClosestThumbFromPointer = useCallback(
    (clientX: number, clientY: number) => {
      if (disabled || dragging) return;
      if (values.length < 2) return;
      const root = sliderRootRef.current;
      if (!root) return;
      const rect = root.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;
      const span = maxValue - minValue || 1;
      let approx: number;
      if (orientation === "vertical") {
        const ratio = Math.min(1, Math.max(0, (rect.bottom - clientY) / rect.height));
        approx = minValue + ratio * span;
      } else {
        const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
        approx = minValue + ratio * span;
      }
      let closest = 0;
      let best = Infinity;
      for (let i = 0; i < values.length; i++) {
        const d = Math.abs(values[i] - approx);
        if (d < best) {
          best = d;
          closest = i;
        }
      }
      setTopIndex((prev) => (prev === closest ? prev : closest));
    },
    [disabled, dragging, orientation, minValue, maxValue, values]
  );

  if (values.length === 1) {
    const resolvedValue = values[0];
    const displayValue = isControlled && dragDraft !== null ? dragDraft : resolvedValue;
    const safeRange = maxValue - minValue || 1;
    const fillPercent = Math.min(100, Math.max(0, ((displayValue - minValue) / safeRange) * 100));
    const isVertical = orientation === "vertical";

    if (isVertical) {
      return (
        <span
          data-slot="slider"
          dir="ltr"
          data-orientation="vertical"
          aria-disabled={disabled}
          data-disabled={disabled ? "" : undefined}
          data-dragging={dragging ? "" : undefined}
          class={cn(
            "group relative inline-flex min-h-40 w-6 shrink-0 touch-none select-none justify-center data-[disabled]:opacity-50 data-[orientation=vertical]:min-h-40 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col",
            className
          )}
        >
        <span
          data-slot="slider-track"
          data-orientation="vertical"
          class="pointer-events-none absolute left-1/2 top-[0.375rem] bottom-[0.375rem] w-1 -translate-x-1/2 rounded-full bg-muted"
          aria-hidden="true"
        />
          <span
            ref={singleRangeVerticalRef}
            data-slot="slider-range"
            data-orientation="vertical"
            class="pointer-events-none absolute left-1/2 w-1 -translate-x-1/2 rounded-full bg-black select-none dark:bg-zinc-200"
            style={{
              bottom: SLIDER_THUMB_HALF,
              height: `calc((100% - ${SLIDER_THUMB_FULL}) * ${fillPercent} / 100)`
            }}
            aria-hidden="true"
          />
          <input
            {...rest}
            ref={singleThumbInputRef}
            type="range"
            data-slot="slider-thumb"
            // @ts-expect-error Firefox-only; improves vertical range behavior
            orient="vertical"
            id={id}
            min={minValue}
            max={maxValue}
            step={stepValue}
            disabled={disabled}
            {...(!isControlled ? { value: displayValue } : {})}
            class={overlayInputVertical}
            style={inputStyleProp}
            onPointerDown={(e) => {
              if (!disabled) {
                setDragging(true);
                if (isControlled) setDragDraft(resolvedValue);
              }
              userPointerDown?.(e);
            }}
            onInput={(event) => {
              const n = Number((event.currentTarget as HTMLInputElement).value);
              const fp = pct(n, minValue, maxValue);
              const el = singleRangeVerticalRef.current;
              if (el) applySingleVerticalRangeFill(el, fp);
              if (isControlled) setDragDraft(n);
              else localValues.value = [n];
              emitValueChange([n]);
              onInput?.(event);
            }}
            onChange={(e) => {
              userOnChange?.(e);
              const n = Number((e.currentTarget as HTMLInputElement).value);
              onValueCommit?.([n]);
              if (isControlled) setDragDraft(null);
            }}
          />
        </span>
      );
    }

    return (
      <span
        data-slot="slider"
        dir="ltr"
        data-orientation="horizontal"
        aria-disabled={disabled}
        data-disabled={disabled ? "" : undefined}
        data-dragging={dragging ? "" : undefined}
        class={cn(
          "group relative flex h-6 w-full shrink-0 touch-none select-none items-center data-[disabled]:opacity-50",
          className
        )}
      >
        <span
          data-slot="slider-track"
          data-orientation="horizontal"
          class="pointer-events-none absolute top-1/2 left-[0.375rem] right-[0.375rem] h-1 -translate-y-1/2 rounded-full bg-muted"
          aria-hidden="true"
        />
        <span
          ref={singleRangeHorizontalRef}
          data-slot="slider-range"
          data-orientation="horizontal"
          class="pointer-events-none absolute top-1/2 h-1 -translate-y-1/2 rounded-full bg-black select-none dark:bg-zinc-200"
          style={{
            left: SLIDER_THUMB_HALF,
            right: `calc(${SLIDER_THUMB_HALF} + (100% - ${SLIDER_THUMB_FULL}) * ${(100 - fillPercent) / 100})`
          }}
          aria-hidden="true"
        />
        <input
          {...rest}
          ref={singleThumbInputRef}
          type="range"
          data-slot="slider-thumb"
          id={id}
          min={minValue}
          max={maxValue}
          step={stepValue}
          disabled={disabled}
          {...(!isControlled ? { value: displayValue } : {})}
          class={overlayInputHorizontal}
          style={inputStyleProp}
          onPointerDown={(e) => {
            if (!disabled) {
              setDragging(true);
              if (isControlled) setDragDraft(resolvedValue);
            }
            userPointerDown?.(e);
          }}
          onInput={(event) => {
            const n = Number((event.currentTarget as HTMLInputElement).value);
            const fp = pct(n, minValue, maxValue);
            const el = singleRangeHorizontalRef.current;
            if (el) applySingleHorizontalRangeFill(el, fp);
            if (isControlled) setDragDraft(n);
            else localValues.value = [n];
            emitValueChange([n]);
            onInput?.(event);
          }}
          onChange={(e) => {
            userOnChange?.(e);
            const n = Number((e.currentTarget as HTMLInputElement).value);
            onValueCommit?.([n]);
            if (isControlled) setDragDraft(null);
          }}
        />
      </span>
    );
  }

  const isVertical = orientation === "vertical";
  const n = values.length;

  /**
   * Every thumb uses the same min/max as the slider so native thumb position matches global
   * `(value - min) / (max - min)` along the track. Per-thumb min/max would scale thumbs to the
   * full track width incorrectly. Ordering is enforced via `enforceOrder` in `setValues`.
   */
  const onThumbInput = (i: number, event: JSX.TargetedInputEvent<HTMLInputElement>) => {
    const raw = Number(event.currentTarget.value);
    const next = [...values];
    next[i] = raw;
    setValues(next);
    onInput?.(event);
  };

  const onThumbChange = (i: number, event: JSX.TargetedEvent<HTMLInputElement>) => {
    if (i === 0) userOnChange?.(event as JSX.TargetedInputEvent<HTMLInputElement>);
    const raw = Number((event.currentTarget as HTMLInputElement).value);
    const next = [...values];
    next[i] = raw;
    onValueCommit?.(enforceOrder(next, minValue, maxValue, stepValue));
  };

  const trackAndFills = isVertical ? (
    <>
      <div
        data-slot="slider-track"
        data-orientation="vertical"
        class="pointer-events-none absolute left-1/2 top-[0.375rem] bottom-[0.375rem] w-1 -translate-x-1/2 rounded-full bg-muted"
        aria-hidden="true"
      />
      {values.map((v, i) => {
        if (i === n - 1) return null;
        const lo = v;
        const hi = values[i + 1];
        const pLo = pct(lo, minValue, maxValue);
        const pHi = pct(hi, minValue, maxValue);
        return (
          <div
            key={`fill-${i}`}
            data-slot="slider-range"
            data-orientation="vertical"
            class="pointer-events-none absolute left-1/2 w-1 -translate-x-1/2 rounded-full bg-black select-none dark:bg-zinc-200"
            style={{
              bottom: `calc(${SLIDER_THUMB_HALF} + (100% - ${SLIDER_THUMB_FULL}) * ${pLo} / 100)`,
              height: `calc((100% - ${SLIDER_THUMB_FULL}) * ${Math.max(0, pHi - pLo)} / 100)`
            }}
            aria-hidden="true"
          />
        );
      })}
    </>
  ) : (
    <>
      <div
        data-slot="slider-track"
        data-orientation="horizontal"
        class="pointer-events-none absolute top-1/2 left-[0.375rem] right-[0.375rem] h-1 -translate-y-1/2 rounded-full bg-muted"
        aria-hidden="true"
      />
      {values.map((v, i) => {
        if (i === n - 1) return null;
        const lo = v;
        const hi = values[i + 1];
        const pLo = pct(lo, minValue, maxValue);
        const pHi = pct(hi, minValue, maxValue);
        return (
          <div
            key={`fill-${i}`}
            data-slot="slider-range"
            data-orientation="horizontal"
            class="pointer-events-none absolute top-1/2 h-1 -translate-y-1/2 rounded-full bg-black select-none dark:bg-zinc-200"
            style={{
              left: `calc(${SLIDER_THUMB_HALF} + (100% - ${SLIDER_THUMB_FULL}) * ${pLo} / 100)`,
              width: `calc((100% - ${SLIDER_THUMB_FULL}) * ${Math.max(0, pHi - pLo)} / 100)`
            }}
            aria-hidden="true"
          />
        );
      })}
    </>
  );

  const rootClass = cn(
    "group relative touch-none select-none data-[disabled]:opacity-50",
    isVertical
      ? "inline-flex min-h-40 w-6 shrink-0 justify-center data-[orientation=vertical]:min-h-40 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col"
      : "flex h-6 w-full shrink-0 items-center",
    className
  );

  const inputLayerClass = "absolute inset-0 min-h-0 min-w-0";

  const perInputClass = () => (isVertical ? multiThumbInputVertical : multiThumbInputHorizontal);

  return (
    <span
      ref={sliderRootRef}
      data-slot="slider"
      id={id}
      dir="ltr"
      data-orientation={isVertical ? "vertical" : "horizontal"}
      aria-disabled={disabled}
      data-disabled={disabled ? "" : undefined}
      data-dragging={dragging ? "" : undefined}
      class={rootClass}
      role="group"
      onPointerEnter={(e) => updateClosestThumbFromPointer(e.clientX, e.clientY)}
      onPointerMove={(e) => updateClosestThumbFromPointer(e.clientX, e.clientY)}
    >
      {trackAndFills}
      <span class={inputLayerClass}>
        {values.map((v, i) => (
          <input
            key={i}
            {...(i === 0 ? rest : {})}
            type="range"
            data-slot="slider-thumb"
            // @ts-expect-error Firefox-only; improves vertical range behavior
            orient={isVertical ? "vertical" : undefined}
            min={minValue}
            max={maxValue}
            step={stepValue}
            disabled={disabled}
            value={v}
            style={{
              ...(typeof inputStyleProp === "object" && inputStyleProp !== null && !Array.isArray(inputStyleProp)
                ? inputStyleProp
                : {}),
              zIndex: topIndex === i ? 3 : 2,
              pointerEvents: disabled ? undefined : topIndex === i ? "auto" : "none"
            }}
            class={perInputClass()}
            onInput={(e) => onThumbInput(i, e)}
            onChange={(e) => onThumbChange(i, e)}
            onPointerDown={(e) => {
              if (!disabled) setDragging(true);
              setTopIndex(i);
              if (i === 0) userPointerDown?.(e);
            }}
            onFocus={() => setTopIndex(i)}
            aria-label={n > 1 ? `Value ${i + 1} of ${n}` : undefined}
          />
        ))}
      </span>
    </span>
  );
};
