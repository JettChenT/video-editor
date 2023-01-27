import { useConfig, useTimeline } from "@/lib/state";
import React from "react";

// https://stackoverflow.com/questions/10420352/converting-file-size-in-bytes-to-human-readable-string
function humanFileSize(bytes:number, si=false, dp=1) {
    const thresh = si ? 1000 : 1024;
  
    if (Math.abs(bytes) < thresh) {
      return bytes + ' B';
    }
  
    const units = si 
      ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'] 
      : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
    let u = -1;
    const r = 10**dp;
  
    do {
      bytes /= thresh;
      ++u;
    } while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 1);
  
  
    return bytes.toFixed(dp) + ' ' + units[u];
  }

const VideoProperties = () => {
    const currentClip = useTimeline((st)=>{
        if(st.currentClip!==null){
            return st.clips[st.currentClip];
        }
        return null;
    });
    const currentInd = useTimeline((st)=>{
        return st.currentClip;
    });
    const config = useConfig();
  return (
    <div className="p-2 text-sm h-full overflow-y-scroll overflow-x-scroll whitespace-nowrap">
        <span className="text-xl text-primary inline-block mt-3">
            Properties
        </span>
        <div>
            <span className="text-lg text-secondary">
                Export Config
            </span><br/>
            width: <input className="input input-xs input-bordered" type="number" value={config.width} onChange={(e)=>{useConfig.setState({width: parseInt(e.target.value)})}}/> <br/>
            height: <input className="input input-xs input-bordered" type="number" value={config.height} onChange={(e)=>{useConfig.setState({height: parseInt(e.target.value)})}}/> <br/>
            fps: <input className="input input-xs input-bordered" type="number" value={config.fps} onChange={(e)=>{useConfig.setState({fps: parseInt(e.target.value)})}}/> <br/>
            name: <input className="input input-xs input-bordered" type="text" value={config.project_name} onChange={(e)=>{useConfig.setState({project_name: e.target.value})}}/> <br/>
        </div>
        {
            currentClip?
            <div>
                <span className="text-xl text-secondary inline-block mt-3">Clip Info:</span> <br/>
                {/* label */}
                Clip name: {" "}
                <input 
                    type="text" 
                    value={currentClip.name} 
                    className="input input-xs input-bordered"
                    onChange={(e)=>{
                        useTimeline.getState().changeClip(currentInd as number, {
                            ...currentClip,
                            name: e.target.value,
                        });
                    }}
                />
                <br/>
                <p>
                    Duration: {currentClip.duration.toFixed(2)}s <br/>
                    Start: {currentClip.start.toFixed(2)} <br/>
                    End: {currentClip.end.toFixed(2)} <br/>
                </p>
                <span className="text-xl text-secondary inline-block mt-3">Source Video Info</span>
                <p>
                    Name: {currentClip.parent.fileInfo.format.filename} <br/>
                    Size: {humanFileSize(Number(currentClip.parent.fileInfo.format.size))} <br/>
                    Bit Rate: {Number(currentClip.parent.fileInfo.format.bit_rate)} <br/>
                </p>
            </div>
            :<></>
        }
    </div>
  );
};

export default VideoProperties;
