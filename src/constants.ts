import type { Id, Position, Size } from "./types";

export const UNIT = window.innerWidth < 420 ? (window.innerWidth - 60) / 4 : 80;

export const GAP = 0.03;

// prettier-ignore
export const SPEC: Record<Id, { size: Size; color: string; pos: Position }> = {
  sun:   { size: { width: 2, height: 2 }, color: 'red',         pos: { x: 1, y: 0 } },
  rect1: { size: { width: 1, height: 2 }, color: 'lightblue',   pos: { x: 0, y: 0 } },
  rect2: { size: { width: 1, height: 2 }, color: 'lightblue',   pos: { x: 3, y: 0 } },
  rect3: { size: { width: 2, height: 1 }, color: 'lightblue',   pos: { x: 1, y: 2 } },
  rect4: { size: { width: 1, height: 2 }, color: 'lightblue',   pos: { x: 0, y: 3 } },
  rect5: { size: { width: 1, height: 2 }, color: 'lightblue',   pos: { x: 3, y: 3 } },
  dot1:  { size: { width: 1, height: 1 }, color: 'lightyellow', pos: { x: 1, y: 3 } },
  dot2:  { size: { width: 1, height: 1 }, color: 'lightyellow', pos: { x: 1, y: 4 } },
  dot3:  { size: { width: 1, height: 1 }, color: 'lightyellow', pos: { x: 2, y: 3 } },
  dot4:  { size: { width: 1, height: 1 }, color: 'lightyellow', pos: { x: 2, y: 4 } },
};

export const IDS = Object.keys(SPEC) as Id[];

export const INIT_STATE = (Object.keys(SPEC) as Id[]).reduce(
  (acc, id) => ({ ...acc, [id]: SPEC[id].pos }),
  {} as Record<Id, Position>
);
