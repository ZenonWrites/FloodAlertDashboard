# 🌊 Project Flood-Safe Mumbai

A complete, production-ready IoT Flood Monitoring System with Real-Time Dashboard.

## 📋 Table of Contents

- [System Overview](#system-overview)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Features](#features)
- [Troubleshooting](#troubleshooting)

## 🎯 System Overview

Flood-Safe Mumbai is a comprehensive IoT monitoring system designed to track water levels across multiple flood-prone locations in Mumbai. The system consists of:

- **IoT Sensor Nodes**: Deployed at strategic locations to monitor water levels
- **FastAPI Backend**: RESTful API server for data management
- **PostgreSQL Database**: Reliable data storage and retrieval
- **React Dashboard**: Real-time monitoring interface with live updates

## 🛠 Technology Stack

### Backend
- **FastAPI** 0.104.1 - Modern Python web framework
- **SQLAlchemy** 2.0.23 - SQL toolkit and ORM
- **PostgreSQL** - Primary database
- **Uvicorn** - ASGI server

### Frontend
- **React** 18.2.0 - UI library
- **Recharts** 2.10.3 - Data visualization
- **CSS3** - Custom styling

## 📁 Project Structure

```
flood-safe-mumbai/
├── backend/
│   ├── main.py              # FastAPI application
│   └── requirements.txt     # Python dependencies
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── DashboardLayout.jsx
│   │   │   ├── SystemStatusHeader.jsx
│   │   │   ├── DeviceManagementGrid.jsx
│   │   │   ├── NodeDetailView.jsx
│   │   │   ├── LiveDataChart.jsx
│   │   │   ├── EventLogFeed.jsx
│   │   │   ├── AlertsPanel.jsx
│   │   │   └── *.css (component styles)
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── index.js
│   └── package.json
├── database_schema.sql      # Database schema
├── generate_dummy_data.py   # Data generation script
└── README.md
```

## ✅ Prerequisites

Before you begin, ensure you have the following installed:

- **Python 3.9+** - [Download](https://www.python.org/downloads/)
- **Node.js 16+** - [Download](https://nodejs.org/)
- **PostgreSQL 13+** - [Download](https://www.postgresql.org/download/)
- **pip** - Python package installer (usually comes with Python)
- **npm** - Node package manager (comes with Node.js)

## 🚀 Installation & Setup

### Step 1: Database Setup

#### 1.1 Create PostgreSQL Database

```bash
# Access PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE floodsafe;

# Exit PostgreSQL
\q
```

#### 1.2 Create Database Schema

```bash
# Run the schema file
psql -U postgres -d floodsafe -f database_schema.sql
```

**Alternative for SQLite** (for testing):
- Modify `backend/main.py` line 19 to: `DATABASE_URL = "sqlite:///./floodsafe.db"`
- For SQLite, change BIGSERIAL to INTEGER in the schema

### Step 2: Backend Setup

#### 2.1 Navigate to Backend Directory

```bash
cd backend
```

#### 2.2 Create Virtual Environment (Recommended)

```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

#### 2.3 Install Dependencies

```bash
pip install -r requirements.txt
```

#### 2.4 Configure Database Connection

Edit `backend/main.py` line 19 if needed:

```python
DATABASE_URL = "postgresql://postgres:YOUR_PASSWORD@localhost:5432/floodsafe"
```

Replace `YOUR_PASSWORD` with your PostgreSQL password.

### Step 3: Generate Dummy Data

#### 3.1 Configure Data Generator

Edit `generate_dummy_data.py` database configuration (around line 11):

```python
DB_CONFIG = {
    'dbname': 'floodsafe',
    'user': 'postgres',
    'password': 'YOUR_PASSWORD',  # Replace with your password
    'host': 'localhost',
    'port': '5432'
}
```

#### 3.2 Run Data Generator

```bash
python generate_dummy_data.py
```

You should see output like:
```
🗑️  Cleaning existing data...
📍 Inserting nodes...
✅ Inserted 8 nodes
📊 Generating sensor readings...
✅ Inserted 150 sensor readings
🚨 Generating alerts...
✅ Inserted 8 alerts
📝 Generating event logs...
✅ Inserted 30 event logs
✅ Database populated successfully!
```

### Step 4: Frontend Setup

#### 4.1 Navigate to Frontend Directory

```bash
cd ../frontend
```

#### 4.2 Install Dependencies

```bash
npm install
```

#### 4.3 Verify API Configuration

The frontend is pre-configured to connect to `http://localhost:8000`. If your backend runs on a different port, update the `API_BASE_URL` constant in each component file.

## 🎮 Running the Application

### Terminal 1: Start Backend Server

```bash
cd backend
# Activate virtual environment if not already active
# Windows: venv\Scripts\activate
# macOS/Linux: source venv/bin/activate

# Run the server
python main.py
```

The backend will start on: **http://localhost:8000**

You can test it by visiting: http://localhost:8000/docs (FastAPI automatic documentation)

### Terminal 2: Start Frontend Development Server

```bash
cd frontend
npm start
```

The dashboard will open automatically in your browser at: **http://localhost:3000**

## 🎨 Features

### Dashboard Components

1. **System Status Header**
   - Real-time KPIs (updates every 5 seconds)
   - Nodes online/offline/maintenance count
   - Active alerts counter
   - Daily readings statistics
   - Average water level

2. **Active Alerts Panel**
   - Real-time flood alerts
   - Water level readings
   - Node information
   - One-click alert acknowledgment
   - Verification image links

3. **Device Management Grid**
   - All registered nodes
   - Status indicators (Online/Offline/Maintenance)
   - Firmware versions
   - Last ping timestamps
   - Click to select node for details

4. **Node Detail View**
   - Comprehensive node information
   - Current sensor readings
   - Water level history chart
   - Signal strength monitoring
   - Real-time updates

5. **Event Log Feed**
   - System-wide event logs
   - Color-coded by severity (INFO/WARN/ERROR)
   - Source identification
   - Auto-refresh every 10 seconds

## 📡 API Documentation

### Base URL
```
http://localhost:8000
```

### Endpoints

#### 1. System Status
```http
GET /api/v1/system/status
```

Returns system-wide KPIs and statistics.

**Response:**
```json
{
  "nodesOnline": 6,
  "nodesOffline": 1,
  "nodesMaintenance": 1,
  "activeAlerts": 3,
  "totalReadingsToday": 142,
  "avgWaterLevel": 8.45
}
```

#### 2. Get All Nodes
```http
GET /api/v1/nodes
```

Returns list of all registered sensor nodes.

#### 3. Get Node Details
```http
GET /api/v1/nodes/{node_id}
```

Returns detailed information for a specific node including 20 most recent readings.

#### 4. Get Alerts
```http
GET /api/v1/alerts?active=true
```

Query Parameters:
- `active` (optional): Filter by acknowledgment status

#### 5. Acknowledge Alert
```http
POST /api/v1/alerts/{alert_id}/ack
```

Marks an alert as acknowledged.

#### 6. Get Event Logs
```http
GET /api/v1/logs/events?limit=50
```

Query Parameters:
- `limit` (optional): Number of logs to return (default: 50)

### Interactive API Documentation

FastAPI provides automatic interactive documentation:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## 🐛 Troubleshooting

### Database Connection Issues

**Problem**: `psycopg2.OperationalError: could not connect to server`

**Solution**:
1. Ensure PostgreSQL is running
2. Verify connection parameters in `main.py`
3. Check if database `floodsafe` exists
4. Verify PostgreSQL is accepting connections on port 5432

### Backend Won't Start

**Problem**: `ModuleNotFoundError: No module named 'fastapi'`

**Solution**:
1. Ensure virtual environment is activated
2. Run `pip install -r requirements.txt` again
3. Verify Python version is 3.9+

### Frontend Can't Connect to Backend

**Problem**: Network errors or CORS issues

**Solution**:
1. Ensure backend is running on port 8000
2. Check browser console for errors
3. Verify CORS middleware in `main.py` includes your frontend URL
4. Clear browser cache and reload

### No Data in Dashboard

**Problem**: Dashboard loads but shows no data

**Solution**:
1. Run `generate_dummy_data.py` to populate database
2. Check backend logs for errors
3. Verify database connection in backend
4. Check browser console for API errors

### Port Already in Use

**Problem**: `Error: listen EADDRINUSE: address already in use`

**Solution**:

For Backend (port 8000):
```bash
# Windows
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:8000 | xargs kill -9
```

For Frontend (port 3000):
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:3000 | xargs kill -9
```

## 🔧 Advanced Configuration

### Production Deployment

For production deployment, consider:

1. **Backend**:
   - Use environment variables for sensitive data
   - Set up Gunicorn or similar WSGI server
   - Enable HTTPS
   - Configure proper logging
   - Set up database connection pooling

2. **Frontend**:
   - Build for production: `npm run build`
   - Serve static files with Nginx or similar
   - Update API_BASE_URL to production backend
   - Enable HTTPS

3. **Database**:
   - Regular backups
   - Connection pooling
   - Performance tuning
   - Security hardening

### Environment Variables

Create a `.env` file in the backend directory:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/floodsafe
SECRET_KEY=your-secret-key
DEBUG=False
```

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Review FastAPI docs: https://fastapi.tiangolo.com/
3. Review React docs: https://react.dev/

## 📄 License

This project is created for educational and demonstration purposes.

---

**Built with ❤️ for Mumbai's flood safety**
