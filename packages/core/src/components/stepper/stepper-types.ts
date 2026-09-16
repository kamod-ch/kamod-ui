import type { ComponentChildren } from "preact";

export type StepperStepStatus = "upcoming" | "current" | "completed" | "error";

export type StepperStepDefinition = {
  id: string;
  title: ComponentChildren;
  description?: ComponentChildren;
  optional?: boolean;
};

export type StepperOrientation = "horizontal" | "vertical";

export type StepperSize = "default" | "sm";
