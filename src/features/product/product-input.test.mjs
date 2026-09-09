import test from "node:test";
import assert from "node:assert/strict";
import {
  clampVolume,
  dragVolume,
  wheelVolume,
  createKeyFeedback,
  KNOB_POSITION,
} from "./product-input.mjs";

test("음량은 0~100 사이이며 위/오른쪽 드래그와 위쪽 휠로 증가한다", () => {
  assert.equal(clampVolume(-20), 0);
  assert.equal(clampVolume(140), 100);
  assert.equal(dragVolume(50, 30, -20), 80);
  assert.equal(dragVolume(50, -300, 0), 0);
  assert.equal(wheelVolume(98, -100), 100);
  assert.equal(wheelVolume(2, 100), 0);
  assert.equal(wheelVolume(50, 0), 50);
});
test("노브 베이스와 첫 줄 키캡 사이에 0.18 이상의 여유가 있다", () => {
  const keyBack = -0.83 - 1.15 / 2;
  assert.ok(keyBack - (KNOB_POSITION.z + 0.65) >= 0.18);
});
test("누르는 동안 LED를 가리고 해제 즉시 원복하며 같은 키도 반복 작동한다", () => {
  const keys = createKeyFeedback();
  keys.hold(2);
  assert.equal(keys.active(10000), 2);
  keys.release();
  assert.equal(keys.active(10000), -1);
  keys.hold(2);
  assert.equal(keys.active(20000), 2);
  keys.release();
  assert.equal(keys.active(20000), -1);
});
test("화면 버튼으로 작동시킨 키도 짧게 눌렸다가 자동 복귀한다", () => {
  const keys = createKeyFeedback();
  keys.pulse(3, 100);
  assert.equal(keys.active(150), 3);
  assert.equal(keys.active(221), -1);
  keys.hold(1);
  keys.release();
  assert.equal(keys.active(150), -1);
});
