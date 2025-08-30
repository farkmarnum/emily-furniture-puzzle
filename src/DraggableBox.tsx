import { useRef } from "react";
import { DraggableCore, type DraggableEventHandler } from "react-draggable";
import { GAP } from "./constants";
import { limitMagnitude, scaleValues } from "./utils";
import type { Position } from "./types";
import useUnit from "./useUnit";

export const DraggableBox = ({
  position,
  setPosition,
  addToHistory,
  background,
  size,
}: {
  position: Position;
  setPosition: (p: Position) => void;
  addToHistory: (p: Position) => void;
  background: string;
  gridSize: number;
  size: { width: number; height: number };
}) => {
  const nodeRef = useRef(null);

  const handleDrag: DraggableEventHandler = (_e, data) => {
    let { deltaX, deltaY } = data;
    deltaX = limitMagnitude(deltaX);
    deltaY = limitMagnitude(deltaY);

    const { x, y } = position;
    setPosition({ x: x + deltaX, y: y + deltaY });
  };

  const unit = useUnit();

  const handleStop = () => {
    let { x, y } = position;
    x = Math.round(x / unit) * unit;
    y = Math.round(y / unit) * unit;
    const newPosition = { x, y };

    addToHistory(scaleValues(1 / unit)(newPosition));
    setPosition(newPosition);
  };

  const { width, height } = size;
  const { x, y } = position;

  return (
    <DraggableCore nodeRef={nodeRef} onStop={handleStop} onDrag={handleDrag}>
      <div
        ref={nodeRef}
        className="draggable-box"
        style={{
          position: "absolute",
          top: y,
          left: x,
          padding: GAP,
          width: `${width - unit * GAP * 2}px`,
          height: `${height - unit * GAP * 2}px`,
          background,
          backgroundSize: background.includes("url") ? "contain" : undefined,
          border:
            background != "transparent"
              ? "1px solid rgba(0,0,0,0.5)"
              : undefined,
        }}
      />
    </DraggableCore>
  );
};
