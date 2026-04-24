# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

**Math Swimmer** — a kids browser math game where solving arithmetic questions powers an animated swimmer. Vite + React + TypeScript, mobile-first, deployed to GitHub Pages.

## Commands

```bash
npm run dev            # dev server at http://localhost:5173/math-swimmer/
npm run build          # sprites → tsc → vite build (output in dist/)
npm run build:sprites  # regenerates src/assets/freestyle-sheet.png from assets/freestyle/
npm run preview        # preview production build locally
npm run deploy         # build + push dist/ to gh-pages branch
```

## Architecture

**State machine**: All game state lives in `src/contexts/GameContext.tsx` (useReducer). `src/contexts/SettingsContext.tsx` persists settings to localStorage. No external state library.

**Routing**: State-based, no React Router. `App.tsx` switches on `state.screen` (`home | settings | game | results`).

**Game flow**: Home → (settings detour) → countdown → racing → results. The `phase` field (`countdown | racing | done`) drives the in-game sub-states.

**Swimmer animation**: `src/assets/freestyle-sheet.png` is a generated sprite sheet (41 frames, 280×14760px). Built by `scripts/build-spritesheet.js` from `assets/freestyle/01-41.png`. The `Swimmer` component uses CSS `steps(41)` animation; speed is controlled by the `--swim-duration` CSS custom property.

**Question logic**: `src/game/questionGenerator.ts` — pure function respecting `settings.maxAnswer` and `settings.operations`. Each correct answer advances one segment (distance = number of segments).

**Speed states**: `normal | boost | penalty` defined in `src/game/speedMechanics.ts`. React sets speed state in GameContext after each answer; a timer resets it back to normal.

**Custom numeric keypad**: `src/components/NumPad.tsx` — avoids the mobile system keyboard. Physical keyboard (0-9, Backspace, Enter) also works.

## Key Files

| Path | Purpose |
|------|---------|
| `src/types.ts` | All shared TypeScript types |
| `src/contexts/GameContext.tsx` | Central state machine |
| `src/game/questionGenerator.ts` | Math question generation |
| `src/screens/GameScreen.tsx` | Main game loop, ties everything together |
| `scripts/build-spritesheet.js` | Regenerate sprite sheet after new frames are added |
| `assets/freestyle/` | Source PNG frames for the swimmer animation |

## Adding New Swim Styles

1. Add frames in `assets/<style>/01.png…` 
2. Update `scripts/build-spritesheet.js` to handle the new style
3. Add the style to `src/types.ts` (`SwimStyle`) and `HomeScreen.tsx` (`STYLES` array)
4. Update `Swimmer.tsx` to use the correct sprite sheet per style
