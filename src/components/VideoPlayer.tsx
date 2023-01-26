import React, { useEffect, useRef } from 'react'
import { useConfig, useTimeline } from '@/lib/state'
import VideoControls from './VideoControls'
import { ilog } from '@/lib/transform';

const VideoPlayer = () => {
    const videoRef = useTimeline(state => {
        return state.vidRef;
    });
    const src = useTimeline(state => {
        ilog(state.currentClip);
        if(state.currentClip!==null){
            let cur = state.clips[state.currentClip]
            return cur.location;
        }
        return null;
    });
    useEffect(() => {
        videoRef.current?.currentTime
    })
    return (
        <>
            <video 
                ref={videoRef} 
                controls
                src={src?src:""}
                // style ={{
                //     "width": useConfig(state => state.width)+"px",
                //     "height": useConfig(state => state.height)+"px",
                // }}
            >
            </video>
            <VideoControls/>
        </>
    )
}

export default VideoPlayer