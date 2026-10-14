# 🐛 Fixes Applied + Railway Deployment Checklist

## ✅ Fixes Applied (March 31, 2024)

### **Issue 1: DLC Load Error - "Can't find variable: GAME_ID"**
**Problem:** The `loadDLC()` function couldn't access `GAME_ID` and other constants because they were scoped inside the "first load" block.

**Fix:** Moved all JavaScript constants to global scope at the top of `game.html`:
```javascript
<script>
  // Global constants available to ALL scripts on this page
  window.CURRENT_GAME_ID = "{{ game.id }}";
  const GAME_ID      = "{{ game.id }}";
  const DEX_SLUGS    = {{ pokedex_slugs_json | safe }};
  const DLC_CONFIG   = {{ dlc_json | safe }};
  const POKEAPI_BASE = "https://pokeapi.co/api/v2";
  const BATCH_SIZE   = 15;
</script>
```

**Status:** ✅ Fixed — `loadDLC()` can now access all required variables

---

### **Issue 2: Regional vs National Dex Toggle Conflicts**
**Problem:** 
- National Dex toggle was hidden when viewing DLC (`dex_mode='all'`)
- DLC toggle was hidden when in National mode
- This made it impossible to freely switch between views

**Fix:** Removed both restrictions in the filter pills section:
```jinja2
{# National Dex - always shown when game supports it #}
{% if has_national_dex and cached %}
  <!-- shows toggle regardless of DLC state -->
{% endif %}

{# DLC - always shown when game has DLC #}
{% if game.dlc %}
  <!-- shows toggle regardless of numbering mode -->
{% endif %}
```

**Status:** ✅ Fixed — All view modes are now independently accessible

---

## 📊 View Modes Explained

| Mode | Shows | Numbering | When to Use |
|------|-------|-----------|-------------|
| **Regional** | Regional dex only | Regional #s | Default game experience |
| **National** | Regional dex only | National #s | Compare across generations |
| **All (DLC)** | Regional + DLC | Sequential #s | Include expansion content |

**Toggle Behavior:**
- Regional ↔ National: Same Pokémon, different numbering
- Regional/National → All: Adds DLC Pokémon (switches to sequential)
- All → Regional: Removes DLC Pokémon

---

## 🧪 Local Testing Checklist

### Basic Functionality
- [ ] Server starts: `bash start-pokedex.sh`
- [ ] Health check passes: `curl http://localhost:8888/health`
- [ ] Can register a new account
- [ ] Can log in

### Test National Dex Toggle
Games with National Dex support:
- [ ] **FireRed/LeafGreen** (national_max_id: 386)
- [ ] **Platinum** (national_max_id: 493)
- [ ] **Black 2/White 2** (national_max_id: 649)
- [ ] **BDSP** (national_max_id: 493)

**Test Steps:**
1. Open a game that supports National Dex (e.g., BDSP)
2. Wait for regional dex to load
3. Click "🌎 National Dex" button
4. Verify Pokémon are renumbered by National Pokédex order
5. Toggle back to Regional — verify original numbering returns

### Test DLC Loading
Games with DLC:
- [ ] **Sword/Shield** (Isle of Armor, Crown Tundra)
- [ ] **Scarlet/Violet** (Teal Mask, Indigo Disk)

**Test Steps:**
1. Open Sword/Shield or Scarlet/Violet
2. Wait for regional dex to load
3. Click "📥 Load DLC" button
4. Watch the progress bar complete
5. Verify page reloads with DLC Pokémon
6. Click "Regional + DLC" to toggle back to regional only
7. Click "⊕ Include DLC" to re-enable DLC view

### Test Combined Modes (if applicable)
For games with BOTH National Dex AND DLC:
- [ ] None currently (SwSh/SV don't expose national_max_id)

**Note:** If you add `national_max_id` to Sword/Shield or Scarlet/Violet in the future:
1. Should be able to toggle Regional → National → All independently
2. National + All mode would show DLC with national numbers

---

## 🚀 Railway Deployment Checklist

### Pre-Deployment Verification
- [x] `Procfile` exists and correct
- [x] `railway.toml` configured
- [x] `requirements.txt` complete
- [x] Template syntax validated
- [x] All Python files error-free

### Deployment Steps

#### 1. Ensure Railway CLI is installed
```bash
brew install railway
```

#### 2. Log in to Railway
```bash
railway login
```

#### 3. Initialize project (if not already done)
```bash
cd ~/Documents/pokedex-tracker
railway init
```
- Project name: `pokedex-tracker` (or your choice)
- Environment: `production`

#### 4. Add persistent volume for database
```bash
railway volume add --mount /data
```
**⚠️ Critical:** Without this, database wipes on every deploy!

#### 5. Set environment variables
```bash
# Generate secure secret key
railway variables set SECRET_KEY=$(openssl rand -hex 32)

# Point database to persistent volume
railway variables set DATA_DIR=/data
```

#### 6. Deploy! 🚀
```bash
railway up
```
Wait 2-3 minutes for first build.

#### 7. Watch logs
```bash
railway logs
```
Look for:
```
[db] DB_PATH   = /data/pokedex.db
[db] DB exists = 🆕 (fresh database)
```

#### 8. Get your public URL
```bash
railway domain
```
You'll get something like:
```
https://pokedex-tracker-production.up.railway.app
```

#### 9. Register first account (becomes admin)
- Open the URL in browser
- Click **Register**
- Create your account
- You're now the admin!

---

## 🔍 Post-Deployment Testing

### Smoke Tests
- [ ] `/health` endpoint returns JSON
- [ ] Can register new account
- [ ] Can log in
- [ ] Homepage shows all games
- [ ] Can open a game and load regional dex
- [ ] Can toggle caught/uncaught
- [ ] Notes save automatically

### Feature Tests
- [ ] National Dex toggle works (try BDSP)
- [ ] DLC load works (try Sword/Shield)
- [ ] Search filter works
- [ ] Type filter works
- [ ] Shiny toggle works
- [ ] Team builder works

### Multi-User Test
- [ ] Share URL with friend
- [ ] Friend registers separate account
- [ ] Verify progress is completely isolated

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| `GAME_ID is not defined` | ✅ Fixed — constants now global |
| DLC button does nothing | Check browser console for errors |
| National Dex toggle missing | Game must have `national_max_id` in config.py |
| Database wipes on deploy | Ensure `/data` volume is mounted |
| Build fails | Run `railway logs` — usually missing env var |
| 500 error on page load | Check `SECRET_KEY` and `DATA_DIR` are set |
| PokéAPI timeout | Normal — server will retry, just takes longer |

---

## 📝 Files Changed
- `templates/game.html` — Fixed variable scope + toggle visibility logic
- `FIXES-AND-DEPLOYMENT.md` — This file (documentation)

**No changes needed to:**
- Python backend (`main.py`, `database.py`, etc.)
- Config (`config.py`)
- Deployment files (`Procfile`, `railway.toml`)

---

## 💾 Version Info
- **Fix Date:** March 31, 2024
- **App Version:** ffae78cd
- **Template validated:** ✅ Jinja2 syntax check passed

---

## 🎯 Next Steps
1. ✅ Local testing (server running on :8888)
2. ⏳ Deploy to Railway
3. ⏳ Test on Railway
4. ⏳ Share URL with friends

**Ready to deploy when you are!** 🚀
