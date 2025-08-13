#!/bin/bash

# Patent Hash - Local Development Installation Script

echo "🚀 Setting up Patent Hash for local development..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ and try again."
    exit 1
fi

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL is not installed. Please install PostgreSQL and try again."
    exit 1
fi

echo "✅ Prerequisites check passed"

# Create database
echo "📊 Setting up database..."
createdb patent_hash_db 2>/dev/null || echo "Database already exists or couldn't create (you may need to create it manually)"

# Backend setup
echo "🔧 Setting up backend..."
cd backend
npm install

if [ ! -f .env ]; then
    cp .env.example .env
    echo "📝 Created backend/.env file - please edit it with your configuration"
fi

# Push database schema
echo "📊 Pushing database schema..."
npm run db:push

cd ..

# Frontend setup
echo "🎨 Setting up frontend..."
cd frontend
npm install

if [ ! -f .env ]; then
    cp .env.example .env
    echo "📝 Created frontend/.env file"
fi

cd ..

echo ""
echo "🎉 Setup complete! To start the application:"
echo ""
echo "1. Start the backend:"
echo "   cd backend && npm run dev"
echo ""
echo "2. In another terminal, start the frontend:"
echo "   cd frontend && npm run dev"
echo ""
echo "3. Open http://localhost:3000 in your browser"
echo ""
echo "📋 Don't forget to:"
echo "   - Edit backend/.env with your database credentials and API keys"
echo "   - Make sure PostgreSQL is running"
echo "   - Check the README.md for detailed configuration options"