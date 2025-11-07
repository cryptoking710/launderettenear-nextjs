# How to Add Next.js Workflow in Replit

Since the Next.js app is in a subdirectory with separate dependencies, you need to create a workflow to run it.

## Option 1: Using Replit UI (Recommended)

1. **Open the Workflows Panel**
   - Click the "Tools" button in the left sidebar
   - Select "Workflows"

2. **Create New Workflow**
   - Click "+ Create Workflow"
   - Name it: **Next.js App**

3. **Add Shell Command Task**
   - Task type: **Execute Shell Command**
   - Command: `cd nextjs-app && bash start-nextjs.sh`
   - Wait for port: **3000**

4. **Save and Run**
   - Click "Save"
   - Click "Run" to start the Next.js server

## Option 2: Using Shell (Quick Test)

Just run this command in the Shell:

```bash
cd nextjs-app && bash start-nextjs.sh
```

## What the Workflow Does

1. Navigates to `nextjs-app/` directory
2. Checks if `node_modules` exists
3. If not, runs `npm install` (takes 2-3 minutes first time)
4. Starts Next.js dev server on port 3000
5. Server available at: http://localhost:3000

## Dual-App Architecture

After setup, you'll have TWO workflows running:

| Workflow | App | Port | Purpose |
|----------|-----|------|---------|
| Start application | Vite Admin | 5000 | Admin interface (Firebase Auth) |
| Next.js App | Next.js Public | 3000 | Public SEO-optimized pages |

Both apps connect to the same Firebase Firestore database.

## Troubleshooting

**Dependencies not installing:**
- Make sure you're in the `nextjs-app` directory
- Try: `cd nextjs-app && rm -rf node_modules && npm install`

**Port 3000 already in use:**
- Kill the process: `lsof -ti:3000 | xargs kill -9`
- Or use a different port in `package.json` scripts

**Firebase connection errors:**
- Set environment variables with `NEXT_PUBLIC_` prefix (see QUICK-START.md)
