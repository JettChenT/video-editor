import React from 'react'

interface TimeTicksProps {
    gap: number
}

const TimeTicks = ({gap}: TimeTicksProps) => {
  return (
    <div className="h-14 w-full flex" id="timeticks">
        {
            Array.from(Array(60).keys()).map((i) => {
                return <div key={i} className="h-1/2 w-0.5 bg-gray-300 inline-block mr-10">
                    <p className="text-xs ml-1">{i*gap}</p>
                </div>
            })
        }
    </div>
  )
}

export default TimeTicks