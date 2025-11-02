import { useState, useEffect, useCallback } from 'react';
import { Alert } from '../types/api';
import AlertsPanel from '../ui/AlertsPanel';

const API_BASE_URL = 'http://127.0.0.1:8000/api/v1';

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAlerts = useCallback(async () => {
    try {
      setError(null);
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/alerts`);
      if (!response.ok) throw new Error('Failed to fetch alerts');
      const data: Alert[] = await response.json();
      
      // Sort to show unacknowledged first, then by date
      data.sort((a, b) => {
        if (a.is_acknowledged === b.is_acknowledged) {
          return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
        }
        return a.is_acknowledged ? 1 : -1;
      });
      
      setAlerts(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 30000);
    return () => clearInterval(interval);
  }, [fetchAlerts]);

  const handleAcknowledgeAlert = async (alertId: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/alerts/${alertId}/ack`, {
        method: 'POST',
      });
      if (!response.ok) throw new Error('Failed to acknowledge alert');
      fetchAlerts();
    } catch (err) {
      console.error(err);
      setError((err as Error).message);
    }
  };

  return (
    <div className="alerts-page-container">
      <h3>Alerts Management</h3>
      {loading ? (
        <p>Loading alerts...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : (
        <AlertsPanel 
          alerts={alerts} 
          onAcknowledge={handleAcknowledgeAlert}
          showAcknowledged={true}
        />
      )}
    </div>
  );
}
