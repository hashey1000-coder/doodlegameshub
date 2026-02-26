interface AnimatedCardProps {
  children: React.ReactNode;
  /** kept for API compatibility — no longer used */
  index?: number;
  className?: string;
}

/** Plain wrapper — scroll-triggered entrance animations removed. */
export default function AnimatedCard({ children, className = '' }: AnimatedCardProps) {
  return <div className={className}>{children}</div>;
}
