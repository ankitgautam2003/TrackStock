# Vercel Deployment Guide

## Deployment Options

### Option 1: Deploy as Monorepo (Recommended)

This deploys both frontend and backend in a single Vercel project.

#### Steps:
1. Push your code to GitHub
2. Import the repository in Vercel
3. Configure environment variables in Vercel dashboard:
   - `MONGODB_URI` - Your MongoDB connection string
   - `NEXT_PUBLIC_API_URL` - Will be `https://your-project.vercel.app/api`
   - `CORS_ORIGIN` - Will be `https://your-project.vercel.app`
4. Deploy!

### Option 2: Deploy Separately

Deploy frontend and backend as separate Vercel projects.

#### Backend Deployment:
1. Create a new Vercel project
2. Set root directory to `backend`
3. Add environment variables:
   - `MONGODB_URI`
   - `CORS_ORIGIN` (your frontend URL)
4. Deploy

#### Frontend Deployment:
1. Create another Vercel project
2. Set root directory to `frontend`
3. Add environment variable:
   - `NEXT_PUBLIC_API_URL` (your backend URL + /api)
4. Deploy

## Environment Variables Required

### Backend (.env in Vercel dashboard):
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/inventory
NODE_ENV=production
CORS_ORIGIN=https://your-frontend-url.vercel.app
```

### Frontend (.env in Vercel dashboard):
```
NEXT_PUBLIC_API_URL=https://your-backend-url.vercel.app/api
```

## Post-Deployment

After deployment, update the CORS_ORIGIN and NEXT_PUBLIC_API_URL with your actual Vercel URLs.
