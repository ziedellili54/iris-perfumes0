# 🚀 Quick Reference Card

## 📍 Your Database Location

**Firebase Firestore Cloud Database**
```
URL: https://firestore.googleapis.com/v1/projects/YOUR_PROJECT/databases/(default)
Access: Firebase Console → Firestore Database
Security: Encrypted + Role-based access control
```

---

## 🔐 Password Hashing

**Algorithm:** bcrypt (automatic by Firebase)
**Hash Example:** `$2a$10$N9qo8uLOickgx2ZMRZoMy...`
**Security:** Industry standard, unbreakable
**Storage:** Never in plain text

---

## 📁 Important Files

| File | Purpose | Commit to Git? |
|------|---------|----------------|
| `firebase-config.js` | Auth & DB functions | ✅ Yes |
| `firestore.rules` | Security rules | ✅ Yes |
| `.env.template` | Config template | ✅ Yes |
| `.env` | YOUR credentials | ❌ NEVER! |
| `deploy.bat` | Deployment script | ✅ Yes |
| `START_HERE.md` | Quick start | ✅ Yes |

---

## ⚡ Quick Commands

### Create Admin Account
```javascript
FirebaseAuth.createAdminAccount('admin@irisperfumes.com', 'YourPassword123!')
```

### Migrate Data
```javascript
fetch('data.json').then(r=>r.json()).then(data=>FirestoreDB.migrateDataToFirestore(data))
```

### Deploy to GitHub
```bash
deploy.bat
```

### Check Git Status
```bash
git status
```

---

## 🔗 Quick Links

- **Firebase Console:** https://console.firebase.google.com
- **Your GitHub Repo:** https://github.com/ziedellili54/iris-perfumes0
- **Firebase Docs:** https://firebase.google.com/docs
- **Live Site:** https://ziedellili54.github.io/iris-perfumes0

---

## 📋 Setup Checklist

- [ ] Read START_HERE.md
- [ ] Create Firebase project
- [ ] Enable Authentication
- [ ] Enable Firestore
- [ ] Create .env file
- [ ] Deploy security rules
- [ ] Create admin account
- [ ] Migrate data
- [ ] Test everything
- [ ] Deploy to GitHub Pages

---

## 🆘 Common Issues

**"Firebase not defined"**
→ Add Firebase SDK to HTML

**"Permission denied"**
→ Deploy Firestore security rules

**"Can't create admin"**
→ Enable Email/Password in Firebase Auth

**"Git not found"**
→ Install Git from git-scm.com

---

## 📞 Documentation

1. **START_HERE.md** - Quick start
2. **SETUP_GUIDE.md** - Complete setup
3. **SECURITY_SUMMARY.md** - Security overview
4. **README_SECURITY.md** - Technical details
5. **IMPLEMENTATION_COMPLETE.md** - What was done

---

**🎉 You're ready to go! Start with START_HERE.md**
