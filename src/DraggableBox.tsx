import { useRef, useState } from "react";
import Draggable, { type DraggableEventHandler } from "react-draggable";

type Axis = "x" | "y" | "both";
type Position = { x: number; y: number };
export const DraggableBox = ({
  position,
  setPosition,
  color,
  gridSize,
  size,
}: {
  position: Position;
  setPosition: (p: Position) => void;
  color: string;
  gridSize: number;
  size: { width: number; height: number };
}) => {
  // const isDragging = useRef(false);
  // const [axis, setAxis] = useState<Axis>("both");

  const nodeRef = useRef(null);

  const handleDrag: DraggableEventHandler = (_e, data) => {
    // if (!isDragging.current) {
    //   const { deltaX, deltaY } = data;
    //   if (deltaX !== 0 || deltaY !== 0) {
    //     isDragging.current = true;
    //     if (Math.abs(deltaX) > Math.abs(deltaY)) {
    //       setAxis("x");
    //     } else {
    //       setAxis("y");
    //     }
    //   }
    // }

    let { x, y } = data;
    // if (axis === "y") x = position.x;
    // if (axis === "x") y = position.y;
    return setPosition({ x, y });
  };

  const handleStop = () => {
    // isDragging.current = false;
    // setAxis("both");
    let { x, y } = position;
    x = Math.round(x / gridSize) * gridSize;
    y = Math.round(y / gridSize) * gridSize;
    return setPosition({ x, y });
  };

  const { width, height } = size;

  return (
    <Draggable
      nodeRef={nodeRef}
      position={position}
      onStop={handleStop}
      onDrag={handleDrag}
      // axis={axis}
    >
      <div
        ref={nodeRef}
        style={{
          position: "absolute",
          width: `${width}px`,
          height: `${height}px`,
          background: color,
          border: "1px solid grey",
        }}
      />
    </Draggable>
  );
};
