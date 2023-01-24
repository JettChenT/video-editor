import React from 'react'
import { Video } from '@/lib/state'

interface VideoCardProps {
    video: Video
}

const VideoCard: React.FC<VideoCardProps> = ({ video }) => {
  return (
    <div className='m-1 p-2 w-40 h-14 border-2 border-solid inline-block'>
        <div>
            <h2 className='text-sm'>{video.name}</h2>
        </div>
    </div>
  )
}

export default VideoCard