import { useRef, useEffect, useState } from "react";
import { api } from "../api.js";
import { sfx } from "../game/sfx.js";
import { drawSnakePreview } from "../game/draw.js";

function SnakePreviewCanvas({ skin }) {
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current) drawSnakePreview(ref.current, skin);
  }, [skin]);
  return <canvas ref={ref} width={100} height={30} />;
}

function ShopCard({ kind, item, owned, selected, coins, onPick }) {
  const [shake, setShake] = useState(false);

  const handleClick = () => {
    if (!owned && coins < item.price) {
      setShake(true);
      sfx.locked(true);
      setTimeout(() => setShake(false), 220);
      return;
    }
    onPick();
  };

  return (
    <div
      className={`pick-card${owned ? "" : " locked"}${selected ? " selected" : ""}`}
      onClick={handleClick}
      style={shake ? { animation: "shakeX 0.22s" } : undefined}
    >
      {selected ? (
        <div className="sel-tag">IN USE</div>
      ) : !owned ? (
        <div className="lock-tag">🪙 {item.price}</div>
      ) : null}

      {kind === "snake" ? (
        <SnakePreviewCanvas skin={item} />
      ) : (
        <div className="food-emoji">{item.emoji}</div>
      )}
      <div className="p-name">{item.name}</div>
    </div>
  );
}

export default function ShopScreen({ kind, title, items, state, setState, onBack }) {
  const ownedList = kind === "snake" ? state.ownedSnakes : state.ownedFoods;
  const selectedId = kind === "snake" ? state.selectedSnake : state.selectedFood;
  const ownedCount = items.filter((i) => ownedList.includes(i.id)).length;

  const pick = async (item) => {
    const owned = ownedList.includes(item.id);
    try {
      let s;
      if (owned) {
        s = await api.selectItem(kind, item.id);
        sfx.click(state.sound);
      } else {
        s = await api.purchaseItem(kind, item.id);
        sfx.purchase(state.sound);
      }
      setState(s);
    } catch (e) {
      // e.g. race condition on price/coins — refresh state to stay in sync
      const fresh = await api.getState();
      setState(fresh);
    }
  };

  return (
    <section className="screen active">
      <div className="subhead">
        <button className="back-btn" onClick={onBack}>←</button>
        <h2>{title}</h2>
        <div className="prog">
          <span>🪙 {state.coins}</span> · <span>{ownedCount}/{items.length} owned</span>
        </div>
      </div>
      <div className="select-grid">
        {items.map((item) => (
          <ShopCard
            key={item.id}
            kind={kind}
            item={item}
            owned={ownedList.includes(item.id)}
            selected={selectedId === item.id}
            coins={state.coins}
            onPick={() => pick(item)}
          />
        ))}
      </div>
    </section>
  );
}
