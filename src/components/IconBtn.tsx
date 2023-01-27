import React, { PropsWithChildren } from 'react'

interface IconBtnProps {
    onClick: () => void
    className?: string
    btnSize?: string 
}

const IconBtn: React.FC<PropsWithChildren<IconBtnProps>> = ({onClick, children, className, btnSize}) => {
  return (
    <button
        className={`btn ${btnSize?btnSize:"btn-sm"} btn-outline btn-square mx-1 `+(className?className:'')}
        onClick={onClick}
    >
        {children}
    </button>
  )
}

export default IconBtn