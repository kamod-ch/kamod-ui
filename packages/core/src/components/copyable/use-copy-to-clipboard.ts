import { useEffect, useRef, useState } from "preact/hooks";
import { copyTextToClipboard } from "./copy-to-clipboard";
import type {
  CopyStatus,
  UseCopyToClipboardOptions,
  UseCopyToClipboardReturn,
} from "./copyable-types";

export const useCopyToClipboard = ({
  resetMs = 2000,
  defaultErrorMessage = "Copy failed. Select the text and copy manually.",
}: UseCopyToClipboardOptions = {}): UseCopyToClipboardReturn => {
  const [status, setStatus] = useState<CopyStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isCopying, setIsCopying] = useState(false);
  const timerRef = useRef<number | null>(null);
  const sequenceRef = useRef(0);

  const clearTimer = () => {
    if (timerRef.current != null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  useEffect(() => clearTimer, []);

  const reset = () => {
    clearTimer();
    setStatus("idle");
    setErrorMessage(null);
    setIsCopying(false);
  };

  const copy = async (text: string, fallback?: () => void): Promise<boolean> => {
    const sequence = ++sequenceRef.current;
    clearTimer();
    setIsCopying(true);
    setStatus("idle");
    setErrorMessage(null);

    const result = await copyTextToClipboard(text);
    if (sequence !== sequenceRef.current) {
      return false;
    }

    setIsCopying(false);

    if (result.ok) {
      setStatus("copied");
      timerRef.current = window.setTimeout(() => {
        if (sequenceRef.current === sequence) {
          setStatus("idle");
          setErrorMessage(null);
        }
        timerRef.current = null;
      }, resetMs);
      return true;
    }

    fallback?.();
    setStatus("error");
    setErrorMessage(result.message || defaultErrorMessage);
    timerRef.current = window.setTimeout(() => {
      if (sequenceRef.current === sequence) {
        setStatus("idle");
        setErrorMessage(null);
      }
      timerRef.current = null;
    }, resetMs);
    return false;
  };

  return {
    status,
    errorMessage,
    isCopying,
    copy,
    reset,
  };
};
