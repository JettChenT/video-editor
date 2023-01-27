import { Clip, useConfig, useTimeline } from '@/lib/state';
import React, {forwardRef} from 'react';
import { hashColor } from './VideoClip';

interface ItemProps {
    id: string;
}

const Item = forwardRef<HTMLDivElement, ItemProps>((props, ref) => {
    const {id} = props;
    const clip= useTimeline(state => {
        return state.clips.find((clip) => clip.id === id) as Clip;
    }); 
    const config = useConfig();
    const style = {
        width: `${clip.duration * config.pixel_per_second}px`,
      };
    const bgcol = hashColor(clip.id);
    return (
        <div
      className={`h-15 overflow-x-hidden rounded-md p-2 inline-block -top-2 drop-shadow-2xl ${bgcol}`}
      style={style}
    >
      <p className="text-xs">
        {clip.name}
        <br />
        {(clip.duration * 1.0).toFixed(2)}
        <br/>
        {clip.start}~{clip.end}
      </p>
    </div>
    )
});

Item.displayName = 'Item';

export default Item;

