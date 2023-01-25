import { createFFmpeg, FFmpeg } from "@ffmpeg/ffmpeg";
import { FileInfo } from "ffprobe-wasm";
import { create } from "zustand";

export interface Clip {
    name: string;
    location: string;
    duration: number;
    start: number | null;
    end: number | null
}

export interface Timeline{
    clips: Clip[];
    cursor: number;
    addClip: (clip: Clip) => void;
    removeClip: (clip: Clip) => void;
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

// export funcs
export const useTimeline = create<Timeline>(set => ({
    clips: [],
    cursor: 0,
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