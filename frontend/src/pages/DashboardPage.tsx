import { useState, useEffect } from 'react';
import { SystemStatus, NodeWithLatestReading, Alert } from '../types/api';
import KPICard from '../ui/KPICard';
import AlertsPanel from '../ui/AlertsPanel';
import DeviceTable from '../ui/DeviceTable';

const API_BASE_URL = 'http://127.0.0.1:8000/api/v1';

export default function DashboardPage() {
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null);
  const [nodes, setNodes] = useState<NodeWithLatestReading[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setError(null);
      
      const [statusRes, nodesRes, alertsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/system/status`),
        fetch(`${API_BASE_URL}/nodes`),
        fetch(`${API_BASE_URL}/alerts`)
      ]);

      if (!statusRes.ok || !nodesRes.ok || !alertsRes.ok) {
        throw new Error('Failed to fetch dashboard data');
      }

      const statusData: SystemStatus = await statusRes.json();
      const nodesData: NodeWithLatestReading[] = await nodesRes.json();
      const allAlerts: Alert[] = await alertsRes.json();
      
      setSystemStatus(statusData);
      setNodes(nodesData);
      setAlerts(allAlerts.filter(alert => !alert.is_acknowledged));

    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleAcknowledgeAlert = async (alertId: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/alerts/${alertId}/ack`, {
        method: 'POST',
      });
      if (!response.ok) throw new Error('Failed to acknowledge alert');
      fetchData();
    } catch (err) {
      console.error(err);
      setError((err as Error).message);
    }
  };

  if (loading && !systemStatus) {
    return <div className="loading-pane">Loading Dashboard...</div>;
  }

  if (error) {
    return <div className="error-pane">Error: {error}</div>;
  }
  
  return (
    <div className="dashboard-container">
      <div className="kpi-grid">
        <KPICard 
          title="Nodes Online" 
          value={systemStatus ? `${systemStatus.nodes_online} / ${systemStatus.nodes_total}` : '...'} 
        />
        <KPICard 
          title="Active Alerts" 
          value={systemStatus ? systemStatus.active_alerts.toString() : '...'} 
        />
        <KPICard 
          title="Avg Network Latency" 
          value={systemStatus ? `${systemStatus.avg_network_latency_ms}ms` : '...'} 
        />
      </div>

      <div className="main-content-grid">
        <div className="device-management-section">
          <h3>Device Management</h3>
          <DeviceTable nodes={nodes} /> 
        </div>
        <div className="active-alerts-section">
          <h3>Active Alerts</h3>
          <AlertsPanel 
            alerts={alerts} 
            onAcknowledge={handleAcknowledgeAlert} 
          />
        </div>
      </div>
    </div>
  );
}
