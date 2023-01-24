import { createFFmpeg, FFmpeg } from "@ffmpeg/ffmpeg";
import { create } from "zustand";

export interface Clip {
    location: string;
}

export interface Timeline{
    clips: Clip[];
    addClip: (clip: Clip) => void;
    removeClip: (clip: Clip) => void;
}

export interface Video{
    location: string;
    name: string;
    // file: object;
}

export interface Library{
    files: Video[]
    addFile: (file: Video) => void;
    removeFile: (file: Video) => void;
}

export interface ff{
    ff: FFmpeg
    ready: boolean
    setReady: (ready: boolean) => void;
}

// export funcs
export const useTimeline = create<Timeline>(set => ({
    clips: [],
    addClip: (clip: Clip) => set(state => ({ clips: [...state.clips, clip] })),
    removeClip: (clip: Clip) => set(state => ({ clips: state.clips.filter(c => c.location !== clip.location) }))
}));

export const useLibrary = create<Library>(set => ({
    files: [],
    addFile: (file: Video) => set(state => ({ files: [...state.files, file] })),
    removeFile: (file: Video) => set(state => ({ files: state.files.filter(f => f.location !== file.location) }))
}));

export const useFF = create<ff>(set => ({
    ff: createFFmpeg({
        log: true,
        corePath: "https://unpkg.com/@ffmpeg/core@0.10.0/dist/ffmpeg-core.js",
    }),
    ready: false,
    setReady: (r: boolean) => set(_ => ({ready: r}))
}))