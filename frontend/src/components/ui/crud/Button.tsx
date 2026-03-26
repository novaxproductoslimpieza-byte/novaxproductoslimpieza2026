// frontend/src/components/ui/crud/Button.tsx
import React from 'react';

interface ButtonProps {
    text: string;
    onClick?: () => void;
    variant?: 'primary' | 'secondary' | 'danger';
    type?: 'button' | 'submit' | 'reset';
    disabled?: boolean;
}

export default function Button({
    text,
    onClick,
    variant = 'primary',
    type = 'button',
    disabled = false,
}: ButtonProps) {
    const baseClass = 'btn';
    const variantClass =
        variant === 'primary'
            ? 'btn-primary'
            : variant === 'secondary'
                ? 'btn-secondary'
                : 'btn-danger';

    return (
        <button
            type={type}
            className={`${baseClass} ${variantClass}`}
            onClick={onClick}
            disabled={disabled}
        >
            {text}
        </button>
    );
}