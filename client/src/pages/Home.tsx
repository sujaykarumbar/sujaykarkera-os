/**
 * SUJAY KARKERA OS — Warm Pixel Desktop
 * Design contract: Treat the page as an asymmetric, warm 16-bit personal desktop.
 * Keep UI tactile, burgundy-outlined, paper-like, and reserve signal lime for actions.
 * Player 01 is a compact reference-led pixel companion: character left, paired mood keys,
 * then a full-width sound key—never a tall control card.
 * Founder Mode places Sujay’s supplied full-body portrait in the right-hand workroom as a grounded,
 * editorial presence, distinct from the compact interactive Player 01 pet.
 * Happy and Sad add only restrained signal and contrast shifts, respecting reduced-motion preferences.
 * The quick launcher is a wide cream pixel-command strip with oversized illustrated sprites, sparse dividers,
 * dark hover labels, theme-aware palettes, and a compact functional music console.
 * Workspace scenes crossfade every ten seconds, retaining a calm, readable backdrop behind the desktop.
 * On desktop, the quick launcher stays out of view until the bottom-edge reveal zone is reached.
 * Desktop shortcuts are hand-built pixel objects with small kicker tabs, framed labels, and concise metadata—never generic emoji badges.
 */
import { type CSSProperties, type PointerEvent as ReactPointerEvent, useEffect, useMemo, useRef, useState } from "react";
import {
  Archive,
  ArrowUpRight,
  BookOpen,
  BookMarked,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  Cloud,
  Database,
  ExternalLink,
  FileText,
  Gamepad2,
  Globe2,
  Github,
  FolderOpen,
  House,
  Mail,
  MapPin,
  MessageCircle,
  Mic,
  Moon,
  Radio,
  Search,
  Send,
  Settings2,
  Sparkles,
  Sun,
  TerminalSquare,
  Trophy,
  UserRound,
  X,
} from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { KartGameCanvas } from "@/components/KartGameCanvas";
import osEmblem from "@/assets/os-emblem.svg";

type AppKey = "work" | "about" | "notes" | "contact" | "proof" | "journey" | "play" | "terminal" | "casefiles";
type CaseTab = "cases" | "notes";
type BootStatus = "booting" | "closing" | "complete";
type ToolbarMode = "auto-hide" | "always-visible";
type ToolbarSpriteKey = "home" | "folder" | "proof" | "notes" | "play" | "pause" | "previous" | "next" | "heart" | "mail" | "calendar" | "founder" | "search" | "prefs" | "code" | "globe" | "music";
type DesktopSpriteKey = "projects" | "casefiles" | "notes" | "about" | "contact" | "github" | "browser" | "game" | "whiteboard";
type WhiteboardNote = { id: string; text: string; tone: "lime" | "peach" | "paper" };

const TOOLBAR_SPRITES: Record<ToolbarSpriteKey, string[]> = {
  home: ["....x...", "...xxx..", "..xxxxx.", ".xxxxxxx", ".xx...xx", ".xx...xx", ".xxxxxxx", "........"],
  folder: [".xxx....", ".x..xxx.", ".xxxxxxx", ".xxxxxxx", ".xx...xx", ".xx...xx", ".xxxxxxx", "........"],
  proof: [".x....x.", ".xx..xx.", "..xxxx..", "...xx...", "...xx...", "..xxxx..", ".x....x.", "........"],
  notes: [".xxxxx..", ".x...x..", ".x.x.x..", ".x...x..", ".x.x.x..", ".x...x..", ".xxxxx..", "........"],
  play: ["........", ".xx.....", ".xxxx...", ".xxxxxx.", ".xxxx...", ".xx.....", "........", "........"],
  pause: ["........", ".xx..xx.", ".xx..xx.", ".xx..xx.", ".xx..xx.", ".xx..xx.", "........", "........"],
  previous: ["........", ".x..xx..", ".x.xxxx.", ".xxxxxx.", ".x.xxxx.", ".x..xx..", "........", "........"],
  next: ["........", "..xx..x.", ".xxxx.x.", ".xxxxxx.", ".xxxx.x.", "..xx..x.", "........", "........"],
  heart: [".xx.xx..", ".xxxxxx.", ".xxxxxx.", "..xxxx..", "...xx...", "....x...", "........", "........"],
  mail: [".xxxxxx.", ".x....x.", ".xx..xx.", ".x.xx.x.", ".x....x.", ".x....x.", ".xxxxxx.", "........"],
  calendar: [".xxxxxx.", ".x.xx.x.", ".xxxxxx.", ".x.x..x.", ".x..x.x.", ".x.x..x.", ".xxxxxx.", "........"],
  founder: ["...xx...", "..xxxx..", "..x..x..", "..xxxx..", "...xx...", ".xx..xx.", ".x....x.", "........"],
  search: ["..xxxx..", ".xx..xx.", ".x....x.", ".x....x.", ".xx..xx.", "..xxxx..", ".....xx.", "........"],
  prefs: ["...xx...", ".x.xx.x.", ".xx..xx.", "..xxxx..", ".xx..xx.", ".x.xx.x.", "...xx...", "........"],
  code: [".xx..xx.", ".xx..xx.", "..xxxx..", "...xx...", "..xxxx..", ".xx..xx.", ".xx..xx.", "........"],
  globe: ["..xxxx..", ".xx..xx.", ".x.xx.x.", ".xxxxxx.", ".x.xx.x.", ".xx..xx.", "..xxxx..", "........"],
  music: [".....xx.", ".....xx.", ".xxxxx..", ".x...x..", ".x...x..", ".xxxxx..", "........", "........"],
};

