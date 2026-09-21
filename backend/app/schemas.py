from typing import List, Literal, Optional
from pydantic import BaseModel, Field


class PlayerState(BaseModel):
    name: str = "Player"
    highScore: int = 0
    gamesPlayed: int = 0
    totalFood: int = 0
    bestLength: int = 3
    coins: int = 0
    ownedSnakes: List[int] = Field(default_factory=lambda: [0])
    ownedFoods: List[int] = Field(default_factory=lambda: [0])
    selectedSnake: int = 0
    selectedFood: int = 0
    theme: Literal["dark", "light"] = "dark"
    sound: bool = True
    speed: Literal["slow", "normal", "fast", "turbo"] = "normal"


class RenameRequest(BaseModel):
    name: str


class PurchaseRequest(BaseModel):
    kind: Literal["snake", "food"]
    item_id: int


class SelectRequest(BaseModel):
    kind: Literal["snake", "food"]
    item_id: int


class SettingsRequest(BaseModel):
    theme: Optional[Literal["dark", "light"]] = None
    sound: Optional[bool] = None
    speed: Optional[Literal["slow", "normal", "fast", "turbo"]] = None


class GameFinishRequest(BaseModel):
    score: int
    foodEaten: int
    length: int


class GameFinishResponse(BaseModel):
    state: PlayerState
    isNewBest: bool
    coinsEarned: int
