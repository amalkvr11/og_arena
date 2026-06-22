# SoulChain Deployment Guide

## Quick Deploy Options

### Option 1: Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

1. Click the button above
2. Import your GitHub repository
3. Vercel auto-detects Vite settings
4. Click Deploy

**Manual:**
```bash
npm i -g vercel
vercel
```

### Option 2: Netlify

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start)

1. Click button above
2. Connect GitHub repo
3. Build command: `npm run build`
4. Publish directory: `dist`

**Manual:**
```bash
npm run build
# Drag & drop dist/ folder to Netlify
```

### Option 3: GitHub Pages

```bash
# Install gh-pages
npm install --save-dev gh-pages

# Add to package.json scripts:
"deploy:gh": "gh-pages -d dist"

# Build and deploy
npm run build && npm run deploy:gh
```

### Option 4: Traditional Hosting

```bash
# Build production files
npm run build

# Upload dist/ folder contents to your web server
# Works with: AWS S3, Google Cloud, DigitalOcean, etc.
```

---

## Pre-Deployment Checklist

- [ ] Update `package.json` repository URL
- [ ] Update `README.md` with your GitHub username
- [ ] Test production build: `npm run build && npm run preview`
- [ ] Run all tests: `npm run test`
- [ ] Remove any test/demo data
- [ ] Update environment variables
- [ ] Check all images and videos load
- [ ] Test on mobile devices
- [ ] Verify all features work

---

## Environment Setup

### Production Environment Variables

Create `.env.production`:

```env
VITE_0G_NETWORK=mainnet
VITE_ENABLE_MOCK_STORAGE=false
```

### CI/CD Setup (GitHub Actions)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm run test
      
      - name: Build
        run: npm run build
      
      - name: Deploy
        # Add your deployment step here
```

---

## Post-Deployment

### 1. Verify Deployment

- [ ] Homepage loads
- [ ] All pages accessible
- [ ] Memory upload works
- [ ] AI companion responds
- [ ] All features functional

### 2. Configure Domain (Optional)

**Custom domain on Vercel:**
1. Project Settings → Domains
2. Add your domain
3. Configure DNS

**Custom domain on Netlify:**
1. Domain Settings
2. Add custom domain
3. Configure DNS

### 3. Enable HTTPS

Both Vercel and Netlify provide free SSL certificates automatically.

---

## Performance Optimization

### Build Analysis

```bash
npm run build
# Check dist/assets sizes
# Aim for < 300KB total JS/CSS
```

### Image Optimization

- Compress images before adding
- Use WebP format for photos
- Consider lazy loading

---

## Monitoring

### Error Tracking

Add Sentry:
```bash
npm install @sentry/react
```

### Analytics

Add analytics:
- Google Analytics
- PostHog (open source)

---

## Scaling

### For High Traffic

1. Use CDN (Cloudflare, AWS CloudFront)
2. Enable caching headers
3. Consider server-side rendering for SEO

---

## Troubleshooting

### Build Fails

```bash
# Clear cache
rm -rf node_modules dist
npm install
npm run build
```

### Runtime Errors

- Check browser console
- Verify environment variables
- Test locally with `npm run preview`

### Slow Loading

- Minimize bundle size
- Enable compression
- Use CDN

---

## Rollback

If deployment fails:

```bash
# Vercel
vercel rollback

# Netlify
# Deploys tab → Rollback to previous

# Manual
git checkout <previous-commit>
npm run build
# Redeploy
```

---

Need help? Open an issue on GitHub.
