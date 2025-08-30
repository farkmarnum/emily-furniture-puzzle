import type { Id, Position, Size } from "./types";

export const getUnit = () => {
  const u = Math.min((window.innerWidth) / 5, 120);
  return u;
};

export const GAP = 0.03;

// prettier-ignore
export const SPEC: Record<Id, { size: Size; color: string; pos: Position }> = {
  // sun:   { size: { width: 2, height: 2 }, color: 'red',         pos: { x: 1, y: 0 } },
  // rect1: { size: { width: 1, height: 2 }, color: 'lightblue',   pos: { x: 0, y: 0 } },
  // rect2: { size: { width: 1, height: 2 }, color: 'lightblue',   pos: { x: 3, y: 0 } },
  // rect3: { size: { width: 2, height: 1 }, color: 'lightblue',   pos: { x: 1, y: 2 } },
  // rect4: { size: { width: 1, height: 2 }, color: 'lightblue',   pos: { x: 0, y: 3 } },
  // rect5: { size: { width: 1, height: 2 }, color: 'lightblue',   pos: { x: 3, y: 3 } },
  dot1:  { size: { width: 1, height: 1 }, color: 'red', pos: { x: 0, y: 1 } },
  dot2:  { size: { width: 1, height: 1 }, color: 'red', pos: { x: 1, y: 0 } },
  dot3:  { size: { width: 1, height: 1 }, color: 'red', pos: { x: 2, y: 0 } },
  dot4:  { size: { width: 1, height: 1 }, color: 'red', pos: { x: 3, y: 1 } },
  blocker1:  { size: { width: 1, height: 1 }, color: 'transparent', pos: { x: 0, y: 0 } },
  blocker2:  { size: { width: 1, height: 1 }, color: 'transparent', pos: { x: 3, y: 0 } },
};

export const IDS = Object.keys(SPEC) as Id[];

export const INIT_STATE = (Object.keys(SPEC) as Id[]).reduce(
  (acc, id) => ({ ...acc, [id]: SPEC[id].pos }),
  {} as Record<Id, Position>
);
