export const KNOB_POSITION: { x: number; y: number; z: number };
export function clampVolume(value: number): number;
export function dragVolume(start: number, dx: number, dy: number): number;
export function wheelVolume(start: number, delta: number): number;
export function createKeyFeedback(): {
  hold(index: number): void;
  release(): void;
  pulse(index: number, now: number): void;
  active(now: number): number;
};
