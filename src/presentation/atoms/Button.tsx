import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', ...props }, ref) => {
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
  }
);
Button.displayName = 'Button';
