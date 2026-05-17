# Exit Value Arena

A standalone browser mini-game prototype: a satirical first-person benchmark shooter about startup exit value.

## Play

### Easiest option

Open `play.html` directly in a browser. It is a single self-contained file with the HTML, CSS, and JavaScript bundled together, so it works even if you can only download one file.

### Multi-file option

Open `index.html` in a browser with `styles.css` and `game.js` in the same folder, or serve this directory with any static file server:

```bash
python3 -m http.server 8080 --directory exit-value-arena
```

Then visit <http://localhost:8080>.

## Concept

Pick a founder avatar, fight AI/corporate bosses in a neon pseudo-3D arena, and trigger benchmark duels by damaging boss shields. The questions are original synthetic prompts inspired by current public benchmark categories (MMLU-Pro-style reasoning, GPQA-style science, LiveCodeBench-style coding, SWE-bench-style debugging, instruction following, ARC-style pattern reasoning, and LiveBench-style data analysis). They are intentionally not copied from live benchmark datasets.

Beat Googol Goliath, Microhard Azure Dragon, Cloudopus, and Kimi K2 Benchmark Warlord to unlock Joe Rogun as a bonus character.
