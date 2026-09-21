import { useEffect, useState, useCallback } from "react";
import { api } from "./api.js";
import { sfx } from "./game/sfx.js";

import Menu from "./components/Menu.jsx";
import ShopScreen from "./components/ShopScreen.jsx";
import Settings from "./components/Settings.jsx";
import NameScreen from "./components/NameScreen.jsx";
import GameScreen from "./components/GameScreen.jsx";
import GameOver from "./components/GameOver.jsx";

export default function App() {
  const [screen, setScreen] = useState("menu");
  const [state, setState] = useState(null); // player save state, from backend
  const [catalog, setCatalog] = useState(null); // { snakes, foods, speeds }
  const [lastRun, setLastRun] = useState(null); // { score, foodEaten, length, isNewBest, coinsEarned }
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "dark");
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const [c, s] = await Promise.all([api.getCatalog(), api.getState()]);
        setCatalog(c);
        setState(s);
        document.documentElement.setAttribute("data-theme", s.theme);
      } catch (e) {
        setError(e.message || "Could not reach the Snake Legends server.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const refreshState = useCallback(async () => {
    const s = await api.getState();
    setState(s);
    return s;
  }, []);

  const goTo = useCallback((screenName) => {
    sfx.click(state?.sound ?? true);
    setScreen(screenName);
  }, [state]);

  if (loading) {
    return <div className="app"><div className="stat-card">Loading Snake Legends…</div></div>;
  }
  if (error || !state || !catalog) {
    return (
      <div className="app">
        <div className="stat-card">
          <b>Couldn't connect to the backend.</b>
          <p className="setting-sub">{error || "Unknown error"}</p>
          <p className="setting-sub">
            Make sure the FastAPI server is running (see backend/README) and that
            VITE_API_URL points at it.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <div className="brand">
        <div className="brand-title"><span className="mark">🐍</span> Snake Legends</div>
        <button
          className="theme-toggle"
          onClick={async () => {
            const theme = state.theme === "dark" ? "light" : "dark";
            document.documentElement.setAttribute("data-theme", theme);
            const s = await api.updateSettings({ theme });
            setState(s);
          }}
          title="Toggle theme"
        >
          {state.theme === "dark" ? "🌙" : "☀️"}
        </button>
      </div>

      {screen === "menu" && (
        <Menu state={state} catalog={catalog} goTo={goTo} onPlay={() => goTo("game")} />
      )}

      {screen === "snakes" && (
        <ShopScreen
          kind="snake"
          title="Snake Shop"
          items={catalog.snakes}
          state={state}
          setState={setState}
          onBack={() => goTo("menu")}
        />
      )}

      {screen === "foods" && (
        <ShopScreen
          kind="food"
          title="Food Shop"
          items={catalog.foods}
          state={state}
          setState={setState}
          onBack={() => goTo("menu")}
        />
      )}

      {screen === "settings" && (
        <Settings state={state} setState={setState} onBack={() => goTo("menu")} />
      )}

      {screen === "name" && (
        <NameScreen state={state} setState={setState} onBack={() => goTo("menu")} />
      )}

      {screen === "game" && (
        <GameScreen
          state={state}
          catalog={catalog}
          onQuit={async () => { await refreshState(); goTo("menu"); }}
          onGameOver={async (run) => {
            const result = await api.finishGame(run.score, run.foodEaten, run.length);
            setState(result.state);
            setLastRun({ ...run, isNewBest: result.isNewBest, coinsEarned: result.coinsEarned });
            sfx.gameOver(result.state.sound);
            setScreen("gameover");
          }}
        />
      )}

      {screen === "gameover" && lastRun && (
        <GameOver
          run={lastRun}
          state={state}
          onPlayAgain={() => setScreen("game")}
          onMenu={() => goTo("menu")}
        />
      )}
    </div>
  );
}
