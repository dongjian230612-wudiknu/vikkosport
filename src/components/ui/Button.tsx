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
        'inline-flex items-center justify-center font-semibold tracking-wide transition-colors duration-200 cursor-pointer',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-vikko-black/40 focus-visible:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        {
          'bg-vikko-black text-vikko-white hover:bg-vikko-ink': variant === 'primary',
          'bg-vikko-canvas text-vikko-ink hover:bg-vikko-border': variant === 'secondary',
          'border border-vikko-black text-vikko-black hover:bg-vikko-black hover:text-vikko-white': variant === 'outline',
          'text-vikko-ink hover:text-vikko-accent': variant === 'ghost',
        },
        {
          'px-3 py-1.5 text-sm rounded': size === 'sm',
          'px-5 py-2.5 text-sm rounded-md': size === 'md',
          'px-8 py-3.5 text-base rounded-md': size === 'lg',
        },
        className
      )}
      {...props}
    />
  );
}
