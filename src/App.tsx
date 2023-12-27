import { useEffect, useRef, useState } from "react";
import "./App.css";
import { DraggableBox } from "./DraggableBox";
import { IDS, INIT_STATE, REPLAY_STEP_MS, SPEC, UNIT } from "./constants";
import {
  celebrate,
  deserializePoint,
  dist,
  getClosestPointOnLeftLine,
  getClosestPointOnTopLine,
  getOpenSquares,
  scaleValues,
  serializePoint,
} from "./utils";
import type { Id, Point, Position } from "./types";

type Positions = Record<Id, Position>;

function App() {
  const [positions, setPositions] = useState({ ...INIT_STATE });
  const [hist, setHist] = useState<Positions[]>([{ ...INIT_STATE }]);
  
  // Celebrate on success! 🎉
  const hasSucceeded = useRef(false);
  useEffect(() => {
    if (
      positions.sun.x === 1 &&
      positions.sun.y === 3 &&
      !hasSucceeded.current
    ) {
      hasSucceeded.current = true;
      celebrate();
    }
  }, [positions]);

  // Replay feature
  const [isReplaying, setIsReplaying] = useState(false);
  const replay = () => {
    setPositions(hist[0]);

    // Turn on "replay" mode for transitions, but with a delay so the first position change doesn't have a transition.
    setTimeout(() => {
      setIsReplaying(true);
    }, REPLAY_STEP_MS / 2);

    let i = 1;
    const interval = setInterval(() => {
      if (i >= hist.length) {
        clearInterval(interval);
        setIsReplaying(false);
        return;
      }

      setPositions(hist[i]);
      i++;
    }, REPLAY_STEP_MS);
  };

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

  const reset = () => {
    setPositions({ ...INIT_STATE });
    setHist([{ ...INIT_STATE }]);
  };

  // Callback to set position that limits the position to valid moves
  const setPosition = (id: Id, pos: Position) => {
    // Get our units back to 1 instead of UNIT
    const { x, y } = scaleValues(1 / UNIT)(pos);

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
        style={{ position: "relative", height: `${UNIT * 5}px` }}
        className={isReplaying ? "replay-mode" : ""}
      >
        {IDS.map((id) => {
          const { size, color } = SPEC[id];
          const pos = positions[id];

          return (
            <DraggableBox
              key={id}
              size={scaleValues(UNIT)(size)}
              position={scaleValues(UNIT)(pos)}
              setPosition={(newPos) => !isReplaying && setPosition(id, newPos)}
              addToHistory={({ x, y }) =>
                !isReplaying && addToHistory({ x, y, id })
              }
              color={color}
              gridSize={UNIT}
            />
          );
        })}
      </div>

      <div
        style={{
          position: "absolute",
          bottom: "16px",
          left: "16px",
          gap: "16px",
          display: "flex",
        }}
      >
        <button
          className="btn-text"
          disabled={!stateHasChanged || isReplaying}
          onClick={reset}
        >
          Reset
        </button>

        <button
          className="btn-text"
          disabled={hist.length <= 1 || isReplaying}
          onClick={replay}
        >
          Replay
        </button>
      </div>
    </>
  );
}

export default App;
