export type Id =
  | "sun"
  | "rect1"
  | "rect2"
  | "rect3"
  | "rect4"
  | "rect5"
  | "dot1"
  | "dot2"
  | "dot3"
  | "dot4";

export type Size = { width: number; height: number };
export type Position = { x: number; y: number };
export type Box = { x1: number; x2: number; y1: number; y2: number };
export type Point = [number, number];
