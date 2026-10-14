# 🚀 Deploy PokéDex Tracker to Railway

> **Do all of this on your personal Mac — nothing here touches Walmart systems.**

When done you'll have a permanent URL like  
`https://pokedex-tracker-production.up.railway.app`  
any phone, tablet, or computer can open — no VPN, no local server, Mac can be off.

---

## What you need

- Your personal Mac (macOS 10.15+)
- A [Railway](https://railway.app) account (free sign-up with GitHub)
- A credit card on file with Railway (they give $5 free credit/month — a small app costs ~$1-2/month)
- Homebrew (if you don't have it: https://brew.sh)

---

## Step 1 — Get the files on your personal Mac

1. Copy `pokedex-tracker-portable.zip` to your personal Mac (AirDrop, USB, iMessage)
2. Double-click the zip to unzip it → you get a `pokedex-tracker` folder
3. Move the folder somewhere permanent, like `~/Documents/pokedex-tracker`

---

## Step 2 — Install tools

Open **Terminal** on your personal Mac and run:

```bash
# Install Homebrew if you don't have it
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Railway CLI
brew install railway
```

---

## Step 3 — Log in to Railway

```bash
railway login
```

This opens a browser window — log in with your GitHub account.

---

## Step 4 — Create the Railway project

```bash
# Go into the project folder
cd ~/Documents/pokedex-tracker

# Create a new Railway project
railway init
```

When prompted:
- **Project name**: `pokedex-tracker` (or whatever you like)
- **Environment**: `production`

---

## Step 5 — Add a persistent volume (keeps the database safe)

The database needs to survive server restarts. In Terminal:

```bash
railway volume add --mount /data
```

> If that command isn't available in your CLI version, do it in the Railway dashboard:  
> Project → your service → **Volumes** → **Add Volume** → mount path: `/data`

---

## Step 6 — Set environment variables

```bash
# Generate a secure secret key and set it
railway variables set SECRET_KEY=$(openssl rand -hex 32)

# Tell the app to store the database on the persistent volume
railway variables set DATA_DIR=/data
```

---

## Step 7 — Deploy safely (recommended) 🚀

```bash
./safe-railway-deploy.sh
```

This does preflight checks before deploy:
- ensures exactly one `/data` volume mount (prevents startup failures)
- verifies `SECRET_KEY` + `DATA_DIR` exist
- deploys and waits for terminal status
- verifies `/health` returns 200

If you need raw deploy only:

```bash
railway up
```

Watch logs:
```bash
railway logs
```

---

## Step 8 — Get your public URL

```bash
railway domain
```

This gives you a URL like `https://pokedex-tracker-production.up.railway.app`.  
Open it in any browser, on any device, anywhere! 🌍

> **Tip:** In the Railway dashboard you can also set a custom domain if you own one.

---

## Step 9 — Register your account

- Open the URL in your browser
- Click **Register**  
- **First account registered = admin** (that's you!)
- Share the URL with your buddy — they register their own account
- Everyone's progress is completely separate

---

## Updating the app later

If you get a new zip with updates:

1. Unzip and replace the files in `~/Documents/pokedex-tracker`
2. Run `railway up` again from that folder
3. Your database and accounts are safe on the volume — redeploys don't wipe data

---

## Troubleshooting

| Problem | Fix |
|---|---|
| `railway: command not found` | Run `brew install railway` again |
| Build fails | Run `railway logs` to see the error |
| App opens but 500 error | Make sure `SECRET_KEY` and `DATA_DIR` are set (`railway variables`) |
| Forgot the URL | Run `railway domain` or check the Railway dashboard |
| Want to wipe accounts & start fresh | In Railway dashboard → Variables → delete the DB file, or redeploy without the volume |

---

## Cost

Railway's free $5/month credit covers this app easily:  
- CPU: ~$0.50/month  
- RAM: ~$0.30/month  
- Volume (1GB): ~$0.25/month  
- **Total: ~$1/month** (well under the free credit)
