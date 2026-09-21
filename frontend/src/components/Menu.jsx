export default function Menu({ state, catalog, goTo, onPlay }) {
  const snake = catalog.snakes.find((s) => s.id === state.selectedSnake);
  const food = catalog.foods.find((f) => f.id === state.selectedFood);
  const totalOwned = state.ownedSnakes.length + state.ownedFoods.length;

  return (
    <section className="screen active">
      <div className="stat-card">
        <div className="player-row">
          <div className="player-name">{state.name}</div>
          <button className="edit-name" onClick={() => goTo("name")}>✎ Rename</button>
          <div className="coin-chip"><span>🪙</span> <span>{state.coins}</span></div>
        </div>
        <div className="stat-grid">
          <div className="stat-box"><div className="num">{state.highScore}</div><div className="lab">High Score</div></div>
          <div className="stat-box"><div className="num">{state.gamesPlayed}</div><div className="lab">Games</div></div>
          <div className="stat-box"><div className="num">{state.totalFood}</div><div className="lab">Food Eaten</div></div>
          <div className="stat-box"><div className="num">{state.bestLength}</div><div className="lab">Best Length</div></div>
        </div>
      </div>

      <button className="btn" style={{ fontSize: 19, padding: 20 }} onClick={onPlay}>▶ PLAY</button>

      <div className="menu-grid">
        <button className="menu-tile" onClick={() => goTo("snakes")}>
          <div className="ico">🐍</div>
          <div className="lbl">Snakes</div>
          <div className="sub">{snake ? snake.name : "Choose your skin"}</div>
        </button>
        <button className="menu-tile" onClick={() => goTo("foods")}>
          <div className="ico">🍎</div>
          <div className="lbl">Food</div>
          <div className="sub">{food ? `${food.emoji} ${food.name}` : "Choose your food"}</div>
        </button>
        <button className="menu-tile" onClick={() => goTo("settings")}>
          <div className="ico">⚙️</div>
          <div className="lbl">Settings</div>
          <div className="sub">Theme, sound, speed</div>
        </button>
        <button className="menu-tile" onClick={() => goTo("snakes")}>
          <div className="ico"></div>
          <div className="lbl">Shop</div>
          <div className="sub">{totalOwned} / 200 owned</div>
        </button>
      </div>
    </section>
  );
}
