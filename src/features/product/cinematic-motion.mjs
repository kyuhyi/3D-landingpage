export const TOUR_DURATION = 36;
const shots = [
  [0, 0.3, 0.64, 13, -1.8, 0, 1],
  [5, 0.48, 0.72, 12.5, -1.6, 0, 1],
  [10, 0.74, 0.58, 10.8, 0.7, 0, 0],
  [15, 1.9, 0.88, 11.8, 0.6, 0, 0],
  [20, 3.1, 0.92, 13.5, 0.3, 0.05, 0],
  [25, 3.95, 1.08, 15, 0, 1, 0],
  [30, 5.35, 0.85, 14.5, -0.4, 1, 0],
  [36, Math.PI * 2 + 0.3, 0.64, 13, -1.8, 0, 1],
];

export function sampleTour(seconds) {
  const time = ((seconds % TOUR_DURATION) + TOUR_DURATION) % TOUR_DURATION;
  const index = shots.findIndex(
    (shot, i) =>
      i < shots.length - 1 && time >= shot[0] && time < shots[i + 1][0],
  );
  const a = shots[Math.max(index, 0)],
    b = shots[Math.max(index, 0) + 1];
  const t = (time - a[0]) / (b[0] - a[0]);
  const eased = t * t * (3 - 2 * t);
  const lerp = (n) => a[n] + (b[n] - a[n]) * eased;
  return {
    theta: lerp(1),
    phi: lerp(2),
    distance: lerp(3),
    targetX: lerp(4),
    explode: lerp(5),
    headline: lerp(6),
    progress: time / TOUR_DURATION,
    chapter: time < 7 || time > 33 ? "intro" : time < 20 ? "detail" : "layers",
  };
}
