# AI-Driven Cyber Threat Response System

A full-stack application for detecting and responding to cyber threats using intelligent automation. The system monitors network logs, detects potential threats using AI analysis, and automatically triggers appropriate responses based on threat levels.

## Features

- Real-time log monitoring and threat detection
- Automated response actions based on threat level
- Dashboard for visualizing and managing security incidents
- RESTful API for integration with other security tools
- Filterable and searchable log interface

## Architecture

The application consists of:

- **Backend**: Django REST API with models for Logs and Responses
- **Frontend**: React-based dashboard with Bootstrap styling
- **AI component**: Threat detection and response policy engine

## Prerequisites

- Python 3.10+
- Node.js 20+
- npm or yarn

## Setup Instructions

### Backend Setup

1. Create a virtual environment:
   ```
   python -m venv threadd
   source threadd/bin/activate  # On Windows: threadd\Scripts\activate
   ```

2. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

3. Create a `.env` file with the following variables:
   ```
   SECRET_KEY=your-secret-key
   DEBUG=True
   ```

4. Run migrations:
   ```
   cd backend
   python manage.py migrate
   ```

5. Create a superuser:
   ```
   python manage.py createsuperuser
   ```

6. Start the development server:
   ```
   python manage.py runserver
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm run dev
   ```

4. Access the application at `http://localhost:5173`

## API Endpoints

- `GET /api/logs/`: Retrieve all logs
- `POST /api/logs/`: Create a new log
- `POST /api/logs/{log_id}/respond/`: Trigger an automated response for a specific log

## Threat Levels

The system classifies threats into four levels:

- **Low**: Typical activity, no immediate action required
- **Medium**: Suspicious activity that requires monitoring
- **High**: Potential attack in progress, immediate action recommended
- **Critical**: Active breach attempt, immediate blocking required

## Automated Response Actions

Based on the threat level, the system will automatically:

- **Low**: Log the activity only
- **Medium**: Notify administrators
- **High**: Block the source IP
- **Critical**: Block the IP and notify the Security Operations Center (SOC)

## Future Improvements

- Machine learning-based threat detection
- Integration with SIEM systems
- User authentication and role-based access control
- Advanced analytics and reporting
- Real-time notification system

## License

[Sam Mochache &COPY](https://thread-6im3.onrender.com/)
