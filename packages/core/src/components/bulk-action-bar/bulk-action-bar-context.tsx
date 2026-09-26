import { createContext } from "preact";
import { useContext } from "preact/hooks";

export type BulkActionBarContextValue = {
  selectedCount: number;
  pending: boolean;
  onClearSelection?: () => void;
};

export const BulkActionBarContext = createContext<BulkActionBarContextValue | null>(null);

export const useBulkActionBar = (): BulkActionBarContextValue => {
  const context = useContext(BulkActionBarContext);
  if (!context) {
    throw new Error("useBulkActionBar must be used within BulkActionBar");
  }
  return context;
};
