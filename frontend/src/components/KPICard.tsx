import { Sparkline } from './Sparkline';

interface KPICardProps {
  title: string;
  value: string | number;
  sparklineData?: number[];
  trend?: 'up' | 'down' | 'neutral';
}

export function KPICard({ title, value, sparklineData, trend }: KPICardProps) {
  const trendColor = trend === 'up' ? '#10B981' : trend === 'down' ? '#EF4444' : '#E2E8F0';
  
  return (
    <div className="px-4 py-3 rounded-lg" style={{ background: '#0B1220' }}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <p className="text-xs opacity-70" style={{ color: '#E2E8F0' }}>{title}</p>
          <p className="mt-1" style={{ color: '#E2E8F0', fontSize: '24px', fontWeight: '600', lineHeight: '1.2' }}>
            {value}
          </p>
        </div>
        {sparklineData && (
          <div className="flex-shrink-0 mt-1">
            <Sparkline data={sparklineData} width={60} height={20} color={trendColor} showTooltip />
          </div>
        )}
      </div>
    </div>
  );
}
