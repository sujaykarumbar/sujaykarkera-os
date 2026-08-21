# Sujay Karkera OS — Reference Ground-Truth Specification

## Reference

The user supplied **https://shreyasraj.com/** as the ground-truth visual and interaction reference. The implementation should recreate the reference's essential experience—a playful, highly tactile operating-system desktop used as a personal portfolio—while substituting original **Sujay Karkera** identity, copy, artwork, and interface details. Fidelity to the reference's warm pixel aesthetic, asymmetric icon field, atmospheric background, top system bar, desktop cards, notification windows, mobile dock, and exploratory interactions overrides generic landing-page conventions.

## Chosen Direction: Warm Pixel Desktop

### Design Movement

An original **16-bit pixel-art desktop / nostalgic webcore** interpretation: an explorable portfolio as a handcrafted personal operating system rather than a conventional marketing page.

### Core Principles

1. **Tactile computing:** every panel, icon, and label should look touchable, slightly printed, and intentionally outlined.
2. **Asymmetric exploration:** the desktop is a freeform field of app shortcuts rather than a centered card grid.
3. **Warm nostalgia:** pixels, dithering, paper-like UI surfaces, and status labels create a human, independent-maker feel.
4. **Functional delight:** the visual metaphor is meaningful—apps open lightweight windows, notes can be added, and status modules respond to interaction.

### Color Philosophy

The visual world starts with a **sunset terminal**: parchment cream gives text and panels a physical paper quality; peach, coral, and rose form the optimistic atmospheric backdrop; ink-burgundy makes UI outlines legible; acid lime acts as the unmistakable actionable signal. The palette should feel sun-warmed and analogue, not like a cool generic product dashboard.

### Layout Paradigm

Use a **full-viewport desktop canvas**. A fine pixel/dither layer rests over a large original sunset landscape, with navigation embedded in a compact system bar and apps scattered in a loose left-weighted field. An independent status card and portrait/avatar zone occupy the right side. On mobile, the canvas becomes a scrollable workspace with a persistent app dock.

### Signature Elements

1. **Pixel-window cards** with dark offset shadows and small system labels.
2. **Desktop shortcuts** that pair an illustrated icon with a paper label, microcopy, and hover lift.
3. **Acid-lime action affordances**—a bright sticky button, status dot, and selected states—against warm sunset tones.

### Interaction Philosophy

Clicks should feel like opening utilities on a private computer. Apps surface concise contextual windows rather than pretending to be pages that do not exist. Closed alerts stay closed; an added sticky becomes a physical part of the desktop; dark mode changes the ambient scene without changing the interface metaphor.

### Animation

Use only short, tactile motion: icon lift and nudge on hover (180ms), paper-window fade/translate entry (220ms), a slow cloud/sky drift only when reduced-motion is not requested, and a decisive 120ms button press. Animations must use transform and opacity, respect `prefers-reduced-motion`, and never obscure keyboard actions.

### Typography System

Use **IBM Plex Mono** for system labels, navigation, metadata, and controls; use **DM Serif Display** for the human, editorial quote and headline voice. Uppercase mono labels provide a computer-like rhythm; serif display text gives the desktop warmth and personality. Use tight tracking for labels and generous leading for editorial copy.

### Brand Essence

**Sujay Karkera OS is an interactive personal workspace for people who want to see how Sujay thinks, builds, and ships on the web.**

Personality: **inventive, grounded, playful**.

### Brand Voice

Headlines are concise, exploratory, and first-person; CTAs sound like operating-system commands rather than conversion copy. Avoid filler such as “Welcome” or “Get started.”

> “Open a project. See the thinking behind the pixels.”

> “Send a signal — I read the interesting ones.”

### Wordmark & Logo

The wordmark uses compact mono lettering, “SUJAY KARKERA OS,” paired with an original pixel-computer **S** emblem—an expressive miniature machine with a lime signal spark. It must never appear as a default-font text-only logo.

### Signature Brand Color

**Signal Lime — #C8F35A.** It is reserved for active states, calls to action, and small moments of energy.

## Style Decisions

1. **Founder Mode is an in-world avatar:** the supplied portrait always receives a restrained pixel-print, dither, CRT, or framed treatment so it belongs to the desktop rather than reading as an untouched cutout.
2. **Every primary shortcut needs a semantic pixel metaphor:** folders, case-file cards, notes, signal devices, browser or data tools must remain individually recognizable at desktop scale.
3. **Signal Lime stays scarce:** use it only for primary commands, active or selected controls, status sparks, and brief interaction cues; the warm peach, parchment, burgundy, and shadow palette carries the decorative atmosphere.
4. **Copy is personal-system language:** favor concise first-person, exploratory, command-like labels over generic portfolio terminology.
