import { DeviceTable } from '../DeviceTable';
import { AlertsPanel } from '../AlertsPanel';
import { EventLog } from '../EventLog';

interface DashboardPageProps {
  nodes: any[];
  alerts: any[];
  logs: any[];
  onNodeClick: (node: any) => void;
  onAcknowledge: (id: string) => void;
  isMobile: boolean;
}

export function DashboardPage({ 
  nodes, 
  alerts, 
  logs, 
  onNodeClick, 
  onAcknowledge,
  isMobile 
}: DashboardPageProps) {
  return (
    <div className="p-4 md:p-6">
      {isMobile ? (
        // Mobile Layout - Stacked
        <div className="space-y-6 pb-20">
          <AlertsPanel alerts={alerts} onAcknowledge={onAcknowledge} />
          <div>
            <DeviceTable nodes={nodes} onRowClick={onNodeClick} />
          </div>
          <EventLog logs={logs} />
        </div>
      ) : (
        // Desktop Layout - Grid
        <div className="grid grid-cols-12 gap-6">
          {/* Main Device Table */}
          <div className="col-span-8">
            <DeviceTable nodes={nodes} onRowClick={onNodeClick} />
          </div>

          {/* Right Sidebar - Alerts & Logs */}
          <div className="col-span-4 space-y-6">
            <AlertsPanel alerts={alerts} onAcknowledge={onAcknowledge} />
            <EventLog logs={logs} />
          </div>
        </div>
      )}
    </div>
  );
}
