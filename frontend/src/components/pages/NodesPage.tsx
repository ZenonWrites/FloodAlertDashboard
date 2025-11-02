import { useState } from 'react';
import { Filter, Download, Search } from 'lucide-react';
import * as XLSX from 'xlsx';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

interface NodesPageProps {
  nodes: any[];
  onNodeClick: (node: any) => void;
}

export function NodesPage({ nodes, onNodeClick }: NodesPageProps) {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [firmwareFilter, setFirmwareFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredNodes = nodes.filter(node => {
    const matchesStatus = statusFilter === 'all' || node.status === statusFilter;
    const matchesFirmware = firmwareFilter === 'all' || node.firmware === firmwareFilter;
    const matchesSearch = node.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesFirmware && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Online': return { bg: 'rgba(14, 165, 164, 0.15)', text: '#0EA5A4', border: 'rgba(14, 165, 164, 0.3)' };
      case 'Maintenance': return { bg: 'rgba(245, 158, 11, 0.15)', text: '#F59E0B', border: 'rgba(245, 158, 11, 0.3)' };
      case 'Offline': return { bg: 'rgba(148, 163, 184, 0.15)', text: '#94A3B8', border: 'rgba(148, 163, 184, 0.3)' };
      default: return { bg: 'transparent', text: '#E2E8F0', border: 'transparent' };
    }
  };

  const uniqueFirmwareVersions = Array.from(new Set(nodes.map(n => n.firmware)));

  return (
    <div className="p-4 md:p-6">
      <div className="space-y-4">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 style={{ color: '#E2E8F0', fontSize: '24px', fontWeight: '600' }}>Node Management</h1>
            <p style={{ color: '#E2E8F0', opacity: 0.6, marginTop: '4px' }}>
              Monitor and manage all flood monitoring nodes
            </p>
          </div>
          <Button
            onClick={() => {
              const worksheet = XLSX.utils.json_to_sheet(filteredNodes.map(node => ({
                'Node ID': node.id,
                'Name': node.name,
                'Status': node.status,
                'Firmware': node.firmware,
                'Last Updated': node.lastUpdated,
                'Location': node.location,
                'Battery': node.battery,
                'Signal': node.signal
              })));
              const workbook = XLSX.utils.book_new();
              XLSX.utils.book_append_sheet(workbook, worksheet, 'Nodes');
              XLSX.writeFile(workbook, `nodes_export_${new Date().toISOString().split('T')[0]}.xlsx`);
            }}
            style={{
              background: '#0EA5A4',
              color: '#0F1724',
            }}
          >
            <Download size={16} className="mr-2" />
            Export Data
          </Button>
        </div>

        {/* Filters */}
        <div 
          className="p-4 rounded-lg"
          style={{ background: '#0B1220', border: '1px solid rgba(226, 232, 240, 0.1)' }}
        >
          <div className="flex items-center gap-2 mb-3">
            <Filter size={16} style={{ color: '#0EA5A4' }} />
            <span style={{ color: '#E2E8F0', fontWeight: '600' }}>Filters</span>
          </div>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
            <div className="relative">
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#E2E8F0', opacity: 0.4 }} />
              <Input
                placeholder="Search nodes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                style={{
                  background: '#0F1724',
                  color: '#E2E8F0',
                  border: '1px solid rgba(226, 232, 240, 0.2)',
                }}
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-lg outline-none"
              style={{ background: '#0F1724', color: '#E2E8F0', border: '1px solid rgba(226, 232, 240, 0.2)' }}
            >
              <option value="all">All Status</option>
              <option value="Online">Online</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Offline">Offline</option>
            </select>
            <select
              value={firmwareFilter}
              onChange={(e) => setFirmwareFilter(e.target.value)}
              className="px-3 py-2 rounded-lg outline-none"
              style={{ background: '#0F1724', color: '#E2E8F0', border: '1px solid rgba(226, 232, 240, 0.2)' }}
            >
              <option value="all">All Firmware</option>
              {uniqueFirmwareVersions.map(fw => (
                <option key={fw} value={fw}>{fw}</option>
              ))}
            </select>
            <Button
              variant="outline"
              onClick={() => {
                setStatusFilter('all');
                setFirmwareFilter('all');
                setSearchQuery('');
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

        {/* Stats Summary */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {[
            { label: 'Total Nodes', value: nodes.length, color: '#E2E8F0' },
            { label: 'Online', value: nodes.filter(n => n.status === 'Online').length, color: '#0EA5A4' },
            { label: 'Maintenance', value: nodes.filter(n => n.status === 'Maintenance').length, color: '#F59E0B' },
            { label: 'Offline', value: nodes.filter(n => n.status === 'Offline').length, color: '#94A3B8' },
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

        {/* Nodes Table */}
        <div 
          className="overflow-auto rounded-lg"
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
                <th className="px-4 py-3 text-left" style={{ color: '#E2E8F0', opacity: 0.7 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredNodes.map((node) => {
                const statusStyle = getStatusColor(node.status);
                return (
                  <tr
                    key={node.id}
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
                    <td className="px-4 py-3">
                      <Button
                        onClick={() => onNodeClick(node)}
                        size="sm"
                        variant="outline"
                        style={{
                          background: 'transparent',
                          color: '#0EA5A4',
                          border: '1px solid rgba(14, 165, 164, 0.3)',
                        }}
                      >
                        View Details
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filteredNodes.length === 0 && (
            <div className="py-12 text-center">
              <p style={{ color: '#E2E8F0', opacity: 0.6 }}>No nodes found matching the filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
