/** @jsxImportSource preact */
import { RocketIcon } from "@kamod-ch/icons/tabler/outline";
import { useEffect, useRef } from "preact/hooks";
import { observeViewportActivity } from "../../layout/runtime/viewport-activity";

// Stable first paint on the server and client; each star chooses a new spot only while invisible.
const STARS = [
  { x: 12, y: 33, size: 9, duration: 5.2, delay: -0.5 },
  { x: 30, y: 10, size: 10.2, duration: 6.6, delay: -3.3 },
  { x: 72, y: 12, size: 8.7, duration: 5.8, delay: -2 },
  { x: 91, y: 43, size: 11, duration: 7.2, delay: -4.6 },
  { x: 72, y: 84, size: 9.7, duration: 6.2, delay: -1.4 },
  { x: 19, y: 83, size: 10.6, duration: 7.6, delay: -5.4 },
] as const;

function moveStar(star: SVGSVGElement) {
  star.style.setProperty("--star-x", `${8 + Math.random() * 84}%`);
  star.style.setProperty("--star-y", `${10 + Math.random() * 80}%`);
  star.style.setProperty("--star-size", `${9 + Math.random() * 2}px`);
}

/** A transparent constellation with a forward-only flight and no timers or frame loop. */
export function GettingStartedRocket() {
  const field = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (!field.current) return;
    const node = field.current;
    return observeViewportActivity(node, (active) => {
      node.dataset.active = String(active);
    });
  }, []);

  return (
    <span ref={field} class="getting-started-flight" data-active="false" aria-hidden="true">
      {STARS.map((star, index) => (
        <svg
          key={index}
          class="getting-started-flight-star"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          focusable="false"
          style={{
            "--star-x": `${star.x}%`,
            "--star-y": `${star.y}%`,
            "--star-size": `${star.size}px`,
            "--star-duration": `${star.duration}s`,
            "--star-delay": `${star.delay}s`,
          }}
          onAnimationIteration={(event) => moveStar(event.currentTarget)}
        >
          <path d="M12 2c1 7 3 9 10 10-7 1-9 3-10 10C11 15 9 13 2 12c7-1 9-3 10-10Z" />
        </svg>
      ))}
      <span class="getting-started-flight-rocket">
        <svg
          class="getting-started-flight-trail"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={0.7}
          strokeLinecap="round"
          focusable="false"
        >
          <path d="m5 17-3 3" />
          <path d="m7 19-4 4" />
          <path d="m9 21-2 2" />
        </svg>
        <RocketIcon size={78} strokeWidth={1.4} />
      </span>
    </span>
  );
}
