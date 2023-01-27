import { useConfig, useTimeline } from "@/lib/state";
import React from "react";

const Cursor = () => {
  const cursor = useTimeline((st) => st.cursor);
  let pixel_per_second = useConfig((st) => st.pixel_per_second);
  const cursorStyle = {
    transform: `translateX(${cursor * pixel_per_second}px)`,
  };
  return (
    <div
      className="w-0.5 opacity-80 h-full absolute bg-red-500 flex top-4 cursor-col-resize z-30"
      style={cursorStyle}
      onMouseDown={(e) => {
        useTimeline.setState({ cursorDragging: true });
        e.stopPropagation();
        e.preventDefault();
      }}
    />
  );
};

export default Cursor;
