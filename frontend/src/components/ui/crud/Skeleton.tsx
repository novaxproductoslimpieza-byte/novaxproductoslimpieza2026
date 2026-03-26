// frontend/src/components/ui/crud/Skeleton.tsx
import React from 'react';

interface SkeletonProps {
    height?: number;
    width?: number;
}

export default function Skeleton({ height = 20, width = 100 }: SkeletonProps) {
    return (
        <div
            style={{
                height,
                width,
                backgroundColor: '#444',
                borderRadius: '4px',
                animation: 'pulse 1.5s infinite',
            }}
        />
    );
}