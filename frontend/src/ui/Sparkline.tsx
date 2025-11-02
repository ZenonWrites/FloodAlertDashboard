interface SparklineProps {
  data: number[];
  width?: number;
  height?: number;
  strokeColor?: string;
  fillColor?: string;
}

export default function Sparkline({
  data,
  width = 200,
  height = 50,
  strokeColor = "#007bff",
  fillColor = "rgba(0, 123, 255, 0.1)"
}: SparklineProps) {
  
  if (data.length < 2) {
    return <div style={{ width, height, lineHeight: `${height}px`, textAlign: 'center' }}>Not enough data</div>;
  }

  const maxVal = Math.max(...data);
  const minVal = Math.min(...data);
  const valRange = maxVal - minVal;

  const getPointY = (val: number) => {
    if (valRange === 0) return height / 2; // Flat line
    return height - ((val - minVal) / valRange) * height;
  };

  const points = data.map((val, index) => {
    const x = (index / (data.length - 1)) * width;
    const y = getPointY(val);
    return `${x},${y}`;
  }).join(" ");

  // Path for the fill area
  const pathD = `M${points} L${width},${height} 0,${height} Z`;

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
      <path d={pathD} fill={fillColor} />
      <polyline
        fill="none"
        stroke={strokeColor}
        strokeWidth="2"
        points={points}
      />
    </svg>
  );
}
