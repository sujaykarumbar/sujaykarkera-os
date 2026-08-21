# Structure — Sujay OS Kart Arena

The existing React page remains the operating-system shell. `KartGameWindow` is a framed OS application that owns React lifecycle only; it mounts `KartGameCanvas`, a focused integration component which creates and disposes the Babylon engine. The game rules do not depend on React.

| Location | Ownership |
| --- | --- |
| `client/src/pages/Home.tsx` | Declares the GAME desktop utility, opens and closes the game app window, and keeps the desktop focus model. |
| `client/src/components/KartGameCanvas.tsx` | Creates one Babylon engine per mounted canvas, manages renderer resize, passes game status to React, and disposes the scene on unmount. |
| `client/src/game/kartArena.ts` | Owns meshes, player input, rival steering, pickups, hazards, HUD state, demo mode, reset behavior, and cleanup. |
| `client/src/index.css` | Provides the pixel-paper game window and compact responsive canvas/control layout. |
| `ASSETS.md` | Holds the visual target and managed-asset URL. |

The player, rival karts, crates, and oil patches own their own Babylon meshes but are governed by one `KartArena` world. The world exposes `reset()` and `dispose()` so the window can restart or close predictably.
