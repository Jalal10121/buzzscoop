"use client";

import { useEffect, useState } from "react";

export function CustomCursor() {
  const [mounted, setMounted] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [hovering, setHovering] = useState(false);
  const [clicking, setClicking] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    // Touch device check
    const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    if (isTouch) return;

    let rafId: number;
    let mouseX = 0;
    let mouseY = 0;

    function handleMove(e: MouseEvent) {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        setPosition({ x: mouseX, y: mouseY });

        const target = e.target as HTMLElement;
        const interactive = target?.closest?.("a, button, [role='button']");
        setHovering(!!interactive);
      });
    }

    function handleDown() {
      setClicking(true);
    }

    function handleUp() {
      setClicking(false);
    }

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mousedown", handleDown);
    window.addEventListener("mouseup", handleUp);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mousedown", handleDown);
      window.removeEventListener("mouseup", handleUp);
    };
  }, [mounted]);

  // Server pe render mat karo
  if (!mounted) return null;

  return (
    <>
      {/* Outer ring */}
      <div
        className="fixed pointer-events-none z-[9999]"
        style={{
          left: position.x,
          top: position.y,
          transform: `translate(-50%, -50%) scale(${hovering ? 1.8 : 1})`,
          transition: "transform 0.15s ease-out",
        }}
      >
        <div
          className="rounded-full border-2 transition-all duration-200"
          style={{
            width: hovering ? "40px" : "24px",
            height: hovering ? "40px" : "24px",
            borderColor: hovering ? "#facc15" : "rgba(15, 23, 42, 0.5)",
            backgroundColor: hovering ? "rgba(250, 204, 21, 0.1)" : "transparent",
          }}
        />
      </div>

      {/* Inner dot */}
      <div
        className="fixed pointer-events-none z-[9999]"
        style={{
          left: position.x,
          top: position.y,
          transform: "translate(-50%, -50%)",
          transition: "transform 0.05s",
        }}
      >
        <div
          className="rounded-full transition-all duration-150"
          style={{
            width: clicking ? "12px" : hovering ? "8px" : "6px",
            height: clicking ? "12px" : hovering ? "8px" : "6px",
            backgroundColor: hovering ? "#facc15" : "#0f172a",
          }}
        />
      </div>
    </>
  );
}