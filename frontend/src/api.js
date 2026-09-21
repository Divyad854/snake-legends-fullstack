const BASE = import.meta.env.VITE_API_URL || "/api";

function getPlayerId() {
  let id = localStorage.getItem("snakeLegendsPlayerId");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("snakeLegendsPlayerId", id);
  }
  return id;
}

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const err = new Error(body.detail || `Request failed: ${res.status}`);
    err.status = res.status;
    throw err;
  }
  return res.json();
}

export const api = {
  playerId: getPlayerId(),

  getCatalog: () => request("/catalog"),
  getState: () => request(`/state/${api.playerId}`),
  saveState: (state) =>
    request(`/state/${api.playerId}`, { method: "PUT", body: JSON.stringify(state) }),
  rename: (name) =>
    request(`/state/${api.playerId}/rename`, { method: "POST", body: JSON.stringify({ name }) }),
  updateSettings: (settings) =>
    request(`/state/${api.playerId}/settings`, { method: "POST", body: JSON.stringify(settings) }),
  selectItem: (kind, item_id) =>
    request(`/state/${api.playerId}/select`, { method: "POST", body: JSON.stringify({ kind, item_id }) }),
  purchaseItem: (kind, item_id) =>
    request(`/state/${api.playerId}/purchase`, { method: "POST", body: JSON.stringify({ kind, item_id }) }),
  resetProgress: () => request(`/state/${api.playerId}/reset`, { method: "POST" }),
  finishGame: (score, foodEaten, length) =>
    request(`/state/${api.playerId}/finish-game`, {
      method: "POST",
      body: JSON.stringify({ score, foodEaten, length }),
    }),
  leaderboard: (limit = 10) => request(`/leaderboard?limit=${limit}`),
};
