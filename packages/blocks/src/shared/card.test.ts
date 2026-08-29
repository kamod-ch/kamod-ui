import { describe, expect, it } from "vitest";
import {
  detectCardBrand,
  digitsOnly,
  formatPanGroups,
  luhnCheck,
  maskPan,
  panMaxLength,
  validateCvc,
  validateExpiry,
} from "./card";

describe("card utilities", () => {
  it("strips non-digits", () => {
    expect(digitsOnly("4111 1111 1111 1111")).toBe("4111111111111111");
  });

  it("accepts a valid Visa test PAN and rejects a tampered checksum", () => {
    expect(luhnCheck("4111111111111111")).toBe(true);
    expect(luhnCheck("4111111111111112")).toBe(false);
    expect(luhnCheck("123")).toBe(false);
  });

  it("detects common brands from BIN prefixes", () => {
    expect(detectCardBrand("4111111111111111")).toBe("visa");
    expect(detectCardBrand("5100000000000000")).toBe("mastercard");
    expect(detectCardBrand("2221000000000009")).toBe("mastercard");
    expect(detectCardBrand("371449635398431")).toBe("amex");
    expect(detectCardBrand("6011000000000004")).toBe("discover");
    expect(detectCardBrand("999999")).toBe("unknown");
  });

  it("validates expiry against end of month", () => {
    const now = new Date(2026, 7, 14);
    expect(validateExpiry("08", "2026", now)).toBe(true);
    expect(validateExpiry("07", "2026", now)).toBe(false);
    expect(validateExpiry("13", "2026", now)).toBe(false);
    expect(validateExpiry("08", "26", now)).toBe(true);
  });

  it("validates CVC length by brand", () => {
    expect(validateCvc("123", "visa")).toBe(true);
    expect(validateCvc("1234", "visa")).toBe(false);
    expect(validateCvc("1234", "amex")).toBe(true);
    expect(validateCvc("123", "amex")).toBe(false);
  });

  it("masks a PAN to the last four digits", () => {
    expect(maskPan("4111111111111111")).toBe("•••• 1111");
  });

  it("groups PAN digits for display without storing extras", () => {
    expect(formatPanGroups("4111111111111111")).toBe("4111 1111 1111 1111");
    expect(formatPanGroups("371449635398431")).toBe("3714 496353 98431");
    expect(panMaxLength("amex")).toBe(15);
    expect(panMaxLength("visa")).toBe(16);
  });
});
