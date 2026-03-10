# 🛰️ Dean's Texas-Wide Starlink Lead Finder
**Dean's Handyman Service LLC · Pittsburg TX 75686 · 281-917-9914**
**Serving ALL of Texas**

AI-powered lead scanner covering **all 20 Texas regions** — finds people across the entire state looking for Starlink installation. Runs every 30 minutes 24/7 on GitHub and texts/emails you every new lead.

---

## 🗺️ Texas Regions Covered (all 20)
East Texas · Deep East Texas · DFW Rural · North Texas · Northwest Texas ·
West Texas · Far West Texas · Permian Basin · Central Texas · Texas Hill Country ·
Austin Rural · South Texas · Rio Grande Valley · Coastal Bend ·
Greater Houston Rural · Golden Triangle · Gulf Coast Plains ·
Texas Panhandle · South Plains · San Antonio Rural

**Rotation:** Scans 2 regions every 30 min → full Texas covered every ~5 hours

---

## ⚡ ONE-TIME SETUP (15 minutes)

### STEP 1 — Free GitHub account
→ **github.com** → Sign Up (free)

### STEP 2 — New repository
1. Click **+** → **New repository**
2. Name: `dhs-lead-finder`
3. Select **Public** → **Create repository**

### STEP 3 — Upload ALL files
Drag these into the repo upload page:
- `index.html`
- `scanner.js`
- `package.json`
- `leads.json`
- `.github/workflows/scan.yml`

### STEP 4 — Enable GitHub Pages
**Settings → Pages → Source: Deploy from branch → main / (root) → Save**

Your live dashboard: `https://YOUR-USERNAME.github.io/dhs-lead-finder`

### STEP 5 — Add Secrets
**Settings → Secrets and variables → Actions → New repository secret**

| Secret | Value |
|--------|-------|
| `ANTHROPIC_API_KEY` | From console.anthropic.com (free) |
| `GMAIL_USER` | Your Gmail address |
| `GMAIL_APP_PASSWORD` | Gmail App Password (see below) |
| `NOTIFY_EMAIL` | Email for lead alerts |
| `NOTIFY_PHONE` | 10-digit cell: `2819179914` |
| `NOTIFY_CARRIER` | `att` `verizon` `tmobile` `boost` `cricket` `sprint` |

### STEP 6 — Gmail App Password
1. myaccount.google.com/security → turn on 2-Step Verification
2. Search "App Passwords" → Mail → Other → "Lead Bot" → Generate
3. Copy 16-char password → paste as `GMAIL_APP_PASSWORD`

### STEP 7 — Anthropic API Key
1. console.anthropic.com → Sign up → API Keys → Create Key
2. Paste as `ANTHROPIC_API_KEY` (free credits to start)

### STEP 8 — First manual scan
**Actions tab → Starlink Lead Scanner → Run workflow → Run workflow**
Check your phone/email in ~60 seconds for your first Texas leads!

---

## 🔄 How it works forever after setup

```
Every 30 minutes, GitHub automatically:
→ Scans 2 Texas regions with AI web search
→ Finds people asking about Starlink installation
→ Emails you all new leads with details
→ Texts your phone hot leads instantly
→ Updates your dashboard automatically
→ Rotates to next 2 regions next scan
→ Full Texas coverage every ~5 hours
```

Zero effort. Zero cost. Runs 24/7.

---

**Dean's Handyman Service LLC · 281-917-9914 · deanshandymanservice.me**
