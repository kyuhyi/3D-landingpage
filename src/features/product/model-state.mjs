export const LAYERS = ["base", "board", "plate", "switches", "caps"];
const OFFSETS = {
  base: -1.45,
  board: -0.65,
  plate: 0.25,
  switches: 1.05,
  caps: 1.85,
};

export function clampExplode(value) {
  return Number.isFinite(value) ? Math.min(1, Math.max(0, value)) : 0;
}

export function layerPosition(layer, progress) {
  return (OFFSETS[layer] ?? 0) * clampExplode(progress) || 0;
}
