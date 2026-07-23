# 🚀 Complete Setup & Deployment Guide

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Firebase Setup](#firebase-setup)
3. [Security Configuration](#security-configuration)
4. [GitHub Repository Setup](#github-repository-setup)
5. [Deployment](#deployment)
6. [Testing](#testing)
7. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Tools
- ✅ Git installed ([Download](https://git-scm.com/download/win))
- ✅ A GitHub account ([Sign up](https://github.com/join))
- ✅ A Google account for Firebase
- ✅ Text editor (VS Code recommended)
- ✅ Modern web browser (Chrome/Firefox/Edge)

### Check Git Installation
```bash
git --version
```
Should output: `git version 2.x.x`

---

## Firebase Setup

### Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"**
3. Enter project name: `iris-perfumes` (or your choice)
4. Disable Google Analytics (optional)
5. Click **"Create project"**

### Step 2: Enable Authentication

1. In Firebase Console, go to **"Authentication"**
2. Click **"Get started"**
3. Enable **"Email/Password"**:
   - Click on "Email/Password"
   - Toggle **"Enable"**
   - Click **"Save"**
4. Enable **"Google"** sign-in:
   - Click on "Google"
   - Toggle **"Enable"**
   - Select your support email
   - Click **"Save"**

### Step 3: Enable Firestore Database

1. In Firebase Console, go to **"Firestore Database"**
2. Click **"Create database"**
3. Select **"Start in test mode"** (we'll secure it later)
4. Choose your region (closest to your users)
5. Click **"Enable"**

### Step 4: Get Firebase Configuration

1. Go to **Project Settings** (gear icon)
2. Scroll to **"Your apps"**
3. Click **"Web"** (</> icon)
4. Register app name: `Iris Perfumes Web`
5. Click **"Register app"**
6. Copy the configuration object:

```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "iris-perfumes.firebaseapp.com",
  projectId: "iris-perfumes",
  storageBucket: "iris-perfumes.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

### Step 5: Configure Firebase in Your Project

1. Open `.env.template` file
2. Copy it and rename to `.env`
3. Fill in your Firebase credentials:

```env
FIREBASE_API_KEY=AIza...
FIREBASE_AUTH_DOMAIN=iris-perfumes.firebaseapp.com
FIREBASE_PROJECT_ID=iris-perfumes
FIREBASE_STORAGE_BUCKET=iris-perfumes.appspot.com
FIREBASE_MESSAGING_SENDER_ID=123456789
FIREBASE_APP_ID=1:123456789:web:abc123
```

4. **NEVER commit this .env file to Git!**

### Step 6: Update Security Rules

1. In Firestore, go to **"Rules"** tab
2. Copy content from `firestore.rules` file
3. Paste it in the Firebase Rules editor
4. Click **"Publish"**

---

## Security Configuration

### Step 1: Create Admin Account

1. Open your website in a browser
2. Open browser console (F12)
3. Run this command:

```javascript
FirebaseAuth.createAdminAccount(
  'admin@irisperfumes.com',  // Your admin email
  'YourSecurePassword123!'    // Strong password
)
```

4. ✅ Admin account created with **hashed password**
5. Password is **NEVER** stored in plain text

### Step 2: Migrate Data from data.json

1. Make sure you're logged in as admin
2. In browser console, run:

```javascript
// Load existing data
fetch('data.json')
  .then(r => r.json())
  .then(data => FirestoreDB.migrateDataToFirestore(data))
  .then(() => console.log('✅ Migration complete!'))
```

### Step 3: Verify Security

Test the following:
- ✅ Users can only see their own orders
- ✅ Only admin can edit products
- ✅ Passwords are hashed (not visible in Firestore)
- ✅ Google OAuth works for customers
- ✅ Admin login works with email/password

---

## GitHub Repository Setup

### Step 1: Create Repository

1. Go to [GitHub](https://github.com/)
2. Click **"New repository"**
3. Repository name: `iris-perfumes`
4. Make it **Public** (required for GitHub Pages)
5. **DO NOT** add README, .gitignore, or license
6. Click **"Create repository"**

### Step 2: Initialize Git Locally

Open Command Prompt in your project folder:

```bash
# Initialize Git (if not already done)
git init

# Check status
git status

# Add all files
git add .

# Create first commit
git commit -m "Initial commit - Secure setup"

# Add your GitHub repository as remote
git remote add origin https://github.com/YOUR_USERNAME/iris-perfumes.git

# Push to GitHub
git push -u origin main
```

If `main` branch doesn't exist, try:
```bash
git branch -M main
git push -u origin main
```

### Step 3: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **"Settings"**
3. Scroll to **"Pages"** (left sidebar)
4. Under **"Source"**, select:
   - Branch: `main`
   - Folder: `/ (root)`
5. Click **"Save"**
6. Wait 2-3 minutes for deployment
7. Your site will be at: `https://YOUR_USERNAME.github.io/iris-perfumes`

---

## Deployment

### Option 1: Using deploy.bat Script (Recommended)

Simply double-click `deploy.bat` or run:

```bash
deploy.bat
```

The script will:
- ✅ Check for sensitive files
- ✅ Show uncommitted changes
- ✅ Create commit
- ✅ Push to GitHub
- ✅ Trigger automatic deployment

### Option 2: Manual Git Commands

```bash
# Stage all changes
git add .

# Commit with message
git commit -m "Update: describe your changes"

# Push to GitHub
git push origin main
```

### Option 3: GitHub Actions (Automatic)

Already configured! Just push to GitHub and it will:
- ✅ Run security checks
- ✅ Deploy automatically
- ✅ Check for sensitive files

---

## Testing

### Test 1: User Authentication

1. Go to your live site
2. Click login/profile icon
3. Select **"Sign in with Google"**
4. ✅ Should redirect and log you in
5. Check that you can see your profile

### Test 2: Admin Access

1. Go to `https://your-site.com/#admin`
2. Enter admin credentials:
   - Email: `admin@irisperfumes.com`
   - Password: (your admin password)
3. ✅ Should see admin controls
4. Try editing a product

### Test 3: Security

1. Log out
2. Try accessing `/admin` without login
3. ✅ Should be denied
4. Try editing a product as regular user
5. ✅ Should fail (no permission)

### Test 4: Order Creation

1. Log in as regular user
2. Add products to cart
3. Create an order
4. ✅ Should appear in your orders
5. Other users should NOT see your order

---

## Troubleshooting

### Problem: "Firebase not defined"

**Solution:**
Add Firebase SDK to your HTML:

```html
<script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-auth-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore-compat.js"></script>
<script src="firebase-config.js"></script>
```

### Problem: "Permission denied" in Firestore

**Solution:**
1. Check Firestore Rules are published
2. Make sure user is authenticated
3. Verify user role in Firestore

### Problem: GitHub Pages not updating

**Solution:**
1. Check GitHub Actions tab for errors
2. Wait 2-5 minutes for deployment
3. Hard refresh browser (Ctrl+Shift+R)
4. Check repository Settings > Pages

### Problem: "Git not found"

**Solution:**
1. Install Git from [git-scm.com](https://git-scm.com/download/win)
2. Restart Command Prompt
3. Run `git --version` to verify

### Problem: Admin can't create account

**Solution:**
1. Check Firebase Console > Authentication
2. Make sure Email/Password is enabled
3. Check browser console for errors
4. Verify Firebase config is correct

---

## Security Checklist

Before going live:

- [ ] `.env` file is NOT committed to Git
- [ ] Firebase Security Rules are published
- [ ] Admin password is strong (12+ characters, mixed case, numbers, symbols)
- [ ] Google OAuth is configured
- [ ] HTTPS is enabled (GitHub Pages uses HTTPS by default)
- [ ] No sensitive data in code comments
- [ ] Test with different user roles
- [ ] Backup your Firestore data
- [ ] Enable 2FA on GitHub account
- [ ] Monitor Firebase usage/quotas

---

## Useful Commands

### Git Commands
```bash
# Check current status
git status

# View commit history
git log --oneline

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Discard local changes
git checkout -- .

# Pull latest from GitHub
git pull origin main

# Create new branch
git checkout -b feature-name
```

### Firebase Commands
```javascript
// Get current user
FirebaseAuth.getCurrentUser()

// Check if user is admin
FirebaseAuth.isAdmin('USER_ID')

// Get all products
FirestoreDB.getAllProducts()

// Create order
FirestoreDB.createOrder({ items: [...], total: 100 })
```

---

## Next Steps

1. **Customize your site**
   - Update colors, fonts, images
   - Add more products
   - Customize checkout flow

2. **Set up email notifications**
   - Use Firebase Cloud Functions
   - Send order confirmations
   - Admin notifications

3. **Add payment integration**
   - Stripe
   - PayPal
   - Local payment methods

4. **Monitor your site**
   - Google Analytics
   - Firebase Analytics
   - Performance monitoring

5. **Backup strategy**
   - Export Firestore data regularly
   - Keep GitHub repository updated
   - Document any manual configurations

---

## Support

### Resources
- 📚 [Firebase Documentation](https://firebase.google.com/docs)
- 📚 [GitHub Pages Guide](https://docs.github.com/en/pages)
- 📚 [Git Tutorial](https://git-scm.com/doc)
- 🔐 [Firebase Security Rules](https://firebase.google.com/docs/firestore/security/get-started)

### Need Help?
- Check `README_SECURITY.md` for security details
- Review Firebase Console for errors
- Check GitHub Actions for deployment issues
- Verify browser console for JavaScript errors

---

**Good luck with your deployment! 🚀**
