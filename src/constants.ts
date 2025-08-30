import type { Id, Position, Size } from "./types";

export const getUnit = () => {
  const u = Math.min((window.innerWidth) * 0.19, 100);
  return u;
};

export const GAP = 0.01;

// prettier-ignore
export const SPEC: Record<Id, { size: Size; color: string; pos: Position }> = {
  dot1:  { size: { width: 1, height: 1 }, color: 'red', pos: { x: 0, y: 1 } },
  dot2:  { size: { width: 1, height: 1 }, color: 'red', pos: { x: 0, y: 2 } },
  dot3:  { size: { width: 1, height: 1 }, color: 'red', pos: { x: 0, y: 3 } },
  dot4:  { size: { width: 1, height: 1 }, color: 'red', pos: { x: 0, y: 4 } },
  blocker1:  { size: { width: 1, height: 1 }, color: 'transparent', pos: { x: 0, y: 0 } },
  blocker2:  { size: { width: 1, height: 1 }, color: 'transparent', pos: { x: 3, y: 0 } },
};

export const IDS = Object.keys(SPEC) as Id[];

export const INIT_STATE = (Object.keys(SPEC) as Id[]).reduce(
  (acc, id) => ({ ...acc, [id]: SPEC[id].pos }),
  {} as Record<Id, Position>
);
