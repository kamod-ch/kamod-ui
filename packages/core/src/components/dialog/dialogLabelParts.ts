import { type ComponentChildren, Fragment, isValidElement, toChildArray, type VNode } from "preact";
import { AlertDialogDescription } from "../alert-dialog/AlertDialogDescription";
import { AlertDialogTitle } from "../alert-dialog/AlertDialogTitle";
import { DialogDescription } from "./DialogDescription";
import { DialogTitle } from "./DialogTitle";

export type DialogLabelParts = {
  hasTitle: boolean;
  hasDescription: boolean;
  titleId?: string;
  descriptionId?: string;
};

const visit = (nodes: ComponentChildren, parts: DialogLabelParts) => {
  for (const node of toChildArray(nodes)) {
    if (!isValidElement(node)) continue;
    const element = node as VNode;
    if (element.type === DialogTitle || element.type === AlertDialogTitle) {
      parts.hasTitle = true;
      const explicitId = element.props?.id;
      if (typeof explicitId === "string") {
        parts.titleId = explicitId;
      }
    }
    if (element.type === DialogDescription || element.type === AlertDialogDescription) {
      parts.hasDescription = true;
      const explicitId = element.props?.id;
      if (typeof explicitId === "string") {
        parts.descriptionId = explicitId;
      }
    }
    if (element.type === Fragment) {
      visit(element.props?.children, parts);
      continue;
    }
    visit(element.props?.children, parts);
  }
};

export const findDialogLabelParts = (children?: ComponentChildren): DialogLabelParts => {
  const parts: DialogLabelParts = {
    hasTitle: false,
    hasDescription: false,
  };
  visit(children, parts);
  return parts;
};
