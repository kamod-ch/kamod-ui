import { prefersReducedMotion } from "../../shared";

export const burstConfetti = (root: HTMLElement) => {
  if (prefersReducedMotion()) return;
  const layer = document.createElement("div");
  layer.setAttribute("data-slot", "checkout-confetti");
  layer.style.cssText = "pointer-events:none;position:absolute;inset:0;overflow:hidden;";
  for (let index = 0; index < 18; index += 1) {
    const bit = document.createElement("span");
    bit.style.cssText = `position:absolute;top:0;left:${(index * 6) % 100}%;width:6px;height:10px;background:var(--chart-${(index % 5) + 1});opacity:.85;transform:translateY(0);animation:kamod-confetti 700ms ease-out forwards;`;
    layer.append(bit);
  }
  const style = document.createElement("style");
  style.textContent =
    "@keyframes kamod-confetti { to { transform: translateY(120px) rotate(120deg); opacity: 0; } }";
  layer.append(style);
  root.append(layer);
  window.setTimeout(() => layer.remove(), 800);
};
