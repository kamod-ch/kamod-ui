export type AvatarContextValue = {
  notifyLoad: () => void;
  notifyError: () => void;
  resetImage: () => void;
  showFallback: boolean;
};
