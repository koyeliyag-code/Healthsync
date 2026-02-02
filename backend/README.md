# HealthSync backend

This folder contains a small Express backend that implements the API the React app expects. It mirrors the endpoints previously in the Next.js `frontend` API routes.

Available endpoints
- POST /api/auth/login
- POST /api/auth/signup
- GET  /api/auth/me
- POST /api/auth/logout
- GET  /api/organizations

Environment variables
- `MONGODB_URI` — (optional) MongoDB connection string. If omitted the server uses an in-memory store (useful for quick testing).
- `MONGODB_DB` — (optional) database name (default: healthsync).
- `JWT_SECRET` — secret used to sign JWT tokens (default is `change-this-secret` — change for production).
- `PORT` — port for the server (default 3000).
- `GROQ_API_KEY` — API key for Groq AI chatbot integration (required for patient chat feature).
- `SERPAPI_KEY` — (optional) API key for SerpAPI research paper integration.
- `ENABLE_SOCKETS` — set to 'true' to enable Socket.IO for real-time notifications (default: false).
- `FRONTEND_URL` — frontend URL for CORS configuration (default: http://localhost:3000).

Groq AI Setup

To enable the AI chatbot feature:

1. Get a Groq API key from https://console.groq.com
2. Create a `.env` file in the backend directory (it's gitignored)
3. Add your API key: `GROQ_API_KEY=your_key_here`
4. The chatbot will now be available at `/api/groq/patient-chat`

The chatbot includes built-in safety constraints and cannot diagnose, prescribe, or provide emergency advice.

Run locally

```powershell
cd backend
npm install
npm run dev
```

Deploy
- Render (recommended for a full Node process): create a new Web Service and point it to this folder's start command `npm start`.
- Vercel: Vercel primarily uses serverless functions; this Express app can be deployed as a Docker service or you can port the routes into Vercel Serverless Functions if you prefer.
