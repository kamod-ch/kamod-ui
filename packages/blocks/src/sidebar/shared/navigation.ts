/** Keep placeholder links inert while allowing consumer-provided destinations to navigate. */
export function stopNavigation(event: Event) {
  if ((event.currentTarget as HTMLElement | null)?.getAttribute("href") === "#")
    event.preventDefault();
}

/** One destination in a navigation group. Placeholder URLs remain inert. */
export type NavigationLink = {
  title: string;
  url: string;
  isActive?: boolean;
};
