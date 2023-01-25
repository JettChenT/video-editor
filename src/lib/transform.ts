import { fetchFile } from "@ffmpeg/ffmpeg";
import { Clip, Timeline, Video, Library, useFF, useConfig, useTimeline } from "./state";

function sec_to_timestamp(seconds: number){
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor((seconds % 3600) % 60);
    return `${hours}:${minutes}:${secs}`;
}

function ilog(...args: any[]){
    console.log("[info]", ...args)
}

async function export_timeline(){
    const ff = useFF.getState().ff;
    const tl = useTimeline.getState();
    const clips = tl.clips;
    console.log("[info]", clips)
    let flst = [];
    for (let i = 0; i < clips.length; i++){
        const clip = clips[i];
        const filoc = `i${i}.mp4`
        const foloc = `i${i}.ts`
        // transform it into ts
        ff.FS("writeFile", filoc, await fetchFile(clip.location))
        await ff.run('-i', filoc, '-c', 'copy', foloc)
        flst.push(`file '${foloc}'`);
    }
    ff.FS("writeFile", "concat_list.txt", flst.join("\n"));
    console.log("[info]",ff.FS("readdir","."));
    let ffcommand = []
    ffcommand.push("-c:v", "libx264"),
    ffcommand.push(['-preset', 'ultrafast'])
    ffcommand.push(['-f', 'concat', '-safe', '0', '-i', 'concat_list.txt', 'output.mp4'])
    await ff.run('-f', 'concat', '-safe', '0', '-i', 'concat_list.txt', 'output.mp4', "-preset", "ultrafast");
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
    const duration = video.fileInfo.format.duration as unknown as number;
    return {
        name: video.name,
        location: video.location,
        duration: duration,
        start:null,
        end: null
    }
}

export {sec_to_timestamp, export_timeline, vid_to_clip, process_video}