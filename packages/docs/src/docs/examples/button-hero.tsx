import { Button } from "@kamod-ch/ui";
import { ArrowUp } from "lucide-preact";

export function ButtonHeroExample() {
  return (
    <div class="flex flex-wrap items-center gap-2 md:flex-row">
      <Button variant="outline">Button</Button>
      <Button variant="outline" size="icon" aria-label="Submit">
        <ArrowUp />
      </Button>
    </div>
  );
}
