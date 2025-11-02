import { useState } from 'react';
import { AlertTriangle, CheckCircle, Twitter, Send } from 'lucide-react';
import { Button } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { toast } from 'sonner@2.0.3';

interface Alert {
  id: string;
  severity: 'Critical' | 'Warning';
  nodeId: string;
  image: string;
  timestamp: string;
  acknowledged: boolean;
}

interface AlertsPanelProps {
  alerts: Alert[];
  onAcknowledge: (id: string) => void;
}

export function AlertsPanel({ alerts, onAcknowledge }: AlertsPanelProps) {
  const [imageModal, setImageModal] = useState<string | null>(null);

  const getSeverityStyle = (severity: string) => {
    if (severity === 'Critical') {
      return { bg: 'rgba(239, 68, 68, 0.15)', text: '#EF4444', border: 'rgba(239, 68, 68, 0.3)' };
    }
    return { bg: 'rgba(245, 158, 11, 0.15)', text: '#F59E0B', border: 'rgba(245, 158, 11, 0.3)' };
  };

  const handleAcknowledge = (id: string) => {
    onAcknowledge(id);
    toast.success('Alert acknowledged ✓', {
      style: {
        background: '#0B1220',
        color: '#E2E8F0',
        border: '1px solid #10B981',
      },
    });
  };

  const handleTelegram = (nodeId: string) => {
    toast.info(`Telegram notification queued for ${nodeId}`, {
      style: {
        background: '#0B1220',
        color: '#E2E8F0',
        border: '1px solid #0EA5A4',
      },
    });
  };

  const handleTwitter = (nodeId: string) => {
    toast.info(`Twitter notification queued for ${nodeId}`, {
      style: {
        background: '#0B1220',
        color: '#E2E8F0',
        border: '1px solid #0EA5A4',
      },
    });
  };

  return (
    <>
      <div 
        className="p-4 rounded-lg"
        style={{ background: '#0B1220', border: '1px solid rgba(226, 232, 240, 0.1)' }}
      >
        <h3 style={{ color: '#E2E8F0', fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>
          Active Alerts ({alerts.filter(a => !a.acknowledged).length})
        </h3>

        <div className="space-y-3">
          {alerts.map((alert) => {
            const style = getSeverityStyle(alert.severity);
            return (
              <div
                key={`alert-${alert.id}`}
                className="p-3 rounded-lg"
                style={{ background: 'rgba(15, 23, 36, 0.5)', border: '1px solid rgba(226, 232, 240, 0.1)' }}
              >
                {/* Alert Header */}
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <AlertTriangle size={16} style={{ color: style.text }} />
                    <span
                      className="inline-block px-2 py-0.5 rounded text-xs"
                      style={{
                        background: style.bg,
                        color: style.text,
                        border: `1px solid ${style.border}`,
                      }}
                    >
                      {alert.severity}
                    </span>
                  </div>
                  <span style={{ color: '#E2E8F0', opacity: 0.6, fontSize: '12px' }}>
                    {alert.timestamp}
                  </span>
                </div>

                {/* Node ID */}
                <p style={{ color: '#E2E8F0', marginBottom: '8px' }}>{alert.nodeId}</p>

                {/* Image */}
                <div 
                  className="mb-3 overflow-hidden rounded cursor-pointer"
                  onClick={() => setImageModal(alert.image)}
                  style={{ height: '120px' }}
                >
                  <ImageWithFallback
                    src={alert.image}
                    alt={`Alert from ${alert.nodeId}`}
                    className="object-cover w-full h-full"
                  />
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-2">
                  <Button
                    onClick={() => handleAcknowledge(alert.id)}
                    disabled={alert.acknowledged}
                    size="sm"
                    style={{
                      background: alert.acknowledged ? 'rgba(16, 185, 129, 0.15)' : '#0EA5A4',
                      color: alert.acknowledged ? '#10B981' : '#0F1724',
                      border: alert.acknowledged ? '1px solid rgba(16, 185, 129, 0.3)' : 'none',
                    }}
                  >
                    {alert.acknowledged ? (
                      <>
                        <CheckCircle size={14} className="mr-1" />
                        Acknowledged
                      </>
                    ) : (
                      'Acknowledge'
                    )}
                  </Button>
                  <Button
                    onClick={() => handleTelegram(alert.nodeId)}
                    variant="outline"
                    size="sm"
                    style={{
                      background: 'transparent',
                      color: '#E2E8F0',
                      border: '1px solid rgba(226, 232, 240, 0.2)',
                    }}
                  >
                    <Send size={14} className="mr-1" />
                    Telegram
                  </Button>
                  <Button
                    onClick={() => handleTwitter(alert.nodeId)}
                    variant="outline"
                    size="sm"
                    style={{
                      background: 'transparent',
                      color: '#E2E8F0',
                      border: '1px solid rgba(226, 232, 240, 0.2)',
                    }}
                  >
                    <Twitter size={14} className="mr-1" />
                    Twitter
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Image Modal */}
      {imageModal && (
        <>
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-8"
            style={{ background: 'rgba(0, 0, 0, 0.8)' }}
            onClick={() => setImageModal(null)}
          >
            <div className="relative max-w-4xl max-h-full">
              <ImageWithFallback
                src={imageModal}
                alt="Alert enlarged"
                className="object-contain w-full h-full rounded-lg"
              />
            </div>
          </div>
        </>
      )}
    </>
  );
}
