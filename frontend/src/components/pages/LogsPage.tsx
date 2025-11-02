import { useState } from 'react';
import { Info, AlertCircle, XCircle, Filter, Download } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

interface LogsPageProps {
  logs: any[];
}

export function LogsPage({ logs }: LogsPageProps) {
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLogs = logs.filter(log => {
    const matchesType = filterType === 'all' || log.type === filterType;
    const matchesSearch = log.message.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const getLogStyle = (type: string) => {
    switch (type) {
      case 'INFO':
        return { icon: Info, color: '#0EA5A4', bg: 'rgba(14, 165, 164, 0.1)' };
      case 'WARN':
        return { icon: AlertCircle, color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.1)' };
      case 'ERROR':
        return { icon: XCircle, color: '#EF4444', bg: 'rgba(239, 68, 68, 0.1)' };
      default:
        return { icon: Info, color: '#E2E8F0', bg: 'rgba(226, 232, 240, 0.1)' };
    }
  };

  return (
    <div className="p-4 md:p-6">
      <div className="space-y-4">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 style={{ color: '#E2E8F0', fontSize: '24px', fontWeight: '600' }}>System Logs</h1>
            <p style={{ color: '#E2E8F0', opacity: 0.6, marginTop: '4px' }}>
              Real-time event monitoring and troubleshooting
            </p>
          </div>
          <Button
            style={{
              background: '#0EA5A4',
              color: '#0F1724',
            }}
          >
            <Download size={16} className="mr-2" />
            Export Logs
          </Button>
        </div>

        {/* Log Stats */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {[
            { label: 'Total Events', value: logs.length, color: '#E2E8F0' },
            { label: 'Info', value: logs.filter(l => l.type === 'INFO').length, color: '#0EA5A4' },
            { label: 'Warnings', value: logs.filter(l => l.type === 'WARN').length, color: '#F59E0B' },
            { label: 'Errors', value: logs.filter(l => l.type === 'ERROR').length, color: '#EF4444' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="p-4 rounded-lg"
              style={{ background: '#0B1220', border: '1px solid rgba(226, 232, 240, 0.1)' }}
            >
              <p style={{ color: '#E2E8F0', opacity: 0.6, fontSize: '12px' }}>{stat.label}</p>
              <p style={{ color: stat.color, fontSize: '28px', fontWeight: '600', marginTop: '4px' }}>
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div 
          className="p-4 rounded-lg"
          style={{ background: '#0B1220', border: '1px solid rgba(226, 232, 240, 0.1)' }}
        >
          <div className="flex items-center gap-2 mb-3">
            <Filter size={16} style={{ color: '#0EA5A4' }} />
            <span style={{ color: '#E2E8F0', fontWeight: '600' }}>Filters</span>
          </div>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <Input
              placeholder="Search logs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                background: '#0F1724',
                color: '#E2E8F0',
                border: '1px solid rgba(226, 232, 240, 0.2)',
              }}
            />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 rounded-lg outline-none"
              style={{ background: '#0F1724', color: '#E2E8F0', border: '1px solid rgba(226, 232, 240, 0.2)' }}
            >
              <option value="all">All Types</option>
              <option value="INFO">Info</option>
              <option value="WARN">Warning</option>
              <option value="ERROR">Error</option>
            </select>
            <Button
              variant="outline"
              onClick={() => {
                setFilterType('all');
                setSearchQuery('');
              }}
              style={{
                background: 'transparent',
                color: '#E2E8F0',
                border: '1px solid rgba(226, 232, 240, 0.2)',
              }}
            >
              Clear Filters
            </Button>
          </div>
        </div>

        {/* Logs List */}
        <div 
          className="rounded-lg"
          style={{ background: '#0B1220', border: '1px solid rgba(226, 232, 240, 0.1)' }}
        >
          <div className="p-4">
            <h3 style={{ color: '#E2E8F0', fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>
              Event Stream
            </h3>
            <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2">
              {filteredLogs.map((log, index) => {
                const style = getLogStyle(log.type);
                const Icon = style.icon;
                return (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 rounded-lg transition-all"
                    style={{ background: style.bg, border: `1px solid ${style.color}40` }}
                  >
                    <div
                      className="flex items-center justify-center rounded flex-shrink-0"
                      style={{ 
                        width: '32px', 
                        height: '32px', 
                        background: `${style.color}20`,
                        border: `1px solid ${style.color}40`
                      }}
                    >
                      <Icon size={16} style={{ color: style.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className="inline-block px-2 py-0.5 rounded text-xs"
                          style={{
                            background: `${style.color}30`,
                            color: style.color,
                            border: `1px solid ${style.color}50`,
                          }}
                        >
                          {log.type}
                        </span>
                        <span style={{ color: '#E2E8F0', opacity: 0.6, fontSize: '12px' }}>
                          {log.timestamp}
                        </span>
                      </div>
                      <p style={{ color: '#E2E8F0', fontSize: '14px' }}>
                        {log.message}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          {filteredLogs.length === 0 && (
            <div className="py-12 text-center">
              <p style={{ color: '#E2E8F0', opacity: 0.6 }}>No logs found matching the filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
