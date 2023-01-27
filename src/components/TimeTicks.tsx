import { useTimeline } from '@/lib/state'
import React from 'react'

interface TimeTicksProps {
    gap: number
}

const minT = 60;

const TimeTicks = ({gap}: TimeTicksProps) => {
    const tickCnt = useTimeline((st) => {
        if(st.startTime.length>0){
            const l = st.startTime.length-1;
            const res = Math.ceil((st.startTime[l]+st.clips[l].duration)/gap)
            if(res>minT){
                return res;
            }
        }
        return minT;
    })
  return (
    <div className="h-14 w-full flex" id="timeticks">
        {
            Array.from(Array(tickCnt).keys()).map((i) => {
                return <div key={i} className="h-1/2 w-0.5 bg-gray-300 inline-block mr-10">
                    <p className="text-xs ml-1">{(i*gap).toFixed(1)}</p>
                </div>
            })
        }
    </div>
  )
}

export default TimeTicks