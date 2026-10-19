import type { ComponentChildren, ComponentType, JSX } from "preact";
import { useLayoutEffect, useState } from "preact/hooks";

type Loaded<Props> = { component: ComponentType<Props> } | { error: unknown };

/**
 * Load a showcase module on first selection, rendering its fallback immediately.
 * Unlike a deferred Suspense fallback, pending content cannot commit an empty panel.
 * Each module shares one request and its resolved component across all examples.
 */
export function lazyShowcase<Props>(load: () => Promise<{ default: ComponentType<Props> }>) {
  let result: Loaded<Props> | undefined;
  let request: Promise<Loaded<Props>> | undefined;

  return function LazyShowcase({ fallback, ...props }: Props & { fallback: ComponentChildren }) {
    const [loaded, setLoaded] = useState(() => result);

    useLayoutEffect(() => {
      if (result) return;
      let mounted = true;
      request ??= load().then(
        ({ default: component }) => (result = { component }),
        (error: unknown) => (result = { error }),
      );
      void request.then((next) => {
        if (mounted) setLoaded(next);
      });
      return () => {
        mounted = false;
      };
    }, []);

    const current = result ?? loaded;
    if (!current) return <>{fallback}</>;
    if ("error" in current) throw current.error;
    const Content = current.component;
    return <Content {...(props as Props & JSX.IntrinsicAttributes)} />;
  };
}
