import { api } from "../api.js";
import { sfx } from "../game/sfx.js";

export default function Settings({ state, setState, onBack }) {
  const update = async (patch) => {
    const s = await api.updateSettings(patch);
    if (patch.theme) document.documentElement.setAttribute("data-theme", patch.theme);
    setState(s);
  };

  const reset = async () => {
    if (!confirm("Reset all progress? This clears your score, unlocks and stats.")) return;
    const s = await api.resetProgress();
    document.documentElement.setAttribute("data-theme", s.theme);
    setState(s);
  };

  return (
    <section className="screen active">
      <div className="subhead">
        <button className="back-btn" onClick={onBack}>←</button>
        <h2>Settings</h2>
      </div>

      <div className="stat-card">
        <div className="setting-row">
          <div>
            <div className="setting-label">Theme</div>
            <div className="setting-sub">Light or dark interface</div>
          </div>
          <div className="seg">
            <button
              className={state.theme === "light" ? "active" : ""}
              onClick={() => { sfx.click(state.sound); update({ theme: "light" }); }}
            >☀ Light</button>
            <button
              className={state.theme === "dark" ? "active" : ""}
              onClick={() => { sfx.click(state.sound); update({ theme: "dark" }); }}
            >🌙 Dark</button>
          </div>
        </div>

        <div className="setting-row">
          <div>
            <div className="setting-label">Sound</div>
            <div className="setting-sub">Eat & game-over effects</div>
          </div>
          <button
            className={`switch${state.sound ? " on" : ""}`}
            onClick={() => update({ sound: !state.sound })}
          >
            <span className="knob" />
          </button>
        </div>

        <div className="setting-row">
          <div>
            <div className="setting-label">Speed</div>
            <div className="setting-sub">Game tick speed</div>
          </div>
          <div className="seg">
            {["slow", "normal", "fast", "turbo"].map((v) => (
              <button
                key={v}
                className={state.speed === v ? "active" : ""}
                onClick={() => { sfx.click(state.sound); update({ speed: v }); }}
              >{v[0].toUpperCase() + v.slice(1)}</button>
            ))}
          </div>
        </div>
      </div>

      <div className="stat-card">
        <div className="setting-row" style={{ border: "none", paddingTop: 0 }}>
          <div>
            <div className="setting-label">Reset Progress</div>
            <div className="setting-sub">Clears scores & unlocks</div>
          </div>
          <button className="btn danger" style={{ width: "auto", padding: "10px 16px" }} onClick={reset}>
            Reset
          </button>
        </div>
      </div>
    </section>
  );
}
