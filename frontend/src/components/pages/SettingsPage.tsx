import { User, Bell, Database, Shield, Activity } from 'lucide-react';
import { Slider } from '../ui/slider';
import { Switch } from '../ui/switch';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { useState } from 'react';
import { toast } from 'sonner@2.0.3';

export function SettingsPage() {
  const [refreshRate, setRefreshRate] = useState([30]);
  const [darkMode, setDarkMode] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [dataRetention, setDataRetention] = useState([90]);

  const handleSave = () => {
    toast.success('Settings saved successfully', {
      style: {
        background: '#0B1220',
        color: '#E2E8F0',
        border: '1px solid #10B981',
      },
    });
  };

  return (
    <div className="p-4 md:p-6">
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 style={{ color: '#E2E8F0', fontSize: '24px', fontWeight: '600' }}>System Settings</h1>
          <p style={{ color: '#E2E8F0', opacity: 0.6, marginTop: '4px' }}>
            Configure dashboard preferences and system behavior
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* General Settings */}
          <div 
            className="p-6 rounded-lg"
            style={{ background: '#0B1220', border: '1px solid rgba(226, 232, 240, 0.1)' }}
          >
            <div className="flex items-center gap-3 mb-6">
              <Activity size={20} style={{ color: '#0EA5A4' }} />
              <h2 style={{ color: '#E2E8F0', fontSize: '18px', fontWeight: '600' }}>General</h2>
            </div>

            <div className="space-y-6">
              {/* Auto-refresh Rate */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label style={{ color: '#E2E8F0' }}>Auto-refresh Rate</Label>
                  <span style={{ color: '#0EA5A4', fontSize: '14px', fontWeight: '600' }}>
                    {refreshRate[0]}s
                  </span>
                </div>
                <Slider
                  value={refreshRate}
                  onValueChange={setRefreshRate}
                  min={5}
                  max={120}
                  step={5}
                  className="mt-2"
                />
                <p style={{ color: '#E2E8F0', opacity: 0.5, fontSize: '12px', marginTop: '8px' }}>
                  How often the dashboard updates data
                </p>
              </div>

              {/* Dark Mode */}
              <div className="flex items-center justify-between">
                <div>
                  <Label style={{ color: '#E2E8F0' }}>Dark Mode</Label>
                  <p style={{ color: '#E2E8F0', opacity: 0.5, fontSize: '12px', marginTop: '4px' }}>
                    Enable dark theme (currently enabled)
                  </p>
                </div>
                <Switch checked={darkMode} onCheckedChange={setDarkMode} />
              </div>

              {/* Data Retention */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label style={{ color: '#E2E8F0' }}>Data Retention Period</Label>
                  <span style={{ color: '#0EA5A4', fontSize: '14px', fontWeight: '600' }}>
                    {dataRetention[0]} days
                  </span>
                </div>
                <Slider
                  value={dataRetention}
                  onValueChange={setDataRetention}
                  min={30}
                  max={365}
                  step={15}
                  className="mt-2"
                />
                <p style={{ color: '#E2E8F0', opacity: 0.5, fontSize: '12px', marginTop: '8px' }}>
                  How long to keep historical data
                </p>
              </div>
            </div>
          </div>

          {/* Notification Settings */}
          <div 
            className="p-6 rounded-lg"
            style={{ background: '#0B1220', border: '1px solid rgba(226, 232, 240, 0.1)' }}
          >
            <div className="flex items-center gap-3 mb-6">
              <Bell size={20} style={{ color: '#0EA5A4' }} />
              <h2 style={{ color: '#E2E8F0', fontSize: '18px', fontWeight: '600' }}>Notifications</h2>
            </div>

            <div className="space-y-6">
              {/* Email Notifications */}
              <div className="flex items-center justify-between">
                <div>
                  <Label style={{ color: '#E2E8F0' }}>Email Notifications</Label>
                  <p style={{ color: '#E2E8F0', opacity: 0.5, fontSize: '12px', marginTop: '4px' }}>
                    Receive alerts via email
                  </p>
                </div>
                <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
              </div>

              {/* Push Notifications */}
              <div className="flex items-center justify-between">
                <div>
                  <Label style={{ color: '#E2E8F0' }}>Push Notifications</Label>
                  <p style={{ color: '#E2E8F0', opacity: 0.5, fontSize: '12px', marginTop: '4px' }}>
                    Browser push notifications
                  </p>
                </div>
                <Switch checked={pushNotifications} onCheckedChange={setPushNotifications} />
              </div>

              {/* Alert Threshold */}
              <div>
                <Label style={{ color: '#E2E8F0' }}>Water Level Alert Threshold</Label>
                <Input
                  type="number"
                  defaultValue="15.0"
                  className="mt-2"
                  style={{
                    background: '#0F1724',
                    color: '#E2E8F0',
                    border: '1px solid rgba(226, 232, 240, 0.2)',
                  }}
                />
                <p style={{ color: '#E2E8F0', opacity: 0.5, fontSize: '12px', marginTop: '8px' }}>
                  Trigger alerts when water level exceeds (cm)
                </p>
              </div>
            </div>
          </div>

          {/* Database Settings */}
          <div 
            className="p-6 rounded-lg"
            style={{ background: '#0B1220', border: '1px solid rgba(226, 232, 240, 0.1)' }}
          >
            <div className="flex items-center gap-3 mb-6">
              <Database size={20} style={{ color: '#0EA5A4' }} />
              <h2 style={{ color: '#E2E8F0', fontSize: '18px', fontWeight: '600' }}>Database</h2>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-lg" style={{ background: 'rgba(14, 165, 164, 0.1)', border: '1px solid rgba(14, 165, 164, 0.3)' }}>
                <div className="flex items-center justify-between mb-2">
                  <span style={{ color: '#E2E8F0', fontSize: '14px' }}>Total Records</span>
                  <span style={{ color: '#0EA5A4', fontSize: '16px', fontWeight: '600' }}>12,453</span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span style={{ color: '#E2E8F0', fontSize: '14px' }}>Storage Used</span>
                  <span style={{ color: '#0EA5A4', fontSize: '16px', fontWeight: '600' }}>2.4 GB</span>
                </div>
                <div className="flex items-center justify-between">
                  <span style={{ color: '#E2E8F0', fontSize: '14px' }}>Last Backup</span>
                  <span style={{ color: '#0EA5A4', fontSize: '16px', fontWeight: '600' }}>2h ago</span>
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full"
                style={{
                  background: 'transparent',
                  color: '#E2E8F0',
                  border: '1px solid rgba(226, 232, 240, 0.2)',
                }}
              >
                Trigger Manual Backup
              </Button>
              <Button
                variant="outline"
                className="w-full"
                style={{
                  background: 'transparent',
                  color: '#EF4444',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                }}
              >
                Clear Old Data
              </Button>
            </div>
          </div>

          {/* Admin Information */}
          <div 
            className="p-6 rounded-lg"
            style={{ background: '#0B1220', border: '1px solid rgba(226, 232, 240, 0.1)' }}
          >
            <div className="flex items-center gap-3 mb-6">
              <Shield size={20} style={{ color: '#0EA5A4' }} />
              <h2 style={{ color: '#E2E8F0', fontSize: '18px', fontWeight: '600' }}>Admin Information</h2>
            </div>

            <div className="space-y-4">
              <div>
                <Label style={{ color: '#E2E8F0', opacity: 0.6 }}>Administrator Name</Label>
                <Input
                  defaultValue="Admin User"
                  className="mt-2"
                  style={{
                    background: '#0F1724',
                    color: '#E2E8F0',
                    border: '1px solid rgba(226, 232, 240, 0.2)',
                  }}
                />
              </div>
              <div>
                <Label style={{ color: '#E2E8F0', opacity: 0.6 }}>Email Address</Label>
                <Input
                  defaultValue="admin@floodsafe-mumbai.local"
                  className="mt-2"
                  style={{
                    background: '#0F1724',
                    color: '#E2E8F0',
                    border: '1px solid rgba(226, 232, 240, 0.2)',
                  }}
                />
              </div>
              <div>
                <Label style={{ color: '#E2E8F0', opacity: 0.6 }}>Role</Label>
                <Input
                  defaultValue="System Administrator"
                  disabled
                  className="mt-2"
                  style={{
                    background: '#0F1724',
                    color: '#E2E8F0',
                    border: '1px solid rgba(226, 232, 240, 0.2)',
                    opacity: 0.6
                  }}
                />
              </div>
              <div className="pt-2">
                <Button
                  variant="outline"
                  className="w-full"
                  style={{
                    background: 'transparent',
                    color: '#E2E8F0',
                    border: '1px solid rgba(226, 232, 240, 0.2)',
                  }}
                >
                  <User size={16} className="mr-2" />
                  Update Profile
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            style={{
              background: 'transparent',
              color: '#E2E8F0',
              border: '1px solid rgba(226, 232, 240, 0.2)',
            }}
          >
            Reset to Defaults
          </Button>
          <Button
            onClick={handleSave}
            style={{
              background: '#0EA5A4',
              color: '#0F1724',
            }}
          >
            Save Settings
          </Button>
        </div>
      </div>
    </div>
  );
}
