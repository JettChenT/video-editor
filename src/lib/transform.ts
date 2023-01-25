import { fetchFile } from "@ffmpeg/ffmpeg";
import { Clip, Timeline, Video, Library, useFF, useConfig } from "./state";

function sec_to_timestamp(seconds: number){
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor((seconds % 3600) % 60);
    return `${hours}:${minutes}:${secs}`;
}

async function export_timeline(tl: Timeline){
    const ff = useFF.getState().ff;
    const clips = tl.clips;
    let concatstr = "concat:";
    for (let i = 0; i < clips.length; i++){
        const clip = clips[i];
        concatstr+=`${clip.location}`;
        if(i<clips.length-1){
            concatstr+="|";
        }
    }
    await ff.run('-i', concatstr, '-c', 'copy', 'output.mp4');
    const data = ff.FS('readFile', 'output.mp4');
    const url = URL.createObjectURL(new Blob([data.buffer], {type: 'video/mp4'}));
    return url
}

async function process_video(video: Video): Promise<string>{
    const ff = useFF.getState().ff;
    const config = useConfig.getState();
    const s = `scale=${config.width}:${config.height}`;
    const fps = config.fps;
    ff.FS("writeFile", video.name, await fetchFile(video.location))
    await ff.run('-i', video.name, '-vf', s, '-r', fps.toString(), 'output.mp4');
    const data = ff.FS('readFile', 'output.mp4');
    const url = URL.createObjectURL(new Blob([data.buffer], {type: 'video/mp4'}));
    return url
}

async function vid_to_clip(video: Video):Promise<Clip>{
    // Use ffmpeg to convert video to a standard 720p 24fps clip
    const ff = useFF.getState().ff;
    const config = useConfig.getState();
    const s = `scale=${config.width}:${config.height}`;
    const fps = config.fps;
    ff.FS("writeFile", video.name, await fetchFile(video.location))
    await ff.run('-i', video.name, '-vf', s, '-r', fps.toString(), 'output.mp4');
    const data = ff.FS('readFile', 'output.mp4');
    const url = URL.createObjectURL(new Blob([data.buffer], {type: 'video/mp4'}));
    return {
        location: url,
        start: null,
        end: null,
    }
}

export {sec_to_timestamp, export_timeline, vid_to_clip, process_video}