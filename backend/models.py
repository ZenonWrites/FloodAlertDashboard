from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean, ForeignKey, desc
from sqlalchemy.orm import relationship, DeclarativeBase, Session
import datetime
import enum

class Base(DeclarativeBase):
    pass

# --- Enums (for better data integrity, based on images) ---
class NodeStatus(str, enum.Enum):
    ONLINE = "Online"
    OFFLINE = "Offline"
    MAINTENANCE = "Maintenance"

class LogLevel(str, enum.Enum):
    INFO = "INFO"
    WARN = "WARN"
    ERROR = "ERROR"

class AlertSeverity(str, enum.Enum):
    INFO = "INFO"
    WARNING = "Warning"
    CRITICAL = "Critical"

# --- SQLAlchemy ORM Models (Based on PDF Schema) ---
class Node(Base):
    __tablename__ = "nodes"

    node_id = Column(String(50), primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    location_desc = Column(String)
    status = Column(String(20), nullable=False, default=NodeStatus.OFFLINE)
    firmware_version = Column(String(20))
    last_ping = Column(DateTime)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    sensor_readings = relationship("SensorReading", back_populates="node", order_by="desc(SensorReading.timestamp)")
    alerts = relationship("Alert", back_populates="node")

class SensorReading(Base):
    __tablename__ = "sensor_readings"

    reading_id = Column(Integer, primary_key=True, autoincrement=True)
    node_id = Column(String(50), ForeignKey("nodes.node_id"))
    timestamp = Column(DateTime, nullable=False, index=True, default=datetime.datetime.utcnow)
    water_level_cm = Column(Float, nullable=False)
    signal_strength_dbm = Column(Integer)

    # Relationship
    node = relationship("Node", back_populates="sensor_readings")

class Alert(Base):
    __tablename__ = "alerts"

    alert_id = Column(Integer, primary_key=True, autoincrement=True)
    node_id = Column(String(50), ForeignKey("nodes.node_id"))
    reading_id = Column(Integer, ForeignKey("sensor_readings.reading_id"))
    timestamp = Column(DateTime, nullable=False, default=datetime.datetime.utcnow)
    severity = Column(String(20), nullable=False, default=AlertSeverity.WARNING)
    verification_image_url = Column(String(255))
    is_acknowledged = Column(Boolean, default=False)

    # Relationships
    node = relationship("Node", back_populates="alerts")
    sensor_reading = relationship("SensorReading")

class EventLog(Base):
    __tablename__ = "event_logs"

    log_id = Column(Integer, primary_key=True, autoincrement=True)
    timestamp = Column(DateTime, nullable=False, default=datetime.datetime.utcnow)
    source = Column(String(50), index=True)
    log_level = Column(String(10), index=True)
    message = Column(String, nullable=False)
