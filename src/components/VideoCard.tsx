import React, { useEffect } from 'react'
import { Video } from '@/lib/state'
import Image from 'next/image'
import { Clip, useTimeline } from '@/lib/state'
import { process_video, vid_to_clip } from '@/lib/transform'

interface VideoCardProps {
    video: Video
}

const VideoCard: React.FC<VideoCardProps> = ({ video }) => {
    let addClip = useTimeline((st) => st.addClip);
    let [processing , setProcessing] = React.useState(false);
  return (
    <div className='m-1 p-2 w-40 border-2 border-solid inline-block'>
        <div>
            <h2 className='text-sm'>{video.name}</h2>
            {
                video.processed?"ready":processing?"processing":"not ready"
            }
            {
                video.thumbnail&&
                <Image src={video.thumbnail} width={100} height={100} alt={video.name}/>
            }
            <button 
                className='p-1 bg-primary text-white inline-block'
                onClick={() => {
                    vid_to_clip(video).then((clip) => {
                        addClip(clip);
                    })
                }}
            >
                +
            </button>
        </div>
    </div>
  )
}

export default VideoCard