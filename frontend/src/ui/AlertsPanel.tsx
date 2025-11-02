import { Alert, AlertSeverity } from '../types/api';

interface AlertsPanelProps {
  alerts: Alert[];
  onAcknowledge: (alertId: number) => void;
  showAcknowledged?: boolean;
}

export default function AlertsPanel({ alerts, onAcknowledge, showAcknowledged = false }: AlertsPanelProps) {
  const getSeverityClass = (severity: AlertSeverity) => {
    return severity.toLowerCase();
  };

  const filteredAlerts = showAcknowledged ? alerts : alerts.filter(a => !a.is_acknowledged);

  return (
    <div className="alerts-panel-container">
      {filteredAlerts.length === 0 ? (
        <p>{showAcknowledged ? "No alerts found." : "No active alerts."}</p>
      ) : (
        filteredAlerts.map(alert => (
          <div 
            key={alert.alert_id} 
            className={`alert-item ${getSeverityClass(alert.severity)} ${alert.is_acknowledged ? 'acknowledged' : ''}`}
          >
            <img 
              src={alert.verification_image_url || "https://i.imgur.com/g8xG8dM.jpeg"} 
              alt="Verification" 
              className="alert-image"
            />
            
            <div className="alert-details">
              <span className={`alert-severity-badge ${getSeverityClass(alert.severity)}`}>
                {alert.severity}
              </span>
              <span className="alert-node">{alert.node_id}</span>
              <span className="alert-timestamp">{new Date(alert.timestamp).toLocaleString()}</span>
              
              {!alert.is_acknowledged && (
                <div className="alert-actions">
                  <button 
                    className="ack-button"
                    onClick={() => onAcknowledge(alert.alert_id)}
                  >
                    Acknowledge
                  </button>
                </div>
              )}
              {alert.is_acknowledged && (
                 <span className="ack-status">Acknowledged</span>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
