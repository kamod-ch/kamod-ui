import { signal } from "@preact/signals";
import type { ComponentChildren, HTMLAttributes } from "preact";
import { useEffect, useMemo, useRef } from "preact/hooks";
import { Dialog, type DialogContextValue, useDialog } from "../dialog/Dialog";
import { ConsentManagerContent } from "./ConsentManagerContent";
import {
  type ConsentState,
  type ConsentStorage,
  draftForCategories,
  localStorageConsentStorage,
  readConsent,
  writeConsent,
} from "./consentStorage";
import {
  type ConsentCategory,
  type ConsentContextValue,
  type ConsentManagerLabels,
  type ConsentManagerView,
  ConsentProvider,
  defaultConsentManagerLabels,
} from "./useConsent";

export type ConsentManagerProps = Omit<HTMLAttributes<HTMLDivElement>, "onChange"> & {
  /** Categories the person can accept. Required categories stay on. */
  categories: readonly ConsentCategory[];
  /** A new version invalidates a stored decision and shows the dialog again. */
  version: string;
  /** Called once after a decision is saved. */
  onConsentChange?: (state: ConsentState) => void;
  /** Replaces any of the default English labels. */
  labels?: Partial<ConsentManagerLabels>;
  /** Persists the decision. Defaults to localStorage and ignores storage failures. */
  storage?: ConsentStorage;
  /** Storage key. Default `kamod-consent`. */
  storageKey?: string;
  /** Controlled open state. When omitted, the dialog opens until a valid decision exists. */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: ComponentChildren;
};

const decisionFor = (version: string, categories: Record<string, boolean>): ConsentState => ({
  version,
  decidedAt: new Date().toISOString(),
  categories,
});

export const ConsentManager = ({
  categories,
  version,
  onConsentChange,
  labels: labelsProp,
  storage,
  storageKey = "kamod-consent",
  open: openProp,
  onOpenChange,
  children,
  ...rest
}: ConsentManagerProps) => {
  const labels = { ...defaultConsentManagerLabels, ...labelsProp };
  const storageImpl = storage ?? localStorageConsentStorage;
  const consent = useMemo(() => signal<ConsentState | null>(null), []);
  const draft = useMemo(() => signal<Record<string, boolean>>({}), []);
  const view = useMemo(() => signal<ConsentManagerView>("summary"), []);
  const dialogRef = useRef<DialogContextValue | null>(null);
  const categoriesRef = useRef(categories);
  const versionRef = useRef(version);
  const storageRef = useRef(storageImpl);
  const storageKeyRef = useRef(storageKey);
  const onConsentChangeRef = useRef(onConsentChange);
  const openPropRef = useRef(openProp);
  categoriesRef.current = categories;
  versionRef.current = version;
  storageRef.current = storageImpl;
  storageKeyRef.current = storageKey;
  onConsentChangeRef.current = onConsentChange;
  openPropRef.current = openProp;

  const persist = (categoriesMap: Record<string, boolean>) => {
    const state = decisionFor(versionRef.current, categoriesMap);
    writeConsent(storageRef.current, storageKeyRef.current, state);
    consent.value = state;
    draft.value = { ...categoriesMap };
    onConsentChangeRef.current?.(state);
    dialogRef.current?.setOpen(false);
    view.value = "summary";
  };

  const acceptAll = () => {
    const next: Record<string, boolean> = {};
    for (const category of categoriesRef.current) next[category.id] = true;
    persist(next);
  };

  const rejectAll = () => {
    const next: Record<string, boolean> = {};
    for (const category of categoriesRef.current) next[category.id] = category.required === true;
    persist(next);
  };

  const save = () => {
    const next: Record<string, boolean> = {};
    for (const category of categoriesRef.current) {
      next[category.id] = category.required ? true : draft.value[category.id] === true;
    }
    persist(next);
  };

  const openSettings = () => {
    draft.value = draftForCategories(categoriesRef.current, consent.value);
    view.value = "settings";
    dialogRef.current?.setOpen(true);
  };

  const back = () => {
    view.value = "summary";
  };

  const setCategory = (id: string, enabled: boolean) => {
    const category = categoriesRef.current.find((item) => item.id === id);
    if (!category || category.required) return;
    draft.value = { ...draft.value, [id]: enabled };
  };

  const hasConsent = (id: string) => {
    const category = categoriesRef.current.find((item) => item.id === id);
    if (!category) return false;
    if (category.required) return true;
    return consent.value?.categories[id] === true;
  };

  useEffect(() => {
    const stored = readConsent(
      storageRef.current,
      storageKeyRef.current,
      versionRef.current,
      categoriesRef.current,
    );
    consent.value = stored;
    draft.value = draftForCategories(categoriesRef.current, stored);
    if (!stored && openPropRef.current === undefined) {
      view.value = "summary";
      dialogRef.current?.setOpen(true);
    }
  }, [version, storageKey]);

  const context: ConsentContextValue = {
    categories,
    labels,
    consent,
    draft,
    view,
    hasConsent,
    acceptAll,
    rejectAll,
    save,
    open: openSettings,
    back,
    setCategory,
  };

  const controlled = openProp !== undefined ? { open: openProp } : {};

  return (
    <ConsentProvider value={context}>
      <Dialog {...rest} {...controlled} onOpenChange={onOpenChange} dismissible={false}>
        <DialogBridge dialogRef={dialogRef} />
        {children}
        <ConsentManagerContent />
      </Dialog>
    </ConsentProvider>
  );
};

const DialogBridge = ({ dialogRef }: { dialogRef: { current: DialogContextValue | null } }) => {
  dialogRef.current = useDialog();
  return null;
};
