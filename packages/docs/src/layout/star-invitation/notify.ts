export const CODE_COPY_SUCCESS_EVENT = "kamod:code-copy-success";
export const TEMPLATE_DELIVERED_EVENT = "kamod:template-delivered";

export function notifyCodeCopySuccess() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(CODE_COPY_SUCCESS_EVENT));
}

export function notifyTemplateDelivered() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(TEMPLATE_DELIVERED_EVENT));
}
