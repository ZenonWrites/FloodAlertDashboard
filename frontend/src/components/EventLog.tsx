import { Info, AlertCircle, XCircle } from 'lucide-react';

interface LogEntry {
  timestamp: string;
  type: 'INFO' | 'WARN' | 'ERROR';
  message: string;
}

interface EventLogProps {
  logs: LogEntry[];
}

export function EventLog({ logs }: EventLogProps) {
  const getLogStyle = (type: string) => {
    switch (type) {
      case 'INFO':
        return { icon: Info, color: '#0EA5A4' };
      case 'WARN':
        return { icon: AlertCircle, color: '#F59E0B' };
      case 'ERROR':
        return { icon: XCircle, color: '#EF4444' };
      default:
        return { icon: Info, color: '#E2E8F0' };
    }
  };

  return (
    <div 
      className="p-4 rounded-lg"
      style={{ background: '#0B1220', border: '1px solid rgba(226, 232, 240, 0.1)' }}
    >
      <h3 style={{ color: '#E2E8F0', fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>
        Event Log
      </h3>
      <div className="space-y-2">
        {logs.map((log, index) => {
          const style = getLogStyle(log.type);
          const Icon = style.icon;
          return (
            <div
              key={index}
              className="flex items-start gap-3 p-2 rounded transition-all"
              style={{ background: 'rgba(15, 23, 36, 0.3)' }}
            >
              <Icon size={16} style={{ color: style.color, marginTop: '2px', flexShrink: 0 }} />
              <div className="flex-1 min-w-0">
                <span style={{ color: '#E2E8F0', opacity: 0.6, fontSize: '12px', marginRight: '8px' }}>
                  {log.timestamp}
                </span>
                <span style={{ color: '#E2E8F0', fontSize: '14px' }}>
                  {log.message}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
