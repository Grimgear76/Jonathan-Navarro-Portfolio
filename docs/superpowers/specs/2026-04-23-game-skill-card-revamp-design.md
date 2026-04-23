# Game Dev Skill Card — JRPG Battle Screen Revamp

**Date:** 2026-04-23  
**Component:** `frontend/src/components/Skills.jsx` — `PixelBattleCanvas` + game domain entry in `DOMAINS`

---

## Summary

Replace the current passive pixel battle animation (click-to-cycle attack modes) with a JRPG-style turn-based battle showcase. The card is showcase-style — click triggers a command, cool things happen, no real stakes. Loops infinitely.

---

## Canvas Layout (380×150px)

### Battle Scene (top ~65%, ~97px)
- Pixel knight sprite (left side), pixel goblin sprite (right side)
- HP bars above each sprite, labeled `JN` and `GOB`
- HP bars animate smoothly; turn red + pulse when critically low (<25%)
- Ground line separates battle area from command box

### Command Box (bottom ~35%, ~53px)
- Dark rectangle with 1px `#9d7fff` border
- 4 commands in a row: `▶ ATTACK   MAGIC   ITEM   RUN`
- `▶` cursor highlights currently selected command in violet
- Cursor blinks every 30 frames while idle (waiting for click)
- On click: cursor stops blinking, command executes, then advances to next command

---

## Click Behavior (4-command cycle, loops)

Each click executes the currently highlighted command, then advances the cursor to the next.

| # | Command | Player action | Enemy counter |
|---|---------|--------------|---------------|
| 1 | ATTACK  | Sword swing → GOBLIN_HIT sprite, `SLASH!` text, `-18` damage floats up on goblin | Goblin lunges → `COUNTER!` text, `-8` on knight |
| 2 | MAGIC   | Arcane lightning bolt fires, `ARCANE!` text, `-32` on goblin, purple screen flash | Goblin counter, `-10` on knight |
| 3 | ITEM    | Knight drinks potion, `POTION!` text, `+25 HP` floats up on knight, HP bar refills | No counter (item turn) |
| 4 | RUN     | Knight runs right, `…but failed!` scrolls in command box, goblin wobbles | Goblin mocks (idle animation) |

After RUN, cursor resets to ATTACK and loops.

---

## Visual Effects

### Floating Numbers
- Drift upward ~20px over 40 frames, fade out
- Damage: red/orange (`#ff6666`)
- Heal: green (`#68d391`)
- Font: `Courier New` bold 8px
- Multiple numbers can be on screen simultaneously

### Screen Shake
- 3px offset, 8 frames, on any hit (player or enemy)
- Implemented via canvas translate offset

### Sprite Flash
- Goblin: color overlay flash on hit (purple for MAGIC, orange for ATTACK)
- Knight: blue flash on taking damage

### Win/Reset
- When either HP hits 0: `VICTORY!` (if goblin) or `DEFEATED!` (if knight) renders centered in battle area
- After 1.5s (~90 frames), HP resets to 100 for both, wipe transition, cursor resets to ATTACK
- Keeps loop going indefinitely

### Idle State (before first click)
- Cursor blinks in command box
- `[ CLICK TO COMMAND ]` hint below command box (hidden after first click)
- Sprites do a subtle idle bob animation (±1px vertical, every 60 frames)

---

## Reuse from Existing Code

Keep all existing pixel art data:
- `KP`, `KNIGHT_IDLE`, `KNIGHT_ATK` palettes/sprites
- `GP`, `GOBLIN_IDLE`, `GOBLIN_HIT` palettes/sprites
- `drawSprite()` helper function
- `ACCENT.game` = `#9d7fff`

Remove:
- `ATTACK_LABELS`, `PHASE_DUR`, `makeLightning()` — replaced by new state machine
- Fireball projectile system — replaced by simpler lightning bolt effect

---

## State Machine

```
IDLE → (click) → PLAYER_ACTION → ENEMY_ACTION → IDLE
                                              ↓ (if HP = 0)
                                          RESULT → RESET → IDLE
```

- `phase`: `'idle' | 'player' | 'enemy' | 'result' | 'reset'`
- `commandIdx`: 0–3 (ATTACK/MAGIC/ITEM/RUN), advances after each full turn
- `kHp`, `gHp`: 0–100, reset to 100 on RESET
- `floats`: array of `{ x, y, text, color, life }` — floating numbers

---

## Files Changed

- `frontend/src/components/Skills.jsx` — replace `PixelBattleCanvas` function and update `DOMAINS[3].hint`
- `frontend/src/components/Skills.css` — no changes needed (canvas styling unchanged)
