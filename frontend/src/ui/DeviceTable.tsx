import { NodeWithLatestReading, NodeStatus } from '../types/api';

interface DeviceTableProps {
  nodes: NodeWithLatestReading[];
  onNodeSelect?: (nodeId: string) => void;
  selectedNodeId?: string | null;
}

export default function DeviceTable({ nodes, onNodeSelect, selectedNodeId }: DeviceTableProps) {
  
  const getStatusClass = (status: NodeStatus) => {
    return status.toLowerCase();
  };

  return (
    <div className="device-table-container">
      <table>
        <thead>
          <tr>
            <th>Node ID</th>
            <th>Status</th>
            <th>Firmware</th>
            <th>Last Seen</th>
            <th>Water Level</th>
            <th>Signal</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {nodes.length === 0 ? (
            <tr>
              <td colSpan={7}>No nodes found.</td>
            </tr>
          ) : (
            nodes.map(node => (
              <tr 
                key={node.node_id} 
                className={node.node_id === selectedNodeId ? 'selected' : ''}
              >
                <td>{node.node_id}</td>
                <td>
                  <span className={`status-badge ${getStatusClass(node.status)}`}>
                    {node.status}
                  </span>
                </td>
                <td>{node.firmware_version}</td>
                <td>{new Date(node.last_ping).toLocaleString()}</td>
                <td>{node.water_level_cm?.toFixed(1) ?? 'N/A'} cm</td>
                <td>{node.signal_strength_dbm ?? 'N/A'} dBm</td>
                <td>
                  {onNodeSelect && (
                    <button 
                      className="view-details-btn" 
                      onClick={() => onNodeSelect(node.node_id)}
                    >
                      View Details
                    </button>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
