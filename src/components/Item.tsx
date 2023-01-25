import React, {forwardRef} from 'react';
interface ItemProps {
    id: string;
}

const Item = forwardRef<HTMLDivElement, ItemProps>((props, ref) => {
    return (
        <div {...props} ref={ref}>{props.id}</div>
    )
});

Item.displayName = 'Item';

export default Item;

