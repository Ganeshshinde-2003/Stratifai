# Getting Started Guide

## Complete Setup Guide for AI Marketing Intelligence Engine

This guide walks you through **everything** you need to install and run the application from scratch.

---

## 📋 Prerequisites Checklist

Before starting, you'll need to install the following software:

### 1. Python (Version 3.10 or higher)

**Check if you have Python:**
```bash
python3 --version
# or
python --version
```

**If you need to install Python:**

- **macOS:**
  ```bash
  # Using Homebrew (recommended)
  brew install python@3.11

  # Or download from python.org
  # Visit: https://www.python.org/downloads/
  ```

- **Windows:**
  1. Download from: https://www.python.org/downloads/
  2. Run the installer
  3. ✅ **IMPORTANT:** Check "Add Python to PATH" during installation

- **Linux (Ubuntu/Debian):**
  ```bash
  sudo apt update
  sudo apt install python3.11 python3.11-venv python3-pip
  ```

**Verify installation:**
```bash
python3 --version
# Should show: Python 3.10.x or higher
```

---

### 2. Node.js (Version 18 or higher)

**Check if you have Node.js:**
```bash
node --version
# Should show v18.x.x or higher
```

**If you need to install Node.js:**

- **macOS:**
  ```bash
  # Using Homebrew (recommended)
  brew install node

  # Or download from nodejs.org
  # Visit: https://nodejs.org/
  ```

- **Windows:**
  1. Download from: https://nodejs.org/
  2. Run the installer (choose LTS version)
  3. Follow installation wizard

- **Linux (Ubuntu/Debian):**
  ```bash
  curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
  sudo apt-get install -y nodejs
  ```

**Verify installation:**
```bash
node --version  # Should show v18.x.x or higher
npm --version   # Should show npm version
```

---

### 3. Google Cloud Platform & Vertex AI Setup

**This is REQUIRED for the AI to work.**

**How to set up Vertex AI:**

1. Go to: https://console.cloud.google.com
2. Create a new project or select an existing one
3. Enable the Vertex AI API:
   - Go to https://console.cloud.google.com/apis/library/aiplatform.googleapis.com
   - Click "Enable"
4. Create a Service Account:
   - Go to IAM & Admin > Service Accounts
   - Click "Create Service Account"
   - Name it (e.g., "stratifai-service-account")
   - Grant role: "Vertex AI User"
   - Click "Done"
5. Create and download credentials:
   - Click on your service account
   - Go to "Keys" tab
   - Click "Add Key" > "Create new key"
   - Choose "JSON" format
   - Download the JSON file
6. Keep the JSON file safe - you'll need it in the next section

**Note:** Vertex AI has a free tier. Check https://cloud.google.com/vertex-ai/pricing

---

## 🚀 Installation Steps

### Step 1: Navigate to Project Directory

Open your terminal/command prompt and navigate to the project:

```bash
cd /Users/gshinde/Downloads/ai-projects/ai-marketing-strategy-builder
```

---

### Step 2: Create Environment Configuration

**Copy the example environment file:**

```bash
cp .env.example .env
```

**Edit the `.env` file and add your Gemini API key:**

**macOS/Linux:**
```bash
nano .env
# or
vim .env
# or
open .env  # Opens in default text editor
```

**Windows:**
```bash
notepad .env
```

**Update the file with your Vertex AI credentials:**

1. Open the downloaded JSON credentials file
2. Copy the entire JSON content
3. Update `.env` to look like this:

