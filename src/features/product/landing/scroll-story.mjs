const clamp = (value) =>
  Number.isFinite(value) ? Math.min(1, Math.max(0, value)) : 0;
export const scrollProgress = (top, height, viewport) =>
  height > viewport ? clamp(-top / (height - viewport)) : 0;
// 각 부품을 읽을 수 있는 정지 구간을 두고 그 사이만 부드럽게 보간한다.
const frames = [
  [0, 0.22, 0.6, 15.7, -3.1, -0.6, 0],
  [0.16, 0.3, 0.55, 15, -3, -0.5, 0],
  [0.31, -0.15, 0.68, 15.2, -3, 0.4, 0],
  [0.43, -0.23, 0.62, 14.8, -3, 0.4, 0],
  [0.57, 0.42, 0.55, 15.5, -3.1, -0.4, 0],
  [0.69, 0.5, 0.64, 15.2, -3.1, -0.4, 0],
  [0.83, 0.6, 1.08, 19, -3.5, -1, 1],
  [1, 0.78, 1.04, 19, -3.5, -1, 1],
];
export function sampleStory(value) {
  const progress = clamp(value);
  const index = Math.max(
    0,
    frames.findIndex(
      (f, i) =>
        i < frames.length - 1 &&
        progress >= f[0] &&
        progress <= frames[i + 1][0],
    ),
  );
  const a = frames[index],
    b = frames[index + 1];
  const t = clamp((progress - a[0]) / (b[0] - a[0]));
  const ease = t * t * (3 - 2 * t);
  const lerp = (i) => a[i] + (b[i] - a[i]) * ease;
  const chapter =
    progress < 0.25 ? 0 : progress < 0.5 ? 1 : progress < 0.75 ? 2 : 3;
  return {
    progress,
    chapter,
    part: ["display", "knob", "keys", "layers"][chapter],
    theta: lerp(1),
    phi: lerp(2),
    distance: lerp(3),
    targetX: lerp(4),
    targetY: lerp(5),
    explode: lerp(6),
  };
}
export function validateInterest(email, consent) {
  const clean = email.trim();
  if (!clean) return "이메일 주소를 입력해 주세요.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean))
    return "이메일 주소를 확인해 주세요.";
  if (!consent) return "이메일 보관에 동의해 주세요.";
  return "";
}
