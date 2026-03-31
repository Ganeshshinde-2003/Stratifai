#!/bin/bash

# Quick start script for AI Marketing Intelligence Engine
# This script starts both backend and frontend in separate terminal windows

echo "=================================="
echo "AI Marketing Intelligence Engine"
echo "Quick Start Script"
echo "=================================="
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found!"
    echo "Creating .env from .env.example..."
    cp .env.example .env
    echo ""
    echo "⚠️  IMPORTANT: Please edit .env and add your GEMINI_API_KEY"
    echo "   1. Get API key from: https://makersuite.google.com/app/apikey"
    echo "   2. Open .env file and replace 'your_gemini_api_key_here'"
    echo "   3. Run this script again"
    echo ""
    exit 1
fi

# Check if GEMINI_API_KEY is set
if grep -q "your_gemini_api_key_here" .env; then
    echo "⚠️  GEMINI_API_KEY not configured!"
    echo ""
    echo "Please edit .env and add your actual API key"
    echo "Get one from: https://makersuite.google.com/app/apikey"
    echo ""
    exit 1
fi

echo "✅ Environment configured"
echo ""

# Copy .env to backend directory for easier access
cp .env backend/.env

# Start backend
echo "Starting backend server..."
cd backend

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "Creating Python virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment and install dependencies
source venv/bin/activate
echo "Installing backend dependencies..."
pip install -q -r requirements.txt

# Start backend in background
echo "✅ Backend starting on http://localhost:8000"
python main.py &
BACKEND_PID=$!

cd ..

# Wait a moment for backend to start
sleep 3

# Start frontend
echo ""
echo "Starting frontend server..."
cd frontend

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install
fi

echo "✅ Frontend starting on http://localhost:3000"
npm run dev &
FRONTEND_PID=$!

cd ..

echo ""
echo "=================================="
echo "🚀 Application Started!"
echo "=================================="
echo ""
echo "Frontend: http://localhost:3000"
echo "Backend:  http://localhost:8000"
echo "API Docs: http://localhost:8000/api/docs"
echo ""
echo "Press Ctrl+C to stop all servers"
echo ""

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "Stopping servers..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    # Kill any remaining processes
    pkill -f "python main.py" 2>/dev/null
    pkill -f "next dev" 2>/dev/null
    echo "✅ Servers stopped"
    exit 0
}

# Trap Ctrl+C
trap cleanup INT

# Wait for Ctrl+C
wait
