import { Button, FieldError, Input, Label } from "@kamod-ch/ui";
import { useRef, useState } from "preact/hooks";
import {
  detectCardBrand,
  digitsOnly,
  formatPanGroups,
  luhnCheck,
  panMaxLength,
  validateCvc,
  validateExpiry,
} from "../../shared";
import type { PaymentFormValues, WalletKind } from "../shared/types";

export type PaymentFormProps = {
  onSubmit?: (values: PaymentFormValues) => void | Promise<void>;
  onWallet?: (wallet: Exclude<WalletKind, "card">) => void | Promise<void>;
  now?: Date;
};

const GENERIC_PAYMENT_ERROR = "Payment could not be completed. Try again.";

const toSafeMessage = (cause: unknown): string => {
  if (cause instanceof Error && cause.message && cause.message.length < 80) return cause.message;
  return GENERIC_PAYMENT_ERROR;
};

export const PaymentForm = ({ onSubmit, onWallet, now }: PaymentFormProps) => {
  const formRef = useRef<HTMLFormElement>(null);
  const [holderName, setHolderName] = useState("");
  const [pan, setPan] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [pending, setPending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const brand = detectCardBrand(pan);
  const grouped = formatPanGroups(pan, brand);
  const [month, year] = expiry.split("/");

  const submit = async (event: SubmitEvent) => {
    event.preventDefault();
    const next: Record<string, string> = {};
    if (!holderName.trim()) next.holderName = "Enter the name on the card.";
    if (!luhnCheck(pan)) next.pan = "Enter a valid card number.";
    if (!validateExpiry(month ?? "", year ?? "", now)) next.expiry = "Enter a valid expiry.";
    if (!validateCvc(cvc, brand))
      next.cvc = brand === "amex" ? "Enter a 4-digit CID." : "Enter a 3-digit CVC.";
    setFieldErrors(next);
    setError("");
    setSuccess(false);
    if (Object.keys(next).length) return;
    setPending(true);
    try {
      await onSubmit?.({
        holderName: holderName.trim(),
        pan: digitsOnly(pan),
        expiryMonth: (month ?? "").padStart(2, "0"),
        expiryYear: (year ?? "").length === 2 ? `20${year}` : (year ?? ""),
        cvc: digitsOnly(cvc),
        brand,
      });
      setSuccess(true);
      setPan("");
      setCvc("");
      setExpiry("");
    } catch (cause) {
      setError(toSafeMessage(cause));
    } finally {
      setPending(false);
    }
  };

  const wallet = async (kind: Exclude<WalletKind, "card">) => {
    setPending(true);
    setError("");
    try {
      await onWallet?.(kind);
      setSuccess(true);
    } catch (cause) {
      setError(toSafeMessage(cause));
    } finally {
      setPending(false);
    }
  };

  return (
    <form
      ref={formRef}
      data-slot="block-payment-form"
      class="bg-background text-foreground mx-auto w-full max-w-md space-y-4 rounded-xl border p-4"
      onSubmit={submit}
      autoComplete="on"
    >
      <p class="text-muted-foreground text-xs">
        This block collects card UI data for a callback. Use PSP-hosted fields or tokenization in
        production. It does not make an app PCI compliant.
      </p>
      <div class="grid grid-cols-2 gap-2">
        <Button
          type="button"
          variant="outline"
          disabled={pending}
          onClick={() => wallet("apple-pay")}
        >
          Apple Pay
        </Button>
        <Button
          type="button"
          variant="outline"
          disabled={pending}
          onClick={() => wallet("google-pay")}
        >
          Google Pay
        </Button>
      </div>
      <div
        class="bg-primary text-primary-foreground rounded-xl p-4"
        aria-hidden="true"
        data-brand={brand}
      >
        <p class="text-xs uppercase tracking-wide">{brand}</p>
        <p class="mt-6 font-mono text-lg tracking-widest">{grouped || "•••• •••• •••• ••••"}</p>
        <div class="mt-4 flex justify-between text-xs">
          <span>{holderName || "FULL NAME"}</span>
          <span>{expiry || "MM/YY"}</span>
        </div>
      </div>
      <div class="grid gap-1">
        <Label for="pay-name">Name on card</Label>
        <Input
          id="pay-name"
          name="cc-name"
          autoComplete="cc-name"
          value={holderName}
          onInput={(event) => setHolderName((event.currentTarget as HTMLInputElement).value)}
          aria-invalid={Boolean(fieldErrors.holderName)}
        />
        {fieldErrors.holderName ? <FieldError>{fieldErrors.holderName}</FieldError> : null}
      </div>
      <div class="grid gap-1">
        <Label for="pay-pan">Card number</Label>
        <Input
          id="pay-pan"
          name="cc-number"
          inputMode="numeric"
          autoComplete="cc-number"
          value={grouped}
          maxLength={brand === "amex" ? 17 : 19}
          onInput={(event) =>
            setPan(
              digitsOnly((event.currentTarget as HTMLInputElement).value).slice(
                0,
                panMaxLength(brand),
              ),
            )
          }
          aria-invalid={Boolean(fieldErrors.pan)}
        />
        {fieldErrors.pan ? <FieldError>{fieldErrors.pan}</FieldError> : null}
      </div>
      <div class="grid grid-cols-2 gap-3">
        <div class="grid gap-1">
          <Label for="pay-exp">Expiry</Label>
          <Input
            id="pay-exp"
            name="cc-exp"
            inputMode="numeric"
            autoComplete="cc-exp"
            placeholder="MM/YY"
            value={expiry}
            onInput={(event) => {
              const digits = digitsOnly((event.currentTarget as HTMLInputElement).value).slice(
                0,
                4,
              );
              setExpiry(digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits);
            }}
            aria-invalid={Boolean(fieldErrors.expiry)}
          />
          {fieldErrors.expiry ? <FieldError>{fieldErrors.expiry}</FieldError> : null}
        </div>
        <div class="grid gap-1">
          <Label for="pay-cvc">CVC</Label>
          <Input
            id="pay-cvc"
            name="cc-csc"
            inputMode="numeric"
            autoComplete="cc-csc"
            value={cvc}
            maxLength={brand === "amex" ? 4 : 3}
            onInput={(event) =>
              setCvc(digitsOnly((event.currentTarget as HTMLInputElement).value).slice(0, 4))
            }
            aria-invalid={Boolean(fieldErrors.cvc)}
          />
          {fieldErrors.cvc ? <FieldError>{fieldErrors.cvc}</FieldError> : null}
        </div>
      </div>
      <Button type="submit" class="w-full" disabled={pending}>
        {pending ? "Processing…" : "Pay"}
      </Button>
      <p role="status" aria-live="polite" class="text-sm">
        {success ? "Payment submitted." : error}
      </p>
    </form>
  );
};
