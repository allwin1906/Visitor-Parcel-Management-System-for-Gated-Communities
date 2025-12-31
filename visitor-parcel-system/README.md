# Visitor and Parcel Management System

## Project Overview
This project is a web-based application designed to manage visitors and parcels for gated communities. The system replaces traditional manual entry logs with a digital solution, enhancing security and convenience for residents and security guards. It allows security guards to log entries and residents to approve or reject visitors in real-time.

## Objectives
- To digitize the manual entry/exit logging process.
- To provide a secure and efficient way to handle parcel deliveries.
- To ensure only authorized visitors are allowed entry.
- To provide real-time updates to residents using WebSockets.

## Technology Stack
- **Frontend:** Angular 16, HTML5, CSS3
- **Backend:** Node.js, Express.js
- **Database:** MySQL
- **Authentication:** JWT (JSON Web Tokens)
- **Real-time Communication:** Socket.io

## Modules
1.  **Admin Module:** For managing users (Residents, Security Guards) and viewing dashboard statistics.
2.  **Resident Module:** For viewing visitor logs, approving/rejecting entry requests, and tracking parcels.
3.  **Security Module:** For logging new visitors and parcels, and updating their status upon exit/collection.

## How to Run the Project

### Prerequisites
- Node.js (v14 or higher) installed.
- MySQL Server installed and running.

### 1. Database Setup
Ensure your MySQL server is running. The application uses TypeORM with `synchronize: true`, so the tables will be created automatically upon connection.
Update the `.env` file in the `backend` folder with your database credentials.

### 2. Backend Setup
1. Open a terminal and navigate to the `backend` folder.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the server:
   ```bash
   npm run dev
   ```
   Server runs on: `http://localhost:4000`

### 3. Frontend Setup
1. Open a new terminal and navigate to the `frontend` folder.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the application:
   ```bash
   npm start
   ```
   Application runs on: `http://localhost:4200`

## Default Login Credentials
Use the following credentials to test different user roles:

| Role | Email | Password |
|---|---|---|
| **Admin** | `admin@example.com` | `admin123` |
| **Security** | `security@example.com` | `security123` |
| **Resident** | `resident@example.com` | `resident123` |

## Future Enhancements
- Mobile app integration for residents.
- QR code based entry for frequent visitors.
- Email notifications for parcel arrival.
