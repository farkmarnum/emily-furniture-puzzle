import { useState } from "react";
import "./App.css";
import { DraggableBox } from "./DraggableBox";
import { type Position, type Size, type Id, UNIT } from "./constants";
import { hasOverlap } from "./utils";

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

function App() {
  const [positions, setPositions] = useState(getInitState());

  const getBounds = (id: Id) => {
    const { x: x1, y: y1 } = positions[id];
    const { width, height } = SPEC[id].size;
    const x2 = x1 + width;
    const y2 = y1 + height;

    return { x1, x2, y1, y2 };
  };

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
    const block = { x1: x, x2: x + w, y1: y, y2: y + h };

    // check for collisions with other blocks
    const overlappingBlocks = IDS.filter((otherId) => otherId !== id)
      .map((otherId) => getBounds(otherId))
      .filter((other) => hasOverlap(block, other));

    overlappingBlocks.forEach((ob) => {
      if (x > ob.x1 && x < ob.x2) x = ob.x2;
      else if (x + w > ob.x1 && x + w < ob.x2) x = ob.x1 - w;
      else if (y > ob.y1 && y < ob.y2) y = ob.y2;
      else if (y + w > ob.y1 && y + h < ob.y2) y = ob.y1 - h;
    });

    // check for collisions with bounds
    if (y < 0) y = 0;
    if (y > 5 - h) y = 5 - h;
    if (x < 0) x = 0;
    if (x > 4 - w) x = 4 - w;

    // const ranges = possibleRanges(positions, id);
    // const  = ranges.some(
    //   ([[x1, x2], [y1, y2]]) => x >= x1 && x <= x2 && y >= y1 && y <= y2
    // );

    // if (!isInRange) return false;

    setPositions((current) => ({ ...current, [id]: { x, y } }));
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
