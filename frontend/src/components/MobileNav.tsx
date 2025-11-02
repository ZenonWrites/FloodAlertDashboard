import { LayoutDashboard, Radio, AlertTriangle, FileText, Settings } from 'lucide-react';

interface MobileNavProps {
  activeMenu: string;
  onMenuChange: (menu: string) => void;
}

export function MobileNav({ activeMenu, onMenuChange }: MobileNavProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'nodes', label: 'Nodes', icon: Radio },
    { id: 'alerts', label: 'Alerts', icon: AlertTriangle },
    { id: 'logs', label: 'Logs', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div 
      className="fixed bottom-0 left-0 right-0 z-30 flex items-center justify-around px-2 py-2"
      style={{ 
        background: '#0B1220', 
        borderTop: '1px solid rgba(226, 232, 240, 0.1)',
        boxShadow: '0 -2px 8px rgba(0, 0, 0, 0.2)'
      }}
    >
      {menuItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeMenu === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onMenuChange(item.id)}
            className="flex flex-col items-center gap-1 px-3 py-2 transition-all rounded-lg"
            style={{
              color: isActive ? '#0EA5A4' : '#E2E8F0',
              background: isActive ? 'rgba(14, 165, 164, 0.1)' : 'transparent',
            }}
          >
            <Icon size={20} />
            <span style={{ fontSize: '10px' }}>{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}
