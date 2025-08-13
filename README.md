# Patent Hash - Local Development Setup

Patent Hash is a full-stack application for protecting intellectual property through blockchain technology and AI integration.

## Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- Git

## Project Structure

```
patent-hash/
├── frontend/          # React frontend application
├── backend/           # Express.js backend API
├── shared/            # Shared types and schemas
└── attached_assets/   # Static assets
```

## Local Development Setup

### 1. Clone and Setup

```bash
git clone <your-repo-url>
cd patent-hash
```

### 2. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `backend/.env` with your local configuration:
- Set up your PostgreSQL connection details
- Add your API keys (OpenAI, Hedera, etc.)
- Configure session secret

### 3. Database Setup

```bash
# Make sure PostgreSQL is running locally
# Create the database
createdb patent_hash_db

# Push schema to database
cd backend
npm run db:push
```

### 4. Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
```

Edit `frontend/.env` if needed (defaults should work for local development).

### 5. Running the Application

#### Start Backend (Terminal 1)
```bash
cd backend
npm run dev
```
Backend will run on http://localhost:5000

#### Start Frontend (Terminal 2)
```bash
cd frontend
npm run dev
```
Frontend will run on http://localhost:3000

## Available Scripts

### Backend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run db:push` - Push schema changes to database
- `npm run db:studio` - Open Drizzle Studio

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Environment Variables

### Backend (.env)
- `DATABASE_URL` - PostgreSQL connection string
- `SESSION_SECRET` - Session encryption key
- `OPENAI_API_KEY` - OpenAI API key (optional)
- `HEDERA_ACCOUNT_ID` - Hedera account ID (optional)
- `HEDERA_PRIVATE_KEY` - Hedera private key (optional)
- `PORT` - Server port (default: 5000)

### Frontend (.env)
- `VITE_API_BASE_URL` - Backend URL (default: http://localhost:5000)

## Features

- **Patent Management**: File, track, and manage patents
- **AI Services**: Prior art search, similarity detection, classification
- **Blockchain Verification**: Immutable proof-of-existence using Hedera
- **Document Management**: Upload and manage patent documents
- **Analytics Dashboard**: Patent portfolio insights

## Development Notes

- Frontend proxy is configured to forward `/api/*` requests to the backend
- CORS is enabled between frontend and backend
- Hot module replacement is available in development
- TypeScript is configured with path aliases for imports

## Troubleshooting

1. **Database Connection Issues**: Ensure PostgreSQL is running and credentials are correct
2. **CORS Errors**: Check that `FRONTEND_URL` in backend `.env` matches your frontend URL
3. **Port Conflicts**: Make sure ports 3000 and 5000 are available
4. **Path Resolution**: Ensure shared types are accessible via the configured aliases

For more details, see the individual README files in the frontend and backend directories.