```env
# Backend Configuration - Vertex AI
PORT=8000
PROJECT_ID=your-gcp-project-id
LOCATION=us-central1

google_credentials='paste-your-entire-json-here-on-one-line'

# Frontend Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

Replace:
- `your-gcp-project-id` with your actual GCP project ID (found in the JSON as "project_id")
- `paste-your-entire-json-here-on-one-line` with the entire JSON credentials (format it as a single-line string with single quotes)

**Example format:**
```env
google_credentials='{"type":"service_account","project_id":"my-project",...}'
```

**Save and close the file.**

---

### Step 3: Install Backend Dependencies

**Navigate to backend folder:**
```bash
cd backend
```

**Create a Python virtual environment:**
```bash
python3 -m venv venv
```

**Activate the virtual environment:**

- **macOS/Linux:**
  ```bash
  source venv/bin/activate
  ```
  You should see `(venv)` appear at the start of your terminal line.

- **Windows (Command Prompt):**
  ```bash
  venv\Scripts\activate.bat
  ```

- **Windows (PowerShell):**
  ```bash
  venv\Scripts\Activate.ps1
  ```

  *If you get an error about scripts being disabled, run this first:*
  ```powershell
  Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
  ```

**Install Python packages:**
```bash
pip install --upgrade pip
pip install -r requirements.txt
```

**Wait for installation to complete** (takes 1-2 minutes)

**Verify installation:**
```bash
pip list
# You should see fastapi, uvicorn, google-cloud-aiplatform, etc.
```

---

### Step 4: Install Frontend Dependencies

**Open a NEW terminal/command prompt** (keep the backend terminal open)

**Navigate to frontend folder:**
```bash
cd /Users/gshinde/Downloads/ai-projects/ai-marketing-strategy-builder/frontend
```

**Install Node.js packages:**
```bash
npm install
```

**Wait for installation to complete** (takes 2-3 minutes)

**Verify installation:**
```bash
npm list --depth=0
# You should see next, react, axios, etc.
```

---

## ▶️ Running the Application

You have **3 options** to run the application:

---

### **Option A: Quick Start (Automated) - RECOMMENDED**

**macOS/Linux:**
```bash
cd /Users/gshinde/Downloads/ai-projects/ai-marketing-strategy-builder
chmod +x start.sh
./start.sh
```

**Windows:**
```bash
cd C:\Users\...\ai-marketing-strategy-builder
start.bat
```

This script will:
- ✅ Check environment setup
- ✅ Install dependencies (if needed)
- ✅ Start backend server
- ✅ Start frontend server
- ✅ Open your browser automatically

---

### **Option B: Manual Start (Recommended for Learning)**

**Terminal 1 - Backend:**
```bash
cd /Users/gshinde/Downloads/ai-projects/ai-marketing-strategy-builder/backend
source venv/bin/activate  # Windows: venv\Scripts\activate
python main.py
```

You should see:
```
INFO:     Started server process
INFO:     Uvicorn running on http://0.0.0.0:8000
```

**Terminal 2 - Frontend:**
```bash
cd /Users/gshinde/Downloads/ai-projects/ai-marketing-strategy-builder/frontend
npm run dev
```

You should see:
```
ready - started server on 0.0.0.0:3000, url: http://localhost:3000
```

---

### **Option C: Development Mode with Hot Reload**

Same as Option B, but both servers will automatically restart when you make code changes.

---

## ✅ Verify Everything is Working

### 1. Check Backend Health

Open your browser and visit:
```
http://localhost:8000/health
```

You should see:
```json
{
  "status": "healthy",
  "service": "AI Marketing Intelligence Engine",
  "version": "1.0.0"
}
```

### 2. Check API Documentation

Visit:
```
http://localhost:8000/api/docs
```

You should see the interactive Swagger API documentation.

### 3. Check Frontend

Visit:
```
http://localhost:3000
```

You should see the **AI Marketing Intelligence Engine** homepage with:
- Title and description
- Toggle buttons (Product URL / Product Description)
- Input form
- Feature badges

---

## 🧪 Test the Application

### Quick Test with URL

1. Go to http://localhost:3000
2. Keep "Product URL" selected
3. Enter: `https://www.stripe.com`
4. Click **"Generate Marketing Strategy"**
5. Wait 30-60 seconds
6. You should see:
   - Product Summary
   - Target Audience
   - Market Positioning
   - 5 Ad Copy variations
   - 3 Email sequence
   - Landing Page structure
7. Click **"Download PDF"** to test PDF generation

### Quick Test with Text

1. Toggle to "Product Description"
2. Enter:
   ```
   Our product is a SaaS tool that helps small business owners
   manage their inventory, track sales, and generate reports.
   It integrates with popular e-commerce platforms like Shopify
   and WooCommerce. The main benefit is saving time and reducing
   manual data entry errors.
   ```
3. Click **"Generate Marketing Strategy"**
4. Verify results appear

---

## 🐛 Common Issues and Solutions

### Issue 1: "PROJECT_ID is required" or "google_credentials is required"

**Problem:** Backend can't find your Vertex AI credentials

**Solution:**
```bash
# Check if .env file exists
ls -la .env

# Verify it contains your credentials
cat .env

# Make sure it has:
# PROJECT_ID=your-project-id
# LOCATION=us-central1
# google_credentials='{"type":"service_account",...}'
```

---

### Issue 2: "Port 8000 already in use"

**Problem:** Another application is using port 8000

**Solution:**

**Find and kill the process:**

- **macOS/Linux:**
  ```bash
  lsof -ti:8000 | xargs kill -9
  ```

- **Windows:**
  ```bash
  netstat -ano | findstr :8000
  # Find the PID from the output
  taskkill /PID <PID_NUMBER> /F
  ```

**Or change the port in `.env`:**
```env
PORT=8001
```

