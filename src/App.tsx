import { useState } from "react";
import "./App.css";
import { DraggableBox } from "./DraggableBox";
import { type Position, type Size, type Id, UNIT } from "./constants";
import { getClosestPointOnLeftLine, getClosestPointOnTopLine } from "./utils";

// prettier-ignore
const SPEC: Record<Id, { size: Size; color: string; pos: Position }> = {
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

const IDS = Object.keys(SPEC) as Id[];

const scaleValues = <T extends Record<string, number>>(obj: T): T =>
  Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, v * UNIT])) as T;

const getInitState = () =>
  (Object.keys(SPEC) as Id[]).reduce(
    (acc, id) => ({ ...acc, [id]: SPEC[id].pos }),
    {} as Record<Id, Position>
  );

const serialize = (x: number, y: number) => `${x}|${y}`;
const deserialize = (s: string) => s.split("|").map((d) => parseInt(d, 10));

const dist = ([x1, y1]: [number, number], [x2, y2]: [number, number]) =>
  (x2 - x1) ** 2 + (y2 - y1) ** 2;

const getOpenSquares = (positions: Record<Id, Position>, currentId: Id) => {
  const squares = new Set<string>();
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 5; j++) {
      squares.add(serialize(i, j));
    }
  }

  for (const id of IDS) {
    if (id === currentId) continue;

    const { size } = SPEC[id];
    const pos = positions[id];
    const { x, y } = pos;

    for (let w = 0; w < size.width; w++) {
      for (let h = 0; h < size.height; h++) {
        squares.delete(serialize(x + w, y + h));
      }
    }
  }

  const { size } = SPEC[currentId];
  // ensure that each square has the other squares needed for the current block's shape
  const validSquares = [...squares].filter((s) => {
    const [x, y] = deserialize(s);
    let valid = true;
    const checks = [];
    for (let w = 0; w < size.width; w++) {
      for (let h = 0; h < size.height; h++) {
        checks.push([x + w, y + h]);
        if (!squares.has(serialize(x + w, y + h))) {
          valid = false;
        }
      }
    }
    return valid;
  });

  return validSquares;
};

function App() {
  const [positions, setPositions] = useState(getInitState());

  const setPosition = (id: Id, pos: Position) => {
    let { x, y } = pos;
    x /= UNIT;
    y /= UNIT;

    // snap X or Y
    const xDiff = Math.abs(x - Math.round(x));
    const yDiff = Math.abs(y - Math.round(y));
    // TODO: add GAP for slack
    if (xDiff > yDiff) {
      y = Math.round(y);
    } else {
      x = Math.round(x);
    }

    const { height: h, width: w } = SPEC[id].size;

    // check for collisions with bounds
    if (y < 0) y = 0;
    if (y > 5 - h) y = 5 - h;
    if (x < 0) x = 0;
    if (x > 4 - w) x = 4 - w;

    const openSquares = getOpenSquares(positions, id);

    const current = positions[id];

    let closestPoint = { x: current.x, y: current.y, d: Infinity };
    openSquares.forEach((s) => {
      const [sx, sy] = deserialize(s);

      const points: [number, number][] = [];

      // top line
      if (openSquares.includes(serialize(sx + 1, sy))) {
        points.push(getClosestPointOnTopLine(sx, sy, x));
      }

      // left line
      if (openSquares.includes(serialize(sx, sy + 1))) {
        points.push(getClosestPointOnLeftLine(sx, sy, y));
      }

      if (points.length === 0) {
        // if no other options, just include the single point
        points.push([sx, sy]);
      }

      let p;
      let d;
      if (points.length === 2) {
        const d0 = dist(points[0], [x, y]);
        const d1 = dist(points[1], [x, y]);
        if (d0 < d1) {
          p = points[0];
          d = d0;
        } else {
          p = points[1];
          d = d1;
        }
      } else {
        p = points[0];
        d = dist(points[0], [x, y]);
      }

      if (d < closestPoint.d) {
        closestPoint = { x: p[0], y: p[1], d };
      }
    });

    setPositions((current) => ({ ...current, [id]: closestPoint }));
  };

  return (
    <div style={{ margin: "30px", position: "relative" }}>
      {IDS.map((id) => {
        const { size, color } = SPEC[id];
        const pos = positions[id];

        return (
          <DraggableBox
            key={id}
            size={scaleValues(size)}
            position={scaleValues(pos)}
            setPosition={(newPos) => setPosition(id, newPos)}
            color={color}
            gridSize={UNIT}
          />
        );
      })}
    </div>
  );
}

export default App;
