import test from "node:test";
import assert from "node:assert/strict";
import {
  sampleFlow,
  flowProgress,
  createFlowInteraction,
} from "./flow-motion.mjs";

test("드래그나 확대 후 정지한 스크롤에서는 수동 시점을 유지한다", () => {
  const interaction = createFlowInteraction();
  interaction.takeOver(1.2);
  assert.equal(interaction.isManual(1.2), true);
  assert.equal(interaction.isManual(1.201), true);
  assert.equal(interaction.isManual(1.2), true);
});
test("다음 스크롤과 소개 시점 복원은 수동 조작을 해제한다", () => {
  const interaction = createFlowInteraction();
  interaction.takeOver(1.2);
  assert.equal(interaction.isManual(1.22), false);
  assert.equal(interaction.isManual(1.2), false);
  interaction.takeOver(2);
  interaction.reset();
  assert.equal(interaction.isManual(2), false);
});

test("문서의 네 제품 소개 위치가 각각 진행률 0,1,2,3에 대응한다", () => {
  assert.equal(flowProgress(400, 800, 800), -0.5);
  assert.equal(flowProgress(0, 800, 800), 0);
  assert.equal(flowProgress(-1600, 800, 800), 2);
});
test("스크롤을 내리면 제품이 오른쪽과 왼쪽을 번갈아 따라간다", () => {
  assert.ok(sampleFlow(0).screenX > 0.5);
  assert.ok(sampleFlow(1).screenX < 0.5);
  assert.ok(sampleFlow(2).screenX > 0.5);
  assert.ok(sampleFlow(3).screenX < 0.5);
  assert.ok(sampleFlow(-0.5).screenY > sampleFlow(0).screenY);
  assert.ok(sampleFlow(3.5).screenY < sampleFlow(3).screenY);
});
test("스크롤 중 카메라·위치가 연속이고 마지막 부분은 완전히 분해된다", () => {
  for (let t = -0.5; t < 3.5; t += 0.001) {
    const a = sampleFlow(t),
      b = sampleFlow(t + 0.001);
    assert.ok(Math.abs(a.screenX - b.screenX) < 0.01);
    assert.ok(Math.abs(a.screenY - b.screenY) < 0.01);
    assert.ok(Math.abs(a.theta - b.theta) < 0.02);
  }
  assert.equal(sampleFlow(0).explode, 0);
  assert.equal(sampleFlow(3).explode, 1);
  assert.deepEqual(sampleFlow(NaN), sampleFlow(0));
});
