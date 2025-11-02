import { ErrorBoundary } from './components/ErrorBoundary';
import { ConnectionStatus } from './components/ConnectionStatus';
import { logger } from './utils/logger';
import { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { KPICard } from './components/KPICard';
import { NodeDetailDrawer } from './components/NodeDetailDrawer';
import { MobileNav } from './components/MobileNav';
import { Sparkline } from './components/Sparkline';
import { DashboardPage } from './components/pages/DashboardPage';
import { NodesPage } from './components/pages/NodesPage';
import { AlertsPage } from './components/pages/AlertsPage';
import { LogsPage } from './components/pages/LogsPage';
import { SettingsPage } from './components/pages/SettingsPage';
import { RefreshCw } from 'lucide-react';
import { Switch } from './components/ui/switch';
import { Toaster } from './components/ui/sonner';

export default function App() {
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [selectedNode, setSelectedNode] = useState<any | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Dummy data - Nodes
  const nodes = [
    { id: '1', name: 'Andheri-Sub-01', status: 'Online' as const, firmware: 'v1.3.2', lastSeen: '2025-10-31 18:02 IST', waterLevel: '14.2 cm', signalStrength: '-46 dBm' },
    { id: '2', name: 'Colaba-Quay-02', status: 'Online' as const, firmware: 'v1.3.0', lastSeen: '2025-10-31 18:00 IST', waterLevel: '13.8 cm', signalStrength: '-47 dBm' },
    { id: '3', name: 'Parel-Bridge-03', status: 'Maintenance' as const, firmware: 'v1.2.8', lastSeen: '2025-10-31 11:22 IST', waterLevel: '11.5 cm', signalStrength: '-52 dBm' },
    { id: '4', name: 'Dadar-Drain-04', status: 'Offline' as const, firmware: 'v1.2.5', lastSeen: '2025-10-31 04:12 IST', waterLevel: '10.2 cm', signalStrength: '-58 dBm' },
    { id: '5', name: 'Andheri-Sub-02', status: 'Online' as const, firmware: 'v1.3.2', lastSeen: '2025-10-31 18:03 IST', waterLevel: '14.0 cm', signalStrength: '-46 dBm' },
    { id: '6', name: 'Bandra-Promenade-05', status: 'Online' as const, firmware: 'v1.3.1', lastSeen: '2025-10-31 17:59 IST', waterLevel: '13.6 cm', signalStrength: '-49 dBm' },
    { id: '7', name: 'Elephanta-Old-06', status: 'Online' as const, firmware: 'v1.3.0', lastSeen: '2025-10-31 17:55 IST', waterLevel: '12.9 cm', signalStrength: '-50 dBm' },
    { id: '8', name: 'Goregaon-Sewage-07', status: 'Offline' as const, firmware: 'v1.1.9', lastSeen: '2025-10-31 09:02 IST', waterLevel: '9.8 cm', signalStrength: '-60 dBm' },
    { id: '9', name: 'Malad-Lake-08', status: 'Online' as const, firmware: 'v1.3.2', lastSeen: '2025-10-31 18:04 IST', waterLevel: '15.0 cm', signalStrength: '-44 dBm' },
    { id: '10', name: 'Vashi-Underpass-09', status: 'Maintenance' as const, firmware: 'v1.2.9', lastSeen: '2025-10-31 10:15 IST', waterLevel: '11.0 cm', signalStrength: '-53 dBm' },
  ];

  // Dummy data - Alerts
  const [alerts, setAlerts] = useState([
    {
      id: 'alert-1',
      severity: 'Critical' as const,
      nodeId: 'Andheri-Sub-01',
      image: 'https://images.unsplash.com/photo-1761252986819-eca07a0eeb91?w=800',
      timestamp: '2025-10-31 18:02 IST',
      acknowledged: false,
    },
    {
      id: 'alert-2',
      severity: 'Warning' as const,
      nodeId: 'Malad-Lake-08',
      image: 'https://images.unsplash.com/photo-1761252986819-eca07a0eeb91?w=800',
      timestamp: '2025-10-31 17:59 IST',
      acknowledged: false,
    },
  ]);

  // Dummy data - Logs
  const logs = [
    { timestamp: '18:01', type: 'INFO' as const, message: 'Gateway: Node ping successful' },
    { timestamp: '18:02', type: 'WARN' as const, message: 'Node Andheri-Sub-01: Water level high (WARN)' },
    { timestamp: '18:03', type: 'INFO' as const, message: 'API: Alert dispatched (INFO)' },
    { timestamp: '18:04', type: 'ERROR' as const, message: 'Node Goregaon-Sewage-07 offline (ERROR)' },
    { timestamp: '18:05', type: 'INFO' as const, message: 'System heartbeat OK (INFO)' },
  ];

  // KPI sparkline data
  const nodesOnlineSparkline = [6, 6, 7, 7, 6, 7, 7, 7];
  const alertsSparkline = [1, 2, 1, 3, 2, 2, 1, 2];
  const latencySparkline = [42, 45, 43, 46, 44, 43, 45, 42];
  const telemetrySparkline = [89, 91, 88, 90, 92, 90, 91, 90];

  const handleNodeClick = (node: any) => {
    setSelectedNode(node);
    setIsDrawerOpen(true);
  };

  const handleAcknowledge = (id: string) => {
    setAlerts(alerts.map(alert => 
      alert.id === id ? { ...alert, acknowledged: true } : alert
    ));
  };

  const onlineNodes = nodes.filter(n => n.status === 'Online').length;
  const activeAlerts = alerts.filter(a => !a.acknowledged).length;

  // Responsive check
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="dark">
      <div
        className="flex h-screen overflow-hidden"
        style={{ background: '#0F1724', color: '#E2E8F0', fontFamily: 'Inter, system-ui, sans-serif' }}
      >
        <Toaster />

        {/* Desktop Sidebar */}
        {!isMobile && (
          <Sidebar activeMenu={activeMenu} onMenuChange={setActiveMenu} />
        )}

        {/* Main Content */}
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Mobile Header */}
          {isMobile && (
            <div
              className="flex items-center gap-3 px-4 py-4"
              style={{ background: '#0B1220', borderBottom: '1px solid rgba(226, 232, 240, 0.1)' }}
            >
              <div
                className="flex items-center justify-center rounded-lg"
                style={{ width: '32px', height: '32px', background: '#0EA5A4' }}
              >
                <span style={{ color: '#0F1724', fontSize: '18px' }}>🌊</span>
              </div>
              <span style={{ color: '#E2E8F0', fontSize: '16px', fontWeight: '600' }}>
                Flood-Safe Mumbai
              </span>
            </div>
          )}

          {/* Top Header - KPI Cards (shown on all pages) */}
          {activeMenu === 'dashboard' && (
            <div
              className="px-4 py-4 md:px-6 md:py-6"
              style={{ borderBottom: '1px solid rgba(226, 232, 240, 0.1)' }}
            >
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <KPICard
                  title="Nodes Online"
                  value={`${onlineNodes}/${nodes.length}`}
                  sparklineData={nodesOnlineSparkline}
                  trend="neutral"
                />
                <KPICard
                  title="Active Alerts"
                  value={activeAlerts}
                  sparklineData={alertsSparkline}
                  trend="down"
                />
                <KPICard
                  title="Avg Network Latency"
                  value="43ms"
                  sparklineData={latencySparkline}
                  trend="up"
                />
              </div>
            </div>
          )}

          {/* Main Content Area - Page Router */}
          <div className="flex-1 overflow-auto">
            {activeMenu === 'dashboard' && (
              <DashboardPage
                nodes={nodes}
                alerts={alerts}
                logs={logs}
                onNodeClick={handleNodeClick}
                onAcknowledge={handleAcknowledge}
                isMobile={isMobile}
              />
            )}
            {activeMenu === 'nodes' && (
              <NodesPage
                nodes={nodes}
                onNodeClick={handleNodeClick}
              />
            )}
            {activeMenu === 'alerts' && (
              <AlertsPage
                alerts={alerts}
                onAcknowledge={handleAcknowledge}
              />
            )}
            {activeMenu === 'logs' && (
              <LogsPage logs={logs} />
            )}
            {activeMenu === 'settings' && (
              <SettingsPage />
            )}
          </div>

          {/* Footer */}
          <div
            className={`px-4 py-3 md:px-6 md:py-4 ${isMobile ? 'pb-20' : ''}`}
            style={{ borderTop: '1px solid rgba(226, 232, 240, 0.1)', background: '#0B1220' }}
          >
            <div className="flex flex-col items-start justify-between gap-3 md:flex-row md:items-center">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={autoRefresh}
                    onCheckedChange={setAutoRefresh}
                  />
                  <span style={{ color: '#E2E8F0', fontSize: '14px', opacity: 0.8 }}>
                    Auto-refresh
                  </span>
                  {autoRefresh && (
                    <RefreshCw
                      size={14}
                      style={{ color: '#0EA5A4' }}
                      className="animate-spin"
                    />
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span style={{ color: '#E2E8F0', fontSize: '14px', opacity: 0.6 }}>
                    Last updated: 2025-10-31 18:05 IST
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span style={{ color: '#E2E8F0', fontSize: '12px', opacity: 0.6 }}>
                  System health
                </span>
                <Sparkline data={telemetrySparkline} width={60} height={16} color="#10B981" />
                <span style={{ color: '#10B981', fontSize: '12px' }}>90%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Node Detail Drawer */}
        <NodeDetailDrawer
          node={selectedNode}
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
        />

        {/* Mobile Bottom Nav */}
        {isMobile && (
          <MobileNav activeMenu={activeMenu} onMenuChange={setActiveMenu} />
        )}
      </div>
    </div>
  );
}
