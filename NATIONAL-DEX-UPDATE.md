# 🌍 National Dex Feature - Complete Implementation

## 📋 What Changed

### **Before:**
- National Dex was just renumbering the same regional Pokémon
- BDSP Regional: 151 Pokémon → National: same 151, just renumbered

### **After:**
- **Regional Dex**: Shows only regional Pokémon (e.g., 151 for BDSP Sinnoh dex)
- **National Dex**: Shows ALL Pokémon up to that generation (e.g., 493 for BDSP = Gen 1-4)
- Each mode has accurate counts and stats

---

## 🎮 How It Works Now

| Mode | BDSP Example | Pokémon Count | Numbering |
|------|--------------|---------------|-----------|
| **Regional** | Sinnoh Dex | 151 | Regional #1-151 |
| **National** | Full Gen 1-4 | 493 | National #1-493 |
| **DLC** | N/A (no DLC) | N/A | N/A |

### Games with National Dex:
- **Gen 3**: Ruby/Sapphire, Emerald, FireRed/LeafGreen (up to #386)
- **Gen 4**: Diamond/Pearl, Platinum, HeartGold/SoulSilver (up to #493)
- **Gen 5**: Black/White, Black 2/White 2 (up to #649)
- **Gen 6**: X/Y, Omega Ruby/Alpha Sapphire (up to #721)
- **Gen 7**: Sun/Moon (up to #807), Ultra Sun/Ultra Moon (up to #809)
- **Gen 8**: Brilliant Diamond/Shining Pearl (up to #493)

---

## 🔧 Technical Implementation

### New Database Functions (`database.py`)
```python
def is_national_cached(game_id: str) -> bool
def mark_national_cached(game_id: str)
```
- Tracks whether National Dex has been loaded for a game
- Prevents re-downloading on every page load

### New API Endpoint (`main.py`)
```
POST /api/seed/{game_id}/national-complete
```
- Marks National Dex as fully loaded
- Called automatically after seeding completes

### Updated Game View Logic (`main.py`)
- `national_cached` flag passed to template
- `national_max_id` value from config
- Dex mode validation updated to require national_cached

### New Template Section (`templates/game.html`)
1. **Loading Overlay**: Shows progress when fetching National Dex
2. **`loadNationalDex()` Function**: 
   - Fetches Pokémon #1 to #national_max_id from PokéAPI
   - Skips already-loaded regional Pokémon
   - Seeds missing Pokémon with `in_regional_dex=false`
   - Marks complete and reloads in National mode
3. **Smart Toggle Button**:
   - Shows "📥 Load National Dex" if not cached
   - Shows "🌍 National Dex" toggle if cached

---

## 🧪 Testing Steps

### 1. Test BDSP (Gen 4, limit #493)
```bash
# Open http://localhost:8888
# Register/login
# Click "Brilliant Diamond / Shining Pearl"
```

**Expected:**
1. Regional dex loads (151 Pokémon)
2. Progress bar shows "151 / 151"
3. Filter bar shows "📥 Load National Dex" button

**Click "Load National Dex":**
1. Overlay appears: "Loading National Dex..."
2. Progress bar fills as it fetches #1-493
3. Page reloads in National mode
4. Progress bar shows "151 / 493" (you've only caught regional ones)
5. Grid shows all 493 Pokémon
6. Button changes to "🌍 National Dex" (active)

**Toggle back to Regional:**
1. Click "🌍 National Dex" button
2. Page reloads
3. Shows only 151 regional Pokémon again
4. Button shows "🌍 National Dex" (inactive)

### 2. Test Platinum (Gen 4, limit #493)
- Same as BDSP
- Regional dex has 210 Pokémon (extended Sinnoh)
- National shows all 493

### 3. Test FireRed/LeafGreen (Gen 3, limit #386)
- Regional: 151 Pokémon (Kanto)
- National: 386 Pokémon (Gen 1-3)

### 4. Test Black 2/White 2 (Gen 5, limit #649)
- Regional: 300 Pokémon (Updated Unova)
- National: 649 Pokémon (Gen 1-5)

### 5. Verify Stats Are Accurate
- In Regional mode: caught count out of regional total
- In National mode: caught count out of national total  
- Switching modes should preserve caught status

---

## 🚀 How Users Will Use It

### First Time Setup (Per Game):
1. Open a game with National Dex support
2. Let regional dex load (automatic, happens once)
3. Click "📥 Load National Dex" button
4. Wait 1-3 minutes (depends on how many Pokémon are missing)
5. Page reloads with full National Dex

### Daily Use:
- Toggle between Regional and National anytime
- **Regional**: Focus on catching regional exclusives
- **National**: See completion progress across all generations
- Caught status is shared (catching Pikachu in Regional also marks it in National)

---

## 📊 Database Schema

### `game_pokemon` Table
| Column | Type | Description |
|--------|------|-------------|
| `game_id` | TEXT | Game identifier |
| `pokemon_id` | INTEGER | National Pokédex # |
| `dex_number` | INTEGER | Display number (regional or national) |
| `in_regional_dex` | INTEGER | 1=regional, 0=national-only |

### `cache_meta` Table
New keys:
- `national_cached_{game_id}`: "1" if National Dex loaded

### Query Logic
```sql
-- Regional mode
WHERE in_regional_dex = 1
ORDER BY dex_number ASC

-- National mode
WHERE in_regional_dex = 1 OR in_regional_dex = 0
ORDER BY pokemon_id ASC  -- National number
```

---

## ⚠️ Important Notes

### DLC vs National Dex (Independent Features)
- **DLC**: Adds expansion Pokémon (e.g., Isle of Armor for Sword/Shield)
- **National**: Adds all Pokémon up to that generation
- They work independently:
  - Sword/Shield has DLC but no National Dex
  - BDSP has National Dex but no DLC
  - (If we add `national_max_id` to SwSh, both would work together!)

### Loading Time
- **Regional Dex**: Usually 30-60 seconds (50-300 Pokémon)
- **National Dex**: 1-3 minutes (100-500 missing Pokémon)
- **DLC**: 30-90 seconds (50-200 Pokémon)

Only happens once per game! After that, it's instant.

### Bandwidth Usage
- Each Pokémon = ~2KB from PokéAPI
- National Dex (500 missing) = ~1MB total
- All done in browser, no server bandwidth used

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| "Load National Dex" does nothing | Check browser console for errors; `GAME_ID` must be defined |
| Progress bar stuck | PokéAPI rate limit hit — wait 1 minute and reload |
| "Can't find variable: national_max_id" | Game doesn't have `national_max_id` in config.py |
| National toggle missing | Either no `national_max_id` or national not cached yet |
| Stats don't match | Clear browser cache and reload (old JS might be cached) |
| Caught count wrong | Normal! Regional catches show in National, but not vice versa |

---

## 📝 Files Modified

### `database.py`
- ✅ Added `is_national_cached()`
- ✅ Added `mark_national_cached()`

### `main.py`
- ✅ Imported new database functions
- ✅ Added `national_cached` variable in `game_view()`
- ✅ Updated dex_mode validation logic
- ✅ Passed `national_cached` and `national_max_id` to template
- ✅ Added `/api/seed/{game_id}/national-complete` endpoint

### `templates/game.html`
- ✅ Added National Dex loading overlay
- ✅ Added `loadNationalDex()` JavaScript function
- ✅ Updated National Dex toggle button logic
- ✅ Shows "Load" button if not cached, "Toggle" if cached

### No Changes Needed:
- `config.py` — `national_max_id` values already exist
- `requirements.txt`
- Railway deployment files

---

## 🎯 Next Steps

### Ready to Deploy:
1. Test locally (server already running on :8888)
2. Verify BDSP National Dex loading works
3. Deploy to Railway: `railway up`

### Future Enhancements:
- Add `national_max_id` to Sword/Shield, Scarlet/Violet (currently DLC-only)
- Add progress indicators for each generation in National mode
- Add "Load All" button to load Regional + National + DLC in one click
- Cache Pokémon sprites locally to reduce PokéAPI calls

---

## ✅ Deployment Checklist

- [x] Database functions added
- [x] API endpoint created
- [x] Template updated with loading UI
- [x] Toggle button logic fixed
- [x] Validation added for cached status
- [x] Template syntax validated
- [x] Python compilation successful
- [x] Server running locally

**Status: READY FOR RAILWAY** 🚀

Run: `cd ~/Documents/pokedex-tracker && railway up`
