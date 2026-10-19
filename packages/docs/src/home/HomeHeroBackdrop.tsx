/** Quiet decorative depth for the hero; no previews, interactive controls or loading state. */
export function HomeHeroBackdrop() {
  return (
    <div class="home-hero-backdrop" aria-hidden="true">
      {[0, 1, 2, 3].map((layer) => (
        <div class="home-hero-skeleton" key={layer}>
          <div class="home-hero-skeleton-header">
            <span />
            <span />
          </div>
          <div class="home-hero-skeleton-body">
            <span />
            <span />
            <span />
          </div>
        </div>
      ))}
    </div>
  );
}
