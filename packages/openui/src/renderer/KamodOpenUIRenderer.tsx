import {
  type ActionEvent,
  BuiltinActionType,
  type Library,
  type OpenUIError,
  Renderer,
} from "@openuidev/react-lang";
import type { ComponentChildren } from "preact";
import { useCallback, useState } from "preact/hooks";
import { type KamodOpenUILibrary, kamodOpenUILibrary } from "../library/createLibrary";
import type { KamodOpenUIAction } from "../security/action";
import { type NavigationPolicy, validateNavigationTarget } from "../security/navigation";

export type ErrorMode = "fallback" | "partial" | "throw";

export type KamodOpenUIRendererProps = {
  /** Raw OpenUI Lang content from the model (or static demo). */
  content: string | null;
  library?: Library | KamodOpenUILibrary;
  isStreaming?: boolean;
  onAction?: (action: KamodOpenUIAction | ActionEvent, event: ActionEvent) => void;
  onSubmit?: (submission: {
    formName?: string;
    formState?: Record<string, unknown>;
    event: ActionEvent;
  }) => void;
  onStateUpdate?: (state: Record<string, unknown>) => void;
  initialState?: Record<string, unknown>;
  onError?: (errors: OpenUIError[]) => void;
  errorMode?: ErrorMode;
  fallback?: ComponentChildren;
  navigation?: NavigationPolicy;
};

function normalizeHostAction(event: ActionEvent): KamodOpenUIAction | null {
  if (event.type === "submit" || event.type === BuiltinActionType.ContinueConversation) {
    return {
      type: "submit",
      name: event.formName ?? event.type,
    };
  }
  if (event.type === BuiltinActionType.OpenUrl || event.type === "open_url") {
    const url = typeof event.params?.url === "string" ? event.params.url : "";
    return { type: "navigate", target: url };
  }
  if (event.type === "navigate" && typeof event.params?.target === "string") {
    return { type: "navigate", target: event.params.target };
  }
  return {
    type: "event",
    name: event.type,
    payload: event.params,
  };
}

/**
 * Thin Kamod wrapper around the official OpenUI Renderer.
 * Applies navigation policy, error fallback, and host action normalization.
 */
export function KamodOpenUIRenderer({
  content,
  library = kamodOpenUILibrary,
  isStreaming = false,
  onAction,
  onSubmit,
  onStateUpdate,
  initialState,
  onError,
  errorMode = "fallback",
  fallback = <p class="text-muted-foreground text-sm">Unable to render this interface.</p>,
  navigation,
}: KamodOpenUIRendererProps) {
  const [hasFatalError, setHasFatalError] = useState(false);
  const navPolicy: NavigationPolicy =
    navigation ??
    ("navigation" in library
      ? (library as KamodOpenUILibrary).navigation
      : { allowExternal: false });

  const handleError = useCallback(
    (errors: OpenUIError[]) => {
      onError?.(errors);
      const critical = errors.some(
        (error) =>
          error.code === "unknown-component" ||
          error.code === "parse-failed" ||
          error.code === "parse-exception" ||
          error.code === "render-error",
      );
      if (critical && errorMode === "fallback") {
        setHasFatalError(true);
      }
      if (critical && errorMode === "throw") {
        throw new Error(errors.map((error) => error.message).join("; "));
      }
    },
    [errorMode, onError],
  );

  const handleAction = useCallback(
    (event: ActionEvent) => {
      const normalized = normalizeHostAction(event);

      if (normalized?.type === "navigate") {
        const decision = validateNavigationTarget(normalized.target, navPolicy);
        if (!decision.allowed) {
          onError?.([
            {
              source: "runtime",
              code: "runtime-error",
              message: `Navigation blocked: ${decision.reason}`,
              hint: "Use a relative path or enable allowExternal / allowedOrigins.",
            },
          ]);
          return;
        }
        onAction?.({ type: "navigate", target: decision.href }, event);
        return;
      }

      if (event.type === "submit" || normalized?.type === "submit") {
        onSubmit?.({
          formName: event.formName,
          formState: event.formState,
          event,
        });
      }

      if (normalized) {
        onAction?.(normalized, event);
      } else {
        onAction?.(event, event);
      }
    },
    [navPolicy, onAction, onError, onSubmit],
  );

  if (hasFatalError && errorMode === "fallback") {
    return <>{fallback}</>;
  }

  return (
    <div data-slot="kamod-openui-renderer">
      <Renderer
        response={content}
        library={library}
        isStreaming={isStreaming}
        onAction={handleAction}
        onStateUpdate={onStateUpdate}
        initialState={initialState}
        onError={handleError}
      />
    </div>
  );
}
