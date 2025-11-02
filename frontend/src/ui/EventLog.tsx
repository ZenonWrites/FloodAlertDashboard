import { EventLog, LogLevel } from '../types/api';

interface EventLogProps {
  log: EventLog;
}

export default function EventLogEntry({ log }: EventLogProps) {
  const getLevelClass = (level: LogLevel) => {
    return level.toLowerCase();
  };

  return (
    <div className={`event-log-entry ${getLevelClass(log.log_level)}`}>
      <span className="log-icon">Icon</span>
      <span className="log-timestamp">{new Date(log.timestamp).toLocaleTimeString()}</span>
      <span className={`log-level-badge ${getLevelClass(log.log_level)}`}>
        {log.log_level}
      </span>
      <span className="log-source">[{log.source}]</span>
      <span className="log-message">{log.message}</span>
    </div>
  );
}
