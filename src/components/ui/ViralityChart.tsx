// import React from 'react';

interface ViralityChartProps {
  data: number[];
  className?: string;
}

export function ViralityChart({ data, className = '' }: ViralityChartProps) {
  const max = Math.max(...data);
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * 60;
    const y = 20 - (value / max) * 20;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg viewBox="0 0 60 20" className={`w-full h-6 ${className}`}>
      <polyline
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        points={points}
        className="text-blue-500 dark:text-blue-400"
      />
    </svg>
  );
}