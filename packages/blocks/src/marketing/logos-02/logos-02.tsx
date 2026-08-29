import { defaultLogos, type LogoItem, LogoMarqueeTrack, logoMarqueeStyles } from "../shared/logos";

export type Logos02Props = {
  eyebrow?: string;
  logos?: LogoItem[];
  duration?: string;
};

export const Logos02 = ({
  eyebrow = "Trusted by teams at",
  logos = defaultLogos,
  duration = "30s",
}: Logos02Props) => (
  <section data-slot="block-logos-02" class="border-y bg-muted/30 text-foreground">
    <style>{logoMarqueeStyles}</style>
    <div class="mx-auto max-w-6xl px-6 py-14">
      <p class="mb-10 text-center text-xs font-medium tracking-widest text-muted-foreground uppercase">
        {eyebrow}
      </p>
      <LogoMarqueeTrack logos={logos} duration={duration} />
    </div>
  </section>
);
