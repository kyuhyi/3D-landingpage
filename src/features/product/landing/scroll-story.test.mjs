import test from "node:test";
import assert from "node:assert/strict";
import {
  sampleStory,
  scrollProgress,
  validateInterest,
} from "./scroll-story.mjs";

test("스크롤 진입/종료 범위와 역방향 진행률", () => {
  assert.equal(scrollProgress(200, 5000, 1000), 0);
  assert.equal(scrollProgress(-2000, 5000, 1000), 0.5);
  assert.equal(scrollProgress(-6000, 5000, 1000), 1);
  assert.equal(scrollProgress(-1000, 5000, 1000), 0.25);
  assert.equal(scrollProgress(0, 0, 0), 0);
});
test("4개 설명 단계에서 실제 부품을 표시하고 마지막에 분해한다", () => {
  assert.equal(sampleStory(0).part, "display");
  assert.equal(sampleStory(0.34).part, "knob");
  assert.equal(sampleStory(0.64).part, "keys");
  assert.equal(sampleStory(1).part, "layers");
  assert.equal(sampleStory(0).explode, 0);
  assert.equal(sampleStory(1).explode, 1);
});
test("빠른 스크롤과 경계에서도 유효하고 연속적인 카메라를 반환한다", () => {
  for (let i = 1; i <= 1000; i++) {
    const a = sampleStory((i - 1) / 1000),
      b = sampleStory(i / 1000);
    assert.ok(Math.abs(a.distance - b.distance) < 0.1);
    assert.ok(Math.abs(a.theta - b.theta) < 0.05);
    assert.ok(b.explode >= 0 && b.explode <= 1);
  }
  assert.deepEqual(sampleStory(-1), sampleStory(0));
  assert.deepEqual(sampleStory(NaN), sampleStory(0));
  assert.deepEqual(sampleStory(2), sampleStory(1));
});
test("알림 정보는 유효한 이메일과 동의가 있어야 저장 가능하다", () => {
  assert.equal(validateInterest("", true), "이메일 주소를 입력해 주세요.");
  assert.equal(
    validateInterest("hello@", true),
    "이메일 주소를 확인해 주세요.",
  );
  assert.equal(
    validateInterest("test@example.com", false),
    "이메일 보관에 동의해 주세요.",
  );
  assert.equal(validateInterest(" test@example.com ", true), "");
});
