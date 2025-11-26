# cPanel Deployment Guide for Swift-Ship Backend

## Prerequisites

Before deploying, ensure your cPanel hosting supports Node.js. Most cPanel hosts offer this through:
- **Node.js Selector** (in cPanel dashboard)
- **Application Manager** (some hosts)
- **Terminal/SSH access** (for manual setup)

If your cPanel doesn't support Node.js, you'll need to:
- Contact your hosting provider to enable Node.js
- Consider using a VPS or cloud hosting (AWS, DigitalOcean, Heroku, etc.)

## Step-by-Step Deployment

### Step 1: Access Your cPanel

1. Log in to your cPanel account
2. Navigate to **Node.js Selector** or **Application Manager** (location varies by host)

### Step 2: Create Node.js Application

1. Click **Create Application** or **Setup Node.js App**
2. Configure the following:
   - **Node.js Version**: Select the latest LTS version (18.x or 20.x recommended)
   - **Application Mode**: Production
   - **Application Root**: `/home/yourusername/swiftship-be` (or your preferred directory)
   - **Application URL**: Choose your domain/subdomain (e.g., `api.yourdomain.com` or `yourdomain.com/api`)
   - **Application Startup File**: `server.js`
   - **Application Port**: Leave default or set to available port (cPanel will assign one)

### Step 3: Upload Your Files

1. Use **File Manager** in cPanel or **FTP/SFTP** to upload all project files
2. Upload to the application root directory you specified in Step 2
3. **Important**: Do NOT upload:
   - `node_modules/` folder (will be installed on server)
   - `.env` file with sensitive data (create new one on server)
   - `.git/` folder (optional)

### Step 4: Install Dependencies

**Option A: Using cPanel Terminal/SSH**
```bash
cd /home/yourusername/swiftship-be
npm install --production
```

**Option B: Using Node.js Selector**
- Some cPanel interfaces have a "Run NPM Install" button
- Click it and wait for dependencies to install

### Step 5: Configure Environment Variables

1. In cPanel, go to your Node.js application settings
2. Find **Environment Variables** section
3. Add the following variables (or create `.env` file in application root):

```
DB_HOST=localhost
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_NAME=your_database_name
PORT=5000
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
JWT_SECRET=your_jwt_secret_key
STRIPE_SECRET_KEY=your_stripe_secret
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
LOCATIONIQ_API_KEY=your_locationiq_key
PRODUCTION_FRONTEND_URL=https://your-frontend-domain.com
```

**Important Security Notes:**
- Never commit `.env` file to version control
- Use strong, unique values for `JWT_SECRET`
- Keep your MongoDB connection string secure

### Step 6: Upload Firebase Service Account (if needed)

1. If you use Firebase Admin SDK, upload `serviceAccount.json` to your application root
2. Ensure it's not publicly accessible (keep it outside `public_html` if possible)

### Step 7: Configure MongoDB

- Your MongoDB Atlas connection should work from cPanel
- Ensure your MongoDB Atlas IP whitelist includes your cPanel server's IP
- Test connection in MongoDB Atlas dashboard

### Step 8: Start/Restart Application

1. In Node.js Selector, click **Restart** or **Start** on your application
2. Check logs for any errors
3. Application should be accessible at your configured URL

### Step 9: Configure Domain/Subdomain (if needed)

1. In cPanel, go to **Subdomains** or **Addon Domains**
2. Point your API subdomain (e.g., `api.yourdomain.com`) to your Node.js application
3. Update DNS records if necessary

### Step 7: Install Dependencies

**Option A: Using cPanel Terminal/SSH**
```bash
cd /home/yourusername/swiftship-be
npm install --production
```

**Option B: Using Node.js Selector**
- Some cPanel interfaces have a "Run NPM Install" button
- Click it and wait for dependencies to install

### Step 8: Start/Restart Application

1. In Node.js Selector, click **Restart** or **Start** on your application
2. Check logs for any errors
3. Application should be accessible at your configured URL

### Step 9: Configure Domain/Subdomain (if needed)

1. In cPanel, go to **Subdomains** or **Addon Domains**
2. Point your API subdomain (e.g., `api.yourdomain.com`) to your Node.js application
3. Update DNS records if necessary

### Step 10: Set Up SSL Certificate

1. In cPanel, go to **SSL/TLS Status**
2. Install Let's Encrypt SSL certificate for your domain
3. Force HTTPS redirect if needed

## Troubleshooting

### Application Won't Start

1. **Check Logs**: View application logs in Node.js Selector
2. **Check Port**: Ensure port is correctly configured
3. **Check Environment Variables**: Verify all required variables are set
4. **Check MongoDB Connection**: Test MongoDB connection string

### Common Issues

**Issue**: "Cannot find module"
- **Solution**: Run `npm install` in application directory

**Issue**: "Port already in use"
- **Solution**: Change port in environment variables or cPanel settings

**Issue**: "MySQL connection failed"
- **Solution**: 
  - Check database credentials in `.env` file
  - Verify database user has proper privileges
  - Check if database exists in phpMyAdmin
  - Ensure database tables were imported successfully

**Issue**: Socket.io not working
- **Solution**: 
  - Ensure WebSocket support is enabled on your hosting
  - Some cPanel hosts may not support WebSockets - contact support

### Viewing Logs

1. In Node.js Selector, click on your application
2. Look for **Logs** or **View Logs** option
3. Check both application logs and error logs

## Alternative: Manual Deployment via SSH

If you have SSH access:

```bash
# Navigate to your application directory
cd /home/yourusername/swiftship-be

# Install dependencies
npm install --production

# Set environment variables (or use .env file)
export MONGO_URI="your_mongodb_uri"
export PORT=5000
# ... other variables

# Use PM2 or similar process manager
npm install -g pm2
pm2 start server.js --name CityMovers
pm2 save
pm2 startup
```

## Post-Deployment Checklist

- [ ] Application is accessible via URL
- [ ] Health check endpoint (`/`) returns success
- [ ] MongoDB connection is working
- [ ] Environment variables are set correctly
- [ ] SSL certificate is installed
- [ ] CORS is configured for your frontend domain
- [ ] File uploads directory has write permissions
- [ ] Cron jobs are set up (if using scheduler.js)
- [ ] Socket.io connections are working (if needed)

## Important Notes

1. **Socket.io on cPanel**: Some cPanel hosts don't support WebSockets. You may need to:
   - Use polling fallback for Socket.io
   - Contact hosting support to enable WebSocket support
   - Consider alternative hosting for real-time features

2. **Cron Jobs**: If you have scheduled tasks (`cron/scheduler.js`), set them up in cPanel's **Cron Jobs** section

3. **File Permissions**: Ensure `uploads/` directory has write permissions:
   ```bash
   chmod 755 uploads/
   chmod 755 uploads/id-proofs/
   ```

4. **Performance**: For production, consider:
   - Using a process manager (PM2)
   - Enabling gzip compression
   - Setting up CDN for static files
   - Database connection pooling

## Support

If you encounter issues:
1. Check cPanel error logs
2. Contact your hosting provider's support
3. Verify all configuration steps were completed correctly

