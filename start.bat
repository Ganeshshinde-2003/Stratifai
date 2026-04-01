@echo off
REM Quick start script for AI Marketing Intelligence Engine (Windows)
REM This script starts both backend and frontend

echo ==================================
echo AI Marketing Intelligence Engine
echo Quick Start Script (Windows)
echo ==================================
echo.

REM Check if .env exists
if not exist .env (
    echo [WARNING] .env file not found!
    echo Creating .env from .env.example...
    copy .env.example .env
    echo.
    echo [WARNING] IMPORTANT: Please edit .env and add your Vertex AI credentials
    echo    1. Set up GCP project and Vertex AI: https://console.cloud.google.com
    echo    2. Create Service Account with Vertex AI User role
    echo    3. Download JSON credentials and add to .env file
    echo    4. Run this script again
    echo.
    pause
    exit /b 1
)

echo [OK] Environment configured
echo.

REM Copy .env to backend directory for easier access
copy .env backend\.env

REM Start backend
echo Starting backend server...
cd backend

REM Check if virtual environment exists
if not exist venv (
    echo Creating Python virtual environment...
    python -m venv venv
)

REM Activate virtual environment and install dependencies
call venv\Scripts\activate.bat
echo Installing backend dependencies...
pip install -q -r requirements.txt

REM Start backend in new window
echo [OK] Backend starting on http://localhost:8000
start "Backend Server" cmd /k "venv\Scripts\activate.bat && python main.py"

cd ..

REM Wait a moment for backend to start
timeout /t 3 /nobreak > nul

REM Start frontend
echo.
echo Starting frontend server...
cd frontend

REM Check if node_modules exists
if not exist node_modules (
    echo Installing frontend dependencies...
    call npm install
)

echo [OK] Frontend starting on http://localhost:3000
start "Frontend Server" cmd /k "npm run dev"

cd ..

echo.
echo ==================================
echo Application Started!
echo ==================================
echo.
echo Frontend: http://localhost:3000
echo Backend:  http://localhost:8000
echo API Docs: http://localhost:8000/api/docs
echo.
echo Close the terminal windows to stop the servers
echo.
pause
