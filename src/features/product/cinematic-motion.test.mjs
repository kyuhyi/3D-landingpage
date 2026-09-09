import test from "node:test";
import assert from "node:assert/strict";
import { sampleTour, TOUR_DURATION } from "./cinematic-motion.mjs";

test("자동 투어가 조립된 소개 장면에서 시작한다", () => {
  const shot = sampleTour(0);
  assert.equal(shot.explode, 0);
  assert.equal(shot.chapter, "intro");
  assert.ok(shot.headline > 0.9);
});

test("회전, 확대, 분해가 모두 투어에 포함된다", () => {
  const shots = Array.from({ length: 36 }, (_, i) => sampleTour(i));
  assert.ok(Math.max(...shots.map((s) => s.explode)) > 0.95);
  assert.ok(
    Math.max(...shots.map((s) => s.theta)) -
      Math.min(...shots.map((s) => s.theta)) >
      5,
  );
  assert.ok(
    Math.max(...shots.map((s) => s.distance)) -
      Math.min(...shots.map((s) => s.distance)) >
      3,
  );
  assert.ok(shots.every((s) => s.explode >= 0 && s.explode <= 1));
});

test("투어 반복 경계에서 카메라가 순간 이동하지 않는다", () => {
  const first = sampleTour(0),
    last = sampleTour(TOUR_DURATION - 0.001);
  assert.ok(Math.abs(Math.cos(first.theta) - Math.cos(last.theta)) < 0.001);
  assert.ok(Math.abs(first.distance - last.distance) < 0.001);
  assert.ok(Math.abs(first.explode - last.explode) < 0.001);
});
