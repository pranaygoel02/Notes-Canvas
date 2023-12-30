import { useEffect, useRef } from 'react';
import { atom } from 'jotai';

export const canvasAtom = atom([]);
export const selectedAtom = atom(null);

export const useDraw = () => {
    
    const canvasRef = useRef(null);




    return { canvasRef };
};


