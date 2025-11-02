import { useState } from 'react';
import { AlertTriangle, CheckCircle, Twitter, Send, Clock } from 'lucide-react';
import { Button } from '../ui/button';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { toast } from 'sonner@2.0.3';

interface AlertsPageProps {
  alerts: any[];
  onAcknowledge: (id: string) => void;
}

export function AlertsPage({ alerts, onAcknowledge }: AlertsPageProps) {
  const [imageModal, setImageModal] = useState<string | null>(null);
  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredAlerts = alerts.filter(alert => {
    const matchesSeverity = filterSeverity === 'all' || alert.severity === filterSeverity;
    const matchesStatus = filterStatus === 'all' || 
      (filterStatus === 'acknowledged' && alert.acknowledged) ||
      (filterStatus === 'unacknowledged' && !alert.acknowledged);
    return matchesSeverity && matchesStatus;
  });

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
      <div className="p-4 md:p-6">
        <div className="space-y-4">
          {/* Page Header */}
          <div>
            <h1 style={{ color: '#E2E8F0', fontSize: '24px', fontWeight: '600' }}>Alerts Management</h1>
            <p style={{ color: '#E2E8F0', opacity: 0.6, marginTop: '4px' }}>
              Monitor and respond to system alerts
            </p>
          </div>

          {/* Alert Stats */}
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {[
              { label: 'Total Alerts', value: alerts.length, color: '#E2E8F0' },
              { label: 'Unacknowledged', value: alerts.filter(a => !a.acknowledged).length, color: '#EF4444' },
              { label: 'Acknowledged', value: alerts.filter(a => a.acknowledged).length, color: '#10B981' },
              { label: 'Critical', value: alerts.filter(a => a.severity === 'Critical').length, color: '#EF4444' },
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
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              <select
                value={filterSeverity}
                onChange={(e) => setFilterSeverity(e.target.value)}
                className="px-3 py-2 rounded-lg outline-none"
                style={{ background: '#0F1724', color: '#E2E8F0', border: '1px solid rgba(226, 232, 240, 0.2)' }}
              >
                <option value="all">All Severities</option>
                <option value="Critical">Critical</option>
                <option value="Warning">Warning</option>
              </select>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 rounded-lg outline-none"
                style={{ background: '#0F1724', color: '#E2E8F0', border: '1px solid rgba(226, 232, 240, 0.2)' }}
              >
                <option value="all">All Status</option>
                <option value="unacknowledged">Unacknowledged</option>
                <option value="acknowledged">Acknowledged</option>
              </select>
              <Button
                variant="outline"
                onClick={() => {
                  setFilterSeverity('all');
                  setFilterStatus('all');
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

          {/* Alerts List */}
          <div className="space-y-4">
            {filteredAlerts.map((alert) => {
              const style = getSeverityStyle(alert.severity);
              return (
                <div
                  key={alert.id}
                  className="p-4 rounded-lg"
                  style={{ background: '#0B1220', border: '1px solid rgba(226, 232, 240, 0.1)' }}
                >
                  <div className="flex flex-col gap-4 md:flex-row">
                    {/* Alert Image */}
                    <div 
                      className="overflow-hidden rounded-lg cursor-pointer md:w-64"
                      onClick={() => setImageModal(alert.image)}
                      style={{ height: '160px' }}
                    >
                      <ImageWithFallback
                        src={alert.image}
                        alt={`Alert from ${alert.nodeId}`}
                        className="object-cover w-full h-full"
                      />
                    </div>

                    {/* Alert Details */}
                    <div className="flex-1 space-y-3">
                      {/* Header */}
                      <div className="flex flex-wrap items-center gap-3">
                        <span
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs"
                          style={{
                            background: style.bg,
                            color: style.text,
                            border: `1px solid ${style.border}`,
                          }}
                        >
                          <AlertTriangle size={14} />
                          {alert.severity}
                        </span>
                        {alert.acknowledged && (
                          <span
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs"
                            style={{
                              background: 'rgba(16, 185, 129, 0.15)',
                              color: '#10B981',
                              border: '1px solid rgba(16, 185, 129, 0.3)',
                            }}
                          >
                            <CheckCircle size={14} />
                            Acknowledged
                          </span>
                        )}
                        <span 
                          className="inline-flex items-center gap-1.5 text-xs"
                          style={{ color: '#E2E8F0', opacity: 0.6 }}
                        >
                          <Clock size={12} />
                          {alert.timestamp}
                        </span>
                      </div>

                      {/* Node Info */}
                      <div>
                        <p style={{ color: '#E2E8F0', opacity: 0.6, fontSize: '12px' }}>Node</p>
                        <p style={{ color: '#E2E8F0', fontSize: '16px', fontWeight: '600' }}>
                          {alert.nodeId}
                        </p>
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
                          Notify via Telegram
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
                          Notify via Twitter
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            {filteredAlerts.length === 0 && (
              <div 
                className="py-12 text-center rounded-lg"
                style={{ background: '#0B1220', border: '1px solid rgba(226, 232, 240, 0.1)' }}
              >
                <AlertTriangle size={48} style={{ color: '#E2E8F0', opacity: 0.3, margin: '0 auto 12px' }} />
                <p style={{ color: '#E2E8F0', opacity: 0.6 }}>No alerts found matching the filters</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {imageModal && (
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
      )}
    </>
  );
}
