# 🏢 Visitor & Parcel Management System for Gated Communities

A modern, full-stack application designed to streamline security operations and enhance the living experience in gated communities. This system provides a digital alternative to manual registers, offering real-time visitor approvals and parcel delivery tracking.

## 📌 Project Overview
The **Visitor & Parcel Management System** solves the security and logistical challenges faced by modern residential complexes. 

### Why this project?
- **For Security**: Eliminates manual paperwork and provides an instant way to reach residents.
- **For Residents**: Complete control over who enters their premises and instant notification of package arrivals.
- **For Admin**: Centralized monitoring of community activity and staff performance.

### User Roles
- **🏠 Residents**: Approve/Reject visitors, acknowledge parcels, and view personal logs.
- **👮 Security Guards**: Log visitor/parcel entries and manage status transitions.
- **⚙️ Administrators**: View global analytics and manage the resident directory.

---

## 🛠️ Prerequisites
Before getting started, ensure you have the following installed on your machine:

- **Node.js** (v18 or above)
- **npm** (Included with Node.js)
- **Git** (For cloning the repository)
- **Modern Web Browser** (Chrome or Edge recommended)
- **VS Code** (Optional but recommended for development)

---

## 🚀 Project Setup (Step-by-Step)

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/allwin1906/Visitor-Parcel-Management-System-for-Gated-Communities.git
    ```

2.  **Navigate to Project Folder**
    ```bash
    cd Visitor-Parcel-Management-System-for-Gated-Communities/visitor-parcel-system
    ```

3.  **Install Dependencies & Start**
    - **Method A: The Fast Way (Windows)**
      Double-click the `start-local.bat` file. This script will automatically install all necessary dependencies for both frontend and backend and launch the servers in separate windows.
    
    - **Method B: Manual Way (Multi-Terminal)**
      - **Backend**: `cd backend && npm install && npm run dev`
      - **Frontend**: `cd frontend && npm install && npm start`

4.  **Access the Application**
    Open your browser and visit:
    - **Frontend:** [http://localhost:4200](http://localhost:4200)
    - **Backend API:** [http://localhost:4000](http://localhost:4000)

---

## 🔑 Login Credentials (Demo Users)
Use these pre-configured accounts to test and evaluate the application workflow:

### **ADMIN LOGIN**
- **Email:** `admin@example.com`
- **Password:** `admin123`

### **SECURITY LOGIN**
- **Email:** `security@example.com`
- **Password:** `security123`

### **RESIDENT LOGIN**
- **Email:** `resident@example.com`
- **Password:** `resident123`

> *Note: These are demo credentials used for evaluation. If the custom passwords do not work on your local environment, try using `password`.*

---

## 📱 How to Use the Application

### **👮 SECURITY GUARD**
1. **Log Visitors**: Record the name, phone, and purpose of every visitor at the gate.
2. **Log Parcels**: Record incoming couriers and assign them to the correct resident.
3. **Manage Status**: Mark visitors as 'Entered' or 'Exited' to keep the log updated.

### **🏠 RESIDENT**
1. **Visitor Approvals**: Receive real-time requests and mark them as **Approved** or **Rejected**.
2. **Parcel Collection**: View your pending parcels and mark them as **Collected** once you pick them up.
3. **History**: Easily track who visited your unit and when.

### **⚙️ ADMIN**
1. **Dashboard Stats**: View total visitors today, pending approvals, and staff numbers.
2. **Staff Management**: View and verify the security team directory.
3. **Resident Directory**: Monitor the list of all registered residents.

---

## 🤝 Team Collaboration
*   **Context**: This is an internship project built by a 4-member team.
*   **Version Control**: We use Git for collaboration.
*   **Guidelines**:
    *   **Always Pull** the latest changes before starting work.
    *   Follow clear and descriptive commit message patterns.
    *   Test your changes locally before committing.

---

## 📝 Important Notes
*   **Frontend-Based Implementation**: The project features a highly polished UI for demonstration.
*   **Lifecycle Rules**: statuses follow strict transitions (e.g., a parcel must be 'Received' before it can be 'Collected').
*   **System Integrity**: Do not modify core business logic without consulting the lead developer.

---
*Developed for a smarter, safer community living experience.*
