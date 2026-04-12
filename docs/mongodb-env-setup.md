# MongoDB Environment Setup

Use these environment variables when wiring MongoDB into this app.

## Required

### `MONGODB_URI`

Server-only connection string for MongoDB.

- MongoDB Atlas:
  - Open Atlas.
  - Select your project and cluster.
  - Click `Connect`.
  - Choose `Drivers`.
  - Copy the `mongodb+srv://...` connection string.
  - Replace the placeholder username and password.
- Local MongoDB:
  - Use `mongodb://127.0.0.1:27017`

Example:

```env
MONGODB_URI=mongodb+srv://myuser:mypassword@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority&appName=losaltoshacks
```

### `MONGODB_DB_NAME`

Database name the app should use.

- In Atlas, open `Browse Collections` to see existing database names.
- If the database does not exist yet, choose the name you want and create it on first write.
- If your connection string already includes a path like `/marketpulse`, the DB name is usually `marketpulse`.

Examples:

```env
MONGODB_DB_NAME=losaltoshacks
MONGODB_DB_NAME=marketpulse
```

## Optional

### `VITE_API_BASE_URL`

Only needed if the frontend talks to a separate backend service.

- Local backend example:

```env
VITE_API_BASE_URL=http://localhost:3001
```

- Hosted backend example:

```env
VITE_API_BASE_URL=https://api.yourapp.com
```

If the frontend and backend are served from the same origin, this is usually unnecessary.

### `VITE_INSFORGE_URL`

Keep this only if InsForge is still handling auth or other services.

Current project value:

```env
VITE_INSFORGE_URL=https://mdd528ty.us-west.insforge.app
```

### `VITE_INSFORGE_ANON_KEY`

Keep this only if InsForge is still handling auth or other browser-side features.

- Get it from the InsForge dashboard, or
- Generate it from the InsForge MCP.

## Important Security Rule

Do not expose MongoDB credentials in browser variables.

- Correct:

```env
MONGODB_URI=...
MONGODB_DB_NAME=...
```

- Incorrect:

```env
VITE_MONGODB_URI=...
```

`VITE_*` values are bundled into the frontend and visible to users.

## Architecture Note

This repository is currently a Vite frontend. A MongoDB connection must be made from a server-side runtime, not directly from the browser.

Use one of these patterns:

1. A separate Node backend such as Express or Fastify
2. API routes in a full-stack framework
3. Serverless functions
