import { createFFmpeg, FFmpeg } from "@ffmpeg/ffmpeg";
import { FileInfo } from "ffprobe-wasm";
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
    currentClip: number | null;
    startTime: number[];
    activeId: string | null;
    addClip: (clip: Clip) => void;
    removeClip: (clip: Clip) => void;
    splitClip: (loc: number) => void;
    removeClipCursor: (loc: number) => void;
    changeTimeline: (newClips: Clip[]) => void;
    updateStartTime: () => void;
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
    return timeline.clips.findIndex((t, i)=> timeline.startTime[i] < cursor && timeline.startTime[i]+t.duration>cursor)
}

// export funcs
export const useTimeline = create<Timeline>((set, get) => ({
    clips: [],
    cursor: 0,
    activeId:null,
    playing: false,
    startTime: [],
    currentClip: null,
    addClip: (clip: Clip) => {
        set(state => ({ clips: [...state.clips, clip] }));
        get().updateStartTime();
    },
    removeClip: (clip: Clip) => {
        set(state => ({ clips: state.clips.filter(c => c.location !== clip.location) }));
        get().updateStartTime();
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
        }
    },
    removeClipCursor: (loc:number) => {
        let clipn = findCursor(loc, get());
        if(clipn>=0){
            get().removeClip(get().clips[clipn]);
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
            // TODO: improve performance of this for incremental
            let currentClip: number|null = findCursor(cursor, state); 
            if(currentClip === -1)currentClip=null;
            return { cursor: cursor, currentClip: currentClip };
        });
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