import { codeLanguages } from "@kamod-ch/ui/code";
import { expect, it } from "vitest";
import { highlightCode } from "./highlight-code";

it.each(codeLanguages)("supports the documentation grammar %s", (language) => {
  if (language === "text") return;
  expect(() => highlightCode("const value = 1;", language)).not.toThrow();
});
