# Routing Configuration

## Domain Setup

### Backend API
- **URL**: `citymovers.com.ph/api`
- **Base Route**: All API endpoints are under `/api`
- **Example**: `citymovers.com.ph/api/auth/login`

### Frontend
- **URL**: `citymovers.com.ph/adm`
- **CORS**: Configured to allow requests from this domain

## API Routes Structure

All routes are prefixed with `/api`:

```
citymovers.com.ph/api/auth/*          - Authentication routes
citymovers.com.ph/api/admin/*        - Admin routes
citymovers.com.ph/api/shipments/*    - Shipment routes
citymovers.com.ph/api/orders/*        - Order routes
citymovers.com.ph/api/drivers/*      - Driver routes
citymovers.com.ph/api/wallets/*      - Wallet routes
... and more
```

## CORS Configuration

The backend allows requests from:
- `http://citymovers.com.ph/adm`
- `https://citymovers.com.ph/adm`
- `http://www.citymovers.com.ph/adm`
- `https://www.citymovers.com.ph/adm`
- Plus any URL set in `PRODUCTION_FRONTEND_URL` environment variable

## Environment Variable

Make sure your `.env` file has:
```env
PRODUCTION_FRONTEND_URL=http://citymovers.com.ph/adm
```

## cPanel Configuration

### For Backend API (citymovers.com.ph/api):
1. In cPanel, set up Node.js application
2. Point it to your backend directory
3. Configure subdomain or path: `/api` or subdomain `api.citymovers.com.ph`

### For Frontend (citymovers.com.ph/adm):
1. Deploy frontend to `/adm` directory
2. Or configure as subdomain if preferred

## Testing

### Test API Health:
```bash
curl http://citymovers.com.ph/api/
# or
curl http://citymovers.com.ph/
```

### Test CORS:
From browser console on `citymovers.com.ph/adm`:
```javascript
fetch('http://citymovers.com.ph/api/')
  .then(r => r.json())
  .then(console.log)
```

## Socket.io Configuration

Socket.io is configured to:
- Accept connections from `citymovers.com.ph/adm`
- Use WebSocket with polling fallback (for cPanel compatibility)
- Support both HTTP and HTTPS

