import { useConfig, useTimeline } from "@/lib/state";
import { ilog, sec_to_timestamp } from "@/lib/transform";
import React, { useEffect, useState } from "react";
import {
  PlayIcon,
  PauseIcon,
  TrashIcon,
  ScissorsIcon,
} from "@heroicons/react/24/solid";
import IconBtn from "./IconBtn";

const VideoControls = () => {
  let playing = useTimeline((st) => st.playing);
  let playpause = useTimeline((st) => st.playpause);
  const cursor = useTimeline((st) => st.cursor);
  useEffect(() => {
    const fps = useConfig.getState().fps;
    const ival = setInterval(() => {
      if (playing) {
        useTimeline.getState().updateCursor(1.0 / fps, true);
      }
    }, 1000.0 / fps);
    return () => clearInterval(ival);
  }, [playing]);
  return (
    <div className="w-full grid grid-cols-3 mt-3 py-1 bg-neutral-100">
      <div className="col-span-1">
        <IconBtn
          onClick={() => {
            useTimeline.getState().splitClip(cursor);
          }}
        >
          <ScissorsIcon className="h-5 w-5" />
        </IconBtn>
        <IconBtn
          onClick={() => {
            useTimeline.getState().removeClipCursor(cursor);
          }}
        >
          <TrashIcon className="h-5 w-5" />
        </IconBtn>
      </div>

      <div className="col-span-1">
        <IconBtn
          onClick={() => {
            playpause();
          }}
        >
          {playing ? (
            <PauseIcon className="h-5 w-5" />
          ) : (
            <PlayIcon className="h-5 w-5" />
          )}
        </IconBtn>

        {sec_to_timestamp(cursor, useConfig.getState().fps)}
      </div>
      <div className="col-span-1">
        <div className="float-right">
        <IconBtn
          className="btn-xs"
          onClick={() => {
            useConfig.getState().set_pixel_per_second(-4, true);
          }}
        >
          -
        </IconBtn>
        <input
          type="range"
          min="1"
          max="100"
          value={useConfig((st) => st.pixel_per_second)}
          className="slider"
          id="myRange"
          onChange={(e) => {
            useConfig
              .getState()
              .set_pixel_per_second(parseInt(e.target.value), false);
          }}
        />
        <IconBtn
          className="btn-xs"
          onClick={() => {
            useConfig.getState().set_pixel_per_second(4, true);
          }}
        >
          +
        </IconBtn>
        </div>
      </div>
    </div>
  );
};

export default VideoControls;
