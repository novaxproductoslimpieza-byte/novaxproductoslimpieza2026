// frontend/src/components/ui/crud/FormInput.tsx
import React from 'react';

interface FormInputProps {
    label: string;
    value: string;
    onChange: (val: string) => void; // tipado correcto
    required?: boolean;
}

export default function FormInput({
    label,
    value,
    onChange,
    required = false,
}: FormInputProps) {
    return (
        <div className="mb-3">
            <label className="form-label text-light">{label}</label>
            <input
                type="text"
                className="form-control"
                value={value}
                required={required}
                onChange={(e) => onChange(e.target.value)} // val siempre es string
            />
        </div>
    );
}