import type { HTMLAttributes, ReactNode } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  glass?: boolean;
}

export default function Card({ children, glass = false, className = '', ...props }: CardProps) {
  const base = 'rounded-3xl border border-slate-100 shadow-sm p-6 sm:p-8';
  const bg = glass ? 'glass' : 'bg-surface-card';

  return (
    <div className={`${base} ${bg} ${className}`} {...props}>
      {children}
    </div>
  );
}
