# FairRoom

FairRoom is a room booking system with a Rust/Axum backend and a React/Vite frontend.

## Live URLs

### Frontend

- Production: https://fortunate-recreation-production.up.railway.app
- Current preview deployment: https://skill-deploy-754r5fscz0-codex-agent-deploys.vercel.app

### Backend

- Production API: https://fairroom-production.up.railway.app

## Test Account

Use the live backend with a test account when needed:

```bash
curl -X POST https://fairroom-production.up.railway.app/auth/register \
  -H "Content-Type: application/json" \
  -d '{"full_name":"Test User","email":"test@example.com","password":"password123"}'
```

## API Endpoints

### Auth

- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login and get a token

### Me

- `GET /me` - Get the current user
- `GET /me/account-status` - Get strikes and booking eligibility
- `GET /me/account-activities` - Get account activity log
- `GET /me/bookings` - Get the user bookings list
- `GET /me/reminders` - Get booking reminders

### Rooms

- `GET /rooms` - List and search rooms
- `GET /rooms/:id` - Get a single room
- `GET /rooms/:id/bookings` - Get bookings for a room

### Bookings

- `POST /bookings` - Create a booking
- `GET /bookings/:id` - Get a booking
- `PATCH /bookings/:id` - Update a booking
- `POST /bookings/:id/cancel` - Cancel a booking

### Admin

- `GET /admin/bookings` - List all bookings
- `GET /admin/bookings/:id` - Get a booking
- `GET /admin/users` - Search users
- `GET /admin/users/:id/strikes` - Get a user's strikes
- `POST /admin/strikes` - Create a strike
- `POST /admin/strikes/:id/revoke` - Revoke a strike
- `GET /admin/rooms` - List rooms
- `POST /admin/rooms` - Create a room
- `PATCH /admin/rooms/:id` - Update a room
- `PUT /admin/rooms/:id/amenities` - Replace a room's amenities
- `DELETE /admin/rooms/:id/amenities/:amenityId` - Remove a room amenity
- `GET /admin/amenities` - List amenities
- `POST /admin/amenities` - Create an amenity
- `DELETE /admin/amenities/:id` - Delete an amenity
- `GET /admin/analytics/room-usage` - Get room usage analytics

## Auth Header

Authenticated requests must include:

```http
Authorization: Bearer <token>
```
