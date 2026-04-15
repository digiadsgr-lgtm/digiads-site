"use client";

import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Hide default cursor across the body
    document.body.style.cursor = 'none';

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let cursorX = mouseX;
    let cursorY = mouseY;
    let isHovering = false;

    // Smooth Linear Interpolation
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
      // 0.25 dictates the stiffness. Closer to 1 = hard attach, closer to 0 = very laggy smooth.
      cursorX = lerp(cursorX, mouseX, 0.25); 
      cursorY = lerp(cursorY, mouseY, 0.25);
      
      if (cursorRef.current) {
        const size = isHovering ? 56 : 16;
        const offset = size / 2;
        
        // Translate3d forces GPU hardware acceleration for 0-lag.
        cursorRef.current.style.transform = `translate3d(${cursorX - offset}px, ${cursorY - offset}px, 0)`;
        cursorRef.current.style.width = `${size}px`;
        cursorRef.current.style.height = `${size}px`;
      }
      
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
      cancelAnimationFrame(animationFrameId);
      document.body.style.cursor = 'auto';
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 z-[9999] pointer-events-none rounded-full flex items-center justify-center mix-blend-difference bg-white"
      style={{
        width: '16px',
        height: '16px',
        transform: 'translate3d(-100px, -100px, 0)',
        willChange: 'transform, width, height',
        transition: 'width 0.3s cubic-bezier(0.16, 1, 0.3, 1), height 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
      }}
    />
  );
}
