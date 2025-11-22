# HR Pro - Fullstack HR Web Application

This is a production-minded sample HR application with:
- Node.js + Express backend
- MongoDB (Mongoose)
- JWT authentication (Admin & Employee)
- GPS-based punch in/out (frontend geolocation + backend Haversine verification)
- Admin dashboard with charts (Chart.js)
- Salary calculation scaffolding

## Quickstart (local)

1. Install MongoDB and ensure it's running (default mongodb://localhost:27017)
2. Backend:
   - cd backend
   - copy `.env.sample` to `.env` and edit values (JWT_SECRET, MONGO_URI)
   - npm install
   - npm run start
3. Frontend:
   - Serve `frontend/` folder statically (open `frontend/index.html` in browser)
   - Or run a static server like `npx serve frontend` for proper CORS with APIs
4. Create users:
   - Use POST /api/auth/register to create an admin and employees, or register via a REST client.
   - Example body: { "name":"Admin", "email":"admin@local", "password":"adminpass", "role":"admin" }

## Notes
- OFFICE_LAT and OFFICE_LON are set in `.env` (sample uses 19.123456,72.987654) and radius in meters is OFFICE_RADIUS_METERS (default 100).
- Attendance export CSV available at GET /api/attendance/report/csv (admin only).
- This project is intentionally simple and designed to be extended.

