import { useConfig, useTimeline } from '@/lib/state'
import { ilog, sec_to_timestamp } from '@/lib/transform';
import React, { useEffect, useState } from 'react'

const VideoControls = () => {
    let playing = useTimeline((st) => st.playing);
    let playpause = useTimeline((st) => st.playpause);
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
            playpause();
        }}>
            {playing? "Pause" : "Play"}
        </button>
        <button className='btn btn-primary' onClick={()=>{
            useTimeline.getState().splitClip(cursor);
        }}>
            Split
        </button>
        <button className='btn btn-primary' onClick={() => {
            useTimeline.getState().removeClipCursor(cursor);
        }}>
            Delete
        </button>

        {sec_to_timestamp(cursor, useConfig.getState().fps)}
        <button className='btn btn-primary' onClick={()=>{
            useConfig.getState().set_pixel_per_second(-4, true);
        }}>-</button>
        <input type="range" min="1" max="100" value={useConfig((st)=>st.pixel_per_second)} className="slider" id="myRange" onChange={(e)=>{
            useConfig.getState().set_pixel_per_second(parseInt(e.target.value), false);
        }}/> 
        <button className='btn btn-primary' onClick={()=>{
            useConfig.getState().set_pixel_per_second(4, true);
        }}>+</button>
        
        
    </div>
  )
}

export default VideoControls