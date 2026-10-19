/** @jsxImportSource preact */
import { RocketIcon } from "@kamod-ch/icons/tabler/outline";
import { useEffect, useRef } from "preact/hooks";
import { observeViewportActivity } from "../../layout/runtime/viewport-activity.ts";

// Outer corner lanes leave air around the vehicle; random placement happens only at hidden seams.
const STARS = [
  { x: 14, y: 17, size: 15, duration: 4.6, delay: -0.8 },
  { x: 85, y: 16, size: 16, duration: 5.3, delay: -3.2 },
  { x: 86, y: 83, size: 14, duration: 4.9, delay: -1.9 },
  { x: 15, y: 84, size: 15.5, duration: 5.8, delay: -4.7 },
] as const;
const TRAILS = [
  { x: 13, y: 72, size: 19, duration: 0.48, delay: -0.16 },
  { x: 20, y: 81, size: 24, duration: 0.62, delay: -0.42 },
  { x: 31, y: 87, size: 16, duration: 0.54, delay: -0.29 },
] as const;

function moveStar(star: SVGSVGElement, index: number) {
  const lane = STARS[index];
  star.style.setProperty("--star-x", `${(lane.x < 50 ? 12 : 82) + Math.random() * 6}%`);
  star.style.setProperty("--star-y", `${(lane.y < 50 ? 14 : 79) + Math.random() * 7}%`);
  star.style.setProperty("--star-size", `${14 + Math.random() * 2}px`);
}

/** Stationary flight: layered CSS turbulence and independent wake icons, without a frame loop. */
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
          onAnimationIteration={(event) => moveStar(event.currentTarget, index)}
        >
          <path d="M12 2c1 7 3 9 10 10-7 1-9 3-10 10C11 15 9 13 2 12c7-1 9-3 10-10Z" />
        </svg>
      ))}
      <span class="getting-started-flight-rocket">
        <span class="getting-started-flight-thrust">
          {TRAILS.map((trail, index) => (
            <svg
              key={index}
              class="getting-started-flight-trail"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.35}
              strokeLinecap="round"
              focusable="false"
              style={{
                left: `${trail.x}%`,
                top: `${trail.y}%`,
                "--trail-size": `${trail.size}px`,
                "--trail-duration": `${trail.duration}s`,
                "--trail-delay": `${trail.delay}s`,
              }}
            >
              <path d="m17 7-10 10" />
            </svg>
          ))}
          <RocketIcon class="getting-started-flight-vehicle" size={78} strokeWidth={1.4} />
        </span>
      </span>
    </span>
  );
}
