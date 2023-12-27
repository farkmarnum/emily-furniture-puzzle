import { IDS, SPEC, UNIT } from "./constants";
import { Box, Id, Point, Position } from "./types";

export const hasOverlap = (a: Box, b: Box) => {
  // no horizontal overlap
  if (a.x1 >= b.x2 || b.x1 >= a.x2) return false;

  // no vertical overlap
  if (a.y1 >= b.y2 || b.y1 >= a.y2) return false;

  return true;
};

export const limitMagnitude = (delta: number) => {
  // By limiting the maximum delta to less than half the unit size, there's no way to "jump" over gaps
  const limit = UNIT / 2 - 1;

  if (delta > limit) return limit;
  if (delta < -limit) return -limit;
  return delta;
};

export const getClosestPointOnTopLine = (
  sx: number,
  sy: number,
  x: number
): Point => {
  if (x < sx) return [sx, sy];
  if (x > sx + 1) return [sx + 1, sy];
  return [x, sy];
};

export const getClosestPointOnLeftLine = (
  sx: number,
  sy: number,
  y: number
): Point => {
  if (y < sy) return [sx, sy];
  if (y > sy + 1) return [sx, sy + 1];
  return [sx, y];
};

export const scaleValues =
  (scale: number) =>
  <T extends Record<string, number>>(obj: T): T =>
    Object.fromEntries(
      Object.entries(obj).map(([k, v]) => [k, v * scale])
    ) as T;

// serialization fns for (x,y)
export const serializePoint = (x: number, y: number) => `${x}|${y}`;
export const deserializePoint = (s: string) =>
  s.split("|").map((d) => parseInt(d, 10)) as Point;

// calculate squared distance (no need for sqrt since we're just using it to compare)
export const dist = ([x1, y1]: Point, [x2, y2]: Point) =>
  (x2 - x1) ** 2 + (y2 - y1) ** 2;

export const getOpenSquares = (
  positions: Record<Id, Position>,
  currentId: Id
) => {
  const squares = new Set<string>();
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 5; j++) {
      squares.add(serializePoint(i, j));
    }
  }

  for (const id of IDS) {
    if (id === currentId) continue;

    const { size } = SPEC[id];
    const pos = positions[id];
    const { x, y } = pos;

    for (let w = 0; w < size.width; w++) {
      for (let h = 0; h < size.height; h++) {
        squares.delete(serializePoint(x + w, y + h));
      }
    }
  }

  const { size } = SPEC[currentId];
  // ensure that each square has the other squares needed for the current block's shape
  const validSquares = [...squares].filter((s) => {
    const [x, y] = deserializePoint(s);
    let valid = true;
    const checks = [];
    for (let w = 0; w < size.width; w++) {
      for (let h = 0; h < size.height; h++) {
        checks.push([x + w, y + h]);
        if (!squares.has(serializePoint(x + w, y + h))) {
          valid = false;
        }
      }
    }
    return valid;
  });

  return validSquares;
};
