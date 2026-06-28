"use client";

import { useRef, useState, useCallback, MouseEvent } from 'react';

export function useMagneticHover<T extends HTMLElement>(strength: number = 0.3) {
  const ref = useRef<T | null>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = useCallback(
    (e: MouseEvent<T>) => {
      if (!ref.current) return;
      const { clientX, clientY } = e;
      const { width, height, left, top } = ref.current.getBoundingClientRect();
      const x = (clientX - (left + width / 2)) * strength;
      const y = (clientY - (top + height / 2)) * strength;
      setPosition({ x, y });
    },
    [strength]
  );

  const handleMouseLeave = useCallback(() => {
    setPosition({ x: 0, y: 0 });
  }, []);

  return { ref, position, handleMouseMove, handleMouseLeave };
}
