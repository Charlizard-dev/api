# Fix Port 5000 Already in Use Error

## Quick Fix Options

### Option 1: Use a Different Port (Easiest)
I've updated your `.env` file to use port **5001** instead of 5000.

Just restart your server:
```bash
npm start
```

### Option 2: Kill Process Using Port 5000

**Find the process:**
```powershell
netstat -ano | findstr :5000
```

**Kill the process:**
1. Note the PID (Process ID) from the command above
2. Run:
```powershell
taskkill /PID <PID_NUMBER> /F
```

**Or use the helper script:**
```powershell
.\kill-port.ps1
```

### Option 3: Change Port Back to 5000

If you want to use port 5000, edit `.env`:
```env
PORT=5000
```

Then kill the process using port 5000 first.

## Database Connection

If you mentioned there's a database problem, check:

1. **Database exists**: Go to phpMyAdmin and verify `citymoverscomph_citymovers` exists
2. **Schema imported**: Make sure you've imported `database/schema.sql`
3. **User privileges**: Verify `citymoverscomph_users` has ALL PRIVILEGES on the database
4. **Connection test**: The server will show database connection status when starting

## Common Database Errors

- **"Access denied"**: Check username/password in `.env`
- **"Unknown database"**: Database doesn't exist or name is wrong
- **"Table doesn't exist"**: Need to import `database/schema.sql`

