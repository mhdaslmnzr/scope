# SCOPE Deployment Guide

## Overview
This guide will help you deploy the SCOPE application to Vercel (Frontend) and Railway (Backend).

## Prerequisites
- GitHub account
- Code pushed to GitHub repository
- Repository structure:
  ```
  scope/
  ├── frontend/          # Next.js app
  ├── backend/           # Flask app
  ├── README.md
  └── .gitignore
  ```

## Step 1: Deploy Frontend to Vercel

### 1.1 Sign up for Vercel
- Go to [vercel.com](https://vercel.com)
- Sign up with your GitHub account

### 1.2 Create New Project
- Click "New Project"
- Import your `scope` repository
- Configure the project:
  - **Root Directory:** `frontend`
  - **Framework Preset:** Next.js (auto-detected)
  - **Build Command:** `npm run build` (default)
  - **Output Directory:** `.next` (default)

### 1.3 Set Environment Variables
In your Vercel project dashboard:
- Go to Settings → Environment Variables
- Add:
  ```
  NEXT_PUBLIC_API_URL=https://your-backend-domain.railway.app
  ```

### 1.4 Deploy
- Click "Deploy"
- Your frontend will be available at `your-app.vercel.app`

## Step 2: Deploy Backend to Railway

### 2.1 Sign up for Railway
- Go to [railway.app](https://railway.app)
- Sign up with your GitHub account

### 2.2 Create New Project
- Click "New Project"
- Select "Deploy from GitHub repo"
- Choose your `scope` repository

### 2.3 Add PostgreSQL Database
- Click "New" → "Database" → "PostgreSQL"
- Railway will automatically set the `DATABASE_URL` environment variable

### 2.4 Configure Environment Variables
In your Railway project dashboard:
- Go to Variables tab
- Add:
  ```
  FLASK_ENV=production
  SECRET_KEY=your-secret-key-here
  CORS_ORIGINS=https://your-frontend-domain.vercel.app
  ```

### 2.5 Deploy
- Railway will automatically detect Python and deploy
- Your backend will be available at `your-app.railway.app`

## Step 3: Update Frontend API Configuration

The frontend has been updated to use environment variables. Make sure to:

1. Set `NEXT_PUBLIC_API_URL` in Vercel to your Railway backend URL
2. The frontend will automatically use the production API URL

## Step 4: Test Your Deployment

### 4.1 Test Frontend
- Visit your Vercel URL
- Check if the dashboard loads
- Verify API calls are working

### 4.2 Test Backend
- Visit `your-backend.railway.app/api/clients`
- Should return JSON data

### 4.3 Test CORS
- Make sure frontend can communicate with backend
- Check browser console for CORS errors

## Troubleshooting

### Common Issues

#### 1. Build Failures
- Check Vercel build logs
- Ensure all dependencies are in `package.json`
- Verify Node.js version compatibility

#### 2. Database Connection Issues
- Check Railway PostgreSQL service is running
- Verify `DATABASE_URL` environment variable
- Check backend logs in Railway dashboard

#### 3. CORS Errors
- Ensure `CORS_ORIGINS` includes your Vercel domain
- Check backend CORS configuration
- Verify environment variables are set correctly

#### 4. API 404 Errors
- Check Railway deployment logs
- Verify Flask routes are correct
- Ensure backend is running

### Debugging Commands

#### Check Railway Logs
```bash
# In Railway dashboard, go to Deployments tab
# Click on latest deployment to view logs
```

#### Check Vercel Logs
```bash
# In Vercel dashboard, go to Functions tab
# View function logs for API calls
```

## Environment Variables Reference

### Frontend (Vercel)
```
NEXT_PUBLIC_API_URL=https://your-backend.railway.app
```

### Backend (Railway)
```
FLASK_ENV=production
SECRET_KEY=your-secret-key-here
DATABASE_URL=postgresql://... (auto-set by Railway)
CORS_ORIGINS=https://your-frontend.vercel.app
```

## Cost Considerations

### Vercel (Free Tier)
- Unlimited deployments
- 100GB bandwidth/month
- Perfect for frontend hosting

### Railway (Free Tier)
- $5 credit/month
- Enough for small applications
- PostgreSQL included

## Next Steps

1. **Custom Domain**: Add custom domain to Vercel
2. **SSL**: Automatically handled by both platforms
3. **Monitoring**: Set up monitoring and alerts
4. **CI/CD**: Configure automatic deployments
5. **Backup**: Set up database backups

## Support

- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
- **Railway Docs**: [docs.railway.app](https://docs.railway.app)
- **GitHub Issues**: Create issues in your repository

## Notes

- Both platforms offer excellent free tiers
- Automatic deployments on git push
- Built-in SSL certificates
- Global CDN for fast loading
- Easy scaling as your app grows 