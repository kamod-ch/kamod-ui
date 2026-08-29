import { defaultLogos, type LogoItem, LogoMarqueeTrack, logoMarqueeStyles } from "../shared/logos";

export type Logos03Props = {
  eyebrow?: string;
  rows?: LogoItem[][];
};

const defaultRows: LogoItem[][] = [defaultLogos, [...defaultLogos].reverse(), defaultLogos];

export const Logos03 = ({ eyebrow = "Trusted by teams at", rows = defaultRows }: Logos03Props) => {
  const durations = ["32s", "26s", "38s"];

  return (
    <section data-slot="block-logos-03" class="border-y bg-muted/30 text-foreground">
      <style>{logoMarqueeStyles}</style>
      <div class="mx-auto max-w-6xl px-6 py-14">
        <p class="mb-10 text-center text-xs font-medium tracking-widest text-muted-foreground uppercase">
          {eyebrow}
        </p>
        <div class="space-y-6">
          {rows.map((row, rowIndex) => (
            <LogoMarqueeTrack
              key={row.map((logo) => logo.label).join("-")}
              logos={row}
              duration={durations[rowIndex] ?? "32s"}
              reverse={rowIndex % 2 === 1}
              label={`Partner logos row ${rowIndex + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
