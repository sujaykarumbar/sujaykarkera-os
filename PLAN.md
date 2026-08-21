# Game Plan: Sujay OS Kart Arena

Sujay OS Kart Arena is a compact top-down arcade kart game that opens within the personal OS instead of replacing the desktop. The player drives a burgundy-and-cream kart around a warm workroom circuit, collects signal crates, avoids hazards, and out-scores rival karts before the timer ends.

## Risk Tasks

### 1. Responsive, lifecycle-safe WebGL scene embedded in an OS window

- **Why isolated:** The canvas mounts conditionally when the game app opens, and React development mode can mount effects more than once. The renderer must cleanly start, resize with its window, and dispose when the game closes.
- **Approach:** Use one guarded Babylon engine instance in `KartGameCanvas`. Keep gameplay in a framework-independent `client/src/game/kartArena.ts` module, return a disposable game handle, and attach keyboard listeners only while the window is open.
- **Verify:** Reopen the GAME window twice without duplicate render loops, canvas errors, or unresponsive keyboard input; resize the game window and confirm the renderer stays readable.

### 2. Arcade steering and rival movement without heavy vehicle physics

- **Why isolated:** Full wheel/suspension physics is disproportionate for a compact window and risks unstable collisions.
- **Approach:** Use deterministic top-down steering, speed damping, arena boundary clamps, soft obstacle repulsion, and simple rival waypoint steering. Score comes from crate pickups; health drops on hazards or kart contact.
- **Verify:** WASD and arrow keys steer the player in the expected direction, speed settles when input stops, rival karts stay in bounds, crates increase score, and hazards reduce a visible health state.

## Main Build

The game includes a short play session with a readable HUD, one player kart, three rivals, five respawning signal crates, two oil hazards, score, health, and restart capability. A `?demo` mode will animate the player kart so screenshots visibly demonstrate the arena.

- **Assets needed:** The managed kart-arena visual target in `ASSETS.md`; all shipped visual game objects are lightweight procedural meshes and generated labels that follow its palette.
- **Verify:**
  - The GAME desktop icon opens the game window and the close action returns safely to the OS.
  - Movement responds to keyboard input and touch-friendly on-screen control buttons.
  - The player, rivals, crates, hazards, score, health, and controls are legible within the game window.
  - No canvas leaks or browser console errors occur when opening, restarting, or closing the game.
  - The screenshot demonstrates the warm burgundy/cream/coral arena, compact top-down camera, restrained lime action cues, and the visual target’s game density.
