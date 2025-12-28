# 🏙️ Visitor & Parcel Management System

This directory contains the core source code for the **Visitor & Parcel Management System**.

## 🚀 Quick Start (Local Development)

### **Standard Launcher (Windows)**
Run the **`start-local.bat`** file from this directory. It will:
1. Initialize the Backend server.
2. Initialize the Frontend application.
3. Automatically install all dependencies if missing.

### **Manual Start**
If you prefer manual control:

1. **Backend Development Server**
   ```bash
   cd backend
   npm install
   npm run dev
   ```
   *Runs on http://localhost:4000*

2. **Frontend Application**
   ```bash
   cd frontend
   npm install
   npm start
   ```
   *Runs on http://localhost:4200*

---

## 🔑 Demo Access
| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `admin@example.com` | `admin123` |
| **Security Guard** | `security@example.com` | `security123` |
| **Resident** | `resident@example.com` | `resident123` |

---

## 🏗️ Project Structure
- **/frontend**: Angular application (UI/UX, Dashboards, State management).
- **/backend**: Express/Node.js API (Authentication, WebSocket for real-time, Database logic).
- **/db**: Database initialization and configurations.

## ⚙️ Configuration
Environment variables can be found in `.env.example` within the respective subdirectories. Ensure you setup your local MySQL credentials in the backend `.env` file if not using the default setup.

---

## 📅 Features
- ✅ Role-Based Dashboards
- ✅ Real-time Notifications (Socket.IO)
- ✅ Modern Glassmorphism UI
- ✅ Visitor Approval Workflow
- ✅ Parcel Tracking System

*Refer to the [Root README](../README.md) for full project documentation and usage flow.*
