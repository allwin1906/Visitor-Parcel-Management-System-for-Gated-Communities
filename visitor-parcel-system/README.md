# Visitor & Parcel Management System

A full-stack application for managing visitors and parcels in gated communities.

## Tech Stack
- **Frontend**: Angular 16, Angular Material
- **Backend**: Node.js, Express, TypeScript, TypeORM, Socket.IO
- **Database**: MySQL
- **DevOps**: Docker, Docker Compose

## How to Run (Local without Docker)
1. **Prerequisites**: Node.js installed.
2. **Install Dependencies** (I've started this for you):
   ```bash
   cd backend && npm install
   cd frontend && npm install
   ```
3. **Start the App**:
   Run the `start-local.bat` file in the root directory.
   - Backend: http://localhost:4000
   - Frontend: http://localhost:4200

## How to Run (with Docker)
1. Ensure Docker Desktop is installed and running.
2. Run:
   ```bash
   docker-compose up --build
   ```

## Sample Credentials
Since the database starts empty, you can register a new user via the API or use the provided registration endpoint in Postman/curl (or implement a UI reg flow, but currently UI has Login).

**To create a Security Admin (via Curl/Postman):**
```bash
curl -X POST http://localhost:4000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name": "Security Guard", "email": "security@example.com", "password": "password", "role": "Security"}'
```

**To create a Resident:**
```bash
curl -X POST http://localhost:4000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name": "John Doe", "email": "john@example.com", "password": "password", "role": "Resident"}'
```

**Login in UI:**
- **Security**: `security@example.com` / `password`
- **Resident**: `john@example.com` / `password`

## API Endpoints

### Auth
- `POST /auth/register` - Create user
- `POST /auth/login` - Login

### Items (Visitor/Parcel)
- `POST /items` - Create item (Security only)
- `GET /items?residentId=X` - View items
- `PATCH /items/:id/status` - Update status (Resident can Approve/Reject, Security can Enter/Exit)

## Features
- Role-based Dashboard (Resident vs Security)
- JWT Authentication
- Real-time notifications via Socket.IO
- Persistent MySQL Database
