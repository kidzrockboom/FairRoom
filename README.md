# FairRoom

A room booking system with a Rust/Axum backend and React/Vite frontend.

## Live URLs

| Service  | URL |
|----------|-----|
| Frontend | https://fortunate-recreation-production.up.railway.app |
| Backend  | https://fairroom-production.up.railway.app |

###  Test Against the Live Backend

Use the live backend URL above. A test account can be created via:

```bash
curl -X POST https://fairroom-production.up.railway.app/auth/register \
  -H "Content-Type: application/json" \
  -d '{"full_name": "Test User", "email": "test@example.com", "password": "password123"}'
```

## Basic API Reference's

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/register` | No | Register a new user |
| POST | `/auth/login` | No | Login and get a token |
| GET | `/me` | Yes | Get current user |
| GET | `/me/account-status` | Yes | Get strikes and booking eligibility |
| GET | `/me/account-activities` | Yes | Get account activity log |
| GET | `/me/bookings` | Yes | Get user's bookings |
| GET | `/me/reminders` | Yes | Get user's reminders |
| GET | `/rooms` | No | List/search rooms |
| GET | `/rooms/:id` | No | Get a single room |
| GET | `/rooms/:id/bookings` | No | Get bookings for a room |
| POST | `/bookings` | Yes | Create a booking |
| GET | `/bookings/:id` | Yes | Get a booking |
| PATCH | `/bookings/:id` | Yes | Update a booking |
| POST | `/bookings/:id/cancel` | Yes | Cancel a booking |

Authenticated requests require the header:
```
Authorization: Bearer <token>
```
