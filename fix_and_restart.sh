#!/bin/bash

echo "=================================="
echo "Quick Fix & Restart Script"
echo "=================================="
echo ""

echo "Fixing import issue..."

# Copy .env to backend if it exists
if [ -f .env ]; then
    cp .env backend/.env
    echo "✅ .env copied to backend directory"
else
    echo "⚠️  No .env file found in project root"
    echo "Please create one from .env.example"
    exit 1
fi

echo ""
echo "Starting servers..."
echo ""

# Kill any existing processes
echo "Stopping any existing servers..."
pkill -f "python main.py" 2>/dev/null
pkill -f "next dev" 2>/dev/null
sleep 2

# Start backend
echo "Starting backend..."
cd backend

if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

source venv/bin/activate
pip install -q -r requirements.txt

echo "✅ Backend starting on http://localhost:8000"
python main.py &
BACKEND_PID=$!

cd ..

# Wait for backend to start
sleep 3

# Start frontend
echo "Starting frontend..."
cd frontend

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
echo "✅ Servers Started!"
echo "=================================="
echo ""
echo "Frontend: http://localhost:3000"
echo "Backend:  http://localhost:8000"
echo "API Docs: http://localhost:8000/api/docs"
echo ""
echo "Press Ctrl+C to stop"
echo ""

# Cleanup function
cleanup() {
    echo ""
    echo "Stopping servers..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    pkill -f "python main.py" 2>/dev/null
    pkill -f "next dev" 2>/dev/null
    echo "✅ Stopped"
    exit 0
}

trap cleanup INT

# Wait
wait
