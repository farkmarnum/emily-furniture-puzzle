import { useRef } from "react";
import Draggable, { type DraggableEventHandler } from "react-draggable";
import { GAP, UNIT } from "./constants";

type Position = { x: number; y: number };
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
    const { x, y } = data;
    return setPosition({ x, y });
  };

  const handleStop = () => {
    let { x, y } = position;
    x = Math.round(x / UNIT) * UNIT;
    y = Math.round(y / UNIT) * UNIT;
    return setPosition({ x, y });
  };

  const { width, height } = size;

  return (
    <Draggable
      nodeRef={nodeRef}
      position={position}
      onStop={handleStop}
      onDrag={handleDrag}
    >
      <div
        ref={nodeRef}
        style={{
          position: "absolute",
          top: `${UNIT * GAP}px`,
          left: `${UNIT * GAP}px`,
          width: `${width - UNIT * GAP * 2}px`,
          height: `${height - UNIT * GAP * 2}px`,
          background: color,
        }}
      />
    </Draggable>
  );
};
