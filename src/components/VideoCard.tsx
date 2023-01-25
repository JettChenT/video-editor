import React, { useEffect } from "react";
import { Video } from "@/lib/state";
import Image from "next/image";
import { Clip, useTimeline } from "@/lib/state";
import { import_video, process_video, vid_to_clip } from "@/lib/transform";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

interface VideoCardProps {
  video: Video;
}

const VideoCard: React.FC<VideoCardProps> = ({ video }) => {
  let addClip = useTimeline((st) => st.addClip);
  let [processing, setProcessing] = React.useState(false);
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: video.location,
    data: {
        "type": "video",
        "video": video
    },
  });

  const style = transform
    ? {
        transform: CSS.Translate.toString(transform),
      }
    : undefined;

  return (
    <div className="m-1 p-2 w-40 border-2 border-solid inline-block">
      <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
        <h2 className="text-sm">{video.name}</h2>
        {video.thumbnail && (
          <Image
            src={video.thumbnail}
            width={100}
            height={100}
            alt={video.name}
          />
        )}
      </div>
      <button
        className="p-1 bg-primary text-white inline-block"
        onClick={() => {
          console.log("processing video", video);
          import_video(video);
        }}
      >
        +
      </button>
    </div>
  );
};

export default VideoCard;