const NOW_PLAYING_TRACKS = [
  { id: "signal-01", title: "Signal Study 01", artist: "SoundHelix", audioSrc: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
  { id: "signal-02", title: "Signal Study 02", artist: "SoundHelix", audioSrc: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
  { id: "signal-03", title: "Signal Study 03", artist: "SoundHelix", audioSrc: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" },
] as const;

const WORKSPACE_SCENES = [
  { id: "sunset-studio", image: "/01-sunset-studio.png", portrait: "/01-founder-sand.png" },
  { id: "daylight-desk", image: "/02-daylight-desk.png", portrait: "/02-founder-black.png" },
  { id: "sunset-atelier", image: "/03-sunset-atelier.png", portrait: "/03-founder-ink-layered.png" },
  { id: "daylight-atelier", image: "/04-daylight-atelier.png", portrait: "/04-founder-portrait.png" },
  { id: "night-atelier", image: "/05-night-atelier.png", portrait: "/05-founder-portrait-night.png" },
] as const;

function PixelGlyph({ glyph }: { glyph: ToolbarSpriteKey }) {
  return (
    <span className={`pixel-glyph pixel-glyph--${glyph}`} aria-hidden="true">
      {TOOLBAR_SPRITES[glyph].flatMap((row, rowIndex) => Array.from(row).map((cell, columnIndex) => (
        <i className={cell === "x" ? "is-on" : undefined} key={`${rowIndex}-${columnIndex}`} style={cell === "x" ? { backgroundColor: "currentColor" } : undefined} />
      )))}
    </span>
  );
}

const DESKTOP_SPRITES: Record<DesktopSpriteKey, string[]> = {
  projects: ["....bb..", "...bppb.", ".bbbbbbb", ".bpppppb", ".bpppppb", ".bpppppb", ".bbbbbbb", "........"],
  casefiles: [".bb...bb", ".bppppb.", "..bppb..", "...bb...", "..bbbbb.", "...bbb..", "...bbb..", "..bbbbb."],
  notes: [".bbbbbb.", ".bppppb.", ".bpmmmb.", ".bppppb.", ".bpmmmb.", ".bppppb.", ".bppppb.", ".bbbbbb."],
  about: ["..bbbb..", ".bppppb.", ".bpmmmb.", ".bppppb.", ".bpmmmb.", ".bppppb.", "..bbbb..", "........"],
  contact: [".bbbbbb.", ".bppppb.", ".bbppbb.", ".bpbbpb.", ".bppppb.", ".bppppb.", ".bbbbbb.", "........"],
  github: [".bbbbbb.", ".bppppb.", ".bbpbbb.", ".bppppb.", ".bbpbbb.", ".bppppb.", ".bbbbbb.", "........"],
  browser: [".bbbbbb.", ".bpmmmb.", ".bppppb.", ".bppppb.", ".bppppb.", ".bppppb.", ".bbbbbb.", "........"],
  game: ["..b..b..", ".bbbbbb.", "bppppppb", "bpmbbmpb", "bppppppb", ".bbbbbb.", "..b..b..", "........"],
  whiteboard: [".bbbbbb.", ".bppppb.", ".bpmmmb.", ".bppppb.", ".bpmmmb.", ".bppppb.", ".bbbbbb.", "........"],
};

function DesktopPixelIcon({ sprite }: { sprite: DesktopSpriteKey }) {
  return (
    <span className="desktop-pixel-icon" aria-hidden="true">
      {DESKTOP_SPRITES[sprite].flatMap((row, rowIndex) => Array.from(row).map((cell, columnIndex) => (
        <i
          className={cell === "." ? undefined : `pixel-${cell}`}
          key={`${rowIndex}-${columnIndex}`}
          style={cell === "." ? undefined : { backgroundColor: cell === "b" ? "var(--burgundy)" : cell === "p" ? "var(--paper)" : "var(--signal)" }}
        />
      )))}
    </span>
  );
}

type DesktopApp = {
  id: string;
  key: AppKey;
  title: string;
  subtitle: string;
  kicker: string;
  sprite: DesktopSpriteKey;
  accent?: "lime" | "coral" | "cream";
  href?: string;
};

type WindowFrameProps = {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  initialWidth?: number;
  initialHeight?: number;
  className?: string;
};

const apps: DesktopApp[] = [
  { id: "projects", key: "work", title: "Projects", subtitle: "Selected build files", kicker: "MAIN DRIVE", sprite: "projects", accent: "coral" },
  { id: "casefiles", key: "casefiles", title: "Case Files", subtitle: "Projects + build notes", kicker: "PROOF VAULT", sprite: "casefiles", accent: "coral" },
  { id: "notes", key: "notes", title: "Field Notes", subtitle: "Ideas worth keeping", kicker: "NOTEBOOK", sprite: "notes", accent: "lime" },
  { id: "about", key: "about", title: "Systems", subtitle: "How the work ships", kicker: "ABOUT.TXT", sprite: "about", accent: "cream" },
  { id: "contact", key: "contact", title: "Leave a Message", subtitle: "Open a channel", kicker: "SIGNAL", sprite: "contact", accent: "lime" },
  { id: "github", key: "contact", title: "Codebase", subtitle: "Open-source work", kicker: "REPOSITORIES", sprite: "github", accent: "lime", href: "https://github.com/sujaykarumbar" },
  { id: "portfolio", key: "casefiles", title: "Browser", subtitle: "Open portfolio", kicker: "SUJAY.NET", sprite: "browser", accent: "lime", href: "https://sujaykarkera-liart.vercel.app/" },
  { id: "game", key: "play", title: "Play Games", subtitle: "Kart arena: drive", kicker: "ARCADE", sprite: "game", accent: "coral" },
  { id: "whiteboard", key: "notes", title: "Whiteboard", subtitle: "Add + arrange notes", kicker: "NOTES.APP", sprite: "whiteboard", accent: "lime" },
];

const appContent: Record<Exclude<AppKey, "casefiles">, { eyebrow: string; heading: string; copy: string; cta?: string }> = {
  work: {
    eyebrow: "Main Drive / Projects",
    heading: "Actual work, filed and ready.",
    copy: "Open Case Files to browse real shipped projects, direct repository links, and the working notes behind Sujay’s current focus.",
    cta: "Open case files",
  },
  proof: {
    eyebrow: "Toolkit / Capabilities",
    heading: "From mobile systems to AI experiments.",
    copy: "Sujay works across Flutter and Firebase, TypeScript and modern web tooling, Python and data exploration, plus practical voice-AI experiments.",
  },
  terminal: {
    eyebrow: "Workflow / Systems",
    heading: "Make the idea tangible early.",
    copy: "A clear brief, an opinionated interface, and a lightweight implementation loop create momentum without losing the details that make a product feel considered.",
  },
  journey: {
    eyebrow: "Timeline / Journey",
    heading: "Independent developer, still iterating.",
    copy: "Sujay is building mobile apps, web tools, data experiences, and AI experiments—shipping what he learns and making the next version stronger.",
  },
  about: {
    eyebrow: "Profile / Sujay Karkera",
    heading: "Engineer. Builder. Executor.",
    copy: "Sujay builds real-world software across web, mobile, AI, and data. He learns by making, ships fast, and keeps the code clean.",
  },
  notes: {
    eyebrow: "Notebook / Field Notes",
    heading: "The useful details live with the work.",
    copy: "Open Case Files and switch to Field Notes for current technical directions based on Sujay’s published projects and active areas of exploration.",
    cta: "Open field notes",
  },
  play: {
    eyebrow: "Side Quest / Play",
    heading: "Small experiments teach fast.",
    copy: "A place for prototypes, visual studies, and playful interactions that would never fit cleanly into a formal case study.",
  },
  contact: {
    eyebrow: "Contact / Send Signal",
    heading: "Have a considered idea? Send it over.",
    copy: "Sujay is open to opportunities and interesting software projects. Reach out through email, browse his GitHub, or visit the primary portfolio.",
    cta: "Draft an email",
  },
};

const caseStudies = [
  {
    title: "Namma Bus",
    category: "MOBILE / REAL-TIME",
    summary: "A real-time bus tracking and management app with live location updates, Cloud Firestore, Google Maps, Firebase Auth, and Android/iOS support.",
    stack: "Flutter · Dart · Firebase · Maps",
    href: "https://github.com/sujaykarumbar/Namma-bus",
  },
  {
    title: "CampusFind",
    category: "WEB / DISCOVERY",
    summary: "A campus-focused discovery platform helping students find people, places, and resources through a clean, fast web interface.",
    stack: "HTML · CSS · JavaScript",
    href: "https://github.com/sujaykarumbar/campusFind",
  },
  {
    title: "Datalens",
    category: "DATA / INSIGHTS",
    summary: "A lightweight data-analysis web app designed to turn raw datasets into clear, approachable visual insights.",
    stack: "HTML · CSS · JavaScript",
    href: "https://github.com/sujaykarumbar/Datalens",
  },
  {
    title: "Smart Driving Risk Monitor",
    category: "AI / SAFETY",
    summary: "A data and ML-flavoured project for monitoring driving behavior and surfacing real-time risk signals for safer roads.",
    stack: "Python · IoT · Analytics",
    href: "https://github.com/sujaykarumbar/smart-driving-risk-monitoring-system",
  },
];

const fieldNotes = [
  {
    title: "Real-time experiences need dependable signals.",
    tag: "MOBILE SYSTEMS",
    copy: "Namma Bus puts live location, authentication, and map interaction in one mobile experience—an ongoing lesson in keeping real-time products useful and legible.",
    href: "https://github.com/sujaykarumbar/Namma-bus",
  },
  {
    title: "Data tools work when they reduce the first step.",
    tag: "DATA & ANALYTICS",
    copy: "Datalens and DataAnalyzer explore a simple goal: make it easier to move from a raw dataset to a useful visual understanding.",
    href: "https://github.com/sujaykarumbar/Datalens",
  },
  {
    title: "Voice is an interface, not just an output channel.",
    tag: "AI & AUTOMATION",
    copy: "Jarvis and Voice AI are practical experiments in speech recognition, automation, and hands-free ways of working with software.",
    href: "https://github.com/sujaykarumbar/voice-ai",
  },
];

const bootLines = [
  "INITIALIZING SUJAY KARKERA OS / V1.0",
  "MOUNTING PROJECT ARCHIVE ................ [OK]",
  "LOADING FIELD NOTES ..................... [OK]",
  "LINKING LIVE PORTFOLIO .................. [OK]",
  "SYSTEM READY. WELCOME, BUILDER.",
];

function formatTime(date: Date) {
  return new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "Asia/Kolkata" }).format(date);
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", timeZone: "Asia/Kolkata" }).format(date).toUpperCase();
}

function DraggableWindow({ title, onClose, children, initialWidth = 560, initialHeight = 420, className = "" }: WindowFrameProps) {
  const [position, setPosition] = useState({ x: 30, y: 76 });
  const [drag, setDrag] = useState<{ offsetX: number; offsetY: number } | null>(null);

  useEffect(() => {
    setPosition({
      x: Math.max(18, Math.round((window.innerWidth - initialWidth) / 2)),
      y: Math.max(68, Math.round((window.innerHeight - initialHeight) / 2)),
    });
  }, [initialHeight, initialWidth]);

  const beginDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (window.matchMedia("(max-width: 690px)").matches || (event.target as HTMLElement).closest("button, a, input")) return;
    const frame = event.currentTarget.parentElement;
    if (!frame) return;
    const rect = frame.getBoundingClientRect();
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    setPosition({ x: rect.left, y: rect.top });
    setDrag({ offsetX: event.clientX - rect.left, offsetY: event.clientY - rect.top });
  };

  const moveDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!drag) return;
    const maxX = Math.max(14, window.innerWidth - 190);
    const maxY = Math.max(58, window.innerHeight - 110);
    setPosition({
      x: Math.min(Math.max(14, event.clientX - drag.offsetX), maxX),
      y: Math.min(Math.max(58, event.clientY - drag.offsetY), maxY),
    });
  };

  const endDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!drag) return;
    event.currentTarget.releasePointerCapture(event.pointerId);
    setDrag(null);
  };

  return (
    <section
      className={`app-window draggable-window ${className} ${drag ? "is-dragging" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-label={title}
      style={{ left: position.x, top: position.y, width: initialWidth, height: initialHeight }}
    >
      <div className="window-titlebar draggable-titlebar" onPointerDown={beginDrag} onPointerMove={moveDrag} onPointerUp={endDrag} onPointerCancel={endDrag}>
        <span>{title}</span>
        <span className="window-controls"><span className="drag-affordance" aria-hidden="true">DRAG</span><button type="button" onClick={onClose} aria-label="Close window">×</button></span>
      </div>
      <div className="window-scroll-area">{children}</div>
      <span className="window-resize-hint" aria-hidden="true">↘ RESIZE</span>
    </section>
  );
}

export default function Home() {
  const [now, setNow] = useState(() => new Date());
  const [dark, setDark] = useState(false);
  const [backgroundIndex, setBackgroundIndex] = useState(0);
  const [noticeOpen, setNoticeOpen] = useState(true);
  const [selectedApp, setSelectedApp] = useState<AppKey | null>(null);
  const [gameOpen, setGameOpen] = useState(() => new URLSearchParams(window.location.search).get("game") === "1");
  const [whiteboardOpen, setWhiteboardOpen] = useState(() => new URLSearchParams(window.location.search).get("whiteboard") === "1");
  const [whiteboardDraft, setWhiteboardDraft] = useState("");
  const [whiteboardNotes, setWhiteboardNotes] = useState<WhiteboardNote[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const saved = JSON.parse(window.localStorage.getItem("sujay-os-whiteboard-notes") ?? "[]");
      return Array.isArray(saved)
        ? saved.filter((note): note is WhiteboardNote => Boolean(note && typeof note.id === "string" && typeof note.text === "string" && ["lime", "peach", "paper"].includes(note.tone)))
        : [];
    } catch {
      return [];
    }
  });
  const [searchOpen, setSearchOpen] = useState(false);
  const [preferencesOpen, setPreferencesOpen] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(() => typeof window !== "undefined" && new URLSearchParams(window.location.search).has("calendar"));
  const [calendarDate, setCalendarDate] = useState<Date | undefined>(() => new Date());
  const [caseTab, setCaseTab] = useState<CaseTab>("cases");
  const [bootStatus, setBootStatus] = useState<BootStatus>("booting");
  const [bootStep, setBootStep] = useState(0);
  const [toolbarActive, setToolbarActive] = useState(false);
  const [toolbarMode, setToolbarMode] = useState<ToolbarMode>(() => {
    if (typeof window === "undefined") return "auto-hide";
    return window.localStorage.getItem("sujay-os-toolbar-mode") === "always-visible" ? "always-visible" : "auto-hide";
  });
  const [trackIndex, setTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [favoriteTrackIds, setFavoriteTrackIds] = useState<string[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const saved = JSON.parse(window.localStorage.getItem("sujay-os-favorite-tracks") ?? "[]");
      return Array.isArray(saved) ? saved.filter((trackId): trackId is string => typeof trackId === "string") : [];
    } catch {
      return [];
    }
  });
  const [companionMood, setCompanionMood] = useState("HAPPY");
  const [soundOn, setSoundOn] = useState(true);
  const [companionOffset, setCompanionOffset] = useState({ x: 0, y: 0 });
  const [companionDragging, setCompanionDragging] = useState(false);
  const companionStart = useRef({ pointerX: 0, pointerY: 0, offsetX: 0, offsetY: 0 });
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const resumeOnTrackChange = useRef(false);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 20_000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reducedMotion.matches) return;
    const timer = window.setInterval(() => {
      setBackgroundIndex((index) => (index + 1) % WORKSPACE_SCENES.length);
    }, 10_000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    window.localStorage.setItem("sujay-os-toolbar-mode", toolbarMode);
  }, [toolbarMode]);

  useEffect(() => {
    window.localStorage.setItem("sujay-os-favorite-tracks", JSON.stringify(favoriteTrackIds));
  }, [favoriteTrackIds]);

  useEffect(() => {
    window.localStorage.setItem("sujay-os-whiteboard-notes", JSON.stringify(whiteboardNotes));
  }, [whiteboardNotes]);

  useEffect(() => {
    const audio = new Audio(NOW_PLAYING_TRACKS[trackIndex].audioSrc);
    audio.preload = "metadata";
    audio.volume = 0.32;
    audioRef.current = audio;
    const markPlaying = () => setIsPlaying(true);
    const markPaused = () => setIsPlaying(false);
    const advanceOnEnd = () => {
      resumeOnTrackChange.current = true;
      setTrackIndex((index) => (index + 1) % NOW_PLAYING_TRACKS.length);
    };
    audio.addEventListener("play", markPlaying);
    audio.addEventListener("pause", markPaused);
    audio.addEventListener("ended", advanceOnEnd);
    if (resumeOnTrackChange.current) {
      resumeOnTrackChange.current = false;
      audio.play().catch(() => setIsPlaying(false));
    }
    return () => {
      audio.pause();
      audio.removeEventListener("play", markPlaying);
      audio.removeEventListener("pause", markPaused);
      audio.removeEventListener("ended", advanceOnEnd);
      if (audioRef.current === audio) audioRef.current = null;
    };
  }, [trackIndex]);

  useEffect(() => {
    if (toolbarMode === "always-visible") {
      setToolbarActive(true);
      return;
    }

    const revealAtBottomEdge = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      setToolbarActive(event.clientY >= window.innerHeight - 74);
    };

    setToolbarActive(false);
    window.addEventListener("pointermove", revealAtBottomEdge, { passive: true });
    return () => window.removeEventListener("pointermove", revealAtBottomEdge);
  }, [toolbarMode]);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const forceBootPreview = new URLSearchParams(window.location.search).has("boot");
    const hasBooted = window.sessionStorage.getItem("sujay-os-booted") === "true";

    if (prefersReducedMotion || (hasBooted && !forceBootPreview)) {
      setBootStatus("complete");
      return;
    }

    if (forceBootPreview) {
      setBootStep(bootLines.length - 1);
      return;
    }

    const progressTimer = window.setInterval(() => {
      setBootStep((current) => Math.min(current + 1, bootLines.length - 1));
    }, 390);
    const closeTimer = window.setTimeout(() => setBootStatus("closing"), 2_140);
    const completeTimer = window.setTimeout(() => {
      window.sessionStorage.setItem("sujay-os-booted", "true");
      setBootStatus("complete");
    }, 2_460);

    return () => {
      window.clearInterval(progressTimer);
      window.clearTimeout(closeTimer);
      window.clearTimeout(completeTimer);
    };
  }, []);

  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      if (bootStatus !== "complete") {
        if (event.key === "Escape" || event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          setBootStatus("closing");
          window.sessionStorage.setItem("sujay-os-booted", "true");
          window.setTimeout(() => setBootStatus("complete"), 260);
        }
        return;
      }
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearchOpen(true);
      }
      if (event.key === "Escape") {
        setSearchOpen(false);
        setSelectedApp(null);
        setGameOpen(false);
        setWhiteboardOpen(false);
        setCalendarOpen(false);
        setPreferencesOpen(false);
      }
    };
    window.addEventListener("keydown", listener);
    return () => window.removeEventListener("keydown", listener);
  }, [bootStatus]);

  const selected = selectedApp && selectedApp !== "casefiles" ? appContent[selectedApp] : null;
  const signalLabel = useMemo(() => (dark ? "NIGHT SHIFT" : "BUILDING"), [dark]);
  const closeApp = () => setSelectedApp(null);
  const selectedBookingDate = calendarDate
    ? new Intl.DateTimeFormat("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(calendarDate)
    : "a selected day";
  const bookingMailto = `mailto:sujaykarkera5@gmail.com?subject=${encodeURIComponent(`30-minute work session — ${selectedBookingDate}`)}&body=${encodeURIComponent(`Hi Sujay,\n\nI'd like to discuss a project on ${selectedBookingDate}.\n\nMy preferred time window is:\n\nThanks!`)}`;
  const currentTrack = NOW_PLAYING_TRACKS[trackIndex];

  const selectTrack = (nextIndex: number) => {
    resumeOnTrackChange.current = isPlaying;
    audioRef.current?.pause();
    setTrackIndex((nextIndex + NOW_PLAYING_TRACKS.length) % NOW_PLAYING_TRACKS.length);
  };

  const togglePlayback = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      try {
        await audio.play();
      } catch {
        setIsPlaying(false);
      }
      return;
    }
    audio.pause();
  };

  const toggleFavoriteTrack = (trackId: string) => {
    setFavoriteTrackIds((saved) => saved.includes(trackId) ? saved.filter((id) => id !== trackId) : [...saved, trackId]);
  };

  const playCompanionTone = (frequency = 520) => {
    if (!soundOn || typeof window === "undefined" || !window.AudioContext) return;
    const context = new window.AudioContext();
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = "square";
    oscillator.frequency.value = frequency;
    gain.gain.setValueAtTime(0.035, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.09);
    oscillator.connect(gain).connect(context.destination);
    oscillator.start();
    oscillator.stop(context.currentTime + 0.09);
    oscillator.addEventListener("ended", () => context.close());
  };

  const skipBoot = () => {
    setBootStatus("closing");
    window.sessionStorage.setItem("sujay-os-booted", "true");
    window.setTimeout(() => setBootStatus("complete"), 260);
  };

  const openApp = (key: AppKey) => {
    setSelectedApp(key === "work" || key === "notes" ? "casefiles" : key);
    setSearchOpen(false);
  };

  const openDesktopApp = (app: DesktopApp) => {
    if (app.id === "game") {
      setGameOpen(true);
      setSearchOpen(false);
      return;
    }
    if (app.id === "whiteboard") {
      setWhiteboardOpen(true);
      setSearchOpen(false);
      return;
    }
    if (app.href) {
      window.open(app.href, "_blank", "noopener,noreferrer");
      return;
    }
    openApp(app.key);
  };

  const addWhiteboardNote = () => {
    const text = whiteboardDraft.trim();
    if (!text) return;
    const tones: WhiteboardNote["tone"][] = ["lime", "peach", "paper"];
    setWhiteboardNotes((notes) => [...notes, { id: `${Date.now()}-${notes.length}`, text: text.slice(0, 240), tone: tones[notes.length % tones.length] }]);
    setWhiteboardDraft("");
  };

  const beginCompanionDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    companionStart.current = { pointerX: event.clientX, pointerY: event.clientY, offsetX: companionOffset.x, offsetY: companionOffset.y };
    setCompanionDragging(true);
  };

  const moveCompanion = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!companionDragging) return;
    setCompanionOffset({
      x: Math.max(-220, Math.min(130, companionStart.current.offsetX + event.clientX - companionStart.current.pointerX)),
      y: Math.max(-240, Math.min(120, companionStart.current.offsetY + event.clientY - companionStart.current.pointerY)),
    });
  };

  const nudgeCompanion = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const delta = event.shiftKey ? 28 : 12;
    const moves: Record<string, { x: number; y: number }> = {
      ArrowLeft: { x: -delta, y: 0 }, ArrowRight: { x: delta, y: 0 }, ArrowUp: { x: 0, y: -delta }, ArrowDown: { x: 0, y: delta },
    };
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setCompanionMood((mood) => mood === "HAPPY" ? "SAD" : "HAPPY");
      playCompanionTone(companionMood === "HAPPY" ? 330 : 620);
      return;
    }
    if (!moves[event.key]) return;
    event.preventDefault();
    setCompanionOffset((current) => ({ x: Math.max(-220, Math.min(130, current.x + moves[event.key].x)), y: Math.max(-240, Math.min(120, current.y + moves[event.key].y)) }));
  };

  return (
    <main className={dark ? "os-shell is-night" : "os-shell"}>
      {bootStatus !== "complete" && (
        <section className={`boot-screen ${bootStatus === "closing" ? "is-closing" : ""}`} aria-label="Sujay Karkera OS boot sequence" aria-live="polite">
          <div className="boot-screen-noise" aria-hidden="true" />
          <button className="boot-skip" type="button" onClick={skipBoot}>SKIP BOOT <ArrowUpRight size={13} /></button>
          <div className="boot-console">
            <div className="boot-identity">
              <div className="boot-emblem" aria-hidden="true"><img src={osEmblem} alt="" /></div>
              <div><p>SUJAY KARKERA OS</p><span>V1.0 · FOUNDER EDITION</span></div>
            </div>
            <div className="boot-terminal">
              <div className="boot-log" aria-label="System startup status">
                {bootLines.map((line, index) => <p className={index <= bootStep ? "is-active" : ""} key={line}><span>{index <= bootStep ? "◆" : "·"}</span>{line}</p>)}
                <p className="boot-prompt">sujay@os:~$<i aria-hidden="true" /></p>
              </div>
            </div>
            <div className="boot-progress" aria-label={`Loading ${Math.round(Math.min(((bootStep + 1) / bootLines.length) * 100, 100))} percent`}><span style={{ width: `${Math.min(((bootStep + 1) / bootLines.length) * 100, 100)}%` }} /></div>
            <div className="boot-progress-meta"><span>LOADING YOUR WORKSPACE…</span><b>{Math.round(Math.min(((bootStep + 1) / bootLines.length) * 100, 100))}%</b></div>
          </div>
          <div className="boot-welcome"><p>WELCOME TO SUJAY KARKERA.</p><h1>this is my <em>creative operating system.</em></h1><span>PRESS ESC, ENTER, OR SPACE TO SKIP</span></div>
        </section>
      )}
      <div className="background-scene-stack" aria-hidden="true">
        {WORKSPACE_SCENES.map((scene, index) => (
          <div
            className={`background-scene ${backgroundIndex === index ? "is-active" : ""}`}
            key={scene.id}
            style={{ backgroundImage: `linear-gradient(90deg, rgba(77, 39, 31, 0.34) 0 50%, rgba(77, 39, 31, 0.1) 58%, transparent 70%), url("${scene.image}")` } as CSSProperties}
          />
        ))}
      </div>
      <div className="dither-overlay" aria-hidden="true" />
      <div className="landscape-art" aria-hidden="true" />

      <header className="system-bar">
        <button className="wordmark" type="button" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} aria-label="Return to Sujay Karkera OS desktop">
          <img src={osEmblem} alt="" />
          <span>SUJAY KARKERA OS</span><span className="wordmark-caret">⌄</span>
        </button>
        <nav className="primary-nav" aria-label="Primary navigation">
          <button type="button" onClick={() => openApp("casefiles")}>Work</button>
          <button type="button" onClick={() => openApp("proof")}>Toolkit</button>
          <button type="button" onClick={() => openApp("journey")}>Journey</button>
          <button type="button" onClick={() => setSearchOpen(true)}>Search</button>
        </nav>
        <div className="system-actions">
          <span className="status-pill"><i />{signalLabel}</span>
          <button className="mode-button" type="button" onClick={() => setDark(!dark)} aria-label="Toggle night mode">{dark ? <Sun size={12} /> : <Moon size={12} />}<span>{dark ? "LIGHT" : "DARK"}</span></button>
          <button className="preferences-button" type="button" onClick={() => setPreferencesOpen(true)} aria-label="Open OS Preferences"><Settings2 size={13} /><span>PREFS</span></button>
          <button className="calendar-button" type="button" onClick={() => setCalendarOpen(true)}><CalendarDays size={12} /> <span>CAL</span></button>
          <span className="clock">{formatDate(now)}&nbsp;&nbsp;{formatTime(now)} IST</span>
        </div>
      </header>

      <nav className={`quick-launch ${toolbarActive ? "is-active" : "is-idle"}`} aria-label="Quick launch. Move the pointer to the bottom edge of the desktop to reveal this toolbar.">
        <div className="quick-launch-core">
          <button className="toolbar-command" data-toolbar-command="home" type="button" aria-label="Return home" data-tooltip="HOME" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}><PixelGlyph glyph="home" /></button>
          <button className="toolbar-command" data-toolbar-command="archive" type="button" aria-label="Open Case Files" data-tooltip="CASE FILES" onClick={() => openApp("casefiles")}><PixelGlyph glyph="folder" /></button>
          <button className="toolbar-command" data-toolbar-command="notes" type="button" aria-label="Open Field Notes" data-tooltip="FIELD NOTES" onClick={() => { setCaseTab("notes"); openApp("casefiles"); }}><PixelGlyph glyph="notes" /></button>
          <button className="toolbar-command" data-toolbar-command="play" type="button" aria-label="Play projects" data-tooltip="PLAY LAB" onClick={() => openApp("play")}><PixelGlyph glyph="play" /></button>
          <button className="toolbar-command" data-toolbar-command="mail" type="button" aria-label="Send a signal" data-tooltip="SEND SIGNAL" onClick={() => openApp("contact")}><PixelGlyph glyph="mail" /></button>
          <button className="toolbar-command" data-toolbar-command="calendar" type="button" aria-label="Open calendar" data-tooltip="CALENDAR" onClick={() => setCalendarOpen(true)}><PixelGlyph glyph="calendar" /></button>
        </div>
        <span className="quick-launch-divider" aria-hidden="true" />
        <div className="quick-launch-tools">
          <button className="toolbar-command" data-toolbar-command="prefs" type="button" aria-label="Open OS Preferences" data-tooltip="PREFERENCES" onClick={() => setPreferencesOpen(true)}><PixelGlyph glyph="prefs" /></button>
          <a className="toolbar-command" data-toolbar-command="code" href="https://github.com/sujaykarumbar" target="_blank" rel="noreferrer" aria-label="Open Sujay's GitHub" data-tooltip="CODEBASE"><PixelGlyph glyph="code" /></a>
        </div>
        <section className={`quick-launch-now-playing ${isPlaying ? "is-playing" : ""}`} aria-label={`Now playing ${currentTrack.title} by ${currentTrack.artist}`}>
          <button className="track-summary" type="button" data-tooltip={isPlaying ? "PAUSE TRACK" : "PLAY TRACK"} onClick={togglePlayback} aria-label={`${isPlaying ? "Pause" : "Play"} ${currentTrack.title} by ${currentTrack.artist}`}>
            <PixelGlyph glyph="music" />
            <span className="track-copy"><small>NOW PLAYING</small><strong>{currentTrack.title}</strong><em>{currentTrack.artist}</em></span>
          </button>
          <div className="track-controls" aria-label="Playback controls">
            <button type="button" data-tooltip="PREVIOUS" onClick={() => selectTrack(trackIndex - 1)} aria-label="Previous track"><PixelGlyph glyph="previous" /></button>
            <button type="button" data-tooltip={isPlaying ? "PAUSE" : "PLAY"} onClick={togglePlayback} aria-label={isPlaying ? "Pause track" : "Play track"}><PixelGlyph glyph={isPlaying ? "pause" : "play"} /></button>
            <button type="button" data-tooltip="NEXT" onClick={() => selectTrack(trackIndex + 1)} aria-label="Next track"><PixelGlyph glyph="next" /></button>
          </div>
          <span className="pixel-equalizer" aria-hidden="true"><i /><i /><i /></span>
        </section>
        <span className="quick-launch-divider toolbar-divider-final" aria-hidden="true" />
        <div className="quick-launch-utility">
          <a className="toolbar-command" data-toolbar-command="globe" href="https://sujaykarkera-liart.vercel.app/" target="_blank" rel="noreferrer" aria-label="Open Sujay's portfolio" data-tooltip="SUJAY.NET"><PixelGlyph glyph="globe" /></a>
        </div>
      </nav>

      <section className="desktop" aria-label="Sujay Karkera OS desktop">
        <div className="desktop-intro">
          <p className="eyebrow">PERSONAL WORKSPACE / 2026</p>
          <h1>Sujay Karkera — <em>Building thoughtful things</em> for the web.</h1>
          <p>A tactile home for projects, systems, field notes, and small digital experiments.</p>
        </div>

        <div className="app-field">
          {apps.map((app, index) => (
            <button type="button" key={app.id} className={`desktop-app app-${index + 1} app-${app.id}`} onClick={() => openDesktopApp(app)} aria-label={app.href ? `Open ${app.title} in a new tab` : `Open ${app.title}`}>
              <span className="app-icon-frame" data-sprite={app.sprite}><span className="app-kicker" aria-hidden="true">{app.kicker}</span><DesktopPixelIcon sprite={app.sprite} /></span>
              <strong>{app.title}</strong><small>{app.subtitle}</small>
            </button>
          ))}
        </div>

        <figure className={`founder-portrait founder-cutout mood-${companionMood.toLowerCase()}`} aria-label={`Sujay Karkera, Founder Mode, ${companionMood.toLowerCase()} state`}>
          {WORKSPACE_SCENES.map((scene, index) => (
            <img
              className={`founder-portrait-layer ${backgroundIndex === index ? "is-active" : ""}`}
              src={scene.portrait}
              alt=""
              aria-hidden="true"
              decoding="async"
              key={`${scene.id}-portrait`}
            />
          ))}
          <figcaption>AVATAR 01<br /><b>FOUNDER MODE</b></figcaption>
        </figure>

        <div className="companion-cluster" style={{ "--companion-x": `${companionOffset.x}px`, "--companion-y": `${companionOffset.y}px` } as CSSProperties}>
          <div className={`avatar-zone ${companionDragging ? "is-dragging" : ""}`} role="button" tabIndex={0} aria-label={`Sujay companion. ${companionMood}. Drag to move, use arrow keys to reposition, or press Enter to change mood.`} onPointerDown={beginCompanionDrag} onPointerMove={moveCompanion} onPointerUp={() => setCompanionDragging(false)} onPointerCancel={() => setCompanionDragging(false)} onKeyDown={nudgeCompanion}>
            <div className="avatar-glow" /><div className="avatar-head"><span className="hair" /><span className="face" /><span className="glasses" /></div>
          </div>
          <div className="companion-controls" aria-label="Companion controls">
            <button type="button" className={companionMood === "HAPPY" ? "active" : ""} aria-pressed={companionMood === "HAPPY"} onClick={() => { setCompanionMood("HAPPY"); playCompanionTone(620); }}>HAPPY</button>
            <button type="button" className={companionMood === "SAD" ? "active" : ""} aria-pressed={companionMood === "SAD"} onClick={() => { setCompanionMood("SAD"); playCompanionTone(320); }}>SAD</button>
            <button type="button" className={`sound-toggle ${soundOn ? "active" : ""}`} aria-pressed={soundOn} onClick={() => setSoundOn((enabled) => !enabled)}>{soundOn ? "SOUND ON" : "SOUND OFF"}</button>
          </div>
        </div>
        <button type="button" className="callout-button" onClick={() => openApp("contact")}><span>IF THIS FEELS LIKE YOUR KIND OF INTERNET</span><b>SEND A SIGNAL <ArrowUpRight size={15} /></b></button>

        {noticeOpen && <aside className="signal-notice"><button type="button" onClick={() => setNoticeOpen(false)} aria-label="Dismiss availability notification"><X size={13} /></button><p><i /> OPPORTUNITY SIGNAL</p><span>Sujay is open to interesting software work. Open Send Signal to start a conversation.</span></aside>}
        <div className="mascot" aria-hidden="true"><span className="antenna" /><span className="mascot-eye" /></div>
      </section>

      <nav className="mobile-dock" aria-label="Desktop app dock">
        <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}><Sparkles size={15} /><span>Home</span></button>
        <button type="button" onClick={() => openApp("casefiles")}><BriefcaseBusiness size={15} /><span>Work</span></button>
        <button type="button" onClick={() => openApp("about")}><UserRound size={15} /><span>About</span></button>
        <button type="button" onClick={() => openApp("contact")}><MessageCircle size={15} /><span>Contact</span></button>
      </nav>
      <footer className="system-footer"><span><CheckCircle2 size={13} /> SYSTEM ONLINE</span><p>Sujay Karkera OS loaded. Open an app or press <kbd>⌘K</kbd>.</p></footer>

      {selectedApp === "casefiles" && (
        <div className="modal-scrim" role="presentation" onMouseDown={closeApp}>
          <DraggableWindow title="CASE FILES / PROJECT ARCHIVE" onClose={closeApp} initialWidth={780} initialHeight={590} className="case-files-window">
            <div className="case-files-body" onMouseDown={(event) => event.stopPropagation()}>
              <div className="window-intro"><div><p className="eyebrow">SUJAY KARKERA / LIVE ARCHIVE</p><h2>Work that ships. Notes that explain the build.</h2></div><a className="archive-link" href="https://sujaykarkera-liart.vercel.app/" target="_blank" rel="noreferrer">OPEN FULL PORTFOLIO <ExternalLink size={14} /></a></div>
              <div className="case-tabs" role="tablist" aria-label="Case file contents">
                <button type="button" role="tab" aria-selected={caseTab === "cases"} className={caseTab === "cases" ? "active" : ""} onClick={() => setCaseTab("cases")}>CASE STUDIES <span>{caseStudies.length}</span></button>
                <button type="button" role="tab" aria-selected={caseTab === "notes"} className={caseTab === "notes" ? "active" : ""} onClick={() => setCaseTab("notes")}>FIELD NOTES <span>{fieldNotes.length}</span></button>
              </div>
              {caseTab === "cases" ? (
                <div className="case-grid" role="tabpanel">
                  {caseStudies.map((study) => <a key={study.title} className="case-card" href={study.href} target="_blank" rel="noreferrer"><p>{study.category}</p><h3>{study.title}</h3><span>{study.summary}</span><b>{study.stack}</b><i>VIEW REPOSITORY <ArrowUpRight size={14} /></i></a>)}
                </div>
              ) : (
                <div className="field-note-list" role="tabpanel">
                  {fieldNotes.map((note, index) => <a key={note.title} className="field-note" href={note.href} target="_blank" rel="noreferrer"><span className="note-number">0{index + 1}</span><div><p>{note.tag}</p><h3>{note.title}</h3><span>{note.copy}</span></div><ArrowUpRight size={18} /></a>)}
                </div>
              )}
            </div>
          </DraggableWindow>
        </div>
      )}

      {selected && selectedApp && (
        <div className="modal-scrim" role="presentation" onMouseDown={closeApp}>
          <DraggableWindow title={selected.eyebrow.toUpperCase()} onClose={closeApp} initialWidth={selectedApp === "contact" ? 560 : 530} initialHeight={selectedApp === "contact" ? 440 : 395}>
            <div className="app-window-body" onMouseDown={(event) => event.stopPropagation()}>
              <p className="eyebrow">SUJAY KARKERA OS</p><h2>{selected.heading}</h2><p>{selected.copy}</p>
              {selectedApp === "contact" && (
                <div className="contact-links">
                  <a href="mailto:sujaykarkera5@gmail.com"><Mail size={16} /> sujaykarkera5@gmail.com</a>
                  <a href="https://github.com/sujaykarumbar" target="_blank" rel="noreferrer"><Github size={16} /> @sujaykarumbar</a>
                  <a href="https://sujaykarkera.vercel.app" target="_blank" rel="noreferrer"><ExternalLink size={16} /> sujaykarkera.vercel.app</a>
                  <button type="button" onClick={() => navigator.clipboard?.writeText("sujaykarkera5@gmail.com")}>Copy email</button>
                </div>
              )}
              {selected.cta && selectedApp !== "contact" && <button type="button" className="window-cta" onClick={() => openApp(selectedApp === "notes" || selectedApp === "work" ? "casefiles" : selectedApp)}>{selected.cta} <ArrowUpRight size={16} /></button>}
              {selectedApp === "contact" && <a className="window-cta" href="mailto:sujaykarkera5@gmail.com">Draft an email <Send size={16} /></a>}
            </div>
          </DraggableWindow>
        </div>
      )}

      {gameOpen && (
        <div className="modal-scrim game-modal-scrim" role="presentation" onMouseDown={() => setGameOpen(false)}>
          <DraggableWindow title="GAME / SUJAY OS KART ARENA" onClose={() => setGameOpen(false)} initialWidth={820} initialHeight={618} className="kart-game-window">
            <div className="kart-window-body" onMouseDown={(event) => event.stopPropagation()}>
              <KartGameCanvas onExit={() => setGameOpen(false)} />
            </div>
          </DraggableWindow>
        </div>
      )}

      {whiteboardOpen && (
        <div className="modal-scrim" role="presentation" onMouseDown={() => setWhiteboardOpen(false)}>
          <DraggableWindow title="WHITEBOARD — NOTES.APP" onClose={() => setWhiteboardOpen(false)} initialWidth={790} initialHeight={650} className="whiteboard-window">
            <div className="whiteboard-body" onMouseDown={(event) => event.stopPropagation()}>
              <div className="whiteboard-intro">
                <div><p className="eyebrow">SUJAY OS WHITEBOARD</p><h2>Leave a <em>sticky note.</em></h2></div>
                <form className="whiteboard-compose" onSubmit={(event) => { event.preventDefault(); addWhiteboardNote(); }}>
                  <label htmlFor="whiteboard-note">YOUR NOTE</label>
                  <textarea id="whiteboard-note" value={whiteboardDraft} onChange={(event) => setWhiteboardDraft(event.target.value)} placeholder="What should Sujay build, fix, or remember?" maxLength={240} />
                  <div><button type="submit" className="whiteboard-add">+ ADD STICKY</button><button type="button" className="whiteboard-reset" onClick={() => setWhiteboardNotes([])} disabled={whiteboardNotes.length === 0}>CLEAR BOARD</button></div>
                </form>
              </div>
              <section className="whiteboard-canvas" aria-label="Your saved sticky notes">
                {whiteboardNotes.length === 0 ? <p className="whiteboard-empty">YOUR IDEAS WILL APPEAR HERE.</p> : whiteboardNotes.map((note) => <article className={`whiteboard-sticky is-${note.tone}`} key={note.id}><button type="button" onClick={() => setWhiteboardNotes((notes) => notes.filter((entry) => entry.id !== note.id))} aria-label="Remove sticky note">×</button><p>{note.text}</p><small>CLICK × TO CLEAR</small></article>)}
              </section>
            </div>
          </DraggableWindow>
        </div>
      )}

      {calendarOpen && (
        <div className="modal-scrim" role="presentation" onMouseDown={() => setCalendarOpen(false)}>
          <DraggableWindow title="CALENDAR / SCHEDULE.APP" onClose={() => setCalendarOpen(false)} initialWidth={980} initialHeight={610} className="calendar-window">
            <div className="calendar-body" onMouseDown={(event) => event.stopPropagation()}>
              <section className="calendar-month-panel">
                <div className="calendar-panel-kicker"><span>SUJAY OS / CALENDAR</span><small>WORK SESSIONS + PLANNING</small></div>
                <Calendar mode="single" selected={calendarDate} onSelect={setCalendarDate} defaultMonth={calendarDate} className="sujay-calendar" />
              </section>
              <aside className="calendar-booking-panel">
                <div className="booking-strip">BOOK TIME</div>
                <p className="eyebrow">SELECTED SESSION</p>
                <h2>30 minutes<br />with Sujay</h2>
                <p>Use this desk to send a project brief, propose a time, and open a direct conversation with Sujay.</p>
                <div className="booking-date"><CalendarDays size={16} /><span>{selectedBookingDate}</span></div>
                <a className="calendar-book-button" href={bookingMailto}><Mail size={16} /> REQUEST A TIME <ArrowUpRight size={14} /></a>
                <small>OPENS A DRAFT TO SUJAYKARKERA5@GMAIL.COM</small>
              </aside>
            </div>
          </DraggableWindow>
        </div>
      )}

      {preferencesOpen && (
        <div className="modal-scrim" role="presentation" onMouseDown={() => setPreferencesOpen(false)}>
          <DraggableWindow title="OS PREFERENCES / DISPLAY" onClose={() => setPreferencesOpen(false)} initialWidth={570} initialHeight={620}>
            <div className="preferences-body" onMouseDown={(event) => event.stopPropagation()}>
              <p className="eyebrow">SYSTEM SETTINGS / QUICK-LAUNCH</p>
              <h2>Toolbar visibility</h2>
              <p>Choose how the quick-launch shelf behaves while you explore Sujay Karkera OS. Your choice is remembered on this device.</p>
              <div className="preference-options" role="radiogroup" aria-label="Quick-launch visibility">
                <button type="button" role="radio" aria-checked={toolbarMode === "always-visible"} className={toolbarMode === "always-visible" ? "is-selected" : ""} onClick={() => setToolbarMode("always-visible")}>
                  <span className="preference-indicator" aria-hidden="true"><CheckCircle2 size={16} /></span>
                  <span><b>Always visible</b><small>Keep the quick-launch shelf fully open on the desktop.</small></span>
                </button>
                <button type="button" role="radio" aria-checked={toolbarMode === "auto-hide"} className={toolbarMode === "auto-hide" ? "is-selected" : ""} onClick={() => setToolbarMode("auto-hide")}>
                  <span className="preference-indicator" aria-hidden="true"><CheckCircle2 size={16} /></span>
                  <span><b>Reveal at bottom edge</b><small>Keep the shelf hidden until the pointer reaches the bottom of the desktop.</small></span>
                </button>
              </div>
              <div className="preference-status"><Settings2 size={15} /><span>ACTIVE MODE: <b>{toolbarMode === "always-visible" ? "ALWAYS VISIBLE" : "REVEAL AT BOTTOM EDGE"}</b></span></div>
              <section className="music-preferences" aria-labelledby="music-preferences-title">
                <div><p className="eyebrow">MUSIC DECK / LOCAL PICKS</p><h3 id="music-preferences-title">Favorite tracks</h3><p>Save the tracks you want to keep close. Favorites remain on this device.</p></div>
                <div className="favorite-track-list">
                  {NOW_PLAYING_TRACKS.map((track) => {
                    const isFavorite = favoriteTrackIds.includes(track.id);
                    return <button key={track.id} type="button" role="checkbox" aria-checked={isFavorite} className={isFavorite ? "is-favorite" : ""} onClick={() => toggleFavoriteTrack(track.id)}><span><b>{track.title}</b><small>{track.artist}</small></span><PixelGlyph glyph="heart" /></button>;
                  })}
                </div>
              </section>
            </div>
          </DraggableWindow>
        </div>
      )}

      {searchOpen && (
        <div className="modal-scrim" role="presentation" onMouseDown={() => setSearchOpen(false)}>
          <section className="search-window" role="dialog" aria-modal="true" aria-label="Search the Sujay Karkera OS" onMouseDown={(event) => event.stopPropagation()}>
            <div className="window-titlebar"><span>COMMAND SEARCH</span><button type="button" onClick={() => setSearchOpen(false)} aria-label="Close search">×</button></div>
            <div className="search-body"><label><Search size={16} /><input autoFocus placeholder="Find an app..." /></label><div className="search-list">{apps.filter((app) => ["work", "casefiles", "about", "notes", "contact"].includes(app.key)).map((app) => <button type="button" key={app.id} onClick={() => openDesktopApp(app)}><DesktopPixelIcon sprite={app.sprite} /><span>{app.title}</span><small>{app.subtitle}</small></button>)}</div></div>
          </section>
        </div>
      )}
    </main>
  );
}
