import test from "node:test";
import assert from "node:assert/strict";
import { clampExplode, layerPosition, LAYERS } from "./model-state.mjs";

test("분해 슬라이더의 잘못된 입력과 범위를 처리한다", () => {
  assert.equal(clampExplode(-1), 0);
  assert.equal(clampExplode(2), 1);
  assert.equal(clampExplode(NaN), 0);
  assert.equal(clampExplode(0.4), 0.4);
});

test("조립 상태에서는 모든 그룹이 원래 위치에 있다", () => {
  for (const layer of LAYERS) assert.equal(layerPosition(layer, 0), 0);
});

test("완전 분해 상태에서 부품 순서와 간격이 유지된다", () => {
  const positions = LAYERS.map((layer) => layerPosition(layer, 1));
  for (let i = 1; i < positions.length; i++)
    assert.ok(positions[i] > positions[i - 1]);
  assert.ok(positions.at(-1) - positions[0] > 3);
});

test("분해 애니메이션 중 부품은 역행하지 않는다", () => {
  for (const layer of LAYERS) {
    const end = layerPosition(layer, 1);
    const halfway = layerPosition(layer, 0.5);
    assert.ok(Math.abs(halfway) <= Math.abs(end));
  }
});
