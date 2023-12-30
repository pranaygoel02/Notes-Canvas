import MotionDiv from '@/components/MotionDiv'
import MovableDiv from '@/components/MovableDiv'
import { selectedAtom, useDraw } from '@/hooks/useCanavas'
import React, { useEffect } from 'react'
import { useAtom } from 'jotai'
import { canvasAtom } from '@/hooks/useCanavas'

function index() {
    const {canvasRef} = useDraw()
    const [canvasItems, setCanvasItems] = useAtom(canvasAtom)
    const [selectedItem, setSelectedItem] = useAtom(selectedAtom)

    console.log(selectedItem);

  return (
    <MotionDiv id={'canvas'} ref={canvasRef} className='w-screen h-screen bg-slate-100 overflow-auto relative'>
        {canvasItems.map((item, index) => {
            return (
                <MovableDiv key={index} id={index}>
                    {item}
                </MovableDiv>
            )
        }
    )}
    </MotionDiv>
  )
}

export default index