# Memory — Sujay OS Kart Arena

The project already uses a draggable/resizable desktop-window pattern in `Home.tsx`. The kart game should reuse that visual shell but not couple its draw loop to React state updates. The visual target is stored in `ASSETS.md`; it must guide the palette and spatial density while gameplay uses procedural meshes to remain lightweight.

The browser game is intentionally an arcade interpretation rather than a networked clone of any specific commercial kart title. It uses single-player scoring, local rivals, keyboard controls, and no external account, audio, multiplayer, or payment dependencies.
