# Railway Deployment Guide - Frontend

## 🚂 Deploying to Railway

### Prerequisites
- GitHub account
- Railway account (https://railway.app)
- Frontend code pushed to GitHub repository
- Backend already deployed (to get API URL)

### Step 1: Deploy Frontend

1. Go to Railway dashboard
2. Click **"New Project"** (or use existing project)
3. Click **"New Service"**
4. Select **"GitHub Repo"**
5. Choose your repository and select the `frontend` folder
6. Railway will auto-detect the Vite app

### Step 2: Configure Environment Variables

In the frontend service settings, add:

```env
VITE_API_URL=https://your-backend-service.railway.app
```

**Important**: Replace with your actual backend Railway URL.

### Step 3: Update API URL in Code

The frontend needs to know where the backend is. Update `src/lib/sync-engine.ts`:

```typescript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
```

### Step 4: Update Backend CORS

After deploying frontend, update backend's `main.ts` to allow your frontend domain:

```typescript
app.enableCors({
  origin: [
    'http://localhost:5173',
    'https://your-frontend.railway.app', // Add this
  ],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
});
```

## 🔧 Railway Configuration

The `railway.json` file is configured to:
1. Build the Vite app
2. Serve it using Vite's preview server
3. Listen on Railway's assigned port

```json
{
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "npm install && npm run build"
  },
  "deploy": {
    "startCommand": "npm run preview -- --host 0.0.0.0 --port $PORT"
  }
}
```

## 📊 Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `https://backend.railway.app` |
| `PORT` | Server port (auto-assigned by Railway) | Auto |

## 🎨 PWA Configuration

The PWA will work automatically on Railway! The service worker will cache:
- Static assets (JS, CSS, images)
- API responses (NetworkFirst strategy)
- Offline fallback page

### Testing PWA on Railway

1. Open your Railway URL in Chrome
2. Open DevTools → Application → Service Workers
3. Verify service worker is registered
4. Test offline mode:
   - DevTools → Network → Offline
   - App should still work with cached data

## 🔍 Monitoring

Railway provides:
- **Logs**: Real-time build and runtime logs
- **Metrics**: Performance monitoring
- **Deployments**: Deployment history

## 🐛 Troubleshooting

### Build Fails
```
Error: Cannot find module 'vite'
```
**Solution**: Ensure `package.json` has all dependencies. Railway runs `npm install` automatically.

### API Calls Fail
```
Error: Failed to fetch
```
**Solution**: 
1. Check `VITE_API_URL` is set correctly
2. Verify backend CORS allows frontend domain
3. Check backend is running

### PWA Not Installing
```
Service worker registration failed
```
**Solution**: 
1. Ensure HTTPS is enabled (Railway provides this automatically)
2. Check `vite.config.js` PWA configuration
3. Verify manifest.json is generated

### Environment Variables Not Working
```
import.meta.env.VITE_API_URL is undefined
```
**Solution**: 
1. Ensure variable starts with `VITE_`
2. Rebuild the app after adding variables
3. Check Railway service settings

## 🚀 Automatic Deployments

Railway automatically deploys when you push to your GitHub repository's main branch.

## 💡 Pro Tips

1. **Use Railway's CLI**:
   ```bash
   npm i -g @railway/cli
   railway login
   railway up
   ```

2. **Monitor logs**:
   ```bash
   railway logs
   ```

3. **Link services** (Frontend → Backend):
   - In Railway dashboard, you can reference backend URL using:
   ```env
   VITE_API_URL=${{Backend.RAILWAY_PUBLIC_DOMAIN}}
   ```

## 🔗 Service Linking

To automatically use backend URL:

1. In Railway, both services should be in the same project
2. In frontend environment variables:
   ```env
   VITE_API_URL=https://${{Backend.RAILWAY_PUBLIC_DOMAIN}}
   ```

Railway will automatically inject the backend's public URL.

## 📱 Testing the Deployed App

1. Open frontend URL in browser
2. Create an inspection while online
3. Go offline (DevTools → Network → Offline)
4. Create another inspection
5. Go back online
6. Verify both inspections synced to backend

## 🔗 Useful Links

- [Railway Documentation](https://docs.railway.app)
- [Vite Deployment](https://vitejs.dev/guide/static-deploy.html)
- [PWA Best Practices](https://web.dev/pwa/)
