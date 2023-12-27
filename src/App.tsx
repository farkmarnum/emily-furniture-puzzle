import { useState } from "react";
import "./App.css";
import { DraggableBox } from "./DraggableBox";
import { type Position, type Size, type Id, UNIT } from "./constants";
import {
  getClosestPointOnLeftLine,
  getClosestPointOnTopLine,
  hasOverlap,
} from "./utils";

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

const getOpenSquares = (positions: Record<Id, Position>, currentId: Id) => {
  const squares = new Set<string>();
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      squares.add(`${i}|${j}`);
    }
  }

  for (const id of IDS) {
    if (id === currentId) continue;

    const { size } = SPEC[id];
    const pos = positions[id];
    const { x, y } = pos;

    for (let w = 0; w < size.width; w++) {
      for (let h = 0; h < size.height; h++) {
        squares.delete(`${x + w}|${y + h}`);
      }
    }
  }

  return [...squares].map((s) => s.split("|").map((i) => parseInt(i, 10)));
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
    console.log(JSON.stringify(openSquares));

    let closestPoint = { x: -1, y: -1, d: Infinity };
    openSquares.forEach(([sx, sy]) => {
      // top line
      const p1 = getClosestPointOnTopLine(sx, sy, x);
      const p2 = getClosestPointOnLeftLine(sx, sy, y);

      const d1 = (p1[0] - x) ** 2 + (p1[1] - y) ** 2;
      const d2 = (p2[0] - x) ** 2 + (p2[1] - y) ** 2;

      const [p, d] = d1 < d2 ? [p1, d1] : [p2, d2];
      if (d < closestPoint.d) {
        closestPoint = { x: p[0], y: p[1], d };
      }
    });

    setPositions((current) => ({ ...current, [id]: closestPoint }));
    // return x === pos.x && y === pos.y;
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
