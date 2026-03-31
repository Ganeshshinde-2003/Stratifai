# Troubleshooting Guide

## Common Issues and Solutions

### 1. ModuleNotFoundError: No module named 'backend'

**Error Message:**
```
Traceback (most recent call last):
  File "/path/to/backend/main.py", line 3, in <module>
    from backend.routes import generate
ModuleNotFoundError: No module named 'backend'
```

**Cause:** Python import path issue when running from backend directory

**Solution (FIXED):** This has been fixed in the code. If you still see this:

1. Make sure you have the latest code
2. The imports in `backend/main.py` should use `from routes import generate` (not `from backend.routes`)

**Alternative Solution - Manual Run:**
```bash
# Option 1: Run from backend directory (recommended)
cd backend
source venv/bin/activate
python main.py

# Option 2: Run from project root
source backend/venv/bin/activate
cd backend
python main.py
```

---

### 2. ValueError: GEMINI_API_KEY is required

**Error Message:**
```
ValueError: GEMINI_API_KEY is required
```

**Cause:** API key not configured or not accessible

**Solution:**

1. **Check .env file exists in project root:**
   ```bash
   ls -la .env
   ```

2. **Verify it contains your API key:**
   ```bash
   cat .env
   # Should show: GEMINI_API_KEY=AIzaSyC...
   ```

3. **If missing, create it:**
   ```bash
   cp .env.example .env
   # Edit .env and add your actual API key
   ```

4. **Get API key:**
   - Visit: https://makersuite.google.com/app/apikey
   - Sign in with Google
   - Click "Create API Key"
   - Copy and paste into .env file

5. **If using manual start, ensure .env is in backend directory:**
   ```bash
   cp .env backend/.env
   ```

---

### 3. Port 8000 already in use

**Error Message:**
```
ERROR: [Errno 48] Address already in use
```

**Cause:** Another process is using port 8000

**Solution:**

**macOS/Linux:**
```bash
# Find and kill the process
lsof -ti:8000 | xargs kill -9

# Verify port is free
lsof -i :8000
```

**Windows:**
```bash
# Find process using port 8000
netstat -ano | findstr :8000

# Kill the process (replace PID with actual number)
taskkill /PID <PID> /F
```

**Alternative - Change Port:**
Edit `.env` file:
```env
PORT=8001
```

Then update frontend to connect to new port in `frontend/services/api.ts` or use environment variable.

---

### 4. npm/node not found

**Error Message:**
```
bash: npm: command not found
```

**Cause:** Node.js not installed or not in PATH

**Solution:**

1. **Install Node.js:**
   - macOS: `brew install node`
   - Windows: Download from https://nodejs.org/
   - Linux: `curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash - && sudo apt-get install -y nodejs`

2. **Verify installation:**
   ```bash
   node --version
   npm --version
   ```

3. **Add to PATH (if needed):**
   - macOS/Linux: Add to `~/.bashrc` or `~/.zshrc`:
     ```bash
     export PATH="/usr/local/bin:$PATH"
     ```
   - Windows: System Properties → Environment Variables → Path

---

### 5. python3: command not found

**Error Message:**
```
bash: python3: command not found
```

**Cause:** Python not installed or not in PATH

**Solution:**

1. **Check if python works (without the 3):**
   ```bash
   python --version
   ```

2. **If it shows Python 3.x, use `python` instead of `python3`**

3. **Otherwise, install Python:**
   - macOS: `brew install python@3.11`
   - Windows: Download from https://python.org/downloads/
   - Linux: `sudo apt update && sudo apt install python3.11`

4. **Verify installation:**
   ```bash
   python3 --version
   # or
   python --version
   ```

---

### 6. Virtual environment won't activate (Windows)

**Error Message:**
```
File cannot be loaded because running scripts is disabled on this system
```

**Cause:** PowerShell execution policy

**Solution:**
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

Then try activating again:
```powershell
venv\Scripts\Activate.ps1
```

---

### 7. Frontend shows "Cannot connect to backend"

**Error in Browser Console:**
```
Error: Network Error
```

**Cause:** Backend not running or CORS issue

**Solution:**

1. **Verify backend is running:**
   - Visit: http://localhost:8000/health
   - Should return JSON: `{"status": "healthy", ...}`

2. **Check backend terminal for errors**

3. **Restart both servers:**
   ```bash
   # Kill both servers (Ctrl+C)
   # Restart using start script
   ./start.sh
   ```

