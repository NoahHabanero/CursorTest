# Deployment Guide

Your dashboard has been set up and pushed to GitHub. Here are two easy ways to deploy it:

## Option 1: Vercel (Recommended - Easiest)

1. Go to [vercel.com](https://vercel.com) and sign in with your GitHub account
2. Click "Add New Project"
3. Import the repository: `NoahHabanero/CursorTest`
4. Vercel will automatically detect it's a Vite project
5. Click "Deploy"
6. Your site will be live in ~2 minutes at a URL like: `https://cursor-test-xxx.vercel.app`

## Option 2: GitHub Pages

1. Go to your repository: https://github.com/NoahHabanero/CursorTest
2. Click on "Settings" tab
3. Scroll down to "Pages" in the left sidebar
4. Under "Source", select "GitHub Actions"
5. The workflow will automatically deploy your site
6. Your site will be available at: `https://noahhabanero.github.io/CursorTest/`

## Option 3: Netlify

1. Go to [netlify.com](https://netlify.com) and sign in with GitHub
2. Click "Add new site" > "Import an existing project"
3. Select your repository: `NoahHabanero/CursorTest`
4. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
5. Click "Deploy site"
6. Your site will be live at a URL like: `https://cursor-test-xxx.netlify.app`

All three options are free and will automatically redeploy when you push changes to GitHub!

