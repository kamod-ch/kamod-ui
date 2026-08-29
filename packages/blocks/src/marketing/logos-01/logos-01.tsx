import { defaultLogos, type LogoItem, LogoMark } from "../shared/logos";

export type Logos01Props = {
  eyebrow?: string;
  logos?: LogoItem[];
};

export const Logos01 = ({
  eyebrow = "Trusted by teams at",
  logos = defaultLogos,
}: Logos01Props) => (
  <section data-slot="block-logos-01" class="border-y bg-muted/30 text-foreground">
    <div class="mx-auto max-w-6xl px-6 py-14">
      <p class="mb-10 text-center text-xs font-medium tracking-widest text-muted-foreground uppercase">
        {eyebrow}
      </p>
      <ul class="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-6">
        {logos.map((logo) => (
          <li key={logo.label} class="flex justify-center">
            {logo.href ? (
              <a href={logo.href} class="inline-flex" aria-label={logo.label}>
                <LogoMark logo={logo} />
              </a>
            ) : (
              <LogoMark logo={logo} />
            )}
          </li>
        ))}
      </ul>
      <p class="sr-only">Placeholder wordmarks. Replace with customer logos before shipping.</p>
    </div>
  </section>
);
