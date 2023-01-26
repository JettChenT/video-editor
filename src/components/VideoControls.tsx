import { useConfig, useTimeline } from '@/lib/state'
import { ilog, sec_to_timestamp } from '@/lib/transform';
import React, { useEffect, useState } from 'react'

const VideoControls = () => {
    let [playing, setPlaying] = useState(false);
    const cursor = useTimeline((st)=>st.cursor);
    useEffect(() => {
        const fps = useConfig.getState().fps;
        const ival = setInterval(() => {
            if (playing) {
                useTimeline.getState().updateCursor(1.0/fps, true)
            }
        }, 1000.0/fps);
        return () => clearInterval(ival);
    }, [playing]);
  return (
    <div>
        <button className='btn btn-primary' onClick={()=>{
            setPlaying(!playing); 
        }}>
            {playing? "Pause" : "Play"}
        </button>
        <button className='btn btn-primary' onClick={()=>{
            useTimeline.getState().splitClip(cursor);
        }}>
            Split
        </button>

        {sec_to_timestamp(cursor, useConfig.getState().fps)}
    </div>
  )
}

export default VideoControls