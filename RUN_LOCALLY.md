Run the Iris Perfumes site locally

Quick start (recommended): serve files over HTTP to avoid origin/security errors (Google Identity and other third-party libs don't work from file://).

Python 3 (built-in):

```powershell
cd "C:\Users\ziede\Downloads\iris page"
python -m http.server 8000
```

Open in browser: http://localhost:8000/index.html

Node (if you have Node):

```powershell
cd "C:\Users\ziede\Downloads\iris page"
npx http-server -p 8000
# or
npx serve -s . -l 8000
```

Google Identity / Sign-In (GSI) notes:
- The Google Sign-In button requires an OAuth Client ID with the "Authorized JavaScript origins" set to the origin you use for testing, e.g. `http://localhost:8000`.
- If you see: "The given origin is not allowed for the given client ID", add the origin in Google Cloud Console → APIs & Services → Credentials → (your OAuth client) → Authorized JavaScript origins.

Developer tips:
- When testing quickly from the filesystem (`file://`), the app will hide the Google Sign-In button and skip initialization to avoid origin/permission errors. Serve over HTTP to enable Google Sign-In features.
- If you want me to register origins or update the client ID, provide the new client ID or add the local origin in the Google Cloud Console and I can help test.

If you want, I can add a small `start.ps1` to automate the server start.
