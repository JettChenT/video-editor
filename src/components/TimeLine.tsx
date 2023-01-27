import React, { use, useState } from "react";
import TimeTicks from "./TimeTicks";
import { useTimeline, useConfig } from "@/lib/state";
import { DragOverlay, useDroppable } from "@dnd-kit/core";
import VideoClip from "./VideoClip";
import { horizontalListSortingStrategy, SortableContext} from "@dnd-kit/sortable";
import Item from "./VideoClipItem";
import Cursor from "./Cursor";
import { ilog } from "@/lib/transform";

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
  const clips = useTimeline((st) => st.clips);
  const cursorDragging = useTimeline((st) => st.cursorDragging);
  const updateCursor = useTimeline((st) => st.updateCursor);
  const config = useConfig();
  const activeId = useTimeline((st)=>st.activeId);
  const { isOver, setNodeRef } = useDroppable({
    id: "timeline",
    disabled: cursorDragging
  });
  const style = isOver ? "bg-green-100/25" : "";
 
  console.log(clips);

  const procClick = (e: React.MouseEvent) => {
    const scrollcnt = document.getElementById("timeline-base")?.scrollLeft;
    const newcursor = (e.clientX+Number(scrollcnt)) / config.pixel_per_second; 
    return newcursor
  }

  return (
    <div 
      className={`cursor-grab overflow-x-scroll overflow-y-hidden relative flex flex-col h-30 h-max-30 whitespace-nowrap ${style}`} 
      ref={setNodeRef}
      id="timeline-base"
      onMouseMove={(e) => {
        if (cursorDragging) {
          const newcursor = procClick(e);
          updateCursor(newcursor, false);
        }
        e.preventDefault()
      }}
      onMouseDown={(e) => {
        const targetid = (e.target as any).id;
        console.log(targetid);
        switch(targetid){
          case "timeline-base":
          case "timeline-scroll":
          case "timeticks":
            console.log(e);
            updateCursor(procClick(e), false);
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
      <TimeTicks gap={useConfig((st) => st.pixel_per_gap/st.pixel_per_second)}/>
      <Cursor/>
      <div 
        className="h-full min-h-16"
        id="timeline-scroll"
      >
        <SortableContext
            items={clips}
            strategy={horizontalListSortingStrategy}
            >
              {/* {clipln} */}
        {clips.map((clip, i) => {
            return (
                <VideoClip
                    key={clip.id}
                    id={clip.id}
                    clip={clip}
                    index={i}
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
