export default function GameOver({ run, state, onPlayAgain, onMenu }) {
  return (
    <section className="screen active">
      <div className="go-panel">
        {run.isNewBest && <div className="new-best">🏆 NEW HIGH SCORE</div>}
        <h2 className="go-title">GAME OVER</h2>
        <div className="go-score">{run.score}</div>
        <div className="go-sub">points this run · 🪙 +{run.coinsEarned} earned</div>
        <div className="go-stats">
          <div className="stat-box"><div className="num">{run.foodEaten}</div><div className="lab">Food Eaten</div></div>
          <div className="stat-box"><div className="num">{run.length}</div><div className="lab">Length</div></div>
          <div className="stat-box"><div className="num">{state.highScore}</div><div className="lab">High Score</div></div>
        </div>
        <div className="btn-row">
          <button className="btn" onClick={onPlayAgain}>↻ PLAY AGAIN</button>
          <button className="btn secondary" onClick={onMenu}>MENU</button>
        </div>
      </div>
    </section>
  );
}
