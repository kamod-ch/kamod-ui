/** Shared contents heading; an empty URL resolves to this document without its fragment. */
export function PageContentsHeading({
  id,
  count,
  level = "h2",
}: {
  id?: string;
  count: number;
  level?: "h2" | "h3";
}) {
  const Heading = level;
  return (
    <div class="page-contents-header">
      <Heading id={id} class="page-contents-heading">
        <a href="" title="Return to the start of this page">
          On This Page
        </a>
      </Heading>
      <span
        class="site-navigation-variant-count page-contents-count"
        aria-label={`${count} main links`}
      >
        {count}
      </span>
    </div>
  );
}
