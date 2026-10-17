# উন্মত্ত ৬৩ — Tour Pre-registration

Folder structure
- `public/`  → website (index.html, style.css, app.js, config.js, assets/)
- `netlify/functions/register.js` → secure server code (validation, rate limit, forwarding to the Sheet)
- `apps-script/Code.gs` → Google Sheet writer (paste into Apps Script)
- `netlify.toml` → security headers and build settings

## Step 1: Google Sheet + Apps Script (5 min)
1. Create a new Google Sheet (name it "Unmotto 63 Registrations"). Keep it private.
2. Extensions > Apps Script. Delete the default code, paste everything from `apps-script/Code.gs`, Save.
3. Project Settings (gear icon) > Script properties > Add property: `SECRET` = a long random string (30+ characters). Keep a copy for step 3.
4. Deploy > New deployment > type **Web app** > Execute as: **Me** > Who has access: **Anyone** > Deploy. Allow permissions when asked.
5. Copy the Web app URL (ends with `/exec`).
   If you edit Code.gs later: Deploy > Manage deployments > edit > New version.

## Step 2: Edit public/config.js
Set the real `opens` and `deadline` (the form stays locked before `opens` and closes after `deadline`), `sections`, ID length (`idMinLen`, `idMaxLen`) and `contacts` (names and phone numbers). Optionally `tourDateText`.

## Step 3: Deploy to Netlify
Netlify CLI is the most reliable way to deploy the page together with the function:
```
npm install -g netlify-cli
netlify login
netlify init            # create and link a new site (choose manual / no git if asked)
netlify env:set APPS_SCRIPT_URL "https://script.google.com/macros/s/XXXX/exec"
netlify env:set APPS_SCRIPT_SECRET "the-same-SECRET-from-step-1"
netlify env:set OPENS "2026-10-18T00:00:00+06:00"
netlify env:set DEADLINE "2026-10-25T23:59:00+06:00"
netlify env:set SECTIONS "63-A,63-B,63-C,63-D"
netlify deploy --prod
```
Environment variables are read on the next deploy, so set them first (or redeploy after).
Optional: `ALLOWED_ORIGINS` = your site URL (for example `https://unmotto63.netlify.app`), `ID_MIN`, `ID_MAX`.
`OPENS`, `DEADLINE` and `SECTIONS` must match config.js (the page shows them, the server enforces them).

## Step 4: Test before sharing
Submit one fake registration, check that a row appears in the Sheet, submit the same Student ID again (it should say already registered), then delete the test row.

## Verifying guardians
In the Sheet, column M "Guardian verified?" has a dropdown (Pending / Verified / Not reachable / Guardian declined). Fill N "Verified by" and O "Verified date" after each call. Column I "Guardian traveling?" shows whether a female student wants to bring a guardian (extra BDT 10,000).

Note: if you already created the "Registrations" tab with an older Code.gs, delete that tab (before real data arrives) so the script recreates it with the current columns.

## Security notes
- The Apps Script URL and SECRET live only in Netlify environment variables, never in the public page.
- Duplicate Student IDs are rejected inside Apps Script under a lock, so two simultaneous submissions cannot both succeed.
- Sheet cells are protected against formula injection. Phone numbers keep their leading 0.
- Share the Sheet with only 2-3 committee members (it contains guardian phone numbers).
- Rate limiting is best-effort per server instance. The honeypot field and the duplicate check cover most spam.
