import { useRef } from "react";
import { DraggableCore, type DraggableEventHandler } from "react-draggable";
import { GAP, UNIT } from "./constants";
import { limitMagnitude, scaleValues } from "./utils";
import type { Position } from "./types";

export const DraggableBox = ({
  position,
  setPosition,
  addToHistory,
  color,
  size,
}: {
  position: Position;
  setPosition: (p: Position) => void;
  addToHistory: (p: Position) => void;
  color: string;
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

  const handleStop = () => {
    let { x, y } = position;
    x = Math.round(x / UNIT) * UNIT;
    y = Math.round(y / UNIT) * UNIT;
    const newPosition = { x, y };

    addToHistory(scaleValues(1 / UNIT)(newPosition));
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
          width: `${width - UNIT * GAP * 2}px`,
          height: `${height - UNIT * GAP * 2}px`,
          background: color,
        }}
      />
    </DraggableCore>
  );
};
