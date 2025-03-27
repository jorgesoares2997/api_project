"use client";

import { useEffect, useState } from "react";

export default function DynamicBackground() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div
      className="fixed inset-0 -z-10 transition-all duration-300 ease-out"
      style={{
        background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, 
          rgba(99, 102, 241, 0.15) 0%,
          rgba(99, 102, 241, 0.1) 25%,
          rgba(99, 102, 241, 0.05) 50%,
          rgba(99, 102, 241, 0) 75%)`,
      }}
    />
  );
} 