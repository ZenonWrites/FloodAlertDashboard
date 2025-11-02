import { useState } from 'react';

interface SparklineProps {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
  showTooltip?: boolean;
}

export function Sparkline({ 
  data, 
  width = 80, 
  height = 24, 
  color = '#0EA5A4',
  showTooltip = false 
}: SparklineProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  if (!data || data.length === 0) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * width;
    const y = height - ((value - min) / range) * height;
    return { x, y, value };
  });

  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!showTooltip) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const index = Math.round((x / width) * (data.length - 1));
    setHoveredIndex(Math.max(0, Math.min(index, data.length - 1)));
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  return (
    <div className="relative inline-block">
      <svg
        width={width}
        height={height}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHoveredIndex(null)}
        className="cursor-crosshair"
      >
        <path
          d={pathD}
          fill="none"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {hoveredIndex !== null && (
          <circle
            cx={points[hoveredIndex].x}
            cy={points[hoveredIndex].y}
            r="2.5"
            fill={color}
          />
        )}
      </svg>
      {showTooltip && hoveredIndex !== null && (
        <div 
          className="fixed z-50 px-2 py-1 text-xs rounded pointer-events-none"
          style={{
            left: mousePos.x + 10,
            top: mousePos.y - 10,
            background: '#0B1220',
            border: '1px solid #0EA5A4',
            color: '#E2E8F0'
          }}
        >
          {data[hoveredIndex].toFixed(1)}
        </div>
      )}
    </div>
  );
}
