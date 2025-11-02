import { NodeDetail } from '../types/api';
import Sparkline from './Sparkline';

interface NodeDetailDrawerProps {
  node: NodeDetail | null;
  loading: boolean;
  onClose: () => void;
}

export default function NodeDetailDrawer({ node, loading, onClose }: NodeDetailDrawerProps) {
  if (!node && !loading) return null;

  return (
    <div className={`node-detail-drawer ${node || loading ? 'open' : ''}`}>
      <button onClick={onClose} className="close-drawer-btn">×</button>
      
      {loading && <p>Loading node details...</p>}
      
      {!loading && node && (
        <div className="drawer-content">
          <h3>{node.name}</h3>
          <span className="node-id-label">{node.node_id}</span>
          
          <div className="node-vitals">
            <p><strong>Status:</strong> {node.status}</p>
            <p><strong>Firmware:</strong> {node.firmware_version}</p>
            <p><strong>Last Ping:</strong> {new Date(node.last_ping).toLocaleString()}</p>
            <p><strong>Location:</strong> {node.location_desc}</p>
          </div>
          
          <h4>Recent Water Level (cm)</h4>
          <div className="sparkline-container">
            <Sparkline 
              data={node.recent_readings.map(r => r.water_level_cm).reverse()}
            />
          </div>

          <h4>Recent Readings</h4>
          <ul className="readings-list">
            {node.recent_readings.map(reading => (
              <li key={reading.reading_id}>
                <span>{new Date(reading.timestamp).toLocaleString()}:</span>
                <span>{reading.water_level_cm.toFixed(1)} cm</span>
                <span>{reading.signal_strength_dbm} dBm</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
