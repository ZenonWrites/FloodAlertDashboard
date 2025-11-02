# main.py
# A complete FastAPI backend for the Flood-Safe Mumbai project.
# This file includes API endpoints and dummy data seeding based on the provided documents.

import uvicorn
from fastapi import FastAPI, Depends, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
import os
from sqlalchemy import create_engine, desc
from sqlalchemy.orm import sessionmaker, Session
from pydantic import BaseModel
from typing import List, Optional
import datetime

# Import models and enums from models.py
from models import Base, Node, SensorReading, Alert, EventLog, NodeStatus, LogLevel, AlertSeverity

# --- Database Setup ---
DATABASE_URL = "sqlite:///./floodsafe.db"

engine = create_engine(
    DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    """Dependency to get a database session."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Pydantic schemas for request/response validation
class EventLogBase(BaseModel):
    timestamp: datetime.datetime
    source: str
    log_level: LogLevel
    message: str

class EventLogSchema(EventLogBase):
    log_id: int

    class Config:
        from_attributes = True

class SensorReadingBase(BaseModel):
    timestamp: datetime.datetime
    water_level_cm: float
    signal_strength_dbm: int

class SensorReadingSchema(SensorReadingBase):
    reading_id: int
    node_id: str

    class Config:
        from_attributes = True

class AlertBase(BaseModel):
    node_id: str
    timestamp: datetime.datetime
    severity: AlertSeverity
    verification_image_url: Optional[str] = None
    is_acknowledged: bool

class AlertSchema(AlertBase):
    alert_id: int

    class Config:
        from_attributes = True

class NodeBase(BaseModel):
    node_id: str
    name: str
    location_desc: Optional[str] = None
    status: NodeStatus
    firmware_version: Optional[str] = None
    last_ping: datetime.datetime

class NodeSchema(NodeBase):
    created_at: datetime.datetime

    class Config:
        from_attributes = True

class NodeWithLatestReading(NodeBase):
    water_level_cm: Optional[float] = None
    signal_strength_dbm: Optional[int] = None

class NodeDetail(NodeSchema):
    recent_readings: List[SensorReadingSchema] = []

class SystemStatus(BaseModel):
    nodes_online: int
    nodes_total: int
    active_alerts: int
    avg_network_latency_ms: int


# --- FastAPI App Initialization ---
app = FastAPI(
    title="Flood-Safe Mumbai Backend API",
    description="API server for the Flood-Safe Mumbai dashboard.",
    version="1.0.0"
)

# Serve static files
app.mount("/static", StaticFiles(directory="static"), name="static")

# Favicon endpoint
@app.get('/favicon.ico', include_in_schema=False)
async def favicon():
    return FileResponse(os.path.join('static', 'favicon.ico'))

# --- CORS Middleware ---
# This is VITAL for your React frontend to be able to talk to this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # For development. In production, list your frontend's domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --- 3. Dummy Data Seeding (Runs on first startup) ---

def seed_database(db: Session):
    """
    Checks if the database is empty and, if so, populates it
    with the exact dummy data from the user's screenshots.
    """

    # Check if nodes already exist
    if db.query(Node).first():
        print("Database already seeded. Skipping.")
        return

    print("Database is empty. Seeding with dummy data...")

    # --- Create Nodes (from Image 3) ---
    # Helper to parse timestamps from images
    def parse_time(ts_str):
        return datetime.datetime.strptime(ts_str, "%Y-%m-%d %H:%M IST")

    nodes_data = [
        {"node_id": "Andheri-Sub-01", "name": "Andheri Subway", "status": NodeStatus.ONLINE, "firmware": "v1.3.2", "last_ping": "2025-10-31 18:02 IST"},
        {"node_id": "Colaba-Quay-02", "name": "Colaba Quay", "status": NodeStatus.ONLINE, "firmware": "v1.3.0", "last_ping": "2025-10-31 18:00 IST"},
        {"node_id": "Parel-Bridge-03", "name": "Parel Bridge", "status": NodeStatus.MAINTENANCE, "firmware": "v1.2.8", "last_ping": "2025-10-31 11:22 IST"},
        {"node_id": "Dadar-Drain-04", "name": "Dadar Drain", "status": NodeStatus.OFFLINE, "firmware": "v1.2.5", "last_ping": "2025-10-31 04:12 IST"},
        {"node_id": "Andheri-Sub-02", "name": "Andheri Subway 2", "status": NodeStatus.ONLINE, "firmware": "v1.3.2", "last_ping": "2025-10-31 18:03 IST"},
        {"node_id": "Bandra-Promenade-05", "name": "Bandra Promenade", "status": NodeStatus.ONLINE, "firmware": "v1.3.1", "last_ping": "2025-10-31 17:59 IST"},
        {"node_id": "Elephanta-Old-06", "name": "Elephanta Old Pier", "status": NodeStatus.ONLINE, "firmware": "v1.3.0", "last_ping": "2025-10-31 17:55 IST"},
        {"node_id": "Goregaon-Sewage-07", "name": "Goregaon Sewage", "status": NodeStatus.OFFLINE, "firmware": "v1.1.9", "last_ping": "2025-10-31 09:02 IST"},
        {"node_id": "Malad-Lake-08", "name": "Malad Lake", "status": NodeStatus.ONLINE, "firmware": "v1.3.2", "last_ping": "2025-10-31 18:04 IST"},
        {"node_id": "Vashi-Underpass-09", "name": "Vashi Underpass", "status": NodeStatus.MAINTENANCE, "firmware": "v1.2.9", "last_ping": "2025-10-31 10:15 IST"},
    ]

    nodes_map = {}
    for data in nodes_data:
        node = Node(
            node_id=data["node_id"],
            name=data["name"],
            location_desc=f"Physical location for {data['name']}",
            status=data["status"],
            firmware_version=data["firmware"],
            last_ping=parse_time(data["last_ping"]),
            created_at=datetime.datetime(2025, 1, 1) # Static creation date
        )
        nodes_map[data["node_id"]] = node
        db.add(node)

    db.commit() # Commit nodes first to get them in the DB

    # --- Create Sensor Readings (from Image 3) ---
    # These are the *latest* readings shown in the node list
    readings_data = [
        {"node_id": "Andheri-Sub-01", "ts": "2025-10-31 18:02 IST", "level": 14.2, "signal": -46},
        {"node_id": "Colaba-Quay-02", "ts": "2025-10-31 18:00 IST", "level": 13.8, "signal": -47},
        {"node_id": "Parel-Bridge-03", "ts": "2025-10-31 11:22 IST", "level": 11.5, "signal": -52},
        {"node_id": "Dadar-Drain-04", "ts": "2025-10-31 04:12 IST", "level": 10.2, "signal": -58},
        {"node_id": "Andheri-Sub-02", "ts": "2025-10-31 18:03 IST", "level": 14.0, "signal": -46},
        {"node_id": "Bandra-Promenade-05", "ts": "2025-10-31 17:59 IST", "level": 13.6, "signal": -49},
        {"node_id": "Elephanta-Old-06", "ts": "2025-10-31 17:55 IST", "level": 12.9, "signal": -50},
        {"node_id": "Goregaon-Sewage-07", "ts": "2025-10-31 09:02 IST", "level": 9.8, "signal": -60},
        {"node_id": "Malad-Lake-08", "ts": "2025-10-31 18:04 IST", "level": 15.0, "signal": -44}, # This is the 15.0cm from the list
        {"node_id": "Vashi-Underpass-09", "ts": "2025-10-31 10:15 IST", "level": 11.0, "signal": -53},

        # Add the specific Malad-Lake-08 warning reading (Image 5)
        {"node_id": "Malad-Lake-08", "ts": "2025-10-31 17:58 IST", "level": 14.9, "signal": -44},

        # Add some historical data for Andheri-Sub-01 for its chart
        {"node_id": "Andheri-Sub-01", "ts": "2025-10-31 18:01 IST", "level": 14.1, "signal": -47},
        {"node_id": "Andheri-Sub-01", "ts": "2025-10-31 18:00 IST", "level": 13.9, "signal": -46},
        {"node_id": "Andheri-Sub-01", "ts": "2025-10-31 17:59 IST", "level": 13.8, "signal": -48},
    ]

    readings_map = {}
    for data in readings_data:
        reading = SensorReading(
            node_id=data["node_id"],
            timestamp=parse_time(data["ts"]),
            water_level_cm=data["level"],
            signal_strength_dbm=data["signal"]
        )
        db.add(reading)
        # Store the reading to link to the alert
        readings_map[(data["node_id"], data["ts"])] = reading

    db.commit() # Commit readings to get their IDs

    # --- Create Event Logs (from Image 2) ---
    logs_data = [
        {"ts": "2025-10-31 18:01 IST", "source": "Gateway", "level": LogLevel.INFO, "msg": "Node ping successful"},
        {"ts": "2025-10-31 18:02 IST", "source": "Node Andheri-Sub-01", "level": LogLevel.WARN, "msg": "Water level high (WARN)"},
        {"ts": "2025-10-31 18:03 IST", "source": "API", "level": LogLevel.INFO, "msg": "Alert dispatched (INFO)"},
        {"ts": "2025-10-31 18:04 IST", "source": "Node Goregaon-Sewage-07", "level": LogLevel.ERROR, "msg": "offline (ERROR)"},
        {"ts": "2025-10-31 18:05 IST", "source": "System", "level": LogLevel.INFO, "msg": "System heartbeat OK (INFO)"},
    ]

    for data in logs_data:
        log = EventLog(
            timestamp=parse_time(data["ts"]),
            source=data["source"],
            log_level=data["level"],
            message=data["msg"]
        )
        db.add(log)

    # --- Create Alerts (from Image 5) ---
    # Get the specific reading objects we created
    critical_reading = readings_map[("Andheri-Sub-01", "2025-10-31 18:02 IST")]
    warning_reading = readings_map[("Malad-Lake-08", "2025-10-31 17:58 IST")] # Note: The list shows 18:04, but the alert is 17:58

    alerts_data = [
        {
            "node_id": "Andheri-Sub-01",
            "reading_id": critical_reading.reading_id,
            "ts": "2025-10-31 18:02 IST",
            "severity": AlertSeverity.CRITICAL,
            "img_url": "https://i.imgur.com/g8xG8dM.jpeg" # Dummy image
        },
        {
            "node_id": "Malad-Lake-08",
            "reading_id": warning_reading.reading_id,
            "ts": "2025-10-31 17:58 IST",
            "severity": AlertSeverity.WARNING,
            "img_url": "https://i.imgur.com/g8xG8dM.jpeg" # Dummy image
        },
    ]

    for data in alerts_data:
        alert = Alert(
            node_id=data["node_id"],
            reading_id=data["reading_id"],
            timestamp=parse_time(data["ts"]),
            severity=data["severity"],
            verification_image_url=data["img_url"],
            is_acknowledged=False
        )
        db.add(alert)

    db.commit()
    print("Database seeding complete.")


@app.on_event("startup")
def on_startup():
    """
    Create database tables and seed with dummy data on app startup.
    """
    Base.metadata.create_all(bind=engine)

    # Use a temporary session to seed the data
    db = SessionLocal()
    seed_database(db)
    db.close()

# --- 4. API Endpoints (Based on PDF) ---

@app.get("/api/v1/health")
async def health_check():
    return {"status": "ok"}

@app.get("/api/v1/system/status", response_model=SystemStatus)
def get_system_status(db: Session = Depends(get_db)):
    """
    [cite: 45] Fetches KPIs for the header.
    Replicates the data from Image 4 header.
    """
    nodes_online = db.query(Node).filter(Node.status == NodeStatus.ONLINE).count()
    nodes_total = db.query(Node).count()
    active_alerts = db.query(Alert).filter(Alert.is_acknowledged == False).count()

    # Hardcoded latency from Image 4
    avg_network_latency_ms = 43

    return {
        "nodes_online": nodes_online,
        "nodes_total": nodes_total,
        "active_alerts": active_alerts,
        "avg_network_latency_ms": avg_network_latency_ms
    }

@app.get("/api/v1/nodes", response_model=List[NodeWithLatestReading])
def get_all_nodes(db: Session = Depends(get_db)):
    """
    Fetches the complete list of all registered nodes.
    This implementation joins with sensor_readings to get the
    latest water level and signal, as shown in Image 3.
    """
    nodes = db.query(Node).all()

    response_list = []
    for node in nodes:
        # Get the most recent sensor reading for this node
        latest_reading = db.query(SensorReading)\
                           .filter(SensorReading.node_id == node.node_id)\
                           .order_by(SensorReading.timestamp.desc())\
                           .first()

        node_data = NodeSchema.from_orm(node).model_dump()

        if latest_reading:
            node_data["water_level_cm"] = latest_reading.water_level_cm
            node_data["signal_strength_dbm"] = latest_reading.signal_strength_dbm
        else:
            node_data["water_level_cm"] = None

        response_list.append(NodeWithLatestReading(**node_data))

    return response_list


@app.get("/api/v1/nodes/{node_id}", response_model=NodeDetail)
def get_node_details(node_id: str, db: Session = Depends(get_db)):
    """
    [cite: 47] Fetches detailed info for one node, including its recent
    readings.
    """
    node = db.query(Node).filter(Node.node_id == node_id).first()

    if not node:
        raise HTTPException(status_code=404, detail="Node not found")

    # Fetch recent readings (e.g., last 20)
    recent_readings = db.query(SensorReading)\
                        .filter(SensorReading.node_id == node_id)\
                        .order_by(SensorReading.timestamp.desc())\
                        .limit(20)\
                        .all()

    # Convert node to schema and add recent readings
    node_detail = NodeDetail(
        **NodeSchema.from_orm(node).model_dump(),
        recent_readings=[SensorReadingSchema.from_orm(r) for r in recent_readings]
    )

    return node_detail

@app.get("/api/v1/logs/events", response_model=List[EventLogSchema])
def get_event_logs(db: Session = Depends(get_db)):
    """
    [cite: 48] Fetches the latest system event logs.
    """
    logs = db.query(EventLog)\
             .order_by(EventLog.timestamp.desc())\
             .limit(50)\
             .all() # Get latest 50 logs
    return [EventLogSchema.from_orm(log) for log in logs]

@app.get("/api/v1/alerts", response_model=List[AlertSchema])
def get_active_alerts(db: Session = Depends(get_db)):
    """
    (Bonus Endpoint)
    Fetches all alerts. The frontend (Image 5) needs this.
    The PDF  only lists an 'ack' endpoint, but the React
    frontend clearly needs a GET endpoint to display alerts.
    """
    alerts = db.query(Alert)\
               .order_by(Alert.is_acknowledged.asc(), Alert.timestamp.desc())\
               .all()
    return [AlertSchema.from_orm(alert) for alert in alerts]


@app.post("/api/v1/alerts/{alert_id}/ack", response_model=AlertSchema)
def acknowledge_alert(alert_id: int, db: Session = Depends(get_db)):
    """
     An endpoint for the "Acknowledge" button to update
    Alerts.is_acknowledged.
    """
    alert = db.query(Alert).filter(Alert.alert_id == alert_id).first()

    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")

    if alert.is_acknowledged:
        # Return the alert schema if already acknowledged
        return AlertSchema.from_orm(alert)

    alert.is_acknowledged = True
    db.commit()
    db.refresh(alert)

    # (Optional) Log this action
    log_entry = EventLog(
        source="API",
        log_level=LogLevel.INFO,
        message=f"Alert {alert_id} ({alert.node_id}) acknowledged by admin."
    )
    db.add(log_entry)
    db.commit()

    return AlertSchema.from_orm(alert)

# Root endpoint that redirects to the API documentation
@app.get("/")
async def root():
    return {"message": "Welcome to Flood-Safe Mumbai API. Visit /docs for the API documentation."}

# --- Main execution ---
if __name__ == "__main__":
    print("Starting Flood-Safe Mumbai FastAPI server...")
    print("Access the API docs at http://127.0.0.1:8000/docs")
    uvicorn.run(app, host="127.0.0.1", port=8000)