# ⬡ Catan · Strategy Simulator

A single-file, dependency-free implementation of *Settlers of Catan* (you + 3 AI)
with a **live win-strategy hint engine**, four distinct AI strategy profiles, and a
**full simulation mode** that records every move and exports JSON for analysis.

Everything lives in [`catan.html`](catan.html) — no build step, no server, no npm.

---

## Play it

Open `catan.html` in any modern browser:

```bash
open catan.html          # macOS
# or just double-click the file
```

If your browser blocks `file://` scripts, serve it over HTTP:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000/catan.html
```

---

## What's in it

- **Real board** — classic 3-4-5-4-3 hex layout, standard resource/number/port
  distribution, probability pips under each token, robber. Reshuffled every game.
- **Full rules** — snake-draft setup, dice production, the 7 (discard + robber +
  steal), roads/settlements/cities, ports (4:1 / 3:1 / 2:1), dev cards
  (knight, VP, road building, year of plenty, monopoly), Longest Road, Largest
  Army, 10 VP to win.
- **Drawn resource icons** — each hex shows a hand-drawn emblem (tree, brick,
  sheep, wheat, ore mountain, desert cactus) so tiles read at a glance.
- **Build-cost reference** — a live panel (and on-button badges) showing what each
  build costs, with a ✅/🔒 affordability marker and the exact resources you're
  missing greyed out.
- **Trading** — trade with the bank at your best rate, or propose swaps to the AI,
  who accept only good deals and refuse to feed a runaway leader.
- **🎯 Strategy engine** — a coaching panel that re-ranks the best move at every
  step: setup placement by pip value + resource diversity, build priority toward
  10 VP, robber targeting, and trade advice.

---

## AI strategy profiles

Each player is assigned a strategy that biases its setup scoring and build order.
Set them in the **Strategy Lab** panel.

| Strategy | Focus |
|---|---|
| **Balanced** | City → Settlement → Road → Dev, even resource weighting |
| **Ore-Wheat / Cities** | Prioritizes cities; weights ore + wheat heavily |
| **Expansion / Roads** | Settlements + roads first; weights wood + brick |
| **Dev-Cards / Army** | Buys dev cards aggressively; plays knights for Largest Army |

---

## Simulation & data export

The **🧪 Strategy Lab & Data** panel offers:

- **👁 Watch AI game** — a live, visible match with all four players as AI.
- **⚡ Run & download** — runs *N* headless all-AI games (fast: ~300 games/sec),
  rotating strategies across seats to cancel first-player advantage, then
  downloads a single JSON file with the full data + an aggregate summary.
- **⬇ Download last game** — saves the most recently finished interactive game.

### Sample finding (200 games, each strategy played every seat equally)

| Strategy | Win % | Avg VP |
|---|---|---|
| Expansion / Roads | 45.5% | 7.66 |
| Balanced | 32.5% | 7.32 |
| Dev-Cards / Army | 12.5% | 6.08 |
| Ore-Wheat / Cities | 9.5% | 5.59 |

> These reflect *this AI's* execution of each strategy, not the strategies'
> theoretical ceilings — the event logs let you dig into *why* each wins or loses.

---

## JSON schema

A **simulation** file (`catan-sim-Ngames-*.json`) is:

```jsonc
{
  "summary": {
    "games": 200,
    "completed": 200,                 // games that reached a real 10-VP winner
    "avgTurns": 254,
    "byStrategy": {
      "expansion": { "plays": 200, "wins": 91, "winRate": 0.455, "avgVP": 7.66 }
      // ...one entry per strategy
    },
    "winsBySeat": { "0": 46, "1": 58, "2": 46, "3": 50 }
  },
  "params": { "base": ["balanced","cities","expansion","devcards"] },
  "games": [ /* array of game records (see below) */ ]
}
```

A **single-game** file (`catan-game-*.json`) is one game record:

```jsonc
{
  "id": "game-...",
  "ts": "2026-07-10T19:31:08.534Z",
  "players": [ { "seat": 0, "name": "You", "strategy": "balanced", "human": false } ],
  "board":   [ { "resource": "wheat", "number": 3 } ],   // 19 hexes, in board order
  "events":  [ /* full ordered move log — see event types */ ],
  "result": {
    "completed": true,
    "winner": 1,                       // seat index
    "winnerStrategy": "cities",
    "turns": 106,                      // player-turns (≈ turns / 4 = rounds)
    "finalVP": [4, 10, 6, 7],
    "longestRoadOwner": 1,             // seat or null
    "largestArmyOwner": 3,             // seat or null
    "knights": [0, 1, 1, 5]            // knights played, per seat
  }
}
```

### Event types

Every event carries `i` (index), `turn` (turn number, 0 = setup), `phase`
(`setup` | `play` | `over`), and `type`, plus these fields:

| `type` | Fields |
|---|---|
| `settlement` | `player`, `vid` (vertex), `pips`, `port` |
| `city` | `player`, `vid`, `pips` |
| `road` | `player`, `eid` (edge) |
| `roll` | `player`, `d1`, `d2`, `sum` |
| `produce` | `roll`, `gains` (`{seat: {resource: count}}`) |
| `robber` | `player`, `hex`, `victim` (seat or null), `stole` (resource or null) |
| `buy_dev` | `player`, `card` |
| `play_dev` | `player`, `card` |
| `trade_bank` | `player`, `give` (`{resource: count}`), `get` |
| `trade_player` | `player`, `to` (seat), `give`, `get` |
| `win` | `player`, `vp` |

### Quick analysis example

```python
import json, glob, collections
data = json.load(open(sorted(glob.glob("catan-sim-*games-*.json"))[-1]))

# win rate by strategy
for strat, s in data["summary"]["byStrategy"].items():
    print(f"{strat:10} {s['winRate']:.1%}  avg VP {s['avgVP']}")

# e.g. how often the Longest Road holder won
lr_wins = sum(1 for g in data["games"]
              if g["result"]["longestRoadOwner"] == g["result"]["winner"])
print("Longest-Road holder won:", lr_wins, "/", len(data["games"]))
```
