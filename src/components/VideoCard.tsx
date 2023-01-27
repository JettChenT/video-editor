import React, { useEffect } from "react";
import { useLibrary, Video } from "@/lib/state";
import Image from "next/image";
import { Clip, useTimeline } from "@/lib/state";
import { import_video, process_video, vid_to_clip } from "@/lib/transform";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import IconBtn from "./IconBtn";
import { PlusIcon, TrashIcon } from "@heroicons/react/24/solid";

interface VideoCardProps {
  video: Video;
}

const VideoCard: React.FC<VideoCardProps> = ({ video }) => {
  let addClip = useTimeline((st) => st.addClip);
  let [processing, setProcessing] = React.useState(false);
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: video.location,
    data: {
      type: "video",
      video: video,
    },
  });

  const style = transform
    ? {
        transform: CSS.Translate.toString(transform),
        zIndex: 999,
      }
    : undefined;

  return (
    <div
      className="m-1 p-2 w-40 border-2 border-solid inline-block"
      ref={setNodeRef}
    >
      <div style={style} {...listeners} {...attributes}>
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
      <IconBtn
        onClick={() => {
          console.log("processing video", video);
          import_video(video);
        }}
        btnSize="btn-xs"
        className="mt-1"
      >
        <PlusIcon className="w-5 h-5" />
      </IconBtn>
      <IconBtn
        onClick={() => {
          useLibrary.getState().removeFile(video);
        }}
        className="mt-1"
        btnSize="btn-xs"
      >
        <TrashIcon className="w-5 h-5" />
      </IconBtn>
    </div>
  );
};

export default VideoCard;
