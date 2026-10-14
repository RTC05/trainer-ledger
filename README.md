# ⚡ PokéDex Tracker

A personal, offline-first web app to track your Pokémon collection across every
main-series game. Runs entirely on your Mac — no accounts, no cloud, no
subscription.

![Python 3.11+](https://img.shields.io/badge/Python-3.11%2B-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-0.111%2B-green)
![SQLite](https://img.shields.io/badge/DB-SQLite-lightgrey)

---

## 🚀 Quick Start (fresh Mac)

### 1. Get the code

```bash
# Clone via git
git clone <your-repo-url> pokedex-tracker
cd pokedex-tracker
```

> **No git?** Just copy the project folder to your Mac and open a terminal inside it.

### 2. Make sure Python 3.11+ is installed

```bash
python3 --version   # needs to be 3.11 or higher
```

Don’t have it?

```bash
# Install Homebrew first if needed:
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Then install Python:
brew install python@3.12
```

Or download directly from [python.org](https://www.python.org/downloads/).

### 3. Run it

```bash
./start-pokedex.sh
```

That’s it. ✅

The script will:
- Create a virtual environment (`.venv/`) on first run
- Install all Python dependencies automatically
- Start the server at `http://localhost:8888`
- Open your browser

Press **Ctrl+C** to stop.

---

## 💻 Features

| Feature | Description |
|---|---|
| 🎮 **All 23 games** | Red/Blue through Scarlet/Violet + Legends + GO |
| ✅ **Catch tracker** | Click any card to mark caught/uncaught |
| ✨ **Shiny tracker** | Mark your shinies with glow effect |
| 🔍 **Search + filter** | By name, #, type, caught/uncaught/shiny |
| 📊 **Dashboard** | Global stats, per-game completion rings |
| 📝 **Notes** | Per-game notes panel (auto-saved) |
| 🔎 **Detail drawer** | Pokédex entry, base stats, type matchups, evolutions, locations |
| 🎯 **Catch rate calc** | Ball + status + HP% → real Gen 6+ catch probability |
| 🏘️ **Team Builder** | Pick 6 from your caught, see gym matchups + type coverage |
| 🧠 **Best Team AI** | Greedy algorithm picks the 6 that cover the most gym leaders |
| 🗺️ **Gym data** | All gyms, Elite Four, Champions for every main game |

---

## 📁 Project Structure

```
pokedex-tracker/
├── main.py              # FastAPI app + all routes
├── database.py          # SQLite helpers
├── config.py            # Game definitions
├── seeder.py            # PokéAPI seeder
├── pokeapi.py           # API utilities
├── requirements.txt     # Python dependencies
├── start-pokedex.sh     # One-click launcher
├── static/
│   ├── style.css          # Core styles
│   ├── game-detail.css    # Card + drawer styles
│   ├── team-builder.css   # Team builder styles
│   ├── detail-drawer.js   # Pokémon detail panel
│   ├── team-builder.js    # Team builder logic
│   ├── gym-data.js        # Gym leader data
│   └── htmx.min.js        # HTMX (bundled, no CDN)
└── templates/
    ├── base.html
    ├── index.html
    ├── game.html
    ├── team_builder.html
    └── partials/
```

---

## ⚙️ How it works

- **Backend:** Python + FastAPI serves HTML pages and a small JSON API
- **Frontend:** HTMX for interactivity (no React, no build step)
- **Database:** SQLite file (`pokedex.db`) — created automatically on first run
- **Pokémon data:** Fetched from [PokéAPI](https://pokeapi.co) on first visit to
  each game, then cached locally in SQLite forever
- **No internet required** after the initial data load

---

## 🔄 Updating

If you get new code (git pull or copy new files):

```bash
./start-pokedex.sh
```

Dependencies re-install automatically if `requirements.txt` changed.
Your catch data in `pokedex.db` is never touched by updates.

---

## 📦 Moving your data

Your entire save state is in `pokedex.db`. To move to another Mac:

1. Copy the whole project folder
2. Run `./start-pokedex.sh` on the new machine

Your catches, shinies, and notes come with it.

---

## ⚠️ Troubleshooting

**"Permission denied" on start-pokedex.sh**
```bash
chmod +x start-pokedex.sh
```

**"Python 3.11+ not found"**
```bash
brew install python@3.12
```

**Port 8888 already in use**
```bash
lsof -ti:8888 | xargs kill -9
```

**Stuck loading a game (spinner won’t stop)**  
PokéAPI might be slow. Wait a minute or refresh. Data loads once and is cached permanently.

**Server crashed — check logs:**
```bash
cat /tmp/pokedex-server.log
```

---

## 📝 License

Personal use. Pokémon data from [PokéAPI](https://pokeapi.co).  
Not affiliated with Nintendo or The Pokémon Company.