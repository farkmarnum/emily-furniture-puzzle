import { useState } from "react";
import "./App.css";
import { DraggableBox } from "./DraggableBox";

const UNIT = 50;

type ID =
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

type Size = { width: number; height: number };
type Position = { x: number; y: number };

// prettier-ignore
const SPEC: Record<ID, { size: Size; color: string; pos: Position }> = {
  sun: { size: { width: 2 * UNIT, height: 2 * UNIT }, color: 'red', pos: { x: 1 * UNIT, y: 0 * UNIT } },
  rect1: { size: { width: 1 * UNIT, height: 2 * UNIT }, color: 'lightblue', pos: { x: 0 * UNIT, y: 0 * UNIT } },
  rect2: { size: { width: 1 * UNIT, height: 2 * UNIT }, color: 'lightblue', pos: { x: 3 * UNIT, y: 0 * UNIT } },
  rect3: { size: { width: 2 * UNIT, height: 1 * UNIT }, color: 'lightblue', pos: { x: 1 * UNIT, y: 2 * UNIT } },
  rect4: { size: { width: 1 * UNIT, height: 2 * UNIT }, color: 'lightblue', pos: { x: 0 * UNIT, y: 3 * UNIT } },
  rect5: { size: { width: 1 * UNIT, height: 2 * UNIT }, color: 'lightblue', pos: { x: 3 * UNIT, y: 3 * UNIT } },
  dot1: { size: { width: 1 * UNIT, height: 1 * UNIT }, color: 'lightyellow', pos: { x: 1 * UNIT, y: 3 * UNIT } },
  dot2: { size: { width: 1 * UNIT, height: 1 * UNIT }, color: 'lightyellow', pos: { x: 1 * UNIT, y: 4 * UNIT } },
  dot3: { size: { width: 1 * UNIT, height: 1 * UNIT }, color: 'lightyellow', pos: { x: 2 * UNIT, y: 3 * UNIT } },
  dot4: { size: { width: 1 * UNIT, height: 1 * UNIT }, color: 'lightyellow', pos: { x: 2 * UNIT, y: 4 * UNIT } },
};

const getInitState = () =>
  (Object.keys(SPEC) as ID[]).reduce(
    (acc, id) => ({ ...acc, [id]: SPEC[id].pos }),
    {} as Record<ID, Position>
  );

const possiblePoints = () => {
  // 1. find the open squares
  const squares = [];
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      squares.push([i, j]);
    }
  }

  
};

function App() {
  const [positions, setPositions] = useState(getInitState());

  const setPosition = (id: ID, pos: Position) => {
    let { x, y } = pos;

    // const currentPos = positions[id];

    // check for collisions with bounds
    const { height: h, width: w } = SPEC[id].size;
    if (y < 0) y = 0;
    if (y > UNIT * 5 - h) y = UNIT * 5 - h;
    if (x < 0) x = 0;
    if (x > UNIT * 4 - w) x = UNIT * 4 - w;

    const a = { x1: x, x2: x + w, y1: y, y2: y + h };

    // check for collisions with other blocks
    (Object.entries(positions) as [ID, Position][]).forEach(
      ([otherId, otherPos]) => {
        if (otherId === id) return;
        const { x: x1, y: y1 } = otherPos;
        const { width, height } = SPEC[otherId].size;

        const x2 = x1 + width;
        const y2 = y1 + height;

        const b = { x1, x2, y1, y2 };

        const hasCollisionOrBorder =
          !(a.x1 > b.x2 || b.x1 > a.x2) || !(a.y1 > b.y2 || b.y1 > a.y2);
        const hasXOverlap = !(a.x1 >= b.x2 || b.x1 >= a.x2);
        const hasYOverlap = !(a.y1 >= b.y2 || b.y1 >= a.y2);

        if (hasCollisionOrBorder) {
          if (hasXOverlap) {
            console.log("hasXOverlap");
            // x = currentPos.x;
          }
          if (hasYOverlap) {
            console.log("hasYOverlap");
            // x = currentPos.y;
          }
        }
      }
    );

    console.log("setting:", x, y);

    setPositions((current) => ({ ...current, [id]: { x, y } }));
    return x === pos.x && y === pos.y;
  };

  return (
    <div>
      {(Object.entries(positions) as [ID, Position][]).map(([id, pos]) => {
        const { size, color } = SPEC[id];

        return (
          <DraggableBox
            key={id}
            size={size}
            position={pos}
            setPosition={(newPos) => {
              return setPosition(id, newPos);
            }}
            color={color}
            gridSize={UNIT}
          />
        );
      })}
    </div>
  );
}

export default App;
