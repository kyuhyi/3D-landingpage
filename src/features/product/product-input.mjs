export const KNOB_POSITION = { x: 2.12, y: 0.3, z: -2.24 };
export const clampVolume = (value) =>
  Math.round(Math.min(100, Math.max(0, value)));
export const dragVolume = (start, dx, dy) =>
  clampVolume(start + (dx - dy) * 0.6);
export const wheelVolume = (start, delta) =>
  clampVolume(start - Math.sign(delta) * 5);

// 선택 상태와 실제 스위치의 눌림 상태를 분리한다.
export function createKeyFeedback() {
  let held = -1,
    pulsed = -1,
    until = 0;
  return {
    hold(index) {
      held = index;
      pulsed = -1;
    },
    release() {
      held = -1;
      pulsed = -1;
      until = 0;
    },
    pulse(index, now) {
      pulsed = index;
      until = now + 120;
    },
    active(now) {
      return held >= 0 ? held : now < until ? pulsed : -1;
    },
  };
}
