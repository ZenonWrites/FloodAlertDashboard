import { useState } from 'react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { ChevronLeft, ChevronRight, Filter } from 'lucide-react';

interface DeviceNode {
  id: string;
  name: string;
  status: 'Online' | 'Maintenance' | 'Offline';
  firmware: string;
  lastSeen: string;
  waterLevel: string;
  signalStrength: string;
}

interface DeviceTableProps {
  nodes: DeviceNode[];
  onRowClick: (node: DeviceNode) => void;
}

export function DeviceTable({ nodes, onRowClick }: DeviceTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const itemsPerPage = 10;

  const filteredNodes = nodes.filter(node => 
    statusFilter === 'all' || node.status === statusFilter
  );

  const totalPages = Math.ceil(filteredNodes.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedNodes = filteredNodes.slice(startIndex, startIndex + itemsPerPage);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Online': return { bg: 'rgba(14, 165, 164, 0.15)', text: '#0EA5A4', border: 'rgba(14, 165, 164, 0.3)' };
      case 'Maintenance': return { bg: 'rgba(245, 158, 11, 0.15)', text: '#F59E0B', border: 'rgba(245, 158, 11, 0.3)' };
      case 'Offline': return { bg: 'rgba(148, 163, 184, 0.15)', text: '#94A3B8', border: 'rgba(148, 163, 184, 0.3)' };
      default: return { bg: 'transparent', text: '#E2E8F0', border: 'transparent' };
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Table Header with Filters */}
      <div className="flex items-center justify-between mb-4">
        <h2 style={{ color: '#E2E8F0', fontSize: '18px', fontWeight: '600' }}>Device Management</h2>
        <div className="flex items-center gap-2">
          <Filter size={16} style={{ color: '#E2E8F0', opacity: 0.6 }} />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1 rounded-lg outline-none"
            style={{ background: '#0B1220', color: '#E2E8F0', border: '1px solid rgba(226, 232, 240, 0.2)' }}
          >
            <option value="all">All Status</option>
            <option value="Online">Online</option>
            <option value="Maintenance">Maintenance</option>
            <option value="Offline">Offline</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div 
        className="flex-1 overflow-auto rounded-lg"
        style={{ background: '#0B1220', border: '1px solid rgba(226, 232, 240, 0.1)' }}
      >
        <table className="w-full">
          <thead style={{ borderBottom: '1px solid rgba(226, 232, 240, 0.1)' }}>
            <tr>
              <th className="px-4 py-3 text-left" style={{ color: '#E2E8F0', opacity: 0.7 }}>Node ID</th>
              <th className="px-4 py-3 text-left" style={{ color: '#E2E8F0', opacity: 0.7 }}>Status</th>
              <th className="px-4 py-3 text-left" style={{ color: '#E2E8F0', opacity: 0.7 }}>Firmware</th>
              <th className="px-4 py-3 text-left" style={{ color: '#E2E8F0', opacity: 0.7 }}>Last Seen</th>
              <th className="px-4 py-3 text-left" style={{ color: '#E2E8F0', opacity: 0.7 }}>Water Level</th>
              <th className="px-4 py-3 text-left" style={{ color: '#E2E8F0', opacity: 0.7 }}>Signal</th>
            </tr>
          </thead>
          <tbody>
            {paginatedNodes.map((node) => {
              const statusStyle = getStatusColor(node.status);
              return (
                <tr
                  key={`node-${node.id}`}
                  onClick={() => onRowClick(node)}
                  className="transition-all cursor-pointer"
                  style={{ borderBottom: '1px solid rgba(226, 232, 240, 0.05)' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(14, 165, 164, 0.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                  }}
                >
                  <td className="px-4 py-3" style={{ color: '#E2E8F0' }}>{node.name}</td>
                  <td className="px-4 py-3">
                    <span
                      className="inline-block px-2 py-1 rounded text-xs"
                      style={{
                        background: statusStyle.bg,
                        color: statusStyle.text,
                        border: `1px solid ${statusStyle.border}`,
                      }}
                    >
                      {node.status}
                    </span>
                  </td>
                  <td className="px-4 py-3" style={{ color: '#E2E8F0', opacity: 0.8 }}>{node.firmware}</td>
                  <td className="px-4 py-3" style={{ color: '#E2E8F0', opacity: 0.8 }}>{node.lastSeen}</td>
                  <td className="px-4 py-3" style={{ color: '#E2E8F0', opacity: 0.8 }}>{node.waterLevel}</td>
                  <td className="px-4 py-3" style={{ color: '#E2E8F0', opacity: 0.8 }}>{node.signalStrength}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4">
        <p style={{ color: '#E2E8F0', opacity: 0.6, fontSize: '14px' }}>
          Showing {startIndex + 1} - {Math.min(startIndex + itemsPerPage, filteredNodes.length)} of {filteredNodes.length}
        </p>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            variant="outline"
            size="sm"
            style={{
              background: '#0B1220',
              color: '#E2E8F0',
              border: '1px solid rgba(226, 232, 240, 0.2)',
            }}
          >
            <ChevronLeft size={16} />
          </Button>
          <span style={{ color: '#E2E8F0', fontSize: '14px' }}>
            Page {currentPage} of {totalPages}
          </span>
          <Button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            variant="outline"
            size="sm"
            style={{
              background: '#0B1220',
              color: '#E2E8F0',
              border: '1px solid rgba(226, 232, 240, 0.2)',
            }}
          >
            <ChevronRight size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
}
