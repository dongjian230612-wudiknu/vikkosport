import { cn } from '../../lib/utils';
import type { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export function Button({
  className,
  variant = 'primary',
  size = 'md',
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center font-semibold transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-vikko-accent/50',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        {
          'bg-vikko-accent text-vikko-black hover:bg-vikko-accent-dark': variant === 'primary',
          'bg-vikko-dark text-vikko-white hover:bg-vikko-gray': variant === 'secondary',
          'border border-vikko-gray text-vikko-white hover:border-vikko-accent hover:text-vikko-accent': variant === 'outline',
          'text-vikko-white hover:text-vikko-accent': variant === 'ghost',
        },
        {
          'px-3 py-1.5 text-sm rounded': size === 'sm',
          'px-5 py-2.5 text-base rounded-md': size === 'md',
          'px-8 py-3 text-lg rounded-md': size === 'lg',
        },
        className
      )}
      {...props}
    />
  );
}
