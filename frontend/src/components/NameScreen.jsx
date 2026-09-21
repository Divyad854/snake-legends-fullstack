import { useState } from "react";
import { api } from "../api.js";

export default function NameScreen({ state, setState, onBack }) {
  const [value, setValue] = useState(state.name);

  const save = async () => {
    const v = value.trim();
    if (v.length > 0) {
      const s = await api.rename(v);
      setState(s);
    }
    onBack();
  };

  return (
    <section className="screen active">
      <div className="subhead">
        <button className="back-btn" onClick={onBack}>←</button>
        <h2>Your Name</h2>
      </div>
      <div className="stat-card">
        <input
          className="name-input"
          maxLength={16}
          placeholder="Enter your name"
          value={value}
          autoFocus
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") save(); }}
        />
        <div className="char-count"><span>{value.length}</span>/16</div>
        <button className="btn" onClick={save}>SAVE</button>
      </div>
    </section>
  );
}
