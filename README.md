# ◈ Visual Learn Lab

A small website that teaches one hard idea at a time through an **interactive, playable
visualization**. No frameworks, no build step — every topic is a single self-contained HTML
page sharing a little CSS/JS for the nav bar, theme, and analytics.

**Live:** `https://danielngo2025.github.io/catan/` (once GitHub Pages is enabled — see below).

## Topics

| Page | Topic | What you can do |
|---|---|---|
| [`index.html`](index.html) | Home | Topic grid + live engagement stats |
| [`catan.html`](catan.html) | **Catan strategy** | Play vs AI with a live win-strategy coach; run bulk simulations |
| [`goal.html`](goal.html) | **The Goal** (Goldratt) | Tune a 5-station line; watch the bottleneck govern throughput |
| [`feynman.html`](feynman.html) | **Feynman Technique** | A guided 4-step workspace with a live clarity meter |
| [`newton.html`](newton.html) | **Newton's gravity** | Feel the inverse-square law; fling planets into orbit |

More topics can be added later — each is one new HTML file plus one entry in
[`assets/config.js`](assets/config.js).

## Run locally

```bash
python3 -m http.server 8000
# open http://localhost:8000/
```

## Project layout

```
index.html            homepage: topic-card grid + engagement stats
catan.html goal.html feynman.html newton.html    topic pages
assets/
  config.js           site name, GoatCounter code, and the ordered topic list
  site.css            shared theme (palette from the original Catan page) + nav + cards
  site.js             injects the nav, loads GoatCounter, renders public view counters
.nojekyll             disables Jekyll on GitHub Pages
```

Adding a topic: create `mytopic.html` (start from any existing page's shell), then add a
`{ path, title, emoji, blurb }` entry to `TOPICS` in `assets/config.js`. It shows up in the nav
and on the homepage automatically.

## Engagement stats (GoatCounter)

Visit tracking uses [GoatCounter](https://www.goatcounter.com) — free, privacy-friendly, no
cookie banner. Site visits vs. per-topic visits fall out of the URL path automatically, and the
homepage/footers render public "👁 N views" counters.

**One-time setup:**
1. Create a free account at goatcounter.com and pick a code → `https://<code>.goatcounter.com`.
2. In **Settings**, enable *"Allow adding a visitor counter to your own website."*
3. Set `goatcounterCode: "<code>"` in [`assets/config.js`](assets/config.js).

Until a code is set, tracking and the on-site counters are silently disabled (no errors).

## Deploy (GitHub Pages)

1. Push to `main`.
2. Repo **Settings → Pages → Source:** `main` branch, `/ (root)`.
3. The site serves at `https://danielngo2025.github.io/catan/`.

---

# ⬡ Catan · Strategy Simulator

The Catan page is a single-file, dependency-free implementation of *Settlers of Catan*
(you + 3 AI) with a **live win-strategy hint engine**, four AI strategy profiles, and a **full
simulation mode** that records every move and exports JSON for analysis.

## What's in it

- **Real board** — classic 3-4-5-4-3 hex layout, standard resource/number/port distribution,
  probability pips, robber. Reshuffled every game.
- **Full rules** — snake-draft setup, dice production, the 7 (discard + robber + steal),
  roads/settlements/cities, ports (4:1 / 3:1 / 2:1), dev cards, Longest Road, Largest Army,
  10 VP to win.
- **🎯 Strategy engine** — a coaching panel that re-ranks the best move at every step.

## AI strategy profiles

| Strategy | Focus |
|---|---|
| **Balanced** | City → Settlement → Road → Dev, even resource weighting |
| **Ore-Wheat / Cities** | Prioritizes cities; weights ore + wheat heavily |
| **Expansion / Roads** | Settlements + roads first; weights wood + brick |
| **Dev-Cards / Army** | Buys dev cards aggressively; plays knights for Largest Army |

## Simulation & data export

The **🧪 Strategy Lab & Data** panel offers **👁 Watch AI game**, **⚡ Run & download** *N*
headless all-AI games (~300 games/sec, rotating strategies across seats), and **⬇ Download last
game**.

### Sample finding (200 games, each strategy played every seat equally)

| Strategy | Win % | Avg VP |
|---|---|---|
| Expansion / Roads | 45.5% | 7.66 |
| Balanced | 32.5% | 7.32 |
| Dev-Cards / Army | 12.5% | 6.08 |
| Ore-Wheat / Cities | 9.5% | 5.59 |

> These reflect *this AI's* execution of each strategy, not the strategies' theoretical ceilings.

## JSON schema

A **simulation** file (`catan-sim-Ngames-*.json`):

```jsonc
{
  "summary": {
    "games": 200,
    "completed": 200,
    "avgTurns": 254,
    "byStrategy": {
      "expansion": { "plays": 200, "wins": 91, "winRate": 0.455, "avgVP": 7.66 }
    },
    "winsBySeat": { "0": 46, "1": 58, "2": 46, "3": 50 }
  },
  "params": { "base": ["balanced","cities","expansion","devcards"] },
  "games": [ /* array of game records */ ]
}
```

A **single-game** record:

```jsonc
{
  "id": "game-...",
  "ts": "2026-07-10T19:31:08.534Z",
  "players": [ { "seat": 0, "name": "You", "strategy": "balanced", "human": false } ],
  "board":   [ { "resource": "wheat", "number": 3 } ],
  "events":  [ /* full ordered move log */ ],
  "result": {
    "completed": true, "winner": 1, "winnerStrategy": "cities", "turns": 106,
    "finalVP": [4, 10, 6, 7], "longestRoadOwner": 1, "largestArmyOwner": 3,
    "knights": [0, 1, 1, 5]
  }
}
```

### Event types

Every event carries `i`, `turn`, `phase` (`setup` | `play` | `over`), and `type`, plus:

| `type` | Fields |
|---|---|
| `settlement` | `player`, `vid`, `pips`, `port` |
| `city` | `player`, `vid`, `pips` |
| `road` | `player`, `eid` |
| `roll` | `player`, `d1`, `d2`, `sum` |
| `produce` | `roll`, `gains` |
| `robber` | `player`, `hex`, `victim`, `stole` |
| `buy_dev` / `play_dev` | `player`, `card` |
| `trade_bank` | `player`, `give`, `get` |
| `trade_player` | `player`, `to`, `give`, `get` |
| `win` | `player`, `vp` |
