# MySQL Database Setup for cPanel/phpMyAdmin

## Step 1: Create Database in cPanel

1. Log into your **cPanel** account
2. Go to **MySQL® Databases** (under "Databases" section)
3. Create a new database:
   - Enter database name (e.g., `citymovers`)
   - Click **Create Database**
4. Create a database user:
   - Enter username (e.g., `citymovers_user`)
   - Enter a strong password
   - Click **Create User**
5. Add user to database:
   - Select the user you just created
   - Select the database you just created
   - Click **Add**
   - Make sure to check **ALL PRIVILEGES**
   - Click **Make Changes**

## Step 2: Import SQL Schema via phpMyAdmin

1. In cPanel, go to **phpMyAdmin** (under "Databases" section)
2. Select your database from the left sidebar (e.g., `citymovers`)
3. Click on the **Import** tab at the top
4. Click **Choose File** button
5. Select the file: `database/schema.sql`
6. Make sure **Format** is set to **SQL**
7. Click **Go** button at the bottom
8. Wait for the import to complete - you should see "Import has been successfully finished"

## Step 3: Configure Environment Variables

1. In your project root, create or edit `.env` file
2. Add your MySQL database credentials:

```env
DB_HOST=localhost
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_NAME=your_database_name
```

**Example:**
```env
DB_HOST=localhost
DB_USER=citymovers_user
DB_PASSWORD=your_secure_password_here
DB_NAME=citymovers_db
```

## Step 4: Verify Database Connection

1. Restart your Node.js application
2. Check the logs - you should see: `✅ MySQL connected`
3. If you see connection errors, verify:
   - Database name is correct
   - Username is correct
   - Password is correct
   - User has proper privileges

## Database Tables Created

The schema will create the following tables:

- `users` - User accounts
- `user_tokens` - User authentication tokens
- `drivers` - Driver information
- `orders` - Order records
- `shipments` - Shipment records
- `shipment_orders` - Shipment-Order relationships
- `warehouses` - Warehouse information
- `staff` - Staff members
- `warehouse_staff` - Warehouse-Staff relationships
- `transactions` - Financial transactions
- `wallets` - User wallets
- `wallet_transactions` - Wallet transaction history
- `notifications` - User notifications
- `verification_codes` - Email verification codes
- `company_info` - Company information
- `roles` - User roles
- `tracking` - Tracking information
- `deliveries` - Delivery records
- `vehicles` - Vehicle information
- `routes` - Route information
- `temp_drivers` - Temporary driver records
- `tokens` - Authentication tokens

## Troubleshooting

### Error: "Access denied for user"
- Check username and password in `.env` file
- Verify user has been added to the database with proper privileges

### Error: "Unknown database"
- Check database name in `.env` file
- Verify database was created in cPanel

### Error: "Table already exists"
- The tables already exist - this is fine
- You can drop existing tables if you want a fresh start

### Import fails
- Make sure file encoding is UTF-8
- Check file size limits in phpMyAdmin
- Try importing in smaller chunks if file is large

## Notes

- All tables use `utf8mb4` character set for proper Unicode support
- Foreign key constraints are set up for data integrity
- Timestamps are automatically managed (`createdAt`, `updatedAt`)
- Indexes are created on frequently queried fields for better performance

