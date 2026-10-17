/** Stable supplemental table targets; existing generated heading IDs remain valid. */
export const componentPropsId = (slug: string, title: string) =>
  `component-props-${slug}-${title.replace(/[^a-zA-Z0-9]+/g, "-")}`;
