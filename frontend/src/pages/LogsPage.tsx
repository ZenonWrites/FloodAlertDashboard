import { useState, useEffect } from 'react';
import { EventLog } from '../types/api';
import EventLogEntry from '../ui/EventLog';

const API_BASE_URL = 'http://127.0.0.1:8000/api/v1';

export default function LogsPage() {
  const [logs, setLogs] = useState<EventLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setError(null);
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/logs/events`);
        if (!response.ok) throw new Error('Failed to fetch event logs');
        const data: EventLog[] = await response.json();
        setLogs(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
    const interval = setInterval(fetchLogs, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="logs-page-container">
      <h3>System Logs</h3>
      <div className="event-stream-container">
        {loading && <p>Loading logs...</p>}
        {error && <p>Error: {error}</p>}
        {!loading && !error && logs.length === 0 && <p>No log entries found.</p>}
        
        {logs.map(log => (
          <EventLogEntry key={log.log_id} log={log} />
        ))}
      </div>
    </div>
  );
}
