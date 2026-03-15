import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'accent' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  pill?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  pill = true,
  className = '',
  disabled,
  ...props
}) => {
  const variantClass = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    outline: 'btn-outline-primary',
    danger: 'btn-danger',
    accent: 'btn-accent',
    ghost: 'btn-ghost' // We will define this in globals.css
  }[variant];

  const sizeClass = {
    sm: 'btn-sm',
    md: '',
    lg: 'btn-lg'
  }[size];

  const pillClass = pill ? 'rounded-pill' : '';

  return (
    <button
      className={`btn ${variantClass} ${sizeClass} ${pillClass} ${className} d-inline-flex align-items-center justify-content-center gap-2 transition-all`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
      )}
      {children}
    </button>
  );
};

export default Button;
