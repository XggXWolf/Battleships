# Backend API Endpoints Documentation

This document outlines the available REST API endpoints for the Battleships backend application. 

## Base URL
The default base URL for the API is generally `http://localhost:3000/api` (or depending on your server configuration).

---

## 1. App (`/`)

### `GET /`
- **Description:** Basic health check or greeting endpoint.
- **Access:** Public

---

## 2. Authentication (`/auth`)

These endpoints manage user authentication and session creation.

### `POST /auth/login`
- **Description:** Authenticates a user with local credentials.
- **Access:** Public (`@SkipAuth()`)
- **Rate Limit:** 10 requests per 60 seconds
- **Body:** `LoginDto`
- **Response:** Returns the `user` object and sets an `access_token` HTTP-only cookie.

### `POST /auth/register`
- **Description:** Registers a new user with local credentials.
- **Access:** Public (`@SkipAuth()`)
- **Rate Limit:** 10 requests per 60 seconds
- **Body:** `RegisterDto`
- **Response:** Returns the `user` object and sets an `access_token` HTTP-only cookie.

### `GET /auth/google/login`
- **Description:** Initiates the Google OAuth2 login flow. Redirects the user to the Google consent screen.
- **Access:** Public (Handled by Passport Google Auth Guard)

### `GET /auth/google/callback`
- **Description:** Callback endpoint for Google OAuth2.
- **Access:** Public (Handled by Passport Google Auth Guard)
- **Response:** Redirects to frontend (`FRONTEND_URL/oauth-success` or `FRONTEND_URL/oauth-failure`) and sets an `access_token` HTTP-only cookie on success.

---

## 3. Users (`/users`)

All routes under `/users` require authentication by default and expect 'admin' or 'user' roles unless marked otherwise.

### `POST /users`
- **Description:** Creates a new user directly in the database. (Note: For sign-up, use the `/auth/register` endpoint instead).
- **Access:** Protected (Admin only)
- **Body:** `CreateUserDto`

### `GET /users`
- **Description:** Retrieves a paginated list of users.
- **Access:** Protected
- **Query Parameters:** `PaginationDto` (e.g., page, limit)

### `GET /users/keep-alive`
- **Description:** A simple endpoint to keep the server/session alive.
- **Access:** Public (`@SkipAuth()`)
- **Response:** `{ "message": "Server is alive" }`

### `GET /users/me`
- **Description:** Retrieves the profile of the currently authenticated user.
- **Access:** Protected

### `GET /users/:identifier`
- **Description:** Retrieves a specific user by their identifier (ID or nickname).
- **Access:** Protected
- **Query Parameters:** `extend` (optional string)

### `PATCH /users/:identifier`
- **Description:** Updates a user's profile. Users can only update their own profiles unless they are an admin. Regular users cannot change their role or ELO rating.
- **Access:** Protected (Self or Admin)
- **Body:** `UpdateUserDto`

### `PATCH /users/:identifier/admin`
- **Description:** Administrative update for a user's profile.
- **Access:** Protected (Admin only)
- **Body:** `AdminUpdateUserDto`

### `PATCH /users/me/complete-profile`
- **Description:** Completes a user's profile, typically used to set a nickname after a successful Google OAuth login.
- **Access:** Protected (Skips profile completeness check)
- **Body:** `CompleteProfileDto`

### `DELETE /users/:identifier`
- **Description:** Deletes a user from the database.
- **Access:** Protected (Admin only)
