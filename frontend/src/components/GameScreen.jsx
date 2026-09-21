import { useEffect, useRef, useState } from "react";
import { COLS, ROWS, SPEED_MS } from "../data/constants.js";
import { drawBoard, drawFood, drawHead, drawSegment, segColor } from "../game/draw.js";
import { sfx } from "../game/sfx.js";

const OPPOSITE = { UP: "DOWN", DOWN: "UP", LEFT: "RIGHT", RIGHT: "LEFT" };

export default function GameScreen({ state, catalog, onQuit, onGameOver }) {
  const canvasRef = useRef(null);
  const [hud, setHud] = useState({ score: 0, best: state.highScore, length: 3 });

  // mutable game state kept in refs so the tick/animation loops don't need
  // to re-subscribe on every render (mirrors the original imperative engine)
  const g = useRef(null);

  const skin = catalog.snakes.find((s) => s.id === state.selectedSnake) || catalog.snakes[0];
  const foodSkin = catalog.foods.find((f) => f.id === state.selectedFood) || catalog.foods[0];

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const CELL = canvas.width / COLS;

    function randInt(n) { return Math.floor(Math.random() * n); }

    function placeFood() {
      const occupied = new Set(g.current.snakeBody.map((p) => `${p.x},${p.y}`));
      let x, y, tries = 0;
      do {
        x = randInt(COLS); y = randInt(ROWS); tries++;
      } while (occupied.has(`${x},${y}`) && tries < 500);
      g.current.food = { x, y };
    }

    function drawGame() {
      drawBoard(ctx, COLS, ROWS, CELL);
      drawFood(ctx, g.current.food, foodSkin, CELL);
      const body = g.current.snakeBody;
      for (let i = body.length - 1; i >= 1; i--) {
        drawSegment(ctx, body[i], segColor(skin, body.length - 1 - i, body.length), CELL * 0.42, CELL);
      }
      drawHead(ctx, body[0], skin, g.current.direction, CELL);
    }

    function updateHud() {
      setHud({
        score: g.current.score,
        best: Math.max(state.highScore, g.current.score),
        length: g.current.snakeBody.length,
      });
    }

    function endGame() {
      clearInterval(g.current.loopHandle);
      g.current.running = false;
      sfx.gameOver(state.sound);
      onGameOver({
        score: g.current.score,
        foodEaten: g.current.foodEaten,
        length: g.current.snakeBody.length,
      });
    }

    function tick() {
      if (!g.current.running) return;
      g.current.direction = g.current.pendingDirection;
      const head = g.current.snakeBody[0];
      let nx = head.x, ny = head.y;
      if (g.current.direction === "UP") ny -= 1;
      else if (g.current.direction === "DOWN") ny += 1;
      else if (g.current.direction === "LEFT") nx -= 1;
      else if (g.current.direction === "RIGHT") nx += 1;

      if (nx < 0 || nx >= COLS || ny < 0 || ny >= ROWS) return endGame();
      for (const seg of g.current.snakeBody) {
        if (seg.x === nx && seg.y === ny) return endGame();
      }

      const newHead = { x: nx, y: ny };
      g.current.snakeBody.unshift(newHead);

      if (nx === g.current.food.x && ny === g.current.food.y) {
        g.current.score += 5;
        g.current.foodEaten += 1;
        sfx.eat(state.sound);
        placeFood();
      } else {
        g.current.snakeBody.pop();
      }

      updateHud();
      drawGame();
    }

    function setDirection(d) {
      if (!g.current.running) return;
      if (d !== OPPOSITE[g.current.direction]) g.current.pendingDirection = d;
    }

    g.current = {
      snakeBody: [{ x: 8, y: 14 }, { x: 7, y: 14 }, { x: 6, y: 14 }],
      direction: "RIGHT",
      pendingDirection: "RIGHT",
      score: 0,
      foodEaten: 0,
      running: true,
      food: { x: 20, y: 14 },
      loopHandle: null,
      setDirection,
    };
    placeFood();
    updateHud();
    drawGame();
    g.current.loopHandle = setInterval(tick, SPEED_MS[state.speed] || SPEED_MS.normal);

    let animHandle;
    function animLoop() {
      if (g.current.running) drawGame();
      animHandle = requestAnimationFrame(animLoop);
    }
    animHandle = requestAnimationFrame(animLoop);

    function onKeydown(e) {
      const map = {
        ArrowUp: "UP", ArrowDown: "DOWN", ArrowLeft: "LEFT", ArrowRight: "RIGHT",
        w: "UP", s: "DOWN", a: "LEFT", d: "RIGHT", W: "UP", S: "DOWN", A: "LEFT", D: "RIGHT",
      };
      if (map[e.key]) { e.preventDefault(); setDirection(map[e.key]); }
      else if (e.key === "Escape") {
        clearInterval(g.current.loopHandle);
        g.current.running = false;
        onQuit();
      }
    }
    window.addEventListener("keydown", onKeydown);

    let touchStart = null;
    function onTouchStart(e) {
      const t = e.changedTouches[0];
      touchStart = { x: t.clientX, y: t.clientY };
    }
    function onTouchEnd(e) {
      if (!touchStart) return;
      const t = e.changedTouches[0];
      const dx = t.clientX - touchStart.x, dy = t.clientY - touchStart.y;
      if (Math.abs(dx) > Math.abs(dy)) {
        if (Math.abs(dx) > 20) setDirection(dx > 0 ? "RIGHT" : "LEFT");
      } else {
        if (Math.abs(dy) > 20) setDirection(dy > 0 ? "DOWN" : "UP");
      }
      touchStart = null;
    }
    canvas.addEventListener("touchstart", onTouchStart, { passive: true });
    canvas.addEventListener("touchend", onTouchEnd, { passive: true });

    return () => {
      clearInterval(g.current.loopHandle);
      cancelAnimationFrame(animHandle);
      window.removeEventListener("keydown", onKeydown);
      canvas.removeEventListener("touchstart", onTouchStart);
      canvas.removeEventListener("touchend", onTouchEnd);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const quit = () => {
    if (g.current) {
      clearInterval(g.current.loopHandle);
      g.current.running = false;
    }
    onQuit();
  };

  const press = (dir) => g.current && g.current.setDirection(dir);

  return (
    <section className="screen active">
      <div className="game-hud">
        <div className="hud-chip">Score <b>{hud.score}</b></div>
        <div className="hud-chip">Best <b>{hud.best}</b></div>
        <div className="hud-chip">Length <b>{hud.length}</b></div>
        <button className="btn ghost" style={{ width: "auto", padding: "8px 14px" }} onClick={quit}>✕ Quit</button>
      </div>
      <div className="canvas-wrap">
        <canvas ref={canvasRef} width={560} height={560} id="gameCanvas" />
      </div>
      <div className="controls-hint">Arrow keys / WASD to move · Esc to quit</div>
      <div className="dpad">
        <div></div><button onClick={() => press("UP")}>▲</button><div></div>
        <button onClick={() => press("LEFT")}>◀</button><div></div><button onClick={() => press("RIGHT")}>▶</button>
        <div></div><button onClick={() => press("DOWN")}>▼</button><div></div>
      </div>
    </section>
  );
}
