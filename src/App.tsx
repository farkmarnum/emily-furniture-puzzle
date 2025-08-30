import { useEffect, useState } from "react";
import "./App.css";
import { DraggableBox } from "./DraggableBox";
import { IDS, INIT_STATE, SPEC, getUnit } from "./constants";
import {
  deserializePoint,
  dist,
  getClosestPointOnLeftLine,
  getClosestPointOnTopLine,
  getOpenSquares,
  scaleValues,
  serializePoint,
} from "./utils";
import type { Id, Point, Position } from "./types";
import bgSrc from "./assets/bg.png";
import useUnit from "./useUnit";

type Positions = Record<Id, Position>;

function App() {
  const [positions, setPositions] = useState({ ...INIT_STATE });
  const [hist, setHist] = useState<Positions[]>([{ ...INIT_STATE }]);

  const unit = useUnit();

  // Celebrate on success! 🎉
  // const hasSucceeded = useRef(false);
  // useEffect(() => {
  //   if (
  //     positions.sun.x === 1 &&
  //     positions.sun.y === 3 &&
  //     !hasSucceeded.current
  //   ) {
  //     hasSucceeded.current = true;
  //     celebrate();
  //   }
  // }, [positions]);

  const addToHistory = ({ x, y, id }: Position & { id: Id }) => {
    const newState = { ...positions, [id]: { x, y } };
    const stateStr = JSON.stringify(newState);

    // Check for loops / backtracking
    for (let i = 0; i < hist.length; i++) {
      if (JSON.stringify(hist[i]) === stateStr) {
        setHist(hist.slice(0, i + 1));
        return;
      }
    }

    let newHist = [...hist, newState];

    // Check for missing steps:
    const prev = hist.slice(-1)[0][id];
    if (x !== prev.x && y !== prev.y) {
      // In this case, more than 1 move happened!
      // To remedy, add an in-between move using the only other open square
      const [openSquare] = getOpenSquares(positions, id)
        .map((s) => deserializePoint(s))
        .filter(
          ([sx, sy]) =>
            !(sx === x && sy === y) && !(sx === prev.x && sy === prev.y)
        );

      if (openSquare) {
        const inbetweenState = {
          ...positions,
          [id]: { x: openSquare[0], y: openSquare[1] },
        };
        newHist = [...hist, inbetweenState, newState];
      }
    }

    setHist(newHist);
  };

  // const reset = () => {
  //   setPositions({ ...INIT_STATE });
  //   setHist([{ ...INIT_STATE }]);
  // };

  // Callback to set position that limits the position to valid moves
  const setPosition = (id: Id, pos: Position) => {
    // Get our units back to 1 instead of UNIT
    const { x, y } = scaleValues(1 / getUnit())(pos);

    // Find the closest point along the available line segments (from the open squares)
    const openSquares = getOpenSquares(positions, id);
    const current = positions[id];
    let closestPoint = { x: current.x, y: current.y, d: Infinity };
    openSquares.forEach((s) => {
      const [sx, sy] = deserializePoint(s);
      const points: Point[] = [];

      // top line
      if (openSquares.includes(serializePoint(sx + 1, sy))) {
        points.push(getClosestPointOnTopLine(sx, sy, x));
      }

      // left line
      if (openSquares.includes(serializePoint(sx, sy + 1))) {
        points.push(getClosestPointOnLeftLine(sx, sy, y));
      }

      if (points.length === 0) {
        // if no other options, just include the single point that's the top-left of the open square
        points.push([sx, sy]);
      }

      // Determine the closest point
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

    setPositions((current) => ({
      ...current,
      [id]: { x: closestPoint.x, y: closestPoint.y },
    }));
  };

  const stateHasChanged = IDS.some(
    (id) =>
      positions[id].x !== INIT_STATE[id].x ||
      positions[id].y !== INIT_STATE[id].y
  );

  useEffect(() => {
    const warnBeforeLeaving = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = true; // legacy
    };

    if (stateHasChanged) {
      window.addEventListener("beforeunload", warnBeforeLeaving);
    }

    return () => {
      if (stateHasChanged) {
        window.removeEventListener("beforeunload", warnBeforeLeaving);
      }
    };
  }, [stateHasChanged]);

  return (
    <>
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          overflow: "hidden",
          display: "flex",
          alignItems: "start",
          justifyContent: "center",
        }}
      >
        <img
          style={{
            display: "block",
            width: "100%",
            maxWidth: "600px",
            opacity: 0.5,
          }}
          src={bgSrc}
        />
      </div>

      <div
        style={{
          position: "relative",
          height: `${unit * 6}px`,
          width: `${unit * 4}px`,
          top: `${unit * 1.25}px`,
          left: `${unit * 0.05}px`,
          margin: "0 auto",
        }}
      >
        {IDS.map((id) => {
          const { size, color } = SPEC[id];
          const pos = positions[id];

          const disabled = id === "blocker1" || id === "blocker2";

          return (
            <DraggableBox
              key={id}
              size={scaleValues(unit)(size)}
              position={scaleValues(unit)(pos)}
              setPosition={(newPos) => !disabled && setPosition(id, newPos)}
              addToHistory={({ x, y }) =>
                !disabled && addToHistory({ x, y, id })
              }
              color={color}
              gridSize={unit}
            />
          );
        })}
      </div>

      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "70px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: "90%",
            maxWidth: "360px",
            textAlign: "center",
            background: "white",
            boxShadow: "0 0 32px rgba(127,127,127,0.5),0 0 8px rgba(0,0,0,0.5)",
            borderRadius: "8px",
            padding: "9px 16px",
            fontSize: "16px",
            fontWeight: "bold",
          }}
        >
          Where should we put Malinda's couch?
        </div>
      </div>
    </>
  );
}

export default App;