---

### Issue 3: "Module not found" errors

**Problem:** Dependencies not installed

**Solution:**

**Backend:**
```bash
cd backend
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

**Frontend:**
```bash
cd frontend
rm -rf node_modules package-lock.json  # Clean install
npm install
```

---

### Issue 4: Virtual environment won't activate (Windows)

**Problem:** PowerShell execution policy

**Solution:**
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

Then try activating again:
```powershell
venv\Scripts\Activate.ps1
```

---

### Issue 5: "Cannot find module 'next'"

**Problem:** Frontend dependencies not installed

**Solution:**
```bash
cd frontend
npm install
```

---

### Issue 6: API connection errors in browser console

**Problem:** Backend not running or CORS issues

**Solution:**
1. Check backend is running at http://localhost:8000/health
2. Check frontend is running at http://localhost:3000
3. Clear browser cache (Cmd+Shift+R on Mac, Ctrl+Shift+R on Windows)
4. Restart both servers

---

### Issue 7: Scraping fails for certain URLs

**Problem:** Some websites block bots or require JavaScript

**Solution:**
- Try a different URL (e.g., https://www.stripe.com)
- Or use "Product Description" input instead

---

## 📊 What to Expect

### Normal Behavior

✅ **Backend startup:** 2-3 seconds
✅ **Frontend startup:** 5-10 seconds
✅ **Strategy generation:** 30-60 seconds
✅ **PDF download:** Instant

### First-Time Installation

⏱️ **Backend dependencies:** 1-2 minutes
⏱️ **Frontend dependencies:** 2-3 minutes
⏱️ **Total first-time setup:** 5-10 minutes

### Subsequent Runs

⚡ **Backend startup:** 2-3 seconds
⚡ **Frontend startup:** 5-10 seconds

---

## 🎯 Quick Reference Commands

### Start Everything (Quick)
```bash
# From project root
./start.sh          # macOS/Linux
start.bat           # Windows
```

### Start Backend Only
```bash
cd backend
source venv/bin/activate
python main.py
```

### Start Frontend Only
```bash
cd frontend
npm run dev
```

### Stop Everything
```bash
# Press Ctrl+C in each terminal
# Or close terminal windows
```

### View Logs
```bash
# Backend logs appear in backend terminal
# Frontend logs appear in frontend terminal
# Browser console (F12) shows frontend errors
```

### Test API
```bash
cd backend
source venv/bin/activate
python test_api.py
```

---

## 📁 Important Files

| File | Purpose |
|------|---------|
| `.env` | Your API key and configuration |
| `backend/main.py` | Backend entry point |
| `frontend/pages/index.tsx` | Frontend main page |
| `backend/requirements.txt` | Python dependencies |
| `frontend/package.json` | Node.js dependencies |

---

## 🎓 Next Steps

Once everything is running:

1. **Read the docs:**
   - `docs/product.md` - Product features and roadmap
   - `docs/claude.md` - Technical architecture
   - `README.md` - Complete documentation

2. **Explore the code:**
   - `backend/services/llm_pipeline.py` - See the 3-step AI pipeline
   - `frontend/components/` - UI components
   - `backend/routes/generate.py` - API endpoints

3. **Customize:**
   - Modify prompts in `llm_pipeline.py`
   - Change UI colors in CSS modules
   - Add new features

---

## 🆘 Getting Help

If you're still stuck:

1. **Check the logs:**
   - Backend terminal output
   - Frontend terminal output
   - Browser console (F12)

2. **Review documentation:**
   - `README.md` - Main documentation
   - `docs/claude.md` - Technical details
   - `DELIVERABLES.md` - Feature checklist

3. **Common error messages:**
   - "PROJECT_ID is required" → Check `.env` file has Vertex AI credentials
   - "Port already in use" → Kill process or change port
   - "Module not found" → Install dependencies
   - "Connection refused" → Backend not running

---

## ✅ Success Checklist

Before you start building, verify:

- [ ] Python 3.10+ installed (`python3 --version`)
- [ ] Node.js 18+ installed (`node --version`)
- [ ] GCP Service Account credentials obtained
- [ ] `.env` file created with Vertex AI credentials
- [ ] Backend dependencies installed (`pip list`)
- [ ] Frontend dependencies installed (`npm list`)
- [ ] Backend running (`http://localhost:8000/health` returns JSON)
- [ ] Frontend running (`http://localhost:3000` loads)
- [ ] Test generation works (try Stripe URL)
- [ ] PDF download works

---

## 🎉 You're Ready!

Once all checkboxes are ✅, you're ready to use the AI Marketing Intelligence Engine!

**Happy marketing!** 🚀
