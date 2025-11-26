# Quick Start: cPanel Deployment

## Before You Begin

⚠️ **Important**: Not all cPanel hosts support Node.js. Check if your hosting provider offers:
- Node.js Selector in cPanel
- Application Manager
- SSH/Terminal access

## Quick Deployment Steps

### 1. Prepare Your Files
- Upload all project files to your cPanel account (via File Manager or FTP)
- **Do NOT upload** `node_modules/` folder

### 2. Set Up Node.js App in cPanel
1. Log into cPanel
2. Find **Node.js Selector** or **Application Manager**
3. Click **Create Application**
4. Configure:
   - **Node.js Version**: 18.x or 20.x (LTS)
   - **Application Root**: Your project directory
   - **Application URL**: Your API domain/subdomain
   - **Startup File**: `server.js`

### 3. Install Dependencies ⚠️ CRITICAL STEP
**This step is REQUIRED!** Without it, you'll get "MODULE_NOT_FOUND" errors.

**Option A: Via cPanel Node.js Selector**
- Find your application in Node.js Selector
- Click **"Run NPM Install"** or **"Install Dependencies"** button
- Wait for installation to complete (may take 2-5 minutes)

**Option B: Via SSH/Terminal**
```bash
cd /home/citymoverscomph/public_html/api
npm install --production
```

**Verify installation:**
- Check that `node_modules/` folder exists in your project directory
- It should contain many subdirectories (express, mongoose, etc.)

### 4. Configure Environment Variables
Create `.env` file in your project root with:
```
MONGO_URI=your_mongodb_connection_string
PORT=5000
JWT_SECRET=your_secret_key
EMAIL_USER=your_email
EMAIL_PASS=your_password
PRODUCTION_FRONTEND_URL=https://your-frontend.com
# ... (see env.template for all variables)
```

### 5. Start Application
- In Node.js Selector, click **Restart** or **Start**
- Check logs for errors

### 6. Test
Visit: `https://your-api-domain.com/`
Should return: `{"message":"CityMovers API is running",...}`

## Common Issues

**"MODULE_NOT_FOUND" or "Cannot find module 'express'"** 
→ **MOST COMMON ISSUE!** Run `npm install --production` in your project directory
→ See `TROUBLESHOOTING.md` for detailed steps

**"Port in use"** → Change PORT in .env  
**"MongoDB connection failed"** → Check MongoDB Atlas IP whitelist  
**"Socket.io not working"** → Some hosts don't support WebSockets  
**".env file not found"** → Create .env file from env.template

## Need Help?

See `CPANEL_DEPLOYMENT.md` for detailed instructions.

