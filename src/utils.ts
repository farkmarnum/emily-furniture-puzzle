import { UNIT } from "./constants";

type Box = { x1: number; x2: number; y1: number; y2: number };

export const hasOverlap = (a: Box, b: Box) => {
  // no horizontal overlap
  if (a.x1 >= b.x2 || b.x1 >= a.x2) return false;

  // no vertical overlap
  if (a.y1 >= b.y2 || b.y1 >= a.y2) return false;

  return true;
};

export const limitMagnitude = (delta: number) => {
  const limit = UNIT / 2;
  if (delta > limit) return limit;
  if (delta < -limit) return -limit;
  return delta;
};

export const getClosestPointOnTopLine = (
  sx: number,
  sy: number,
  x: number
): [number, number] => {
  if (x < sx) return [sx, sy];
  if (x > sx + 1) return [sx + 1, sy];
  return [x, sy];
};

export const getClosestPointOnLeftLine = (
  sx: number,
  sy: number,
  y: number
): [number, number] => {
  if (y < sy) return [sx, sy];
  if (y > sy + 1) return [sx, sy + 1];
  return [sx, y];
};
