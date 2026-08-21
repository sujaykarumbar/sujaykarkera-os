/** Sujay OS Kart Arena: a compact Babylon race runtime, independent from React presentation. */
import {
  Color3, Engine, FreeCamera, HemisphericLight, Mesh, MeshBuilder, Scene, StandardMaterial, TransformNode, Vector3,
} from "@babylonjs/core";

export type KartGameStatus = { score: number; health: number; time: number; lap: number; totalLaps: number; checkpoint: number; totalCheckpoints: number; finished: boolean };
type GameOptions = { onStatus: (status: KartGameStatus) => void; demo?: boolean };

const PALETTE = { burgundy: "#6f1f35", cream: "#fff7dc", peach: "#ffc77f", coral: "#ed7f74", ink: "#3a1d27", lime: "#c8f35a", charcoal: "#202127", track: "#40212e", infield: "#ad5b52" };
const material = (scene: Scene, name: string, hex: string) => {
  const item = new StandardMaterial(name, scene);
  item.diffuseColor = Color3.FromHexString(hex);
  item.specularColor = Color3.Black();
  return item;
};
const CHECKPOINTS = [new Vector3(0, 0.42, -6.7), new Vector3(9.8, 0.42, 0), new Vector3(0, 0.42, 6.7), new Vector3(-9.8, 0.42, 0)];

export class KartArena {
  private scene: Scene;
  private player!: TransformNode;
  private keys = new Set<string>();
  private score = 0;
  private health = 3;
  private time = 105;
  private elapsed = 0;
  private hitCooldown = 0;
  private lap = 1;
  private checkpoint = 0;
  private raceFinished = false;
  private pickups: Array<{ mesh: Mesh; spawn: Vector3; active: boolean; timer: number }> = [];
  private hazards = [new Vector3(-6.3, 0.08, -4.1), new Vector3(6.6, 0.08, 3.5), new Vector3(0.2, 0.08, -7.1)];
  private checkpointBeacons: Mesh[] = [];
  private exhaust: Mesh[] = [];
  private disposeInput: () => void;

