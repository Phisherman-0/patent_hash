@echo off
REM Patent Hash - Local Development Installation Script for Windows

echo 🚀 Setting up Patent Hash for local development...

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ and try again.
    pause
    exit /b 1
)

REM Check if PostgreSQL is installed
psql --version >nul 2>&1
if errorlevel 1 (
    echo ❌ PostgreSQL is not installed. Please install PostgreSQL and try again.
    pause
    exit /b 1
)

echo ✅ Prerequisites check passed

REM Create database
echo 📊 Setting up database...
createdb patent_hash_db 2>nul || echo Database already exists or couldn't create (you may need to create it manually)

REM Backend setup
echo 🔧 Setting up backend...
cd backend
call npm install

if not exist .env (
    copy .env.example .env
    echo 📝 Created backend/.env file - please edit it with your configuration
)

REM Push database schema
echo 📊 Pushing database schema...
call npm run db:push

cd ..

REM Frontend setup
echo 🎨 Setting up frontend...
cd frontend
call npm install

if not exist .env (
    copy .env.example .env
    echo 📝 Created frontend/.env file
)

cd ..

echo.
echo 🎉 Setup complete! To start the application:
echo.
echo 1. Start the backend:
echo    cd backend && npm run dev
echo.
echo 2. In another terminal, start the frontend:
echo    cd frontend && npm run dev
echo.
echo 3. Open http://localhost:3000 in your browser
echo.
echo 📋 Don't forget to:
echo    - Edit backend/.env with your database credentials and API keys
echo    - Make sure PostgreSQL is running
echo    - Check the README.md for detailed configuration options
pause