# Troubleshooting Guide for cPanel Deployment

## WebAssembly Memory Error

If you see this error:
```
RangeError: WebAssembly.instantiate(): Out of memory: Cannot allocate Wasm memory
```

### Solution:

**This is caused by low memory limits on cPanel shared hosting.**

**Option 1: Add Node.js Options (Recommended)**
1. In cPanel, go to **Node.js Selector**
2. Find your application and click **Edit** or **Environment Variables**
3. Add a new environment variable:
   - **Name**: `NODE_OPTIONS`
   - **Value**: `--max-old-space-size=512 --no-wasm-code-gc`
4. Save and restart your application

**Option 2: Update package.json start script**
The `package.json` has been updated with memory flags. Make sure you're using:
```json
"start": "node --max-old-space-size=512 --no-wasm-code-gc server.js"
```

**Option 3: Contact Hosting Provider**
- Request increased memory limits for Node.js applications
- Ask for at least 512MB memory allocation
- Some shared hosting may not support Node.js properly

**Option 4: Use Older Node.js Version**
- Try Node.js 16.x or 18.x instead of 20.x
- Newer versions use more memory for WebAssembly

## MODULE_NOT_FOUND Error

If you see this error:
```
Error: Cannot find module 'express'
code: 'MODULE_NOT_FOUND'
```

### Solution:

**The `node_modules` folder is missing or dependencies are not installed.**

1. **Via SSH/Terminal:**
   ```bash
   cd /home/citymoverscomph/public_html/api
   npm install --production
   ```

2. **Via cPanel Node.js Selector:**
   - Go to Node.js Selector in cPanel
   - Find your application
   - Click **"Run NPM Install"** or **"Install Dependencies"** button
   - Wait for installation to complete

3. **Verify installation:**
   ```bash
   ls -la node_modules/express
   ```
   Should show the express module directory.

## Common Issues and Solutions

### Issue 1: "Cannot find module" errors

**Cause:** Dependencies not installed

**Solution:**
```bash
cd /home/citymoverscomph/public_html/api
npm install --production
```

### Issue 2: ".env file not found"

**Cause:** Environment variables file is missing

**Solution:**
1. Create `.env` file in your project root:
   ```bash
   cd /home/citymoverscomph/public_html/api
   cp env.template .env
   ```
2. Edit `.env` file with your actual values
3. Restart your Node.js application

### Issue 3: "MONGO_URI not set"

**Cause:** MongoDB connection string is missing in .env

**Solution:**
1. Open `.env` file
2. Add your MongoDB connection string:
   ```
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database
   ```
3. Restart application

### Issue 4: "Port already in use"

**Cause:** Another process is using the port

**Solution:**
1. Change PORT in `.env` file to a different port
2. Or stop the conflicting process
3. Restart application

### Issue 5: "Permission denied" errors

**Cause:** File permissions are incorrect

**Solution:**
```bash
cd /home/citymoverscomph/public_html/api
chmod 755 uploads/
chmod 755 uploads/id-proofs/
```

### Issue 6: Application starts but crashes immediately

**Check logs:**
1. In cPanel Node.js Selector, click on your application
2. View **Error Logs** or **Application Logs**
3. Look for specific error messages
4. Common causes:
   - Missing environment variables
   - MongoDB connection failed
   - Missing required files

## Verification Steps

After deployment, verify:

1. **Dependencies installed:**
   ```bash
   ls node_modules/ | head -5
   ```

2. **Environment file exists:**
   ```bash
   ls -la .env
   ```

3. **Application starts:**
   - Check logs in cPanel
   - Visit your API URL: `https://yourdomain.com/api/`
   - Should return: `{"message":"CityMovers API is running",...}`

4. **MongoDB connection:**
   - Check application logs for "✅ MongoDB connected"
   - If you see connection errors, check MongoDB Atlas IP whitelist

## Quick Fix Commands

```bash
# Navigate to your application directory
cd /home/citymoverscomph/public_html/api

# Install dependencies
npm install --production

# Create .env file from template (if missing)
cp env.template .env

# Set proper permissions
chmod 755 uploads/
chmod 755 uploads/id-proofs/

# Check if node_modules exists
ls -la node_modules/ | head -5

# View recent logs
tail -f ~/logs/nodejs/your-app-name.log
```

## Still Having Issues?

1. **Check cPanel Error Logs:**
   - cPanel → Metrics → Errors
   - Look for recent errors

2. **Check Node.js Application Logs:**
   - Node.js Selector → Your App → View Logs

3. **Verify File Structure:**
   ```bash
   cd /home/citymoverscomph/public_html/api
   ls -la
   ```
   Should show:
   - `server.js`
   - `package.json`
   - `node_modules/` (directory)
   - `.env` (file)
   - `config/` (directory)
   - `routes/` (directory)

4. **Contact Support:**
   - Provide error logs
   - Provide your Node.js version: `node --version`
   - Provide npm version: `npm --version`

