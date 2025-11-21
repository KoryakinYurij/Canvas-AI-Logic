import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  ref?: React.Ref<HTMLButtonElement>; // Ref is now a prop in React 19
}

// React 19: remove forwardRef, access ref directly from props
export const Button: React.FC<ButtonProps> = ({ className, variant = 'primary', ref, ...props }) => {
  return (
    <button
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50',
        'h-10 px-4 py-2',
        variant === 'primary' && 'bg-primary text-white hover:bg-primary/90',
        variant === 'secondary' && 'bg-secondary text-white hover:bg-secondary/90',
        variant === 'ghost' && 'hover:bg-slate-100 text-slate-700',
        className
      )}
      {...props}
    />
  );
};
Button.displayName = 'Button';
