import { Clip, useConfig } from "@/lib/state";
import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface VideoClipProps {
  clip: Clip;
  id: string;
}

const VideoClip: React.FC<VideoClipProps> = ({ clip, id}) => {
  const config = useConfig.getState();

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: id, data: {
        type: "videoClip"
    }});
  const style = {
    width: `${clip.duration * config.pixel_per_second}px`,
    transform: CSS.Translate.toString(transform),
    transition,
  };
  return (
    <div
        ref={setNodeRef}
      className="h-full rounded-md p-2 bg-secondary inline-block"
      style={style}
      {...attributes}
      {...listeners}
    >
      <p className="text-xs">
        {clip.name}
        <br />
        {(clip.duration * 1.0).toFixed(2)}
      </p>
    </div>
  );
};

export default VideoClip;
