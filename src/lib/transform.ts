import { DragEndEvent, DragStartEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { fetchFile } from "@ffmpeg/ffmpeg";
import { match } from "assert";
import { randomUUID } from "crypto";
import {v4 as uuidv4} from 'uuid';
import { DragTypes } from "./constants";
import {
  Clip,
  Timeline,
  Video,
  Library,
  useFF,
  useConfig,
  useTimeline,
} from "./state";

const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    ilog("drag event start");
    switch(active.data.current?.type){
        case DragTypes.VIDEO:
            ilog("activeid", useTimeline.getState().activeId)
            break;
        case DragTypes.VIDEO_CLIP:
            useTimeline.setState({activeId: active.data.current?.clip.id})
            ilog("dragging clip", active.data.current)
            break;
    }
}

const handleDragEnd = (event: DragEndEvent) => {
  const { over, active } = event;
  ilog(over);
  switch (active.data.current?.type) {
    case "video":
      if (over?.id == "timeline") {
        ilog("DATA", active.data.current);
        if (active.data.current?.type == "video") {
            ilog("importing video.....")
          let video = active.data.current.video as Video;
          ilog(video);
          import_video(video);
        }
      }
      break;
    case "videoClip":
      if(active.id!=over?.id){
        ilog("videoclip switching...", active.data.current)
        const timeline = useTimeline.getState();
        const clips = timeline.clips;
        const oldIndex = clips.findIndex((c) => c.id == active.id);
        const newIndex = clips.findIndex((c) => c.id == over?.id);
        timeline.changeTimeline(arrayMove(clips, oldIndex, newIndex));
      }
      break;
  }
};

function import_video(video: Video) {
  const addClip = useTimeline.getState().addClip;
  vid_to_clip(video).then((clip) => {
    ilog("converted clip", clip);
    addClip(clip);
    ilog("after:", useTimeline.getState());
    });
}

function sec_to_timestamp(seconds: number, fps: null|number=null) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor((seconds % 3600) % 60);
  const pad = (n:number)=>n.toString().padStart(2, "0");
  let resp = `${pad(hours)}:${pad(minutes)}:${pad(secs)}`;
  if (fps!=null){
    const frame = Math.floor((seconds % 1) * fps);
    resp += `:${pad(frame)}`;
  }
  return resp;
}

function ilog(...args: any[]) {
  console.log("[info]", ...args);
}

async function export_timeline() {
  const ff = useFF.getState().ff;
  const tl = useTimeline.getState();
  const config = useConfig.getState();
  const outloc = `${config.project_name}.mp4`;
  const clips = tl.clips;
  console.log("[info]", clips);
  let flst = [];
  for (let i = 0; i < clips.length; i++) {
    const clip = clips[i];
    const filoc = `i${i}.mp4`;
    const foloc = `i${i}.ts`;
    // transform it into ts
    ff.FS("writeFile", filoc, await fetchFile(clip.location));
    ilog("converting clip", clip.start, clip.end, filoc, foloc);
    await ff.run("-ss", clip.start.toString(), "-to", clip.end.toString(), "-i", filoc, foloc);
    flst.push(`file '${foloc}'`);
  }
  ff.FS("writeFile", "concat_list.txt", flst.join("\n"));
  console.log("[info]", ff.FS("readdir", "."));
  let ffcommand = [];
  // ffcommand.push("-preset", "ultrafast");
  ffcommand.push(
    "-f",
    "concat",
    "-safe",
    "0",
    "-i",
    "concat_list.txt",
    '-s', `${config.width}x${config.height}`, 
    "-filter:v",
    'fps='+config.fps.toString(),
    outloc,
  );
  await ff.run(
    ...ffcommand as string[]
  );
  const data = ff.FS("readFile", outloc);
  const url = URL.createObjectURL(
    new Blob([data.buffer], { type: "video/mp4"})
  );
  return url;
}

async function process_video(video: Video): Promise<string> {
  const ff = useFF.getState().ff;
  const config = useConfig.getState();
  const s = `scale=${config.width}:${config.height}`;
  const fps = config.fps;
  ff.FS("writeFile", video.name, await fetchFile(video.location));
  await ff.run("-i", video.name, "-vf", s, "-r", fps.toString(), "output.mp4");
  const data = ff.FS("readFile", "output.mp4");
  const url = URL.createObjectURL(
    new Blob([data.buffer], { type: "video/mp4" })
  );
  return url;
}

async function vid_to_clip(video: Video): Promise<Clip> {
  const duration = Number(video.fileInfo.format.duration);
  return {
    name: video.name,
    location: video.location,
    duration: duration,
    start: 0,
    id: uuidv4(),
    end: duration,
    parent: video
  };
}

export {
  sec_to_timestamp,
  export_timeline,
  vid_to_clip,
  process_video,
  handleDragEnd,
  handleDragStart,
  ilog,
  import_video,
};
