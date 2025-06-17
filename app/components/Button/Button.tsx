import styles from './Button.module.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'default' | 'google';
}

const Button: React.FC<ButtonProps> = ({ children, className = '', variant = 'default', ...props }) => {
  const variantClass = variant === 'google' ? styles.google : '';

  return (
    <button className={`${className} ${styles.button} ${variantClass}`} {...props}>
      {children}
    </button>
  );
};

export default Button;
