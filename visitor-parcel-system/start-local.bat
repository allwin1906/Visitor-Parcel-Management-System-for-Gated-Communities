@echo off
echo Starting Visitor ^& Parcel Management System (Local Mode)

echo Starting Backend...
start "Backend" cmd /k "cd backend && npm run dev"

echo Starting Frontend...
start "Frontend" cmd /k "cd frontend && ng serve -o"

echo Done. Backend running on 4000. Frontend starting on 4200...
