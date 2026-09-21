export function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

export function lighten(color) {
  const m = /hsl\((\d+(?:\.\d+)?),(\d+)%,(\d+)%\)/.exec(color.replace(/\s/g, ""));
  if (!m) return color;
  const l = Math.min(92, parseInt(m[3], 10) + 18);
  return `hsl(${m[1]},${m[2]}%,${l}%)`;
}

function mixColorHSL(hslA, hslB, t) {
  return t < 0.5 ? hslA : hslB;
}

export function segColor(skin, i, total) {
  switch (skin.pattern) {
    case "stripe":
      return i % 2 === 0 ? skin.light : skin.primary;
    case "scale":
      return i % 3 === 0 ? skin.light : skin.primary;
    case "gradient": {
      const t = i / Math.max(1, total - 1);
      return mixColorHSL(skin.light, skin.secondary, t);
    }
    case "gold":
      return i % 2 === 0 ? "hsl(48,95%,60%)" : "hsl(42,85%,45%)";
    case "rainbow": {
      const palette = [
        "hsl(0,80%,60%)", "hsl(35,85%,58%)", "hsl(60,80%,55%)",
        "hsl(140,65%,50%)", "hsl(205,75%,55%)", "hsl(275,65%,60%)",
      ];
      return palette[i % palette.length];
    }
    case "shadow":
      return i % 2 === 0 ? skin.secondary : "hsl(230,10%,16%)";
    case "fire":
      return i % 2 === 0 ? "hsl(20,95%,55%)" : "hsl(45,95%,55%)";
    case "ice":
      return i % 2 === 0 ? skin.light : "hsl(200,70%,80%)";
    case "neon":
      return i % 2 === 0 ? skin.primary : skin.light;
    default:
      return skin.primary;
  }
}

export function drawSnakePreview(canvas, skin) {
  const ctx = canvas.getContext("2d");
  const w = canvas.width, h = canvas.height;
  ctx.clearRect(0, 0, w, h);
  const segs = 4, cell = 18, startX = 12, y = h / 2 - cell / 2;
  for (let i = segs - 1; i >= 0; i--) {
    const x = startX + i * (cell - 2);
    const col = segColor(skin, segs - 1 - i, segs);
    ctx.fillStyle = col;
    roundRect(ctx, x, y, cell, cell, 5);
    ctx.fill();
  }
  const hx = startX + (segs - 1) * (cell - 2);
  ctx.fillStyle = skin.primary;
  roundRect(ctx, hx, y, cell, cell, 6);
  ctx.fill();
  ctx.fillStyle = "#fff";
  ctx.beginPath(); ctx.arc(hx + cell * 0.65, y + cell * 0.32, 1.6, 0, 7); ctx.fill();
  ctx.beginPath(); ctx.arc(hx + cell * 0.65, y + cell * 0.68, 1.6, 0, 7); ctx.fill();
}

export function drawSegment(ctx, seg, color, radius, CELL) {
  const cx = seg.x * CELL + CELL / 2, cy = seg.y * CELL + CELL / 2;
  const grad = ctx.createRadialGradient(cx - radius * 0.3, cy - radius * 0.3, radius * 0.15, cx, cy, radius);
  grad.addColorStop(0, lighten(color));
  grad.addColorStop(1, color);
  ctx.fillStyle = grad;
  roundRect(ctx, seg.x * CELL + 1.5, seg.y * CELL + 1.5, CELL - 3, CELL - 3, CELL * 0.32);
  ctx.fill();
  ctx.strokeStyle = "rgba(0,0,0,0.12)";
  ctx.lineWidth = 1;
  ctx.stroke();
}

export function drawHead(ctx, seg, skin, dir, CELL) {
  const x = seg.x * CELL, y = seg.y * CELL;
  const cx = x + CELL / 2, cy = y + CELL / 2;
  const grad = ctx.createRadialGradient(cx - CELL * 0.2, cy - CELL * 0.2, 2, cx, cy, CELL * 0.55);
  grad.addColorStop(0, lighten(skin.primary));
  grad.addColorStop(1, skin.primary);
  ctx.fillStyle = grad;
  roundRect(ctx, x + 1, y + 1, CELL - 2, CELL - 2, CELL * 0.38);
  ctx.fill();
  ctx.strokeStyle = "rgba(0,0,0,0.18)";
  ctx.stroke();

  let ex1, ey1, ex2, ey2, tx, ty;
  const off = CELL * 0.24, eoff = CELL * 0.16;
  if (dir === "RIGHT") { ex1 = cx + off * 0.6; ey1 = cy - off; ex2 = cx + off * 0.6; ey2 = cy + off; tx = cx + CELL * 0.5; ty = cy; }
  else if (dir === "LEFT") { ex1 = cx - off * 0.6; ey1 = cy - off; ex2 = cx - off * 0.6; ey2 = cy + off; tx = cx - CELL * 0.5; ty = cy; }
  else if (dir === "UP") { ex1 = cx - off; ey1 = cy - off * 0.6; ex2 = cx + off; ey2 = cy - off * 0.6; tx = cx; ty = cy - CELL * 0.5; }
  else { ex1 = cx - off; ey1 = cy + off * 0.6; ex2 = cx + off; ey2 = cy + off * 0.6; tx = cx; ty = cy + CELL * 0.5; }

  if (Math.floor(Date.now() / 300) % 2 === 0) {
    ctx.strokeStyle = "#d13b3b";
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(tx, ty);
    ctx.stroke();
  }

  ctx.fillStyle = "#fff";
  ctx.beginPath(); ctx.arc(ex1, ey1, eoff, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(ex2, ey2, eoff, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = "#111";
  ctx.beginPath(); ctx.arc(ex1, ey1, eoff * 0.5, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(ex2, ey2, eoff * 0.5, 0, Math.PI * 2); ctx.fill();
}

export function drawFood(ctx, food, foodSkin, CELL) {
  const cx = food.x * CELL + CELL / 2, cy = food.y * CELL + CELL / 2;
  const r = CELL * 0.42;
  const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, r * 1.8);
  glow.addColorStop(0, foodSkin.color.replace(")", ",0.35)").replace("hsl", "hsla"));
  glow.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = glow;
  ctx.beginPath(); ctx.arc(cx, cy, r * 1.8, 0, Math.PI * 2); ctx.fill();
  ctx.font = `${CELL * 0.85}px "Segoe UI Emoji","Apple Color Emoji",sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(foodSkin.emoji, cx, cy + 1);
}

export function drawBoard(ctx, COLS, ROWS, CELL) {
  const style = getComputedStyle(document.documentElement);
  const panel = style.getPropertyValue("--bg-panel");
  const card = style.getPropertyValue("--card-bg");
  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      const light = (x + y) % 2 === 0;
      ctx.fillStyle = light ? panel : card;
      ctx.fillRect(x * CELL, y * CELL, CELL, CELL);
    }
  }
}
