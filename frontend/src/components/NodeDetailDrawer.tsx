import { X } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface NodeDetailDrawerProps {
  node: {
    name: string;
    status: string;
    firmware: string;
    lastSeen: string;
    waterLevel: string;
    signalStrength: string;
  } | null;
  isOpen: boolean;
  onClose: () => void;
}

export function NodeDetailDrawer({ node, isOpen, onClose }: NodeDetailDrawerProps) {
  if (!isOpen || !node) return null;

  // Sample chart data for Andheri-Sub-01
  const chartData = [
    { time: '17:55', value: 12.0 },
    { time: '17:56', value: 12.5 },
    { time: '17:57', value: 13.2 },
    { time: '17:58', value: 13.8 },
    { time: '17:59', value: 14.0 },
    { time: '18:00', value: 14.5 },
    { time: '18:01', value: 15.2 },
    { time: '18:02', value: 16.0 },
    { time: '18:03', value: 16.5 },
    { time: '18:04', value: 17.0 },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Online': return '#0EA5A4';
      case 'Maintenance': return '#F59E0B';
      case 'Offline': return '#94A3B8';
      default: return '#E2E8F0';
    }
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-40"
        style={{ background: 'rgba(0, 0, 0, 0.5)' }}
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div
        className="fixed top-0 right-0 z-50 h-full overflow-y-auto"
        style={{
          width: '480px',
          background: '#0B1220',
          borderLeft: '1px solid rgba(226, 232, 240, 0.1)',
          boxShadow: '-4px 0 24px rgba(0, 0, 0, 0.3)',
        }}
      >
        {/* Header */}
        <div 
          className="flex items-center justify-between p-6"
          style={{ borderBottom: '1px solid rgba(226, 232, 240, 0.1)' }}
        >
          <h2 style={{ color: '#E2E8F0', fontSize: '20px', fontWeight: '600' }}>Node Details</h2>
          <button
            onClick={onClose}
            className="p-2 transition-all rounded-lg hover:bg-opacity-10"
            style={{ background: 'rgba(226, 232, 240, 0.05)' }}
          >
            <X size={20} style={{ color: '#E2E8F0' }} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Node Info */}
          <div>
            <h3 style={{ color: '#E2E8F0', fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>
              {node.name}
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p style={{ color: '#E2E8F0', opacity: 0.6, fontSize: '12px', marginBottom: '4px' }}>Status</p>
                <span
                  className="inline-block px-2 py-1 rounded text-xs"
                  style={{
                    background: `${getStatusColor(node.status)}20`,
                    color: getStatusColor(node.status),
                    border: `1px solid ${getStatusColor(node.status)}40`,
                  }}
                >
                  {node.status}
                </span>
              </div>
              <div>
                <p style={{ color: '#E2E8F0', opacity: 0.6, fontSize: '12px', marginBottom: '4px' }}>Firmware</p>
                <p style={{ color: '#E2E8F0' }}>{node.firmware}</p>
              </div>
              <div>
                <p style={{ color: '#E2E8F0', opacity: 0.6, fontSize: '12px', marginBottom: '4px' }}>Last Seen</p>
                <p style={{ color: '#E2E8F0' }}>{node.lastSeen}</p>
              </div>
              <div>
                <p style={{ color: '#E2E8F0', opacity: 0.6, fontSize: '12px', marginBottom: '4px' }}>Signal</p>
                <p style={{ color: '#E2E8F0' }}>{node.signalStrength}</p>
              </div>
            </div>
          </div>

          {/* Water Level Chart */}
          <div>
            <h3 style={{ color: '#E2E8F0', fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>
              Water Level Trend
            </h3>
            <div 
              className="p-4 rounded-lg"
              style={{ background: 'rgba(15, 23, 36, 0.5)', border: '1px solid rgba(226, 232, 240, 0.1)' }}
            >
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(226, 232, 240, 0.1)" />
                  <XAxis 
                    dataKey="time" 
                    stroke="#E2E8F0" 
                    style={{ fontSize: '12px', opacity: 0.6 }}
                  />
                  <YAxis 
                    stroke="#E2E8F0" 
                    style={{ fontSize: '12px', opacity: 0.6 }}
                    label={{ value: 'cm', angle: -90, position: 'insideLeft', fill: '#E2E8F0', opacity: 0.6 }}
                  />
                  <Tooltip
                    contentStyle={{
                      background: '#0B1220',
                      border: '1px solid #0EA5A4',
                      borderRadius: '8px',
                      color: '#E2E8F0',
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#0EA5A4" 
                    strokeWidth={2}
                    dot={{ fill: '#0EA5A4', r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Current Reading */}
          <div 
            className="p-4 rounded-lg"
            style={{ background: 'rgba(14, 165, 164, 0.1)', border: '1px solid rgba(14, 165, 164, 0.3)' }}
          >
            <p style={{ color: '#E2E8F0', opacity: 0.8, fontSize: '14px', marginBottom: '4px' }}>Current Water Level</p>
            <p style={{ color: '#0EA5A4', fontSize: '32px', fontWeight: '600', lineHeight: '1.2' }}>
              {node.waterLevel}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
