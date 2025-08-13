# Local Development Deployment Guide

## Quick Start

### Automated Setup (Recommended)

**For Linux/macOS:**
```bash
./install-local.sh
```

**For Windows:**
```bash
install-local.bat
```

### Manual Setup

#### 1. Prerequisites
- Node.js 18+ and npm
- PostgreSQL 12+
- Git

#### 2. Database Setup
```bash
# Create database
createdb patent_hash_db

# Or using psql
psql -c "CREATE DATABASE patent_hash_db;"
```

#### 3. Backend Setup
```bash
cd backend
npm install
cp .env.example .env

# Edit .env with your configuration
# DATABASE_URL=postgresql://username:password@localhost:5432/patent_hash_db
# SESSION_SECRET=your-secret-key
# ... (other environment variables)

# Push database schema
npm run db:push
```

#### 4. Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env
```

#### 5. Start Development Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

## Configuration

### Environment Variables

#### Backend (.env)
```env
# Database
DATABASE_URL=postgresql://username:password@localhost:5432/patent_hash_db
PGHOST=localhost
PGPORT=5432
PGUSER=postgres
PGPASSWORD=your_password
PGDATABASE=patent_hash_db

# Server
NODE_ENV=development
PORT=5000
SESSION_SECRET=your-super-secret-session-key

# External Services (Optional)
OPENAI_API_KEY=sk-...
HEDERA_ACCOUNT_ID=0.0.xxxxx
HEDERA_PRIVATE_KEY=302e...

# CORS
FRONTEND_URL=http://localhost:3000
```

#### Frontend (.env)
```env
VITE_API_BASE_URL=http://localhost:5000
NODE_ENV=development
```

## Features Available Locally

✅ **Core Features:**
- Patent filing and management
- Document upload and storage
- User authentication (simplified for local dev)
- Dashboard and analytics
- Patent status tracking

⚙️ **Optional Features (require API keys):**
- AI-powered prior art search (OpenAI)
- Patent similarity detection (OpenAI)
- Blockchain verification (Hedera)

## Production Build

### Backend Production Build
```bash
cd backend
npm run build
npm start
```

### Frontend Production Build
```bash
cd frontend
npm run build
npm run preview
```

## Troubleshooting

### Common Issues

1. **Database Connection Failed**
   ```
   Error: connect ECONNREFUSED 127.0.0.1:5432
   ```
   Solution: Ensure PostgreSQL is running and credentials are correct

2. **CORS Errors**
   ```
   Access to fetch at 'http://localhost:5000/api/...' from origin 'http://localhost:3000' has been blocked
   ```
   Solution: Check `FRONTEND_URL` in backend .env matches your frontend URL

3. **Port Already in Use**
   ```
   Error: listen EADDRINUSE: address already in use :::5000
   ```
   Solution: Kill existing process or change PORT in .env

4. **Module Not Found**
   ```
   Cannot find module 'cors'
   ```
   Solution: Run `npm install` in the respective directory

5. **TypeScript Errors**
   Solution: Ensure all dependencies are installed and paths are correctly configured

### Database Issues

**Reset Database:**
```bash
cd backend
npm run db:push
```

**View Database:**
```bash
cd backend
npm run db:studio
```

### Development Tools

**Backend Tools:**
- API testing: `curl http://localhost:5000/health`
- Database studio: `npm run db:studio`
- Type checking: `npm run check`

**Frontend Tools:**
- React DevTools browser extension
- TypeScript checking: `npm run check`
- Build preview: `npm run preview`

## File Structure

```
patent-hash/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── lib/
│   │   └── hooks/
│   ├── package.json
│   ├── vite.config.ts
│   └── .env
├── backend/
│   ├── server/
│   ├── shared/
│   ├── package.json
│   ├── tsconfig.json
│   └── .env
└── shared/
    └── schema.ts
```

## Next Steps

1. **Configure External Services**: Add API keys for OpenAI and Hedera
2. **Test Core Features**: Create a test patent and verify functionality
3. **Customize**: Modify the application according to your requirements
4. **Deploy**: Follow production deployment guides for your hosting platform