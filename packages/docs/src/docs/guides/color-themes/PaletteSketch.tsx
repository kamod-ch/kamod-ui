const labels = { workspace: "Workspace", action: "Action card", feature: "Feature" } as const;

/** Decorative static compositions: no timers, loading states or pretend controls. */
export function PaletteSketch({ kind }: { kind: keyof typeof labels }) {
  return (
    <div class={`theme-study-sketch theme-study-sketch-${kind}`} data-palette-sketch={kind}>
      <div class="theme-study-sketch-art" aria-hidden="true">
        {kind === "workspace" && (
          <div class="theme-study-sketch-rail">
            <i />
            <i />
            <i />
          </div>
        )}
        <div class="theme-study-sketch-content">
          {kind === "feature" && <i class="theme-study-sketch-mark" />}
          <b />
          <span />
          {kind === "workspace" ? (
            <div class="theme-study-sketch-sheet">
              <i />
              <i />
              <i />
            </div>
          ) : (
            <>
              <span />
              {kind === "action" && (
                <div class="theme-study-sketch-actions">
                  <i class="theme-study-action" />
                  <i />
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <p class="theme-study-sketch-label">{labels[kind]}</p>
    </div>
  );
}
