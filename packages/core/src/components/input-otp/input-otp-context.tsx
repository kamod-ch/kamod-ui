import { createContext } from "preact";
import { useContext } from "preact/hooks";
export type InputOTPContextValue = {
  value: string;
  maxLength: number;
  disabled: boolean;
  focused: boolean;
  activeIndex: number;
  inputRef: { current: HTMLInputElement | null };
};

export const InputOTPContext = createContext<InputOTPContextValue | null>(null);

export const useInputOTP = () => {
  const ctx = useContext(InputOTPContext);
  if (!ctx) throw new Error("InputOTPSlot and InputOTPGroup must be used within InputOTP");
  return ctx;
};
