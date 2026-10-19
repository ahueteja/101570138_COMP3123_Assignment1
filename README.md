# COMP3123 Assignment 1 — Employee Management API
Student: 101570138

## Stack & purpose
Node.js / Express REST API with MongoDB and Mongoose. Users authenticate using bcryptjs-hashed credentials and JWTs; each employee record has a required `user` ObjectId. Authorization queries always include the token owner's ID so another user's employees cannot be retrieved, modified or deleted.

## Structure
- `app.js` Express middleware and routing; `server.js` local startup; `index.js` Vercel entrypoint
- `src/config` MongoDB connection; `src/models` MongoDB schemas; `src/routes` user and employee controllers/routes; `src/middleware` authentication and input validation
- `logs/` local Morgan request logs (generated when running locally)

## Install/run
1. Clone this repository, then `npm install`.
2. Copy `.env.example` to `.env` and set a MongoDB connection string (Atlas or local), a random JWT_SECRET of 32+ characters, and PORT=3000.
3. Ensure MongoDB is running and database name in the URI is `comp3123_assignment1`.
4. Run `npm start`. Test `GET http://localhost:3000/health`.
5. Import `postman/COMP3123_Assignment1.postman_collection.json` into Postman. Set the `baseUrl` collection variable if necessary. Use signup/login; set `token` from login, and replace `eid` with an existing employee ID.

## Endpoints
| Method | URL | Success |
|---|---|---|
| POST | /api/v1/user/signup | 201 |
| POST | /api/v1/user/login | 200 JWT |
| GET | /api/v1/emp/employees | 200 |
| POST | /api/v1/emp/employees | 201 |
| GET | /api/v1/emp/employees/:eid | 200 |
| PUT | /api/v1/emp/employees/:eid | 200 |
| DELETE | /api/v1/emp/employees?eid=xxx | 204 |
| GET | /health | 200 |

## Security and logging
Passwords are hashed with bcryptjs (12 rounds), excluded from User responses, and never committed. `Authorization: Bearer <token>` required on all employee endpoints; JWTs expire in 1 hour. Only employee records with `user` matching the verified token subject may be accessed. Helmet sets common security headers. An authentication rate limiter permits 15 requests per 15 minutes per IP for login/signup, then responds HTTP 429. The default limiter is in-memory, so Vercel serverless instances do not share state; for production use a shared rate-limit store. Inputs are validated for required fields, lengths, emails, ISO dates, numeric salaries, and MongoDB ObjectIds. Errors use JSON with correct 400/401/404/409/429/500 codes. Morgan logs requests locally to `logs/requests.log` without logging request bodies or tokens; console logs authentication outcome without secrets. Vercel filesystems are ephemeral so production logs appear in platform logs instead of persistent local files.

## Environment variables
`MONGODB_URI`, `JWT_SECRET`, optional `PORT`. Do not commit `.env` or credentials. Configure secrets in the Vercel project settings. `MONGODB_URI` must have database path `/comp3123_assignment1`.

## Tests and ownership demonstration
Register User A and B with different emails; log in as A and create employee A, then log in as B and create employee B. With B's token, requests to GET/PUT/DELETE employee A must return 404 and B's list must exclude employee A. Repeat in reverse. Test missing/invalid/expired JWT; invalid employee IDs, malformed JSON, missing fields, duplicate registration, incorrect password; send 16+ auth requests in 15 minutes to trigger HTTP 429. Capture Postman responses, Atlas Users and Employees collections (show ObjectId ownership, hashed passwords), health check, Helmet headers, and local log file screenshots. Export the Postman collection. Use only non-sensitive dummy test credentials and hide JWTs before sharing screenshots.

## Deployment
Import public repository into Vercel, add MONGODB_URI and JWT_SECRET environment variables, deploy, then test `https://<project>.vercel.app/health` and user/employee endpoints. Atlas network access must permit Vercel connections; configure database credentials with least privilege. Never commit secrets.
