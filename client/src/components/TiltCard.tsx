/**
 * TiltCard — wraps any content with a subtle 3D perspective tilt on mouse hover.
 * Design: uses CSS transform perspective + rotateX/Y driven by mouse position.
 * The tilt is gentle (max ±8°) so it feels premium, not gimmicky.
 */
import { useRef, useCallback } from "react";

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number; // degrees, default 8
  scale?: number;   // scale on hover, default 1.02
  onMouseEnter?: React.MouseEventHandler<HTMLDivElement>;
}

export default function TiltCard({
  children,
  className = "",
  maxTilt = 8,
  scale = 1.02,
  onMouseEnter,
}: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current) return;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;  // 0–1
        const y = (e.clientY - rect.top) / rect.height;  // 0–1
        const rotateX = (0.5 - y) * maxTilt * 2;  // positive = tilt top toward viewer
        const rotateY = (x - 0.5) * maxTilt * 2;  // positive = tilt right toward viewer
        cardRef.current.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scale})`;
      });
    },
    [maxTilt, scale]
  );

  const handleMouseLeave = useCallback(() => {
    if (!cardRef.current) return;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    cardRef.current.style.transform = `perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)`;
  }, []);

  return (
    <div
      data-tilt
      ref={cardRef}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={onMouseEnter}
      style={{
        transition: "transform 0.15s ease-out",
        willChange: "transform",
      }}
    >
      {children}
    </div>
  );
}