4. **Clear browser cache:**
   - Chrome/Firefox: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)

---

### 8. "Cannot find module 'next'" or similar npm errors

**Error Message:**
```
Error: Cannot find module 'next'
```

**Cause:** Frontend dependencies not installed

**Solution:**

1. **Clean install:**
   ```bash
   cd frontend
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **If still failing, check npm cache:**
   ```bash
   npm cache clean --force
   npm install
   ```

---

### 9. Scraping fails for certain URLs

**Error Message:**
```
Failed to scrape URL: ...
```

**Cause:**
- Website blocks bots
- Website requires JavaScript
- Slow website (timeout)

**Solution:**

1. **Try a different URL:**
   - ✅ Works: https://www.stripe.com
   - ✅ Works: https://www.shopify.com
   - ❌ May fail: JavaScript-heavy SPAs

2. **Use text input instead:**
   - Toggle to "Product Description"
   - Paste product description
   - Generate strategy

---

### 10. LLM returns "Invalid JSON" errors

**Error Message:**
```
Failed to get valid JSON after 3 attempts
```

**Cause:** Gemini API occasionally returns malformed JSON

**Solution:**

1. **This is already handled by retry logic (3 attempts)**

2. **If persistent:**
   - Check API key is valid
   - Check Gemini API quota: https://console.cloud.google.com/
   - Try again in a few minutes

---

### 11. PDF download not working

**Symptom:** Clicking "Download PDF" does nothing

**Cause:**
- Missing reportlab dependency
- Browser blocking download

**Solution:**

1. **Verify reportlab installed:**
   ```bash
   cd backend
   source venv/bin/activate
   pip list | grep reportlab
   ```

2. **Reinstall if missing:**
   ```bash
   pip install reportlab
   ```

3. **Check browser console (F12) for errors**

4. **Try different browser**

---

### 12. Webpack cache errors (Next.js)

**Warning in Frontend Terminal:**
```
[webpack.cache.PackFileCacheStrategy] Caching failed for pack
```

**Cause:** Next.js build cache issue

**Solution:**

**These are warnings, not errors - they don't affect functionality**

To clear them:
```bash
cd frontend
rm -rf .next
npm run dev
```

---

## Environment Checklist

If nothing works, verify these basics:

```bash
# 1. Python installed and correct version
python3 --version   # Should be 3.10+

# 2. Node.js installed and correct version
node --version      # Should be 18+

# 3. Virtual environment activated
which python        # Should point to venv/bin/python

# 4. Dependencies installed
pip list            # Should show fastapi, uvicorn, etc.
npm list --depth=0  # Should show next, react, etc.

# 5. API key configured
cat .env            # Should contain actual API key

# 6. Ports free
lsof -i :8000       # Should be empty
lsof -i :3000       # Should be empty

# 7. .env accessible
ls -la .env         # Should exist
ls -la backend/.env # Should exist (copied by start script)
```

---

## Quick Reset (Nuclear Option)

If all else fails, complete reset:

```bash
# 1. Stop all servers
# Press Ctrl+C in all terminals

# 2. Kill any remaining processes
pkill -f "python main.py"
pkill -f "next dev"

# 3. Clean backend
cd backend
rm -rf venv
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# 4. Clean frontend
cd ../frontend
rm -rf node_modules .next package-lock.json
npm install

# 5. Verify .env exists and is correct
cd ..
cat .env  # Should have your actual API key

# 6. Start fresh
./start.sh
```

---

## Getting Help

If you've tried everything:

1. **Check the error message carefully** - often tells you exactly what's wrong
2. **Search this document** for the specific error
3. **Check logs:**
   - Backend terminal output
   - Frontend terminal output
   - Browser console (F12 → Console tab)
4. **Review documentation:**
   - `GETTING_STARTED.md` - Setup guide
   - `README.md` - Complete docs
   - `docs/claude.md` - Technical architecture

---

## Verified Working Configurations

These setups are known to work:

### macOS
- Python 3.11 via Homebrew
- Node 18.x via Homebrew
- Terminal or iTerm2

### Windows 10/11
- Python 3.11 from python.org
- Node 18.x from nodejs.org
- PowerShell or Command Prompt

### Linux (Ubuntu 22.04)
- Python 3.10 via apt
- Node 18.x via NodeSource
- Bash

---

**Last Updated:** 2024-03-28
