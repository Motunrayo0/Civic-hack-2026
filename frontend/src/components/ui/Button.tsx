import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost';
  children: ReactNode;
}

export default function Button({ variant = 'primary', children, className = '', ...props }: ButtonProps) {
  const base = 'inline-flex items-center justify-center gap-3 rounded-full px-8 py-4 font-medium transition-all duration-300 ease-in-out cursor-pointer text-base';

  const variants = {
    primary: 'bg-indigo-primary text-white hover:bg-indigo-dark shadow-sm hover:shadow-md',
    ghost: 'bg-transparent text-indigo-primary border-2 border-indigo-primary/20 hover:bg-indigo-primary/5',
  };

  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}
