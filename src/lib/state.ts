import { createFFmpeg, FFmpeg } from "@ffmpeg/ffmpeg";
import { setServers } from "dns";
import { FileInfo } from "ffprobe-wasm";
import { stat } from "fs";
import { createRef, useRef } from "react";
import { create } from "zustand";
import { ilog } from "./transform";

export interface Clip {
    name: string;
    location: string;
    id: string;
    duration: number;
    start: number;
    end: number
}

export interface Timeline{
    clips: Clip[];
    cursor: number;
    playing: boolean;
    cursorDragging: boolean;
    vidRef: React.RefObject<HTMLVideoElement>;
    currentClip: number | null;
    startTime: number[];
    activeId: string | null;
    addClip: (clip: Clip) => void;
    removeClip: (clip: Clip) => void;
    splitClip: (loc: number) => void;
    removeClipCursor: (loc: number) => void;
    updateCursor: (newCursor: number, incremental: boolean) => void;
    changeTimeline: (newClips: Clip[]) => void;
    updateStartTime: () => void;
    updateVidInfo: ()=>void;
    playpause: ()=>void;
}

export interface Video{
    location: string;
    name: string;
    thumbnail: string | null;
    processed: boolean;
    fileInfo: FileInfo
    // file: object;
}

export interface Library{
    files: Video[]
    addFile: (file: Video) => void;
    removeFile: (file: Video) => void;
}

export interface ff{
    ff: FFmpeg;
    ready: boolean;
    progress: number;
    setReady: (ready: boolean) => void;
    setProgress: (progress: number) => void;
}

export interface Config{
    fps: number;
    width: number;
    height: number;
    project_name: string;
    pixel_per_second: number;
}

const findCursor = (cursor: number, timeline: Timeline):number => {
    timeline.updateStartTime();
    const res = timeline.clips.findIndex((t, i)=> timeline.startTime[i] <= cursor && timeline.startTime[i]+t.duration>cursor)
    ilog({
        "result": res,
        "stTime": timeline.startTime,
        "cursor": cursor,
        "clips": timeline.clips
    }) 
    return res;
}

// export funcs
export const useTimeline = create<Timeline>((set, get) => ({
    clips: [],
    cursor: 0,
    activeId:null,
    playing: false,
    cursorDragging: false,
    vidRef: createRef<HTMLVideoElement>(),
    startTime: [],
    currentClip: null,
    addClip: (clip: Clip) => {
        set(state => ({ clips: [...state.clips, clip] }));
        get().updateStartTime();
        get().updateVidInfo();
    },
    removeClip: (clip: Clip) => {
        set(state => ({ clips: state.clips.filter(c => c.location !== clip.location) }));
        get().updateStartTime();
        get().updateVidInfo();
    },
    splitClip: (loc: number) => {
        let clipn = findCursor(loc, get());
        if(clipn>=0){
            let clip = get().clips[clipn];
            let st = get().startTime[clipn];
            let rightClip = {...clip};
            rightClip.duration = st+clip.duration-loc;
            rightClip.start = clip.end-rightClip.duration;
            rightClip.end = clip.end;
            let leftClip = {...clip};
            leftClip.duration = clip.duration-rightClip.duration;
            leftClip.end = rightClip.start;
            // assert (leftClip.duration+rightClip.duration === clip.duration);
            set(state => {
                state.clips.splice(clipn, 1, leftClip, rightClip);
                return {clips: state.clips};
            });
            get().updateStartTime();
            get().updateVidInfo();
        }
    },
    removeClipCursor: (loc:number) => {
        let clipn = findCursor(loc, get());
        if(clipn>=0){
            get().removeClip(get().clips[clipn]);
            get().updateVidInfo();
        }
    },
    changeTimeline: (newClips: Clip[]) => {
        set(state => ({ clips: newClips }));
        get().updateStartTime();
    },
    updateStartTime: () => {
        set(state => {
            const clips = state.clips;
            const startTime = [];
            let t = 0;
            for (let i = 0; i < clips.length; i++) {
                startTime.push(t);
                t += clips[i].duration;
            }
            return { startTime: startTime };
        });
    },
    updateCursor: (newCursor: number, incremental: boolean) => {
        set(state => {
            const cursor = incremental ? state.cursor + newCursor : newCursor;
            let currentClip: number|null = findCursor(cursor, state); 
            if(currentClip != state.currentClip)state.updateVidInfo();
            if(currentClip === -1)currentClip=null;
            return { cursor: cursor, currentClip: currentClip };
        });
    },
    updateVidInfo: () => {
        let state = get();
        if(state.currentClip){
            // const clip = state.clips[state.currentClip];
            const psec = state.cursor - state.startTime[state.currentClip];
            if(state.vidRef.current){
                state.vidRef.current.currentTime = psec;
            }
        }
    },
    playpause: () => {
        set(state => {
            if(state.playing){
                state.vidRef.current?.pause();
            }else{
                state.vidRef.current?.play();
            }
            return {playing: !state.playing}
        })
    }
}));

export const useLibrary = create<Library>(set => ({
    files: [],
    addFile: (file: Video) => set(state => ({ files: [...state.files, file] })),
    removeFile: (file: Video) => set(state => ({ files: state.files.filter(f => f.location !== file.location) }))
}));

export const useFF = create<ff>(set => ({
    ff: createFFmpeg({
        log: true,
        corePath: "https://unpkg.com/@ffmpeg/core@0.11.0/dist/ffmpeg-core.js",
    }),
    progress:1.0,
    ready: false,
    setReady: (r: boolean) => set(_ => ({ready: r})),
    setProgress: (p: number) => set(_ => ({progress: p}))
}))

export const useConfig = create<Config>(set => ({
    fps: 24,
    width: 1280,
    height: 720,
    project_name: "untitled project",
    pixel_per_second: 40,
}))