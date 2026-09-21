import json
import os
import sqlite3
from pathlib import Path
from contextlib import contextmanager

# In Docker/k8s, set DB_DIR to a mounted volume path so the SQLite file
# survives pod restarts. Defaults to the backend folder for local dev.
_DB_DIR = os.environ.get("DB_DIR")
if _DB_DIR:
    Path(_DB_DIR).mkdir(parents=True, exist_ok=True)
    DB_PATH = Path(_DB_DIR) / "snake_legends.db"
    print(f"From if statement : {DB_PATH}")
else:
    DB_PATH = Path(__file__).resolve().parent.parent / "snake_legends.db"
    print(f"From else statement : {DB_PATH}")


DEFAULT_STATE = {
    "name": "Player",
    "highScore": 0,
    "gamesPlayed": 0,
    "totalFood": 0,
    "bestLength": 3,
    "coins": 0,
    "ownedSnakes": [0],
    "ownedFoods": [0],
    "selectedSnake": 0,
    "selectedFood": 0,
    "theme": "dark",
    "sound": True,
    "speed": "normal",
}


def init_db():
    with get_conn() as conn:
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS players (
                player_id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                high_score INTEGER NOT NULL DEFAULT 0,
                games_played INTEGER NOT NULL DEFAULT 0,
                total_food INTEGER NOT NULL DEFAULT 0,
                best_length INTEGER NOT NULL DEFAULT 3,
                coins INTEGER NOT NULL DEFAULT 0,
                owned_snakes TEXT NOT NULL DEFAULT '[0]',
                owned_foods TEXT NOT NULL DEFAULT '[0]',
                selected_snake INTEGER NOT NULL DEFAULT 0,
                selected_food INTEGER NOT NULL DEFAULT 0,
                theme TEXT NOT NULL DEFAULT 'dark',
                sound INTEGER NOT NULL DEFAULT 1,
                speed TEXT NOT NULL DEFAULT 'normal'
            )
            """
        )
        conn.commit()


@contextmanager
def get_conn():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    try:
        yield conn
    finally:
        conn.close()


def row_to_state(row: sqlite3.Row) -> dict:
    return {
        "name": row["name"],
        "highScore": row["high_score"],
        "gamesPlayed": row["games_played"],
        "totalFood": row["total_food"],
        "bestLength": row["best_length"],
        "coins": row["coins"],
        "ownedSnakes": json.loads(row["owned_snakes"]),
        "ownedFoods": json.loads(row["owned_foods"]),
        "selectedSnake": row["selected_snake"],
        "selectedFood": row["selected_food"],
        "theme": row["theme"],
        "sound": bool(row["sound"]),
        "speed": row["speed"],
    }


def get_or_create_player(player_id: str) -> dict:
    with get_conn() as conn:
        row = conn.execute("SELECT * FROM players WHERE player_id = ?", (player_id,)).fetchone()
        if row is None:
            s = DEFAULT_STATE
            conn.execute(
                """INSERT INTO players
                (player_id, name, high_score, games_played, total_food, best_length, coins,
                 owned_snakes, owned_foods, selected_snake, selected_food, theme, sound, speed)
                VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)""",
                (
                    player_id, s["name"], s["highScore"], s["gamesPlayed"], s["totalFood"],
                    s["bestLength"], s["coins"], json.dumps(s["ownedSnakes"]), json.dumps(s["ownedFoods"]),
                    s["selectedSnake"], s["selectedFood"], s["theme"], int(s["sound"]), s["speed"],
                ),
            )
            conn.commit()
            row = conn.execute("SELECT * FROM players WHERE player_id = ?", (player_id,)).fetchone()
        return row_to_state(row)


def save_player(player_id: str, state: dict):
    with get_conn() as conn:
        conn.execute(
            """UPDATE players SET
                name=?, high_score=?, games_played=?, total_food=?, best_length=?, coins=?,
                owned_snakes=?, owned_foods=?, selected_snake=?, selected_food=?, theme=?, sound=?, speed=?
               WHERE player_id=?""",
            (
                state["name"], state["highScore"], state["gamesPlayed"], state["totalFood"],
                state["bestLength"], state["coins"], json.dumps(state["ownedSnakes"]),
                json.dumps(state["ownedFoods"]), state["selectedSnake"], state["selectedFood"],
                state["theme"], int(state["sound"]), state["speed"], player_id,
            ),
        )
        conn.commit()


def leaderboard(limit: int = 10):
    with get_conn() as conn:
        rows = conn.execute(
            "SELECT name, high_score, games_played, best_length FROM players "
            "ORDER BY high_score DESC LIMIT ?",
            (limit,),
        ).fetchall()
        return [
            {
                "name": r["name"],
                "highScore": r["high_score"],
                "gamesPlayed": r["games_played"],
                "bestLength": r["best_length"],
            }
            for r in rows
        ]
