"use client";

import { motion } from 'motion/react';
import { useMagneticHover } from '@/hooks/useMagneticHover';

type MagneticMotionAnchorProps = {
  href: string;
  className?: string;
  children: React.ReactNode;
};

export function MagneticMotionAnchor({
  href,
  className,
  children,
}: MagneticMotionAnchorProps) {
  const { ref, position, handleMouseMove, handleMouseLeave } =
    useMagneticHover<HTMLAnchorElement>(0.2);

  return (
    <motion.a
      href={href}
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: 'spring', stiffness: 150, damping: 15, mass: 0.1 }}
      className={className}
    >
      {children}
    </motion.a>
  );
}

type MagneticMotionButtonProps = {
  onClick: (e?: any) => void;
  disabled?: boolean;
  className?: string;
  'aria-label'?: string;
  children: React.ReactNode;
};

export function MagneticMotionButton({
  onClick,
  disabled,
  className,
  'aria-label': ariaLabel,
  children,
}: MagneticMotionButtonProps) {
  const { ref, position, handleMouseMove, handleMouseLeave } =
    useMagneticHover<HTMLButtonElement>(0.15);

  return (
    <motion.button
      type="button"
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: 'spring', stiffness: 150, damping: 15, mass: 0.1 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={className}
    >
      {children}
    </motion.button>
  );
}
