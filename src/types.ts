export type Id =
  | "dot1"
  | "dot2"
  | "dot3"
  | "dot4"
  | "blocker1"
  | "blocker2";

export type Size = { width: number; height: number };
export type Position = { x: number; y: number };
export type Box = { x1: number; x2: number; y1: number; y2: number };
export type Point = [number, number];
