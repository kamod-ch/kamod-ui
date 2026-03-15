import { createContext } from "preact";
import { useContext } from "preact/hooks";
import type { AvatarContextValue } from "./types";

export const AvatarContext = createContext<AvatarContextValue | null>(null);

export const useAvatarContext = () => {
  const ctx = useContext(AvatarContext);
  if (!ctx) {
    throw new Error("AvatarImage, AvatarFallback, and AvatarBadge must be used within Avatar");
  }
  return ctx;
};
