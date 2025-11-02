import { useState, useEffect, useCallback } from 'react';
import { NodeWithLatestReading, NodeDetail } from '../types/api';
import DeviceTable from '../ui/DeviceTable';
import NodeDetailDrawer from '../ui/NodeDetailDrawer';

const API_BASE_URL = 'http://127.0.0.1:8000/api/v1';

export default function NodesPage() {
  const [nodes, setNodes] = useState<NodeWithLatestReading[]>([]);
  const [selectedNode, setSelectedNode] = useState<NodeDetail | null>(null);
  const [loadingNodes, setLoadingNodes] = useState(true);
  const [loadingNodeDetail, setLoadingNodeDetail] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNodes = useCallback(async () => {
    try {
      setError(null);
      setLoadingNodes(true);
      const response = await fetch(`${API_BASE_URL}/nodes`);
      if (!response.ok) throw new Error('Failed to fetch nodes');
      const data: NodeWithLatestReading[] = await response.json();
      setNodes(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoadingNodes(false);
    }
  }, []);

  useEffect(() => {
    fetchNodes();
    const interval = setInterval(fetchNodes, 30000);
    return () => clearInterval(interval);
  }, [fetchNodes]);

  const handleNodeSelect = async (nodeId: string) => {
    if (selectedNode?.node_id === nodeId) {
      setSelectedNode(null);
      return;
    }
    
    try {
      setError(null);
      setLoadingNodeDetail(true);
      setSelectedNode(null);
      const response = await fetch(`${API_BASE_URL}/nodes/${nodeId}`);
      if (!response.ok) throw new Error(`Failed to fetch details for node ${nodeId}`);
      const data: NodeDetail = await response.json();
      setSelectedNode(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoadingNodeDetail(false);
    }
  };

  const handleCloseDrawer = () => {
    setSelectedNode(null);
  };

  return (
    <div className="nodes-page-container">
      <div className="nodes-table-section">
        <h3>Node Management</h3>
        {loadingNodes ? (
          <p>Loading nodes...</p>
        ) : error ? (
          <p>Error: {error}</p>
        ) : (
          <DeviceTable 
            nodes={nodes} 
            onNodeSelect={handleNodeSelect}
            selectedNodeId={selectedNode?.node_id}
          />
        )}
      </div>

      <NodeDetailDrawer
        node={selectedNode}
        loading={loadingNodeDetail}
        onClose={handleCloseDrawer}
      />
    </div>
  );
}
