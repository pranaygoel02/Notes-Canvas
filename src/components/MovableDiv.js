import React, {useEffect, useRef, useState} from 'react'

function MovableDiv({children, className, id}) {

  return (
    <div className={`p-2 absolute cursor-move active:border-dashed active:border-2 hover:border-black active:border-black ${className}`} id={id}>
        {children}
    </div>
  )
}

export default MovableDiv