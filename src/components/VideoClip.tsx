import { Clip, useConfig, useTimeline } from "@/lib/state";
import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface VideoClipProps {
  clip: Clip;
  id: string;
  index: number;
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

// https://stackoverflow.com/questions/7616461/generate-a-hash-from-string-in-javascript
const cyrb53 = (str:string, seed = 0) => {
  let h1 = 0xdeadbeef ^ seed,
    h2 = 0x41c6ce57 ^ seed;
  for (let i = 0, ch; i < str.length; i++) {
    ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  
  return 4294967296 * (2097151 & h2) + (h1 >>> 0);
};

export const hashColor = (s: string) => {
  return colors[cyrb53(s)%colors.length];
}


const VideoClip: React.FC<VideoClipProps> = ({ clip, id, index}) => {
  const config = useConfig.getState();
  const bgcolor = hashColor(clip.id);
  const clipname = useTimeline((st) => st.clips[index].name);
  const isSelected = useTimeline((st) => st.currentClip === index);

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
      className={`h-15 overflow-x-hidden rounded-md p-2 z-20 ${bgcolor} inline-block ${isSelected&&"relative -top-1 drop-shadow-lg"} ${isDragging&& "opacity-50"}`}
      style={style}
      {...attributes}
      {...listeners}
    >
      <p className="text-xs">
        {clipname} <br/>
        {(clip.duration).toFixed(2)}s <br/>
      </p>
    </div>
  );
};

export default VideoClip;
