/**
 * SawahSense Demo Field Data
 *
 * demo-video branch: fields are intentionally empty so the app starts with
 * a clean slate for the onboarding demo scene.
 *
 * Full field data lives on the `main` branch.
 */

// ── Helpers ───────────────────────────────────────────────────────────────────
function getBounds(coords) {
  const lngs = coords.map((c) => c[0]);
  const lats = coords.map((c) => c[1]);
  return [
    [Math.min(...lats), Math.min(...lngs)],
    [Math.max(...lats), Math.max(...lngs)],
  ];
}
function tilePath(fieldId) {
  return `/demo-tiles/${fieldId}`;
}

// ── DEMO_FIELDS — empty for onboarding demo ────────────────────────────────────
export const DEMO_FIELDS = [];

// ── Exports ────────────────────────────────────────────────────────────────────

export function getFieldsSortedByAlert() {
  const order = { critical: 0, warning: 1, healthy: 2 };
  return [...DEMO_FIELDS].sort(
    (a, b) => order[a.alertLevel] - order[b.alertLevel],
  );
}

/**
 * Get the latest non-cloudy acquisition date for a field.
 */
export function getLatestClearDate(field) {
  if (!field.acquisitionDates) return null;
  const clear = [...field.acquisitionDates]
    .reverse()
    .find((d) => d.cloudPct <= 40);
  return clear?.date ?? null;
}

/**
 * Build the heatmap tile URL for a given field, index, and date.
 * Returns null if the field has no tile config.
 */
export function getHeatmapTileUrl(field, index, date) {
  if (!field.tileBasePath || !date) return null;
  return `${field.tileBasePath}/${index.toLowerCase()}/${date}.png`;
}
