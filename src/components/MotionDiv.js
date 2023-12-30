import React, { useEffect, useRef, useState } from "react";
import { selectedAtom } from "@/hooks/useCanavas";
import { useAtom } from "jotai";

function MotionDiv({ children, className, id }) {
    const [selectedItem, setSelectedItem] = useAtom(selectedAtom);
  console.log(children);
  const divRef = useRef(null);

  
  let canvasLeft = 0;
  let canvasTop = 0;

  const state = {
    isDragging: false,
    x: 0,
    y: 0,
  };

  const currElementRef = useRef(null);

  const handleMouseDown = (e) => {
    state.isDragging = true;
    currElementRef.current = e.target;
    // const offset_X = e.clientX - state.x;
    // const offset_Y = e.clientY - state.y;
    // state.x += offset_X;
    // state.y += offset_Y;
  };

  const handleMouseMove = (e) => {
    if (state.isDragging) {
      const offset_X = e.clientX - state.x;
      const offset_Y = e.clientY - state.y;
      state.x += offset_X;
      state.y += offset_Y;
    }
    if (currElementRef.current && currElementRef.current.id !== 'canvas') {
        currElementRef.current.style.left = `${state.x - canvasLeft}px`;
        currElementRef.current.style.top = `${state.y - canvasTop}px`;
      }
  };

  const handleMouseUp = (e) => {
    state.isDragging = false;
    const offset_X = e.clientX - state.x;
    const offset_Y = e.clientY - state.y;
    state.x += offset_X;
    state.y += offset_Y;
    currElementRef.current = null;
  };

  const handleMouseOut = (e) => {
    if (state.isDragging) {
      const offset_X = e.clientX - state.x;
      const offset_Y = e.clientY - state.y;
      state.x += offset_X;
      state.y += offset_Y;
    }
    if (currElementRef.current && currElementRef.current.id !== 'canvas') {
      currElementRef.current.style.left = `${state.x - canvasLeft}px`;
      currElementRef.current.style.top = `${state.y - canvasTop}px`;
    }
  };

  
  useEffect(() => {
    const div = divRef.current;
    const divRect = div.getBoundingClientRect();

    canvasLeft = divRect.left;
    canvasTop = divRect.top;
    
    div.addEventListener("mousedown", handleMouseDown);
    div.addEventListener("mousemove", handleMouseMove);
    div.addEventListener("mouseup", handleMouseUp);
    div.addEventListener("mouseout", handleMouseOut);
    div.addEventListener("click", (e) => {
        e.preventDefault()
        setSelectedItem(e.target)
    })
  
    return () => {
      div.removeEventListener("mousedown", handleMouseDown);
      div.removeEventListener("mousemove", handleMouseMove);
      div.removeEventListener("mouseup", handleMouseUp);
      div.removeEventListener("mouseout", handleMouseOut);
      div.removeEventListener("click", (e) => {
        e.preventDefault()
        setSelectedItem(e.target)
        })
    };
  }, []);

  useEffect(() => {
    if (state.isDragging) {
      currElementRef.current.style.left = `${state.x - canvasLeft}px`;
      currElementRef.current.style.top = `${state.y - canvasTop}px`;
    }
  }, [state]);

  return (
    <div id={id} ref={divRef} className={className}>
      {children}
    </div>
  );
}

export default MotionDiv;