  constructor(private canvas: HTMLCanvasElement, private options: GameOptions) {
    const engine = new Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true });
    this.scene = new Scene(engine);
    this.player = new TransformNode("player", this.scene);
    this.scene.clearColor = Color3.FromHexString(PALETTE.peach).toColor4(1);
    this.build();
    this.disposeInput = this.bindInput();
    engine.runRenderLoop(() => this.scene.render());
    this.scene.onBeforeRenderObservable.add(() => this.update(Math.min(this.scene.getEngine().getDeltaTime() / 1000, 0.05)));
    window.addEventListener("resize", () => engine.resize());
    this.scene.onDisposeObservable.add(() => engine.dispose());
  }

  private build() {
    const camera = new FreeCamera("race-camera", new Vector3(0, 24, -0.01), this.scene);
    camera.setTarget(Vector3.Zero());
    camera.fov = 0.76;
    new HemisphericLight("sunset", new Vector3(0.2, 1, -0.3), this.scene).intensity = 1.2;

    const stadium = MeshBuilder.CreateGround("race-stadium", { width: 29, height: 21 }, this.scene);
    stadium.material = material(this.scene, "race-stadium-mat", PALETTE.burgundy);
    const road = MeshBuilder.CreateGround("race-loop", { width: 26.5, height: 18.5 }, this.scene);
    road.position.y = 0.015; road.material = material(this.scene, "race-loop-mat", PALETTE.track);
    const infield = MeshBuilder.CreateGround("race-infield", { width: 17.2, height: 9.6 }, this.scene);
    infield.position.y = 0.03; infield.material = material(this.scene, "race-infield-mat", PALETTE.infield);
    this.addCurbs();
    this.addStartLine();
    this.addCheckpointBeacons();

    this.makeKart(this.player, PALETTE.cream, PALETTE.burgundy);
    this.player.position = new Vector3(0, 0.22, 7.05); this.player.rotation.y = Math.PI;
    this.addExhaust();
    [
      { color: PALETTE.coral, angle: 0.2, speed: 0.69 },
      { color: PALETTE.charcoal, angle: 2.2, speed: 0.75 },
      { color: "#d79d4d", angle: 4.35, speed: 0.72 },
    ].forEach((item, index) => { const rival = new TransformNode(`rival-${index}`, this.scene); this.makeKart(rival, item.color, PALETTE.cream); rival.metadata = item; });
    [[-9.2, -3.2], [-4.2, -7.2], [4.9, -7.2], [10.2, -2.3], [8.8, 4.5], [1.6, 7.5], [-6.3, 6.5], [-10.1, 1.6]].forEach(([x, z], index) => this.makePickup(index, new Vector3(x, 0.38, z)));
    this.hazards.forEach((at, index) => { const oil = MeshBuilder.CreateDisc(`oil-${index}`, { radius: 0.78, tessellation: 16 }, this.scene); oil.rotation.x = Math.PI / 2; oil.position = at; oil.material = material(this.scene, `oilmat-${index}`, PALETTE.ink); });
  }

  private addStartLine() {
    const start = MeshBuilder.CreateGround("start-finish", { width: 4.2, height: 0.72 }, this.scene);
    start.position = new Vector3(0, 0.05, 7.35); start.material = material(this.scene, "start-finish-mat", PALETTE.cream);
    for (let index = 0; index < 8; index += 1) {
      const marker = MeshBuilder.CreateBox(`start-marker-${index}`, { width: 0.5, height: 0.07, depth: 0.34 }, this.scene);
      marker.position = new Vector3(-1.75 + index * 0.5, 0.1, 7.35);
      marker.material = material(this.scene, `start-marker-mat-${index}`, index % 2 ? PALETTE.cream : PALETTE.ink);
    }
  }

  private addCurbs() {
    const curbMaterial = material(this.scene, "curb-mat", PALETTE.coral);
    const placements: Array<[number, number, number, number]> = [];
    for (let x = -12; x <= 12; x += 1.2) placements.push([x, -8.55, 0.8, 0.22], [x, 8.55, 0.8, 0.22]);
    for (let z = -7.4; z <= 7.4; z += 1.2) placements.push([-12.7, z, 0.22, 0.8], [12.7, z, 0.22, 0.8]);
    placements.forEach(([x, z, width, depth], index) => { const curb = MeshBuilder.CreateBox(`curb-${index}`, { width, height: 0.15, depth }, this.scene); curb.position = new Vector3(x, 0.11, z); curb.material = curbMaterial; });
  }

  private addCheckpointBeacons() {
    CHECKPOINTS.forEach((point, index) => { const beacon = MeshBuilder.CreateCylinder(`checkpoint-${index}`, { height: 0.75, diameter: 0.38, tessellation: 8 }, this.scene); beacon.position = point.clone(); beacon.material = material(this.scene, `checkpoint-mat-${index}`, index === 0 ? PALETTE.lime : PALETTE.cream); this.checkpointBeacons.push(beacon); });
  }

  private makeKart(parent: TransformNode, bodyColor: string, stripeColor: string) {
    const body = MeshBuilder.CreateBox(`${parent.name}-body`, { width: 0.92, height: 0.32, depth: 1.32 }, this.scene); body.parent = parent; body.material = material(this.scene, `${parent.name}-bodymat`, bodyColor);
    const stripe = MeshBuilder.CreateBox(`${parent.name}-stripe`, { width: 0.24, height: 0.09, depth: 1.38 }, this.scene); stripe.parent = parent; stripe.position.y = 0.21; stripe.material = material(this.scene, `${parent.name}-stripemat`, stripeColor);
    [-0.52, 0.52].forEach((x) => [-0.44, 0.44].forEach((z) => { const wheel = MeshBuilder.CreateBox(`${parent.name}-wheel`, { width: 0.18, height: 0.19, depth: 0.36 }, this.scene); wheel.parent = parent; wheel.position = new Vector3(x, 0, z); wheel.material = material(this.scene, `${parent.name}-wheelmat`, PALETTE.ink); }));
  }

  private addExhaust() {
    const glowMaterial = material(this.scene, "exhaust-mat", PALETTE.lime); glowMaterial.emissiveColor = Color3.FromHexString(PALETTE.lime); glowMaterial.alpha = 0.85;
    [-0.24, 0.24].forEach((x, index) => { const flame = MeshBuilder.CreateBox(`exhaust-${index}`, { width: 0.14, height: 0.08, depth: 0.32 }, this.scene); flame.parent = this.player; flame.position = new Vector3(x, 0.06, 0.82); flame.material = glowMaterial; this.exhaust.push(flame); });
  }

  private makePickup(index: number, spawn: Vector3) { const mesh = MeshBuilder.CreateBox(`signal-crate-${index}`, { size: 0.58 }, this.scene); mesh.position = spawn.clone(); mesh.material = material(this.scene, `crate-mat-${index}`, PALETTE.lime); this.pickups.push({ mesh, spawn, active: true, timer: 0 }); }
  private bindInput() { const down = (event: KeyboardEvent) => { if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "w", "a", "s", "d", "W", "A", "S", "D", "r", "R"].includes(event.key)) { event.preventDefault(); if (event.key.toLowerCase() === "r") this.reset(); else this.keys.add(event.key.toLowerCase()); } }; const up = (event: KeyboardEvent) => this.keys.delete(event.key.toLowerCase()); window.addEventListener("keydown", down); window.addEventListener("keyup", up); return () => { window.removeEventListener("keydown", down); window.removeEventListener("keyup", up); }; }

  private update(delta: number) {
    if (this.raceFinished) { this.emitStatus(); return; }
    this.elapsed += delta; this.time = Math.max(0, 105 - this.elapsed);
    const demo = this.options.demo;
    const left = this.keys.has("arrowleft") || this.keys.has("a") || (demo && Math.sin(this.elapsed * 0.74) > 0.74);
    const right = this.keys.has("arrowright") || this.keys.has("d") || (demo && Math.sin(this.elapsed * 0.74) < -0.74);
    const forward = this.keys.has("arrowup") || this.keys.has("w") || demo;
    const back = this.keys.has("arrowdown") || this.keys.has("s");
    if (left) this.player.rotation.y -= delta * 3.1; if (right) this.player.rotation.y += delta * 3.1;
    const speed = forward ? 6.1 : back ? -2.8 : 0;
    this.player.position.x += Math.sin(this.player.rotation.y) * speed * delta; this.player.position.z += Math.cos(this.player.rotation.y) * speed * delta;
    this.player.position.x = Math.max(-12.1, Math.min(12.1, this.player.position.x)); this.player.position.z = Math.max(-8.0, Math.min(8.0, this.player.position.z));
    this.player.position.y = 0.22 + (forward ? Math.sin(this.elapsed * 18) * 0.015 : 0);
    this.exhaust.forEach((flame, index) => { flame.scaling.z = forward ? 0.7 + Math.sin(this.elapsed * 20 + index) * 0.35 : 0.1; });
    this.scene.transformNodes.filter((node) => node.name.startsWith("rival-")).forEach((rival, index) => { const data = rival.metadata as { angle: number; speed: number }; data.angle += delta * data.speed; rival.position.x = Math.cos(data.angle) * 10.1; rival.position.z = Math.sin(data.angle) * 6.45; rival.rotation.y = -data.angle - Math.PI / 2; rival.position.y = 0.22 + Math.sin(this.elapsed * 11 + index) * 0.012; });
    this.checkpointBeacons.forEach((beacon, index) => { const active = index === this.checkpoint; beacon.rotation.y += delta * (active ? 4.8 : 1.4); beacon.scaling.y = active ? 1 + Math.sin(this.elapsed * 8) * 0.18 : 0.7; (beacon.material as StandardMaterial).diffuseColor = Color3.FromHexString(active ? PALETTE.lime : PALETTE.cream); });
    if (Vector3.Distance(CHECKPOINTS[this.checkpoint], this.player.position) < 1.25) { this.score += 150; this.checkpoint += 1; if (this.checkpoint >= CHECKPOINTS.length) { this.lap += 1; this.checkpoint = 0; this.score += 500; } }
    this.pickups.forEach((item) => { if (!item.active) { item.timer -= delta; if (item.timer <= 0) { item.active = true; item.mesh.setEnabled(true); } return; } item.mesh.rotation.y += delta * 3.4; item.mesh.position.y = item.spawn.y + Math.sin(this.elapsed * 4 + item.spawn.x) * 0.1; if (Vector3.Distance(item.mesh.position, this.player.position) < 0.86) { item.active = false; item.timer = 5; item.mesh.setEnabled(false); this.score += 100; } });
    this.hitCooldown -= delta; if (this.hitCooldown <= 0 && this.hazards.some((hazard) => Vector3.Distance(hazard, this.player.position) < 0.9)) { this.health = Math.max(0, this.health - 1); this.hitCooldown = 1.4; }
    if (this.time === 0 || this.health === 0 || this.lap > 3) this.raceFinished = true;
    if (Math.floor(this.elapsed * 8) % 2 === 0) this.emitStatus();
  }

  private emitStatus() { this.options.onStatus({ score: this.score, health: this.health, time: Math.ceil(this.time), lap: Math.min(this.lap, 3), totalLaps: 3, checkpoint: this.checkpoint + 1, totalCheckpoints: CHECKPOINTS.length, finished: this.raceFinished }); }
  reset() { this.score = 0; this.health = 3; this.elapsed = 0; this.time = 105; this.lap = 1; this.checkpoint = 0; this.raceFinished = false; this.player.position.copyFromFloats(0, 0.22, 7.05); this.player.rotation.y = Math.PI; this.pickups.forEach((item) => { item.active = true; item.timer = 0; item.mesh.setEnabled(true); item.mesh.position.copyFrom(item.spawn); }); this.emitStatus(); }
  dispose() { this.disposeInput(); this.scene.dispose(); }
}
