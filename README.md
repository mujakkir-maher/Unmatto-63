# উন্মত্ত ৬৩ — Tour Pre-registration

**Live Website:** [astonishing-stroopwafel-83e6aa.netlify.app](https://astonishing-stroopwafel-83e6aa.netlify.app)

Official Tour Pre-registration Portal for LU CSE-63 Batch ("Unmotto 63"). 

---

## Tech Stack
- **Frontend:** HTML5, CSS3, Vanilla JavaScript
- **Backend:** Netlify Serverless Functions (Node.js)
- **Database:** Google Sheets (via Google Apps Script)

---

## Folder Structure
- `public/` → Website (index.html, style.css, app.js, config.js, assets/)
- `netlify/functions/register.js` → Secure server code (validation, rate limit, forwarding to the Sheet)
- `apps-script/Code.gs` → Google Sheet writer (paste into Apps Script)
- `netlify.toml` → Security headers and build settings

---

## Step 1: Google Sheet + Apps Script
1. Create a new Google Sheet. Keep it private.
2. Go to **Extensions > Apps Script**. Delete the default code, paste everything from `apps-script/Code.gs`, and Save.
3. **Project Settings** (gear icon) > **Script properties** > Add property: `SECRET` = a long random string (30+ characters). Keep a copy for Step 3.
4. **Deploy > New deployment** > type **Web app** > Execute as: **Me** > Who has access: **Anyone** > Deploy. Allow permissions when asked.
5. Copy the Web app URL (ends with `/exec`). 
   *If you edit Code.gs later: Deploy > Manage deployments > edit > New version.*

## Step 2: Edit `public/config.js`
Set the real `opens` and `deadline` (the form stays locked before `opens` and closes after `deadline`), `sections`, ID length (`idMinLen`, `idMaxLen`), and `contacts`. Optionally set `tourDateText`.

## Step 3: Deploy to Netlify
Netlify CLI is the most reliable way to deploy the page together with the function:
```bash
npm install -g netlify-cli
netlify login
netlify init
netlify env:set APPS_SCRIPT_URL "https://script.google.com/macros/s/XXXX/exec"
netlify env:set APPS_SCRIPT_SECRET "the-same-SECRET-from-step-1"
netlify env:set OPENS "2026-10-18T00:00:00+06:00"
netlify env:set DEADLINE "2026-10-25T23:59:00+06:00"
netlify env:set SECTIONS "63-A,63-B,63-C,63-D,63-E"
netlify deploy --prod
