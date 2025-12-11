# Configuration Guide

This project uses environment-aware configuration for local development and production deployment.

## Configuration Files

- **`vite.config.js`** - Main configuration file that automatically switches between local and production settings
- **`vite.config.local.js`** - Reference file for local development settings
- **`vite.config.production.js`** - Reference file for production build settings

## How It Works

The main `vite.config.js` automatically detects the environment:

- **Local Development** (`npm run dev`): Uses base path `/` for localhost
- **Production Build** (`npm run build`): Uses base path `/CursorTest/` for GitHub Pages

## Changing Settings

### For Local Development
Edit `vite.config.local.js` and update the corresponding section in `vite.config.js`

### For Production
Edit `vite.config.production.js` and update the corresponding section in `vite.config.js`

## Base Paths

- **Local**: `/` (root path, works on localhost:5173)
- **Production**: `/CursorTest/` (GitHub Pages repository path)

## Testing Locally

1. Run `npm run dev` - automatically uses local config
2. Open `http://localhost:5173/`
3. Test your changes before deploying

## Building for Production

1. Run `npm run build` - automatically uses production config
2. The build output will be in the `dist/` folder
3. GitHub Actions will automatically deploy it

