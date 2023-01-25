import React, { useState } from "react";
import TimeTicks from "./TimeTicks";
import { useTimeline } from "@/lib/state";

const TimeLine = () => {
  const [gapsec, setGapsec] = useState(1);
  const timeline = useTimeline((st) => st.clips);

  return (
    <div className="cursor-grab overflow-x-scroll overflow-y-hidden flex flex-col h-full">
        <TimeTicks gap={gapsec} />
        <div className="h-full min-h-16">
            {
                timeline.map((clip, i) => {
                    return <div key={i} className="h-full w-40 bg-gray-300 inline-block m-1 p-2">
                        <p className="text-xs">{clip.location}
                        <br />
                        {clip.start} - {clip.end}
                        </p>
                    </div>
                })
            }
        </div>
    </div>
    );
};

export default TimeLine;
