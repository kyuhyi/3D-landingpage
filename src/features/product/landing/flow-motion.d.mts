import type { StoryFrame } from "./scroll-story.mjs";
export function createFlowInteraction(): {
  takeOver(progress: number): void;
  reset(): void;
  isManual(progress: number): boolean;
};
export function flowProgress(
  top: number,
  rowHeight: number,
  viewport: number,
): number;
export function sampleFlow(
  value: number,
): StoryFrame & { screenX: number; screenY: number };
