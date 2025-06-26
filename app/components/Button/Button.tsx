import { ButtonHTMLAttributes, ReactNode } from 'react';
import styles from './Button.module.css';

type ButtonProps = {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'google';
  className?: string;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({
  children,
  variant = 'primary',
  className = '',
  ...props
}: ButtonProps) {
  let variantClass = styles.button;

  if (variant === 'secondary') {
    variantClass = styles['button-secondary'];
  } else if (variant === 'google') {
    variantClass = `${styles.button} ${styles.google}`;
  }

  return (
    <button {...props} className={`${variantClass} ${className}`}>
      {children}
    </button>
  );
}
