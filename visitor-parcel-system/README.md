# Visitor & Parcel Management System

A full-stack application for managing visitors and parcels in gated communities.

## Tech Stack
- **Frontend**: Angular 16, Angular Material
- **Backend**: Node.js, Express, TypeScript, TypeORM, Socket.IO
- **Database**: MySQL
- **DevOps**: Docker, Docker Compose

## How to Start the Application
**Option 1: The Easy Way (Windows)**
1.  Navigate to the project folder.
2.  Double-click **`start-local.bat`**.
    *   This will automatically install dependencies and launch both the Backend (Port 4000) and Frontend (Port 4200).
    *   The application will open in your browser automatically.

**Option 2: Manual Start**
1.  **Backend**:
    ```bash
    cd backend
    npm install
    npm run dev
    ```
2.  **Frontend**:
    ```bash
    cd frontend
    npm install
    npm start
    ```

## Pre-Configured Login Credentials
The system comes with the following users pre-created (seeded):

| Role | Email | Password |
| :--- | :--- | :--- |
| **Security Guard** | `security@example.com` | `password` |
| **Resident** | `john@example.com` | `password` |
| **Admin** | `admin@example.com` | `password` |

## API Endpoints

### Auth
- `POST /auth/register` - Create user
- `POST /auth/login` - Login

### Items (Visitor/Parcel)
- `POST /items` - Create item (Security only)
- `GET /items?residentId=X` - View items
- `PATCH /items/:id/status` - Update status (Resident can Approve/Reject, Security can Enter/Exit)

## Features Implemented
- **Premium UI/UX**: Glassmorphism design with responsive gradients and animations.
- **Visitor Management**: Log visitors with Name, Phone, and Purpose. Residents can approve/reject.
- **Parcel Tracking**: Log packages with Courier Name and Tracking ID. Residents can acknowledge receipt.
- **Role-Based Access**: Specialized dashboards for Security, Residents, and Admins.
- **Real-time Stats**: Admin dashboard showing daily stats.
