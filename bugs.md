# Bug Report - User Management API

### 1. Unhandled Exception on Duplicate User (500 Error)
- **Endpoint**: `POST /users`
- **Description**: When attempting to create a user with an email that already exists in the system, the API returns a `500 Internal Server Error` instead of the documented `409 Conflict`.
- **OpenAPI Spec Expected**: `409 Conflict` with an `ErrorResponse` body.
- **Actual Behavior**: `500 Internal Server Error`.
- **Impact**: High. A 500 error indicates an unhandled exception on the server side, which can leak stack traces or lead to server instability. It also provides a poor experience for API consumers who cannot programmatically identify that the error is specifically a "duplicate" issue.
- **Steps to Reproduce**: 
    1. POST a valid user to `/dev/users`.
    2. POST the exact same user payload again.
    3. Observe the 500 status code.
    
# Bug Report - User Management API

### 1. Unhandled Exception on Duplicate User (500 Error)
- **Endpoint**: `POST /users`
- **Description**: When attempting to create a user with an email that already exists in the system, the API returns a `500 Internal Server Error` instead of the documented `409 Conflict`.
- **OpenAPI Spec Expected**: `409 Conflict` with an `ErrorResponse` body.
- **Actual Behavior**: `500 Internal Server Error`.
- **Impact**: High. A 500 error indicates an unhandled exception on the server side, which can leak stack traces or lead to server instability. It also provides a poor experience for API consumers who cannot programmatically identify that the error is specifically a "duplicate" issue.
- **Steps to Reproduce**: 
    1. POST a valid user to `/dev/users`.
    2. POST the exact same user payload again.
    3. Observe the 500 status code.

