export const flowProgress = (top, rowHeight, viewport) =>
  rowHeight > 0 ? ((viewport - rowHeight) / 2 - top) / rowHeight : 0;

// 미세한 레이아웃 오차는 무시하고 실제 스크롤을 다시 시작할 때 소개를 재개한다.
export function createFlowInteraction() {
  let anchor = null;
  return {
    takeOver(progress) {
      anchor = progress;
    },
    reset() {
      anchor = null;
    },
    isManual(progress) {
      if (anchor !== null && Math.abs(progress - anchor) > 0.006) anchor = null;
      return anchor !== null;
    },
  };
}
const frames = [
  [0.3, 0.57, 16.5, 0],
  [-0.48, 0.65, 15.6, 0],
  [0.66, 0.52, 16.2, 0],
  [0.92, 1.08, 19.5, 1],
];
export function sampleFlow(value) {
  const raw = Number.isFinite(value) ? value : 0;
  const t = Math.min(3, Math.max(0, raw));
  const index = Math.min(2, Math.floor(t));
  const fraction = t - index;
  const ease = fraction * fraction * (3 - 2 * fraction);
  const a = frames[index],
    b = frames[index + 1];
  const lerp = (i) => a[i] + (b[i] - a[i]) * ease;
  const chapter = Math.min(3, Math.max(0, Math.round(t)));
  return {
    progress: t / 3,
    chapter,
    part: ["display", "knob", "keys", "layers"][chapter],
    theta: lerp(0),
    phi: lerp(1),
    distance: lerp(2),
    explode: lerp(3),
    targetX: 0,
    targetY: 0,
    screenX: 0.5 + 0.23 * Math.cos(Math.PI * t),
    screenY:
      raw < 0
        ? 0.5 - raw * 1.2
        : raw > 3
          ? 0.5 - (raw - 3) * 1.2
          : 0.5 - 0.3 * Math.sin(Math.PI * 2 * t),
  };
}
