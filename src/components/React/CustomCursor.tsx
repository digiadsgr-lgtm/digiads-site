"use client";

import { useEffect, useRef, useState } from "react";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    // Hide default cursor across the body securely
    document.documentElement.style.cursor = 'none';

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let cursorX = mouseX;
    let cursorY = mouseY;
    let isHovering = false;

    const lerp = (start: number, end: number, amt: number) => {
      return (1 - amt) * start + amt * end;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest && target.closest("a, button, input, textarea, [data-magnetic]")) {
        isHovering = true;
      } else {
        isHovering = false;
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mouseover", handleMouseOver, { passive: true });

    let animationFrameId: number;

    const render = () => {
      cursorX = lerp(cursorX, mouseX, 0.2); 
      cursorY = lerp(cursorY, mouseY, 0.2);
      
      if (cursorRef.current) {
        let size = 12;
        if (isHovering) size = 48;
        
        const offset = size / 2;
        
        cursorRef.current.style.transform = `translate3d(${cursorX - offset}px, ${cursorY - offset}px, 0)`;
        cursorRef.current.style.width = `${size}px`;
        cursorRef.current.style.height = `${size}px`;
        
        if (isHovering) {
            cursorRef.current.style.backgroundColor = 'transparent';
            cursorRef.current.style.border = '1px solid #00d9ff';
        } else {
            cursorRef.current.style.backgroundColor = '#00d9ff';
            cursorRef.current.style.border = 'none';
        }
      }
      
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
      cancelAnimationFrame(animationFrameId);
      document.documentElement.style.cursor = 'auto';
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 z-[9999] pointer-events-none rounded-full flex items-center justify-center transition-colors duration-200"
      style={{
        width: '12px',
        height: '12px',
        transform: 'translate3d(-100px, -100px, 0)',
        willChange: 'transform, width, height',
        transition: 'width 0.2s ease-out, height 0.2s ease-out'
      }}
    />
  );
}
