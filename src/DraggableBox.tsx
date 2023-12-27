import { useRef } from "react";
import { DraggableCore, type DraggableEventHandler } from "react-draggable";
import { type Position, GAP, UNIT } from "./constants";
import { limitMagnitude } from "./utils";

export const DraggableBox = ({
  position,
  setPosition,
  color,
  size,
}: {
  position: Position;
  setPosition: (p: Position) => void;
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
    return setPosition({ x: x + deltaX, y: y + deltaY });
  };

  const handleStop = () => {
    let { x, y } = position;
    x = Math.round(x / UNIT) * UNIT;
    y = Math.round(y / UNIT) * UNIT;
    return setPosition({ x, y });
  };

  const { width, height } = size;
  const { x, y } = position;

  return (
    <DraggableCore nodeRef={nodeRef} onStop={handleStop} onDrag={handleDrag}>
      <div
        ref={nodeRef}
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
