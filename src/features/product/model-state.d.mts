export type LayerName = "base" | "board" | "plate" | "switches" | "caps";
export const LAYERS: LayerName[];
export function clampExplode(value: number): number;
export function layerPosition(layer: LayerName, progress: number): number;
