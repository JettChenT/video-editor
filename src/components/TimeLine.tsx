import React, { useState } from "react";
import TimeTicks from "./TimeTicks";
import { useTimeline, useConfig } from "@/lib/state";
import { DragOverlay, KeyboardSensor, PointerSensor, useDndMonitor, useDroppable } from "@dnd-kit/core";
import VideoClip from "./VideoClip";
import { horizontalListSortingStrategy, SortableContext, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { useSensors, useSensor,  } from "@dnd-kit/core";
import Item from "./Item";

const rand_colors = [
  "bg-red-300",
  "bg-yellow-300",
  "bg-green-300",
  "bg-blue-300",
  "bg-indigo-300",
  "bg-purple-300",
  "bg-pink-300",
];

const TimeLine = () => {
  const [gapsec, setGapsec] = useState(1);
  const cursor = useTimeline((st)=>st.cursor);
  const clips = useTimeline((st) => st.clips);
  const config = useConfig.getState();
  const activeId = useTimeline.getState().activeId;
  const { isOver, setNodeRef } = useDroppable({
    id: "timeline",
  });
  const style = isOver ? "bg-green-100" : "";
  const cursorStyle = {
    transform: `translateX(${cursor * config.pixel_per_second}px)`,
  }
  console.log(clips);

  return (
    <div className={`cursor-grab overflow-x-scroll overflow-y-hidden flex flex-col h-full ${style}`} ref={setNodeRef}>
      <TimeTicks gap={gapsec} />
      <div className="h-full min-h-16">
        <SortableContext
            items={clips}
            strategy={horizontalListSortingStrategy}
            >
        {clips.map((clip, i) => {
            return (
                <VideoClip
                    key={clip.id}
                    id={clip.id}
                    clip={clip}
                />
            )
        })}
        </SortableContext>
        <DragOverlay>
            {activeId? <Item id={activeId} /> : null}
        </DragOverlay>
      </div>
      <div className="w-1 h-full bg-gray-500" style={cursorStyle}/>
    </div>
  );
};

export default TimeLine;
