# Setting Up Environment Variables

## Quick Setup Guide

You need to create a `.env` file with your MySQL database credentials.

### Step 1: Get Your Database Credentials from cPanel

1. Log into your **cPanel**
2. Go to **MySQL® Databases**
3. Find your database and user information:
   - **Database Name**: Usually `username_dbname`
   - **Database User**: Usually `username_dbuser`
   - **Database Password**: The password you set when creating the user
   - **Host**: Usually `localhost`

### Step 2: Update .env File

Open the `.env` file in your project root and update these values:

```env
DB_HOST=localhost
DB_USER=your_actual_database_user
DB_PASSWORD=your_actual_database_password
DB_NAME=your_actual_database_name
```

**Example:**
```env
DB_HOST=localhost
DB_USER=citymovers_user
DB_PASSWORD=MySecurePassword123!
DB_NAME=citymovers_db
```

### Step 3: Other Required Variables

You also need to set these (minimum required):

```env
# JWT Secret (generate a random long string)
JWT_SECRET=your_very_long_and_secure_jwt_secret_key_here

# Email (for sending verification codes)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Frontend URL (for CORS)
PRODUCTION_FRONTEND_URL=https://your-frontend-domain.com
```

### Step 4: Verify Setup

After updating `.env`, try starting your server:

```bash
npm start
```

You should see:
```
✅ MySQL connected
🚀 Server running on port 5000
```

## Common Issues

### "Access denied for user"
- Check username and password are correct
- Make sure user has been added to the database with ALL PRIVILEGES

### "Unknown database"
- Check database name is correct
- Make sure database exists in cPanel

### "Connection refused"
- Check DB_HOST is correct (usually `localhost`)
- Verify MySQL service is running

## Security Note

⚠️ **Never commit `.env` file to Git!** It contains sensitive credentials.
The `.env` file should be in `.gitignore`.

