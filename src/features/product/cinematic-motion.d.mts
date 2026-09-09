export type TourFrame = {
  theta: number;
  phi: number;
  distance: number;
  targetX: number;
  explode: number;
  headline: number;
  progress: number;
  chapter: "intro" | "detail" | "layers";
};
export const TOUR_DURATION: number;
export function sampleTour(seconds: number): TourFrame;
