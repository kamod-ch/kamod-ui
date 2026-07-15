import type { FieldStore } from "@formisch/preact";
import { Card, CardContent, CardHeader, CardTitle } from "@kamod-ch/ui";
import type { ComponentChildren } from "preact";

export const errorsToFieldErrors = (errors: readonly string[] | null) =>
  errors?.map((message) => ({ message })) ?? undefined;

export const stringInput = (value: unknown) => (typeof value === "string" ? value : "");

export const booleanInput = (value: unknown) => value === true;

export const arrayInput = <T,>(value: unknown): T[] => (Array.isArray(value) ? (value as T[]) : []);

export const invalid = (field: Pick<FieldStore, "errors">) => Boolean(field.errors.value?.length);

export const ResultCard = ({
  title = "Submitted data",
  children,
}: {
  title?: string;
  children: ComponentChildren;
}) => (
  <Card class="border-border/80 bg-muted/30">
    <CardHeader class="pb-2">
      <CardTitle class="text-sm">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <pre
        class="overflow-auto rounded-md bg-background p-3 text-xs text-foreground shadow-xs"
        aria-live="polite"
      >
        {children}
      </pre>
    </CardContent>
  </Card>
);
