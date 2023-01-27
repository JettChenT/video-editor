import { createFFmpeg, FFmpeg } from "@ffmpeg/ffmpeg";
import { setServers } from "dns";
import { FileInfo } from "ffprobe-wasm";
import { stat } from "fs";
import { createRef, useRef } from "react";
import { create } from "zustand";
import { ilog, vid_to_clip } from "./transform";
import {v4 as uuidv4} from 'uuid';

export interface Clip {
    name: string;
    location: string;
    id: string;
    duration: number;
    start: number;
    end: number;
    parent: Video
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
    changeClip: (i:number, clip: Clip) => void;
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
    pixel_per_gap: number;
    set_pixel_per_second: (p: number, d:boolean) => void;
}

const findCursor = (cursor: number, timeline: Timeline):number|null=> {
    timeline.updateStartTime();
    const res = timeline.clips.findIndex((t, i)=> timeline.startTime[i] <= cursor && timeline.startTime[i]+t.duration>cursor)
    ilog({
        "result": res,
        "stTime": timeline.startTime,
        "cursor": cursor,
        "clips": timeline.clips
    }) 
    if(res<0)return null;
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
    changeClip: (i:number, clip: Clip) => {
        set(state => {
            state.clips[i] = {...clip};
            return {clips: state.clips};
        });
        get().updateStartTime();
        get().updateVidInfo();
    },
    addClip: (clip: Clip) => {
        set(state => ({ clips: [...state.clips, clip] }));
        get().updateStartTime();
        get().updateVidInfo();
    },
    removeClip: (clip: Clip) => {
        set(state => ({ clips: state.clips.filter(c => c.id !== clip.id) }));
        get().updateStartTime();
        get().updateVidInfo();
    },
    splitClip: (loc: number) => {
        let clipn = findCursor(loc, get());
        if(clipn!==null){
            let clip = get().clips[clipn];
            let st = get().startTime[clipn];
            let rightClip = {...clip};
            rightClip.duration = st+clip.duration-loc;
            rightClip.start = clip.end-rightClip.duration;
            rightClip.end = clip.end;
            rightClip.id = uuidv4();
            let leftClip = {...clip};
            leftClip.duration = clip.duration-rightClip.duration;
            leftClip.end = rightClip.start;
            leftClip.id = uuidv4();
            set(state => {
                state.clips.splice(clipn as number, 1, leftClip, rightClip);
                return {clips: state.clips};
            });
            get().updateStartTime();
            get().updateVidInfo();
        }
    },
    removeClipCursor: (loc:number) => {
        let clipn = findCursor(loc, get());
        if(clipn!==null){
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
            return { startTime: startTime};
        });
    },
    updateCursor: (newCursor: number, incremental: boolean) => {
            // ilog("update cursor called", newCursor, incremental, state.cursor)
        const cursor = incremental ? get().cursor + newCursor : newCursor;
        set({cursor:cursor})
        let currentClip: number|null = findCursor(cursor, get()); 
        const vref = get().vidRef;
        if(get().playing && vref.current?.paused){
            get().updateVidInfo();
            vref.current.play();
        }
        if(currentClip === null && get().playing){
            get().playpause();
        }
        if(currentClip !== get().currentClip || !incremental){
            ilog("current clip changed", currentClip, get().currentClip);
            if(vref.current)vref.current.src = get().clips[currentClip as number].location;
            set({currentClip: currentClip});
            get().updateVidInfo();
            if(get().playing){
                vref.current?.play();
            }
        }   
    },
    updateVidInfo: () => {
        let state = get();
        let currentClip = findCursor(state.cursor, state);
        set({currentClip: currentClip})
        if(currentClip!=null){
            // const clip = state.clips[state.currentClip];
            const psec = state.cursor - state.startTime[currentClip]+state.clips[currentClip].start;
            ilog("update vid info", state.currentClip, state.cursor, state.startTime[currentClip], state.clips[currentClip].start, psec)
            if(state.vidRef.current){
                state.vidRef.current.currentTime = psec;
            }
        }
    },
    playpause: () => {
        set(state => {
            ilog("playpause", state.playing)
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

export const useConfig = create<Config>((set,get) => ({
    fps: 24,
    width: 720,
    height: 480,
    project_name: "Untitled Project",
    pixel_per_second: 40,
    pixel_per_gap: 40,
    set_pixel_per_second(p: number, d:boolean=false) { set(_ => ({
        pixel_per_second: Math.max(1, p+(d?get().pixel_per_second:0))
    })) },
}))