import Head from "next/head";
import Image from "next/image";
import styles from "@/styles/Home.module.css";
import FileUpload from "@/components/FileUpload";
import { useLibrary, useFF, useTimeline, Video } from "@/lib/state";
import { useEffect, useState } from "react";
import {
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import TimeLine from "@/components/TimeLine";
import Exporter from "@/components/Exporter";
import {
  ilog,
  import_video,
  vid_to_clip,
  handleDragEnd,
  handleDragStart,
} from "@/lib/transform";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import VideoPlayer from "@/components/VideoPlayer";
import VideoControls from "@/components/VideoControls";
import VideoProperties from "@/components/VideoProperties";
import ExportControls from "@/components/ExportControls";

export default function Home() {
  const ff = useFF((st) => st.ff);
  const setReady = useFF((st) => st.setReady);
  const setProgress = useFF((st) => st.setProgress);
  
  const ready = useFF((st) => st.ready);
  const addClip = useTimeline((st) => st.addClip);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const load = async () => {
    if (!ff.isLoaded()) {
      console.log("downloading ffmpeg...");
      await ff.load();
      setReady(true);
      console.log("ready!");
      ff.setProgress(({ ratio }) => {
        console.log("[progress]", ratio);
        setProgress(ratio);
      });
    }
  };

  useEffect(() => {
    load();
  }, []);

  return ready ? (
    <DndContext onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
      <div className="h-screen overflow-y-hidden">
        <div className="grid grid-cols-5 h-2/3 gap-3 mt-3 container mx-auto">
          <div className="col-span-2 h-full">
            <FileUpload />
          </div>
          <div className="col-span-2 h-full">
            <VideoPlayer />
          </div>
          <div className="col-span-1 h-full border-solid border-2 border-neutral-200">
            <VideoProperties/>
          </div>
        </div>
        <VideoControls />
        <TimeLine />
        <ExportControls/>
      </div>
    </DndContext>
  ) : (
    <div>
      <p>Loading FFMpeg...</p>
    </div>
  );
}
