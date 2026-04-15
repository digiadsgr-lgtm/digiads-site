"use client";

import React, { useRef, useState } from "react";
import { motion } from "framer-motion";

interface MagneticProps {
  children: React.ReactElement;
  strength?: number;
}

export default function Magnetic({ children, strength = 0.3 }: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY } = e;
    if (!ref.current) return;
    
    // Get dimensions of the element
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    
    // Calculate center of the element
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    
    setPosition({ x: middleX * strength, y: middleY * strength });
  };

  const reset = () => {
    setPosition({ x: 0, y: 0 });
  };

  // Extract className from children if present to pass down properly
  const childClassName = children.props.className || "";

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      className={`inline-block origin-center ${childClassName}`}
      data-magnetic="true"
    >
      {/* Clone element without its original className since we lift it to the wrapper for layout stability, or leave it if it's display block. Wait! Actually we should just keep it inline but let the child do the styling */}
      {React.cloneElement(children)}
    </motion.div>
  );
}
