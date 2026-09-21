# Snake Legends — Python + React

Converted from the original single-file `snake-legends.html` into a full
stack app:

- **backend/** — FastAPI + SQLite. Serves the shop catalog (100 snake skins,
  100 food skins — generated with the exact same algorithm as the original
  JS) and stores each player's save (coins, unlocks, stats) server-side.
  Purchases and game results are validated on the server so a client can't
  just grant itself coins.
- **frontend/** — React (Vite) app. Same screens, look, canvas-based game
  engine and controls as the original (keyboard/WASD, on-screen d-pad,
  touch swipe), but talking to the backend over HTTP instead of
  `localStorage`.

## Run it

### 1. Backend

```bash
cd backend
python3 -m venv .venv && source .venv/bin/activate   # optional
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

This creates `backend/snake_legends.db` (SQLite) on first run.
API docs: http://127.0.0.1:8000/docs

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

Open http://127.0.0.1:5173 — the Vite dev server proxies `/api/*` to the
backend on port 8000 (see `vite.config.js`).

For a production build:

```bash
npm run build      # outputs frontend/dist
```
Serve `frontend/dist` with any static host, and point `VITE_API_URL`
(in `frontend/.env`, set at build time) at your deployed backend's URL.

## API overview

| Method | Path | Purpose |
|---|---|---|
| GET | `/api/catalog` | All snake & food skins + prices |
| GET | `/api/state/{player_id}` | Get (or create) a player's save |
| PUT | `/api/state/{player_id}` | Bulk-overwrite a player's save |
| POST | `/api/state/{player_id}/rename` | Change display name |
| POST | `/api/state/{player_id}/settings` | Update theme/sound/speed |
| POST | `/api/state/{player_id}/select` | Equip an owned snake/food |
| POST | `/api/state/{player_id}/purchase` | Buy a snake/food (server checks coins) |
| POST | `/api/state/{player_id}/reset` | Wipe progress |
| POST | `/api/state/{player_id}/finish-game` | Submit a completed run |
| GET | `/api/leaderboard` | Top scores across all players |

`player_id` is a random UUID the frontend generates once and keeps in
`localStorage` — it's just an anonymous identifier, not game state, so all
real progress now lives on the server.

## What changed vs. the original file

- Game rules, art, layout, colors, and shop economy are unchanged.
- `localStorage` save data was replaced with a SQLite-backed save per
  player, via the FastAPI endpoints above.
- Coin purchases are now validated server-side.
- Added a `/api/leaderboard` endpoint (not in the original) since scores
  are now centrally stored — feel free to wire up a leaderboard screen.
