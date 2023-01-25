import React, { useState } from "react";
import TimeTicks from "./TimeTicks";
import { useTimeline, useConfig } from "@/lib/state";
const pixel_per_sec = 10;

const rand_colors = [
    "bg-red-300",
    "bg-yellow-300",
    "bg-green-300",
    "bg-blue-300",
    "bg-indigo-300",
    "bg-purple-300",
    "bg-pink-300",
]

const TimeLine = () => {
  const [gapsec, setGapsec] = useState(1);
  const timeline = useTimeline((st) => st.clips);
  const config = useConfig.getState();

  return (
    <div className="cursor-grab overflow-x-scroll overflow-y-hidden flex flex-col h-full">
        <TimeTicks gap={gapsec} />
        <div className="h-full min-h-16">
            {
                timeline.map((clip, i) => {
                    return <div 
                        key={i} 
                        className={`h-full rounded-md inline-block p-2 ${rand_colors[i%rand_colors.length]}`}
                        style={
                            {
                                width: `${(clip.duration) * config.pixel_per_second}px`
                            }
                        }
                    >
                        <p className="text-xs">{clip.name}
                        <br />
                        {(clip.duration*1.0).toFixed(2)}
                        </p>
                    </div>
                })
            }
        </div>
    </div>
    );
};

export default TimeLine;
