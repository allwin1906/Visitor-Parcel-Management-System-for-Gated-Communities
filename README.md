# 🏢 Visitor & Parcel Management System for Gated Communities

A modern, **full-stack** application designed to streamline security operations and enhance the living experience in gated communities. This system provides a digital alternative to manual registers, offering real-time visitor approvals, parcel delivery tracking, and role-based dashboards.

## 📌 Project Overview
The **Visitor & Parcel Management System** is a complete end-to-end solution featuring a robust Node.js backend, a MySQL database, and a polished Angular frontend. It has been transformed from a frontend prototype into a fully functional requirement-compliant application.

### Key features:
- **🌓 Dark Mode**: Premium themed experience with seamless light/dark mode persistence.
- **⚡ Real-time Notifications**: Socket.IO integration to notify residents instantly when a visitor or parcel arrives.
- **🛡️ Secure Auth**: JWT-based authentication with strict role-based access control (RBAC).
- **📱 Smart Dashboards**: Specialized views for Security, Residents, and Admin.
- **📊 Database Integrity**: Optimized MySQL schema using strictly two tables for high performance.

### User Roles
- **🏠 Residents**: Manage real-time visitor entry requests and acknowledge parcel pickups.
- **👮 Security Guards**: Log entries for visitors & parcels and manage entry/exit flows.
- **⚙️ Administrators**: Global system monitoring, user registration, and directory management.

---

## 🛠️ Prerequisites
Before getting started, ensure you have the following installed:

- **Node.js** (v18+)
- **MySQL Server** (Running on port 3306)
- **npm** (Included with Node.js)
- **Modern Web Browser** (Chrome or Edge recommended)

---

## 🚀 Project Setup (Step-by-Step)

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/allwin1906/Visitor-Parcel-Management-System-for-Gated-Communities.git
    cd Visitor-Parcel-Management-System-for-Gated-Communities/visitor-parcel-system
    ```

2.  **Configure Database**
    - Ensure MySQL is running.
    - Create a database named `visitor_system` (or update `.env` in the backend folder).
    - The system uses **TypeORM** with `synchronize: true` to auto-create tables on first run.

3.  **Seed Default Accounts (Crucial)**
    Navigate to the backend folder and run the seed script to create the default users:
    ```bash
    cd backend
    npm install
    npm run seed
    ```

4.  **Run the Application**
    - **Windows (Automatic)**: 
      From the `visitor-parcel-system` root, double-click `start-local.bat`.
    - **Manual (Manual Way)**:
      - **Backend**: `cd backend && npm run dev`
      - **Frontend**: `cd frontend && npm install && npm start`

5.  **Access points**
    - **Frontend:** [http://localhost:4200](http://localhost:4200)
    - **Backend API:** [http://localhost:4000](http://localhost:4000)

---

## 🔑 Login Credentials (After Seeding)
Use these accounts to evaluate the full-stack workflow:

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `admin@example.com` | `password` |
| **Security** | `security@example.com` | `password` |
| **Resident** | `john@example.com` | `password` |

---

## 💻 Tech Stack
- **Frontend**: Angular 16, TypeScript, Angular Material, RxJS.
- **Backend**: Node.js, Express, TypeORM.
- **Database**: MySQL.
- **Real-time**: Socket.IO.
- **Auth**: JSON Web Tokens (JWT).

---

## 📱 Core Workflows

### **👮 SECURITY GUARD**
- **Log Visitors**: Record name, phone, and purpose. Status starts as `Waiting`.
- **Log Parcels**: Record courier and tracking details. Status starts as `Received`.
- **Manage Entry**: Mark visitors as `Entered` or `Exited` once they cross the gate.

### **🏠 RESIDENT**
- **Approve Entries**: Receive instant alerts for `Waiting` visitors and mark them as `Approved` or `Rejected`.
- **Track Parcels**: View assigned parcels and mark them as `Collected` upon pickup.

### **⚙️ ADMIN**
- **System Monitoring**: View total visitors, pending requests, and parcel logs.
- **User Management**: Register new residents or security staff directly into the database.

---

## 🤝 Team Collaboration
*   **Version Control**: GitHub (`main` branch).
*   **Standards**: Branch before merging, descriptive commit messages, and local verification before push.

---
*Developed for a smarter, safer community living experience.*
