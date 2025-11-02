import { LayoutDashboard, Radio, AlertTriangle, FileText, Settings, User } from 'lucide-react';

interface SidebarProps {
  activeMenu: string;
  onMenuChange: (menu: string) => void;
}

export function Sidebar({ activeMenu, onMenuChange }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'nodes', label: 'Nodes', icon: Radio },
    { id: 'alerts', label: 'Alerts', icon: AlertTriangle },
    { id: 'logs', label: 'Logs', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div 
      className="flex flex-col h-full"
      style={{ background: '#0B1220', width: '240px', borderRight: '1px solid rgba(226, 232, 240, 0.1)' }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-6">
        <div 
          className="flex items-center justify-center rounded-lg"
          style={{ width: '36px', height: '36px', background: '#0EA5A4' }}
        >
          <Radio size={20} style={{ color: '#0F1724' }} />
        </div>
        <span style={{ color: '#E2E8F0', fontSize: '18px', fontWeight: '600' }}>
          Flood-Safe Mumbai
        </span>
      </div>

      {/* Menu */}
      <nav className="flex-1 px-3 py-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeMenu === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onMenuChange(item.id)}
              className="flex items-center w-full gap-3 px-3 py-2 mb-1 transition-all rounded-lg"
              style={{
                background: isActive ? 'rgba(14, 165, 164, 0.15)' : 'transparent',
                color: isActive ? '#0EA5A4' : '#E2E8F0',
                border: isActive ? '1px solid rgba(14, 165, 164, 0.3)' : '1px solid transparent',
              }}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Profile */}
      <div className="p-4" style={{ borderTop: '1px solid rgba(226, 232, 240, 0.1)' }}>
        <div className="flex items-center gap-3">
          <div 
            className="flex items-center justify-center rounded-full"
            style={{ width: '32px', height: '32px', background: 'rgba(14, 165, 164, 0.2)' }}
          >
            <User size={16} style={{ color: '#0EA5A4' }} />
          </div>
          <div>
            <p style={{ color: '#E2E8F0', fontSize: '14px' }}>Admin User</p>
            <p style={{ color: '#E2E8F0', fontSize: '12px', opacity: 0.6 }}>Internal Access</p>
          </div>
        </div>
      </div>
    </div>
  );
}
