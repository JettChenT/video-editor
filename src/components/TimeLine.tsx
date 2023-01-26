import React, { use, useState } from "react";
import TimeTicks from "./TimeTicks";
import { useTimeline, useConfig } from "@/lib/state";
import { DragOverlay, KeyboardSensor, PointerSensor, useDndMonitor, useDroppable } from "@dnd-kit/core";
import VideoClip from "./VideoClip";
import { horizontalListSortingStrategy, SortableContext, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { useSensors, useSensor,  } from "@dnd-kit/core";
import Item from "./Item";
import Cursor from "./Cursor";

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
  const clips = useTimeline((st) => st.clips);
  const cursorDragging = useTimeline((st) => st.cursorDragging);
  const updateCursor = useTimeline((st) => st.updateCursor);
  const config = useConfig.getState();
  const activeId = useTimeline.getState().activeId;
  const { isOver, setNodeRef } = useDroppable({
    id: "timeline",
    disabled: cursorDragging
  });
  const style = isOver ? "bg-green-100/25" : "";
 
  console.log(clips);

  return (
    <div 
      className={`cursor-grab overflow-x-scroll overflow-y-hidden relative flex flex-col h-full ${style}`} 
      ref={setNodeRef}
      onMouseMove={(e) => {
        if (cursorDragging) {
          const newcursor = e.clientX / config.pixel_per_second;
          updateCursor(newcursor, false);
        }
        e.preventDefault()
      }}
      onMouseDown={(e) => {
        const targetid = (e.target as any).id;
        console.log(targetid);
        if(targetid=="timeline-scroll" || targetid=="timeticks") {
          const newcursor = e.clientX / config.pixel_per_second;
          updateCursor(newcursor, false);
        }
      }}
      onMouseUp={(e) => {
        useTimeline.setState({ cursorDragging: false });
        e.preventDefault()
      }}
      onMouseLeave={(e) => {
        useTimeline.setState({ cursorDragging: false });
        e.preventDefault()
      }}
    >
      <TimeTicks gap={gapsec} />
      <Cursor/>
      <div 
        className="h-full min-h-16"
        id="timeline-scroll"
      >
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
    </div>
  );
};

export default TimeLine;
