export enum NodeStatus {
  ONLINE = "Online",
  OFFLINE = "Offline",
  MAINTENANCE = "Maintenance",
}

export enum LogLevel {
  INFO = "INFO",
  WARN = "WARN",
  ERROR = "ERROR",
}

export enum AlertSeverity {
  INFO = "INFO",
  WARNING = "Warning",
  CRITICAL = "Critical",
}

export interface SystemStatus {
  nodes_online: number;
  nodes_total: number;
  active_alerts: number;
  avg_network_latency_ms: number;
}

export interface SensorReading {
  reading_id: number;
  node_id: string;
  timestamp: string; // ISO 8601 string
  water_level_cm: number;
  signal_strength_dbm: number;
}

export interface Node {
  node_id: string;
  name: string;
  location_desc?: string;
  status: NodeStatus;
  firmware_version?: string;
  last_ping: string; // ISO 8601 string
  created_at: string; // ISO 8601 string
}

export interface NodeWithLatestReading extends Node {
  water_level_cm?: number;
  signal_strength_dbm?: number;
}

export interface NodeDetail extends Node {
  recent_readings: SensorReading[];
}

export interface Alert {
  alert_id: number;
  node_id: string;
  reading_id?: number;
  timestamp: string; // ISO 8601 string
  severity: AlertSeverity;
  verification_image_url?: string;
  is_acknowledged: boolean;
  node?: {
    name: string;
  };
}

export interface EventLog {
  log_id: number;
  timestamp: string; // ISO 8601 string
  source: string;
  log_level: LogLevel;
  message: string;
}
