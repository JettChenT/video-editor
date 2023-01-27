import { Clip, useConfig } from "@/lib/state";
import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface VideoClipProps {
  clip: Clip;
  id: string;
}

const colors = [
  "bg-red-300",
  "bg-yellow-300",
  "bg-green-300",
  "bg-blue-300",
  "bg-indigo-300",
  "bg-purple-300",
  "bg-pink-300",
]

export const hashColor = (s: string) => {
  return colors[s.charCodeAt(0) % colors.length];
}


const VideoClip: React.FC<VideoClipProps> = ({ clip, id}) => {
  const config = useConfig.getState();
  const bgcolor = hashColor(clip.id);

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: id, data: {
        type: "videoClip",
        clip: clip
    }});
  const style = {
    width: `${clip.duration * config.pixel_per_second}px`,
    transform: CSS.Translate.toString(transform),
    transition,
  };
  return (
    <div
        ref={setNodeRef}
      className={`h-15 overflow-x-hidden rounded-md p-2 ${bgcolor} inline-block ${isDragging? "opacity-50": ""}`}
      style={style}
      {...attributes}
      {...listeners}
    >
      <p className="text-xs">
        {clip.name}
        <br />
        {(clip.duration * 1.0).toFixed(2)}
        <br/>
        {clip.start}~{clip.end}
      </p>
    </div>
  );
};

export default VideoClip;
