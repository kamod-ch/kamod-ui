import { Alert, AlertDescription } from "@kamod-ch/ui";

export const AuthStatusMessage = ({
  tone,
  children,
}: {
  tone: "error" | "success" | "pending";
  children: string;
}) => {
  if (tone === "error") {
    return (
      <Alert variant="destructive" role="alert">
        <AlertDescription>{children}</AlertDescription>
      </Alert>
    );
  }
  return (
    <Alert role="status" aria-live="polite" aria-busy={tone === "pending" ? "true" : undefined}>
      <AlertDescription>{children}</AlertDescription>
    </Alert>
  );
};
