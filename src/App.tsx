import { useState } from "react";
import "./App.css";
import { DraggableBox } from "./DraggableBox";
import { UNIT } from "./constants";

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

const IDS = Object.keys(SPEC) as ID[];

const scaleValues = <T extends Record<string, number>>(obj: T): T =>
  Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, v * UNIT])) as T;

const getInitState = () =>
  (Object.keys(SPEC) as ID[]).reduce(
    (acc, id) => ({ ...acc, [id]: SPEC[id].pos }),
    {} as Record<ID, Position>
  );

// const possibleRanges = (positions: Record<ID, Position>, currentId: ID) => {
//   // 1. find the open squares
//   const squares = new Set<string>();
//   for (let i = 0; i < 4; i++) {
//     for (let j = 0; j < 4; j++) {
//       squares.add(`${i}|${j}`);
//     }
//   }

//   for (const id of IDS) {
//     if (id === currentId) continue;

//     const { size } = SPEC[id];
//     const pos = positions[id];
//     const { x, y } = pos;

//     for (let w = 0; w < size.width; w++) {
//       for (let h = 0; h < size.height; h++) {
//         squares.delete(`${x + w}|${y + h}`);
//       }
//     }
//   }

//   const ranges: [[number, number], [number, number]][] = [...squares].map(
//     (s) => {
//       const [x, y] = s.split("|").map((i) => parseInt(i));
//       return [
//         [x, x + 1],
//         [y, y + 1],
//       ];
//     }
//   );

//   return ranges;
// };

function App() {
  const [positions, setPositions] = useState(getInitState());

  const setPosition = (id: ID, pos: Position) => {
    let { x, y } = pos;

    x /= UNIT;
    y /= UNIT;

    // check for collisions with bounds
    const { height: h, width: w } = SPEC[id].size;
    if (y < 0) y = 0;
    if (y > 5 - h) y = 5 - h;
    if (x < 0) x = 0;
    if (x > 4 - w) x = 4 - w;

    // snap X or Y
    const xDiff = Math.abs(x - Math.round(x));
    const yDiff = Math.abs(y - Math.round(y));

    if (xDiff > yDiff) {
      y = Math.round(y);
    } else {
      x = Math.round(x);
    }

    // const ranges = possibleRanges(positions, id);
    // const  = ranges.some(
    //   ([[x1, x2], [y1, y2]]) => x >= x1 && x <= x2 && y >= y1 && y <= y2
    // );

    // if (!isInRange) return false;

    setPositions((current) => ({ ...current, [id]: { x, y } }));
    // return x === pos.x && y === pos.y;
  };

  return (
    <div style={{margin: '30px', position: 'relative'}}>
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
