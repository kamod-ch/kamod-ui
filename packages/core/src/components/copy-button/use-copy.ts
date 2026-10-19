import { useLayoutEffect, useRef, useState } from "preact/hooks";
import type { CopyButtonProps, CopyStatus } from "./copy-button-types";
import { writeClipboard } from "./write-clipboard";

/** Ignore stale clipboard resolutions and clean up transient feedback on replacement/unmount. */
export function useCopy(
  code: string,
  onCopy: CopyButtonProps["onCopy"],
  onCopyError: CopyButtonProps["onCopyError"],
) {
  const [status, setStatus] = useState<CopyStatus>("idle");
  const request = useRef(0);
  const pending = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useLayoutEffect(() => {
    setStatus("idle");
    return () => {
      request.current += 1;
      pending.current = false;
      clearTimeout(timer.current);
    };
  }, [code]);

  const copy = async () => {
    if (pending.current) return;
    pending.current = true;
    const current = ++request.current;
    clearTimeout(timer.current);
    setStatus("copying");
    try {
      await writeClipboard(code);
    } catch (error) {
      if (request.current !== current) return;
      pending.current = false;
      setStatus("error");
      onCopyError?.(error);
      return;
    }
    if (request.current !== current) return;
    pending.current = false;
    setStatus("copied");
    timer.current = setTimeout(() => setStatus("idle"), 1500);
    onCopy?.(code);
  };
  return { status, copy };
}
