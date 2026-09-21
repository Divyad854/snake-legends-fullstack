import os

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from . import database as db
from . import data
from .schemas import (
    PlayerState, RenameRequest, PurchaseRequest, SelectRequest,
    SettingsRequest, GameFinishRequest, GameFinishResponse,
)

app = FastAPI(title="Snake Legends API", version="1.0.0")

# Comma-separated list of allowed origins, e.g. "https://snake.example.com".
# Defaults to "*" for easy local/dev use.
_origins = os.environ.get("CORS_ORIGINS", "*")
allow_origins = ["*"] if _origins.strip() == "*" else [o.strip() for o in _origins.split(",")]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allow_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup():
    db.init_db()


@app.get("/api/health")
def health():
    return {"status": "ok"}


@app.get("/api/catalog")
def get_catalog():
    """Static shop data: every snake skin and food skin, with prices."""
    return {"snakes": data.SNAKES, "foods": data.FOODS, "speeds": data.SPEED_MS}


@app.get("/api/state/{player_id}", response_model=PlayerState)
def get_state(player_id: str):
    return db.get_or_create_player(player_id)


@app.put("/api/state/{player_id}", response_model=PlayerState)
def put_state(player_id: str, state: PlayerState):
    """Bulk-save the whole player state (used for settings + full sync)."""
    db.get_or_create_player(player_id)  # ensure row exists
    db.save_player(player_id, state.model_dump())
    return db.get_or_create_player(player_id)


@app.post("/api/state/{player_id}/rename", response_model=PlayerState)
def rename_player(player_id: str, body: RenameRequest):
    state = db.get_or_create_player(player_id)
    name = body.name.strip()[:16]
    if name:
        state["name"] = name
        db.save_player(player_id, state)
    return db.get_or_create_player(player_id)


@app.post("/api/state/{player_id}/settings", response_model=PlayerState)
def update_settings(player_id: str, body: SettingsRequest):
    state = db.get_or_create_player(player_id)
    if body.theme is not None:
        state["theme"] = body.theme
    if body.sound is not None:
        state["sound"] = body.sound
    if body.speed is not None:
        state["speed"] = body.speed
    db.save_player(player_id, state)
    return db.get_or_create_player(player_id)


@app.post("/api/state/{player_id}/select", response_model=PlayerState)
def select_item(player_id: str, body: SelectRequest):
    """Switch the equipped snake skin or food skin (must already be owned)."""
    state = db.get_or_create_player(player_id)
    owned_key = "ownedSnakes" if body.kind == "snake" else "ownedFoods"
    select_key = "selectedSnake" if body.kind == "snake" else "selectedFood"
    catalog = data.SNAKES_BY_ID if body.kind == "snake" else data.FOODS_BY_ID

    if body.item_id not in catalog:
        raise HTTPException(404, "Unknown item id")
    if body.item_id not in state[owned_key]:
        raise HTTPException(400, "Item not owned")

    state[select_key] = body.item_id
    db.save_player(player_id, state)
    return db.get_or_create_player(player_id)


@app.post("/api/state/{player_id}/purchase", response_model=PlayerState)
def purchase_item(player_id: str, body: PurchaseRequest):
    """Server-authoritative purchase: validates price & coin balance itself,
    so the client can never grant itself free items."""
    state = db.get_or_create_player(player_id)
    owned_key = "ownedSnakes" if body.kind == "snake" else "ownedFoods"
    select_key = "selectedSnake" if body.kind == "snake" else "selectedFood"
    catalog = data.SNAKES_BY_ID if body.kind == "snake" else data.FOODS_BY_ID

    item = catalog.get(body.item_id)
    if item is None:
        raise HTTPException(404, "Unknown item id")
    if body.item_id in state[owned_key]:
        raise HTTPException(400, "Item already owned")
    if state["coins"] < item["price"]:
        raise HTTPException(402, "Not enough coins")

    state["coins"] -= item["price"]
    state[owned_key].append(body.item_id)
    state[select_key] = body.item_id
    db.save_player(player_id, state)
    return db.get_or_create_player(player_id)


@app.post("/api/state/{player_id}/reset", response_model=PlayerState)
def reset_progress(player_id: str):
    state = db.get_or_create_player(player_id)
    keep_name = state["name"]
    fresh = dict(db.DEFAULT_STATE)
    fresh["name"] = keep_name
    db.save_player(player_id, fresh)
    return db.get_or_create_player(player_id)


@app.post("/api/state/{player_id}/finish-game", response_model=GameFinishResponse)
def finish_game(player_id: str, body: GameFinishRequest):
    """Called once when a run ends. Server computes coins earned, high score,
    and persists the updated stats — mirrors the original endGame() logic."""
    state = db.get_or_create_player(player_id)
    is_new_best = body.score > state["highScore"]
    state["highScore"] = max(state["highScore"], body.score)
    state["gamesPlayed"] += 1
    state["totalFood"] += body.foodEaten
    state["bestLength"] = max(state["bestLength"], body.length)
    state["coins"] += body.score  # coins earned this run == score, same as original
    db.save_player(player_id, state)
    updated = db.get_or_create_player(player_id)
    return {"state": updated, "isNewBest": is_new_best, "coinsEarned": body.score}


@app.get("/api/leaderboard")
def get_leaderboard(limit: int = 10):
    return db.leaderboard(limit)
