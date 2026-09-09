export type StoryFrame = {
  progress: number;
  chapter: number;
  part: string;
  theta: number;
  phi: number;
  distance: number;
  targetX: number;
  targetY: number;
  explode: number;
};
export function scrollProgress(
  top: number,
  height: number,
  viewport: number,
): number;
export function sampleStory(value: number): StoryFrame;
export function validateInterest(email: string, consent: boolean): string;
