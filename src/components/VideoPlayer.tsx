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
        <div>
            <video 
                ref={videoRef} 
                // src={src?src:""}
                className="bg-black h-full w-full"
                onPlay={(e)=>{
                    ilog("playpause: ==play");
                    e.preventDefault()
                }}
                onPause={(e)=>{
                    ilog("playpause: ==pause", e);
                    e.preventDefault()
                }}
            >
            </video>
        </div>
    )
}

export default VideoPlayer