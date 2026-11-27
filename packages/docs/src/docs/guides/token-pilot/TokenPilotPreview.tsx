import type { ThemePresetId } from "@kamod-ch/themes";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Input,
} from "@kamod-ch/ui";
import { useState } from "preact/hooks";
import "./token-pilot.css";

const brands = [
  { id: "kamod", label: "Kamod" },
  { id: "watson", label: "Watson" },
] as const satisfies readonly { id: ThemePresetId; label: string }[];

const schemes = ["light", "dark"] as const;

/** Local Kamod/Watson preview. It does not write the page theme or its storage. */
export function TokenPilotPreview() {
  const [brand, setBrand] = useState<(typeof brands)[number]["id"]>("kamod");
  const [scheme, setScheme] = useState<(typeof schemes)[number]>("light");
  return (
    <div
      class={`token-pilot-scope ${scheme}`}
      data-theme-scope=""
      data-theme={brand}
      style={{ colorScheme: scheme }}
      aria-label={`${brands.find((entry) => entry.id === brand)?.label} ${scheme} component preview`}
    >
      <div class="token-pilot-toolbar">
        <div class="token-pilot-modes" role="group" aria-label="Brand">
          {brands.map(({ id, label }) => (
            <Button
              key={id}
              type="button"
              variant="ghost"
              size="xs"
              aria-pressed={brand === id}
              onClick={() => setBrand(id)}
            >
              {label}
            </Button>
          ))}
        </div>
        <div class="token-pilot-modes" role="group" aria-label="Color scheme">
          {schemes.map((mode) => (
            <Button
              key={mode}
              type="button"
              variant="ghost"
              size="xs"
              aria-pressed={scheme === mode}
              onClick={() => setScheme(mode)}
            >
              {mode === "light" ? "Light" : "Dark"}
            </Button>
          ))}
        </div>
      </div>
      <Card>
        <CardHeader>
          <Badge>Draft</Badge>
          <CardTitle>Release note</CardTitle>
          <CardDescription>
            Button, field, badge, and card use the preset selected above.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div class="token-pilot-field">
            <label for="token-pilot-title">Title</label>
            <Input
              id="token-pilot-title"
              size="md"
              defaultValue="Spring launch"
              aria-invalid="true"
              aria-describedby="token-pilot-title-error"
            />
            <p class="token-pilot-error" id="token-pilot-title-error" role="alert">
              This title is already used.
            </p>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="button">Save</Button>
        </CardFooter>
      </Card>
      <p class="token-pilot-note">Tab to the title field. Its focus ring stays visible.</p>
    </div>
  );
}
