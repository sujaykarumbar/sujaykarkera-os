/** Warm Pixel Desktop game integration: this component owns the Babylon canvas lifecycle, not gameplay rules. */
import { useEffect, useRef, useState } from "react";
import { KartArena, type KartGameStatus } from "@/game/kartArena";

const initialStatus: KartGameStatus = { score: 0, health: 3, time: 105, lap: 1, totalLaps: 3, checkpoint: 1, totalCheckpoints: 4, finished: false };

export function KartGameCanvas({ onExit }: { onExit: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const arenaRef = useRef<KartArena | null>(null);
  const [status, setStatus] = useState<KartGameStatus>(initialStatus);
  useEffect(() => { if (!canvasRef.current) return; const demo = new URLSearchParams(window.location.search).has("demo"); const arena = new KartArena(canvasRef.current, { onStatus: setStatus, demo }); arenaRef.current = arena; return () => { arena.dispose(); arenaRef.current = null; }; }, []);
  useEffect(() => {
    const leaveRace = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      onExit();
    };
    window.addEventListener("keydown", leaveRace);
    return () => window.removeEventListener("keydown", leaveRace);
  }, [onExit]);
  return <div className="kart-game-shell">
    <div className="kart-game-hud"><span>LAP <b>{status.lap}/{status.totalLaps}</b></span><span>CHECK <b>{status.checkpoint}/{status.totalCheckpoints}</b></span><span>SCORE <b>{String(status.score).padStart(4, "0")}</b></span><span>LIFE <b>{"●".repeat(status.health)}{"○".repeat(3 - status.health)}</b></span><span>TIME <b>{status.time}s</b></span><button type="button" className="kart-exit-button" onClick={onExit}>BACK TO DESKTOP</button></div>
    <div className="kart-race-banner"><i />SUJAY CIRCUIT // COMPLETE 3 LAPS<i /></div>
    <canvas ref={canvasRef} className="kart-game-canvas" aria-label="Playable Sujay OS Kart Race. Use arrow keys or WASD to drive through checkpoints and complete three laps." />
    <div className="kart-game-footer"><span>ARROWS / WASD · RACE &nbsp; | &nbsp; GREEN BEACONS · CHECKPOINTS</span><div><button type="button" onClick={() => arenaRef.current?.reset()}>RESTART RACE</button><button type="button" className="kart-footer-exit" onClick={onExit}>BACK</button></div></div>
    {status.finished && <div className="kart-game-finish"><p>{status.lap >= status.totalLaps ? "CHECKERED FLAG" : "RACE OVER"}</p><b>{status.score} SIGNAL POINTS</b><span>LAP {status.lap}/{status.totalLaps}</span><button type="button" onClick={() => arenaRef.current?.reset()}>RACE AGAIN</button><button type="button" className="kart-finish-exit" onClick={onExit}>BACK TO DESKTOP</button></div>}
  </div>;
}
