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
    let isMassive = false;
    let cursorText = "";

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
      
      // Check for interactive elements
      if (target.closest && target.closest("a, button, input, textarea, [data-magnetic]")) {
        isHovering = true;
      } else {
        isHovering = false;
      }

      // Check for elements wanting the MASSIVE "VIEW" cursor effect
      const massiveTarget = target.closest && target.closest("[data-cursor-text]");
      if (massiveTarget) {
        isMassive = true;
        cursorText = (massiveTarget as HTMLElement).getAttribute("data-cursor-text") || "VIEW";
      } else if (target.tagName.toLowerCase() === 'img') {
        isMassive = true;
        cursorText = "VIEW";
      } else {
        isMassive = false;
        cursorText = "";
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mouseover", handleMouseOver, { passive: true });

    let animationFrameId: number;

    const render = () => {
      // Very smooth lag for that cinematic cursor weight
      cursorX = lerp(cursorX, mouseX, 0.15); 
      cursorY = lerp(cursorY, mouseY, 0.15);
      
      if (cursorRef.current && textRef.current) {
        // Base sizes
        let size = 16;
        if (isHovering && !isMassive) size = 64; // bigger circle over standard links
        if (isMassive) size = 120; // massive circle over images
        
        const offset = size / 2;
        
        // Transform the outer div
        cursorRef.current.style.transform = `translate3d(${cursorX - offset}px, ${cursorY - offset}px, 0)`;
        cursorRef.current.style.width = `${size}px`;
        cursorRef.current.style.height = `${size}px`;
        
        // Handle inner text visibility
        textRef.current.textContent = cursorText;
        textRef.current.style.opacity = isMassive ? '1' : '0';
        textRef.current.style.transform = isMassive ? 'scale(1)' : 'scale(0.5)';
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
      className="fixed top-0 left-0 z-[9999] pointer-events-none rounded-full flex items-center justify-center mix-blend-difference bg-white text-black shadow-2xl"
      style={{
        width: '16px',
        height: '16px',
        transform: 'translate3d(-100px, -100px, 0)',
        willChange: 'transform, width, height',
        transition: 'width 0.4s cubic-bezier(0.16, 1, 0.3, 1), height 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
      }}
    >
      <span 
        ref={textRef} 
        className="font-black tracking-[0.2em] uppercase text-xs transition-all duration-300 pointer-events-none"
        style={{ opacity: 0, transform: 'scale(0.5)' }}
      >
        VIEW
      </span>
    </div>
  );
}
