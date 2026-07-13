"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Ocean Creatures Game — big fish eats small fish + more.
 *
 * The player's fish follows the mouse cursor. Various ocean creatures
 * spawn and swim/drift around the screen:
 *
 *   Fish:
 *     - Small  (size 8-14,  +1,  35% spawn)
 *     - Medium (size 16-24, +3,  18% spawn)
 *     - Big    (size 28-40, +5,  8%  spawn)
 *
 *   Creatures:
 *     - Shrimp    (tiny, fast, +2,  15% spawn) — hard to catch
 *     - Clam      (very slow, +1,   8%  spawn) — hides in shell
 *     - Jellyfish (drifts, stings, +4, 10% spawn) — BOOM if you're small
 *     - Octopus   (slow, +8,        6%  spawn) — ink spray when eaten
 *
 * Eat creatures smaller than you to grow. Touch a creature bigger
 * than you → BOOM! Reset to default.
 *
 * Hidden on touch devices.
 */

type Vec = { x: number; y: number };

type CreatureKind = "fish-small" | "fish-medium" | "fish-big" | "shrimp" | "clam" | "jellyfish" | "octopus";

type Creature = {
  pos: Vec;
  vel: Vec;
  size: number;
  color: string;
  born: number;
  wiggle: number;
  kind: CreatureKind;
  points: number;
  // creature-specific
  hiding?: boolean;
  hideTimer?: number;
  inkSprayed?: boolean;
  stung?: boolean;
};

type Particle = {
  pos: Vec;
  vel: Vec;
  size: number;
  color: string;
  life: number;
  maxLife: number;
};

type ScorePopup = {
  x: number;
  y: number;
  born: number;
  text: string;
  color: string;
};

type Boom = {
  x: number;
  y: number;
  born: number;
};

const PLAYER_BASE_SIZE = 26;
const PLAYER_MAX_SIZE = 80;
const EAT_RADIUS_FACTOR = 0.5;
const SPAWN_INTERVAL = 750;
const MAX_CREATURES = 22;
const POPUP_DURATION = 1400;
const BOOM_DURATION = 1000;

const KIND_CONFIG: Record<
  CreatureKind,
  { sizeRange: [number, number]; points: number; spawnWeight: number; colors: string[] }
> = {
  "fish-small": {
    sizeRange: [8, 14], points: 1, spawnWeight: 35,
    colors: ["#ff6b6b", "#ffd93d", "#6bcf7f", "#ff9f43", "#48dbfb"],
  },
  "fish-medium": {
    sizeRange: [16, 24], points: 3, spawnWeight: 18,
    colors: ["#ee5a6f", "#feca57", "#ff6348", "#a29bfe", "#fd79a8"],
  },
  "fish-big": {
    sizeRange: [28, 40], points: 5, spawnWeight: 8,
    colors: ["#6c5ce7", "#e17055", "#00cec9", "#0984e3", "#e84393"],
  },
  shrimp: {
    sizeRange: [6, 10], points: 2, spawnWeight: 15,
    colors: ["#ff9f43", "#ff6b6b", "#ee5a6f", "#feca57"],
  },
  clam: {
    sizeRange: [10, 16], points: 1, spawnWeight: 8,
    colors: ["#dfe6e9", "#b2bec3", "#dfe4ea", "#a5b1c2"],
  },
  jellyfish: {
    sizeRange: [18, 28], points: 4, spawnWeight: 10,
    colors: ["#a29bfe", "#fd79a8", "#74b9ff", "#e17055"],
  },
  octopus: {
    sizeRange: [22, 34], points: 8, spawnWeight: 6,
    colors: ["#6c5ce7", "#e84393", "#0984e3", "#e17055"],
  },
};

const KIND_ORDER: CreatureKind[] = [
  "fish-small", "fish-medium", "fish-big",
  "shrimp", "clam", "jellyfish", "octopus",
];

function pickKind(): CreatureKind {
  const total = KIND_ORDER.reduce((s, k) => s + KIND_CONFIG[k].spawnWeight, 0);
  let r = Math.random() * total;
  for (const k of KIND_ORDER) {
    r -= KIND_CONFIG[k].spawnWeight;
    if (r <= 0) return k;
  }
  return "fish-small";
}

function growthFor(kind: CreatureKind): number {
  switch (kind) {
    case "fish-small": return 1.2;
    case "fish-medium": return 3;
    case "fish-big": return 6;
    case "shrimp": return 1.5;
    case "clam": return 1;
    case "jellyfish": return 4;
    case "octopus": return 8;
  }
}

export function FishCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scoreRef = useRef<HTMLDivElement>(null);
  const sizeRef = useRef<HTMLDivElement>(null);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const scoreEl = scoreRef.current;
    const sizeEl = sizeRef.current;
    if (!canvas) return;
    if (window.matchMedia("(max-width: 768px)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;
    const g = ctx;
    const cv = canvas;

    let width = 0;
    let height = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let rafId = 0;

    let mouseX = window.innerWidth * 0.5;
    let mouseY = window.innerHeight * 0.5;
    let playerX = mouseX;
    let playerY = mouseY;
    let prevX = playerX;
    let prevY = playerY;
    let playerAngle = 0;
    let playerSize = PLAYER_BASE_SIZE;
    let wagPhase = 0;
    let scoreVal = 0;
    let lastSpawn = 0;
    let hurtFlash = 0;
    let boomActive: Boom | null = null;
    let stungTimer = 0;

    const creatures: Creature[] = [];
    const particles: Particle[] = [];
    const popups: ScorePopup[] = [];

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      cv.width = width * dpr;
      cv.height = height * dpr;
      cv.style.width = `${width}px`;
      cv.style.height = `${height}px`;
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function onMove(e: MouseEvent) {
      mouseX = e.clientX;
      mouseY = e.clientY;
    }

    function onLeave() {
      mouseX = -9999;
      mouseY = -9999;
    }

    function spawnCreature() {
      if (creatures.length >= MAX_CREATURES) return;
      const kind = pickKind();
      const cfg = KIND_CONFIG[kind];
      const size = cfg.sizeRange[0] + Math.random() * (cfg.sizeRange[1] - cfg.sizeRange[0]);
      const color = cfg.colors[Math.floor(Math.random() * cfg.colors.length)];

      const edge = Math.floor(Math.random() * 4);
      let x: number, y: number, vx: number, vy: number;

      // Speed depends on creature type
      let speedMul = 1;
      if (kind === "shrimp") speedMul = 2.5;       // fast
      else if (kind === "clam") speedMul = 0.2;     // very slow
      else if (kind === "jellyfish") speedMul = 0.3; // drifts
      else if (kind === "octopus") speedMul = 0.4;   // slow
      else if (kind === "fish-big") speedMul = 0.6;

      const speed = (0.4 + Math.random() * 0.8) * speedMul;

      switch (edge) {
        case 0: x = Math.random() * width; y = -40; vx = (Math.random() - 0.5) * speed; vy = speed; break;
        case 1: x = width + 40; y = Math.random() * height; vx = -speed; vy = (Math.random() - 0.5) * speed; break;
        case 2: x = Math.random() * width; y = height + 40; vx = (Math.random() - 0.5) * speed; vy = -speed; break;
        default: x = -40; y = Math.random() * height; vx = speed; vy = (Math.random() - 0.5) * speed; break;
      }

      // Jellyfish drifts mostly vertically
      if (kind === "jellyfish") {
        vx = (Math.random() - 0.5) * 0.3;
        vy = Math.random() > 0.5 ? speed : -speed;
      }

      creatures.push({
        pos: { x, y },
        vel: { x: vx, y: vy },
        size, color, kind,
        born: performance.now(),
        wiggle: Math.random() * Math.PI * 2,
        points: cfg.points,
        hiding: false,
        hideTimer: 0,
        inkSprayed: false,
        stung: false,
      });
    }

    function eatCreature(c: Creature, now: number) {
      scoreVal += c.points;
      setScore(scoreVal);
      if (scoreEl) scoreEl.textContent = `${scoreVal}`;

      const growth = growthFor(c.kind);
      playerSize = Math.min(playerSize + growth, PLAYER_MAX_SIZE);
      updateSizeDisplay();

      // Particle burst
      const count = c.kind === "octopus" ? 25 : c.kind === "fish-big" ? 20 : c.kind === "jellyfish" ? 18 : 12;
      for (let i = 0; i < count; i++) {
        const a = (Math.PI * 2 * i) / count + Math.random() * 0.5;
        const sp = 2 + Math.random() * 5;
        particles.push({
          pos: { x: c.pos.x, y: c.pos.y },
          vel: { x: Math.cos(a) * sp, y: Math.sin(a) * sp },
          size: 2 + Math.random() * 4,
          color: c.color,
          life: 0,
          maxLife: 500 + Math.random() * 400,
        });
      }

      // Octopus: ink spray
      if (c.kind === "octopus" && !c.inkSprayed) {
        c.inkSprayed = true;
        for (let i = 0; i < 30; i++) {
          const a = Math.random() * Math.PI * 2;
          const sp = 1 + Math.random() * 3;
          particles.push({
            pos: { x: c.pos.x, y: c.pos.y },
            vel: { x: Math.cos(a) * sp, y: Math.sin(a) * sp },
            size: 4 + Math.random() * 8,
            color: "rgba(20, 20, 40, 0.6)",
            life: 0,
            maxLife: 800 + Math.random() * 400,
          });
        }
      }

      // Score popup
      const popupColors: Record<CreatureKind, string> = {
        "fish-small": "#8ed8ff",
        "fish-medium": "#feca57",
        "fish-big": "#ffd93d",
        shrimp: "#ff9f43",
        clam: "#dfe6e9",
        jellyfish: "#a29bfe",
        octopus: "#e84393",
      };
      popups.push({
        x: c.pos.x, y: c.pos.y, born: now,
        text: `+${c.points}`,
        color: popupColors[c.kind],
      });
    }

    function triggerBoom(c: Creature, now: number) {
      const lostScore = scoreVal;
      scoreVal = 0;
      setScore(0);
      if (scoreEl) scoreEl.textContent = "0";
      playerSize = PLAYER_BASE_SIZE;
      updateSizeDisplay();
      hurtFlash = 1;

      boomActive = { x: playerX, y: playerY, born: now };

      const count = 40;
      for (let i = 0; i < count; i++) {
        const a = (Math.PI * 2 * i) / count + Math.random() * 0.3;
        const sp = 4 + Math.random() * 10;
        const colors = ["#ff4757", "#ff6b6b", "#ffa502", "#ffd93d", "#ff7f50"];
        particles.push({
          pos: { x: playerX, y: playerY },
          vel: { x: Math.cos(a) * sp, y: Math.sin(a) * sp },
          size: 3 + Math.random() * 6,
          color: colors[Math.floor(Math.random() * colors.length)],
          life: 0,
          maxLife: 700 + Math.random() * 500,
        });
      }

      popups.push({ x: playerX, y: playerY - 40, born: now, text: "BOOM!", color: "#ff4757" });
      if (lostScore > 0) {
        popups.push({ x: playerX, y: playerY - 10, born: now + 200, text: `-${lostScore}`, color: "#ff4757" });
      }
    }

    function stingPlayer(c: Creature, now: number) {
      // Jellyfish sting — temporary stun + small score loss
      stungTimer = 60; // frames of stun
      hurtFlash = 0.6;
      const loss = Math.min(scoreVal, 3);
      scoreVal = Math.max(0, scoreVal - loss);
      setScore(scoreVal);
      if (scoreEl) scoreEl.textContent = `${scoreVal}`;

      for (let i = 0; i < 15; i++) {
        const a = Math.random() * Math.PI * 2;
        const sp = 2 + Math.random() * 4;
        particles.push({
          pos: { x: playerX, y: playerY },
          vel: { x: Math.cos(a) * sp, y: Math.sin(a) * sp },
          size: 2 + Math.random() * 3,
          color: c.color,
          life: 0,
          maxLife: 500,
        });
      }

      if (loss > 0) {
        popups.push({ x: playerX, y: playerY - 25, born: now, text: `STUNG -${loss}`, color: "#a29bfe" });
      } else {
        popups.push({ x: playerX, y: playerY - 25, born: now, text: "STUNG!", color: "#a29bfe" });
      }
    }

    function updateSizeDisplay() {
      if (!sizeEl) return;
      const level =
        playerSize >= 55 ? "BIG" : playerSize >= 40 ? "MEDIUM" : playerSize >= 30 ? "SMALL" : "TINY";
      sizeEl.textContent = level;
    }

    // ---- Drawing functions for each creature type ----

    function drawFish(c: Creature, now: number): boolean {
      const elapsed = now - c.born;
      c.wiggle += 0.08;
      const wiggle = Math.sin(c.wiggle) * 0.12;

      if (Math.random() < 0.008) {
        c.vel.x += (Math.random() - 0.5) * 0.25;
        c.vel.y += (Math.random() - 0.5) * 0.25;
        const sp = Math.hypot(c.vel.x, c.vel.y);
        const maxSp = c.kind === "fish-big" ? 1.2 : 2;
        if (sp > maxSp) { c.vel.x = (c.vel.x / sp) * maxSp; c.vel.y = (c.vel.y / sp) * maxSp; }
      }

      c.pos.x += c.vel.x;
      c.pos.y += c.vel.y;

      if (c.pos.x < -120 || c.pos.x > width + 120 || c.pos.y < -120 || c.pos.y > height + 120) return false;

      const angle = Math.atan2(c.vel.y, c.vel.x);
      const s = c.size;
      const fade = Math.min(1, elapsed / 400);
      const isBig = c.kind === "fish-big" || c.kind === "fish-medium";

      g.save();
      g.translate(c.pos.x, c.pos.y);
      g.rotate(angle + wiggle);
      g.globalAlpha = fade;

      // Tail
      g.fillStyle = c.color;
      g.globalAlpha = fade * 0.7;
      g.beginPath();
      g.moveTo(-s * 0.8, 0); g.lineTo(-s * 1.5, -s * 0.55); g.lineTo(-s * 1.25, 0); g.lineTo(-s * 1.5, s * 0.55);
      g.closePath(); g.fill();
      g.globalAlpha = fade;

      // Body
      g.fillStyle = c.color;
      g.beginPath(); g.ellipse(0, 0, s, s * 0.55, 0, 0, Math.PI * 2); g.fill();

      // Belly
      g.fillStyle = "rgba(255,255,255,0.25)";
      g.beginPath(); g.ellipse(0, s * 0.15, s * 0.7, s * 0.3, 0, 0, Math.PI * 2); g.fill();

      // Dorsal fin for medium/big
      if (isBig) {
        g.fillStyle = c.color; g.globalAlpha = fade * 0.6;
        g.beginPath(); g.moveTo(-s * 0.2, -s * 0.45); g.lineTo(0, -s * 0.8); g.lineTo(s * 0.2, -s * 0.45);
        g.closePath(); g.fill(); g.globalAlpha = fade;
      }

      // Eye
      g.fillStyle = "#000";
      g.beginPath(); g.arc(s * 0.5, -s * 0.15, s * 0.13, 0, Math.PI * 2); g.fill();
      g.fillStyle = "#fff";
      g.beginPath(); g.arc(s * 0.55, -s * 0.18, s * 0.06, 0, Math.PI * 2); g.fill();

      g.restore();
      return true;
    }

    function drawShrimp(c: Creature, now: number): boolean {
      const elapsed = now - c.born;
      c.wiggle += 0.2; // fast wiggle

      // Shrimp dart in short bursts
      if (Math.random() < 0.02) {
        const a = Math.random() * Math.PI * 2;
        c.vel.x = Math.cos(a) * 3;
        c.vel.y = Math.sin(a) * 3;
      }
      // Decay speed
      c.vel.x *= 0.97;
      c.vel.y *= 0.97;

      c.pos.x += c.vel.x;
      c.pos.y += c.vel.y;

      if (c.pos.x < -80 || c.pos.x > width + 80 || c.pos.y < -80 || c.pos.y > height + 80) return false;

      const angle = Math.atan2(c.vel.y, c.vel.x);
      const s = c.size;
      const fade = Math.min(1, elapsed / 300);

      g.save();
      g.translate(c.pos.x, c.pos.y);
      g.rotate(angle);
      g.globalAlpha = fade;

      // Curved tail segments
      g.strokeStyle = c.color;
      g.lineWidth = s * 0.4;
      g.lineCap = "round";
      g.beginPath();
      g.moveTo(-s * 1.2, 0);
      g.quadraticCurveTo(-s * 0.8, -s * 0.3, -s * 0.4, 0);
      g.quadraticCurveTo(-s * 0.2, s * 0.2, 0, 0);
      g.stroke();

      // Body
      g.fillStyle = c.color;
      g.beginPath();
      g.ellipse(0, 0, s * 0.8, s * 0.4, 0, 0, Math.PI * 2);
      g.fill();

      // Antennae
      g.strokeStyle = c.color;
      g.lineWidth = 1;
      g.globalAlpha = fade * 0.6;
      g.beginPath();
      g.moveTo(s * 0.5, -s * 0.1);
      g.lineTo(s * 1.5, -s * 0.5);
      g.moveTo(s * 0.5, s * 0.1);
      g.lineTo(s * 1.5, s * 0.5);
      g.stroke();
      g.globalAlpha = fade;

      // Eye
      g.fillStyle = "#000";
      g.beginPath(); g.arc(s * 0.4, -s * 0.1, s * 0.12, 0, Math.PI * 2); g.fill();

      g.restore();
      return true;
    }

    function drawClam(c: Creature, now: number): boolean {
      const elapsed = now - c.born;

      // Very slow movement
      c.vel.x *= 0.99;
      c.vel.y *= 0.99;
      c.pos.x += c.vel.x;
      c.pos.y += c.vel.y;

      // Check if player is near → hide
      const dx = c.pos.x - playerX;
      const dy = c.pos.y - playerY;
      const distToPlayer = Math.hypot(dx, dy);
      if (distToPlayer < 80 && !c.hiding) {
        c.hiding = true;
        c.hideTimer = now + 2000;
      }
      if (c.hiding && now > (c.hideTimer ?? 0)) {
        c.hiding = false;
      }

      if (c.pos.x < -80 || c.pos.x > width + 80 || c.pos.y < -80 || c.pos.y > height + 80) return false;

      const s = c.size;
      const fade = Math.min(1, elapsed / 400);

      g.save();
      g.translate(c.pos.x, c.pos.y);
      g.globalAlpha = fade;

      if (c.hiding) {
        // Closed shell
        g.fillStyle = c.color;
        g.beginPath();
        g.ellipse(0, 0, s * 0.7, s * 0.6, 0, 0, Math.PI * 2);
        g.fill();
        // Shell ridges
        g.strokeStyle = "rgba(0,0,0,0.2)";
        g.lineWidth = 1.5;
        for (let i = -2; i <= 2; i++) {
          g.beginPath();
          g.ellipse(0, 0, s * 0.7, s * 0.15, 0, Math.PI * i * 0.3, Math.PI * i * 0.3 + 0.5);
          g.stroke();
        }
      } else {
        // Open shell with pearl inside
        // Bottom shell
        g.fillStyle = c.color;
        g.beginPath();
        g.ellipse(0, s * 0.1, s * 0.8, s * 0.4, 0, 0, Math.PI);
        g.fill();
        // Top shell
        g.beginPath();
        g.ellipse(0, -s * 0.1, s * 0.8, s * 0.4, 0, Math.PI, Math.PI * 2);
        g.fill();
        // Pearl
        g.fillStyle = "#ffffff";
        g.beginPath();
        g.arc(0, 0, s * 0.2, 0, Math.PI * 2);
        g.fill();
        g.fillStyle = "rgba(200,220,255,0.5)";
        g.beginPath();
        g.arc(-s * 0.05, -s * 0.05, s * 0.08, 0, Math.PI * 2);
        g.fill();
      }

      g.restore();
      return true;
    }

    function drawJellyfish(c: Creature, now: number): boolean {
      const elapsed = now - c.born;
      c.wiggle += 0.05;

      // Drift movement
      c.pos.x += c.vel.x + Math.sin(c.wiggle) * 0.3;
      c.pos.y += c.vel.y;

      if (c.pos.x < -100 || c.pos.x > width + 100 || c.pos.y < -100 || c.pos.y > height + 100) return false;

      const s = c.size;
      const fade = Math.min(1, elapsed / 500);
      const pulse = Math.sin(c.wiggle * 2) * 0.1;

      g.save();
      g.translate(c.pos.x, c.pos.y);
      g.globalAlpha = fade * 0.85;

      // Tentacles
      g.strokeStyle = c.color;
      g.lineWidth = 2;
      g.globalAlpha = fade * 0.5;
      for (let i = -3; i <= 3; i++) {
        const tx = i * s * 0.2;
        g.beginPath();
        g.moveTo(tx, s * 0.2);
        g.quadraticCurveTo(
          tx + Math.sin(c.wiggle + i) * s * 0.3,
          s * 0.8,
          tx + Math.sin(c.wiggle + i) * s * 0.5,
          s * 1.5,
        );
        g.stroke();
      }
      g.globalAlpha = fade * 0.85;

      // Bell (dome)
      const bellGrad = g.createRadialGradient(0, -s * 0.2, 0, 0, 0, s);
      bellGrad.addColorStop(0, c.color);
      bellGrad.addColorStop(1, "rgba(255,255,255,0.1)");
      g.fillStyle = bellGrad;
      g.beginPath();
      g.ellipse(0, 0, s * (0.8 + pulse), s * 0.6, 0, Math.PI, Math.PI * 2);
      g.fill();

      // Inner glow
      g.fillStyle = "rgba(255,255,255,0.2)";
      g.beginPath();
      g.ellipse(0, -s * 0.1, s * 0.4, s * 0.25, 0, 0, Math.PI * 2);
      g.fill();

      g.restore();
      return true;
    }

    function drawOctopus(c: Creature, now: number): boolean {
      const elapsed = now - c.born;
      c.wiggle += 0.06;

      // Slow movement
      if (Math.random() < 0.005) {
        c.vel.x += (Math.random() - 0.5) * 0.3;
        c.vel.y += (Math.random() - 0.5) * 0.3;
        const sp = Math.hypot(c.vel.x, c.vel.y);
        if (sp > 0.8) { c.vel.x = (c.vel.x / sp) * 0.8; c.vel.y = (c.vel.y / sp) * 0.8; }
      }
      c.pos.x += c.vel.x;
      c.pos.y += c.vel.y;

      if (c.pos.x < -120 || c.pos.x > width + 120 || c.pos.y < -120 || c.pos.y > height + 120) return false;

      const s = c.size;
      const fade = Math.min(1, elapsed / 500);

      g.save();
      g.translate(c.pos.x, c.pos.y);
      g.globalAlpha = fade;

      // Tentacles (8)
      g.strokeStyle = c.color;
      g.lineWidth = s * 0.18;
      g.lineCap = "round";
      g.globalAlpha = fade * 0.7;
      for (let i = 0; i < 8; i++) {
        const baseAngle = (Math.PI * 2 * i) / 8 + Math.PI / 8;
        const wiggleAmt = Math.sin(c.wiggle + i * 0.5) * 0.3;
        const a = baseAngle + wiggleAmt;
        g.beginPath();
        g.moveTo(Math.cos(baseAngle) * s * 0.4, Math.sin(baseAngle) * s * 0.4);
        g.quadraticCurveTo(
          Math.cos(a) * s * 0.8, Math.sin(a) * s * 0.8,
          Math.cos(a) * s * 1.3, Math.sin(a) * s * 1.3,
        );
        g.stroke();
      }
      g.globalAlpha = fade;

      // Head (bulb)
      const headGrad = g.createRadialGradient(0, -s * 0.2, 0, 0, 0, s * 0.6);
      headGrad.addColorStop(0, c.color);
      headGrad.addColorStop(1, "rgba(0,0,0,0.2)");
      g.fillStyle = headGrad;
      g.beginPath();
      g.ellipse(0, 0, s * 0.55, s * 0.6, 0, 0, Math.PI * 2);
      g.fill();

      // Eyes (big and expressive)
      g.fillStyle = "#fff";
      g.beginPath(); g.arc(-s * 0.18, -s * 0.1, s * 0.12, 0, Math.PI * 2); g.fill();
      g.beginPath(); g.arc(s * 0.18, -s * 0.1, s * 0.12, 0, Math.PI * 2); g.fill();
      g.fillStyle = "#000";
      g.beginPath(); g.arc(-s * 0.15, -s * 0.08, s * 0.06, 0, Math.PI * 2); g.fill();
      g.beginPath(); g.arc(s * 0.21, -s * 0.08, s * 0.06, 0, Math.PI * 2); g.fill();

      g.restore();
      return true;
    }

    function drawCreature(c: Creature, now: number): boolean {
      switch (c.kind) {
        case "fish-small":
        case "fish-medium":
        case "fish-big":
          return drawFish(c, now);
        case "shrimp":
          return drawShrimp(c, now);
        case "clam":
          return drawClam(c, now);
        case "jellyfish":
          return drawJellyfish(c, now);
        case "octopus":
          return drawOctopus(c, now);
      }
    }

    function drawPlayerFish() {
      if (playerX === 0) { playerX = mouseX; playerY = mouseY; }
      prevX = playerX; prevY = playerY;

      // If stung, movement is sluggish
      const lerp = stungTimer > 0 ? 0.02 : 0.06;
      playerX += (mouseX - playerX) * lerp;
      playerY += (mouseY - playerY) * lerp;

      const dx = playerX - prevX;
      const dy = playerY - prevY;
      const speed = Math.hypot(dx, dy);
      const targetAngle = Math.atan2(dy, dx);

      let angleDiff = targetAngle - playerAngle;
      while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
      while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
      playerAngle += angleDiff * 0.12;

      wagPhase += 0.08 + Math.min(speed * 0.04, 0.25);
      const wag = Math.sin(wagPhase) * (8 + Math.min(speed * 0.8, 20));

      const s = playerSize;
      const flash = hurtFlash;
      const stung = stungTimer > 0;

      g.save();
      g.translate(playerX, playerY);
      g.rotate(playerAngle);

      if (flash > 0) { g.shadowColor = "#ff4757"; g.shadowBlur = 20 * flash; }
      if (stung) { g.shadowColor = "#a29bfe"; g.shadowBlur = 15; }

      // Tail
      g.save();
      g.translate(-s * 0.9, 0);
      g.rotate((wag * Math.PI) / 180);
      g.fillStyle = flash > 0 ? "#ff6b6b" : stung ? "#a29bfe" : "#1c85f5";
      g.beginPath();
      g.moveTo(0, 0); g.lineTo(-s * 0.6, -s * 0.5); g.lineTo(-s * 0.4, 0); g.lineTo(-s * 0.6, s * 0.5);
      g.closePath(); g.fill();
      g.restore();

      // Body
      const bodyGrad = g.createLinearGradient(0, -s * 0.5, 0, s * 0.5);
      if (flash > 0) {
        bodyGrad.addColorStop(0, "#ff8e8e"); bodyGrad.addColorStop(0.5, "#ff4757"); bodyGrad.addColorStop(1, "#e0303f");
      } else if (stung) {
        bodyGrad.addColorStop(0, "#c8c8ff"); bodyGrad.addColorStop(0.5, "#a29bfe"); bodyGrad.addColorStop(1, "#6c5ce7");
      } else {
        bodyGrad.addColorStop(0, "#59c0ff"); bodyGrad.addColorStop(0.5, "#1c85f5"); bodyGrad.addColorStop(1, "#0f71e0");
      }
      g.fillStyle = bodyGrad;
      g.beginPath(); g.ellipse(0, 0, s, s * 0.5, 0, 0, Math.PI * 2); g.fill();

      // Fins
      g.fillStyle = flash > 0 ? "rgba(255,71,87,0.6)" : stung ? "rgba(162,155,254,0.6)" : "rgba(56,170,255,0.6)";
      g.beginPath(); g.moveTo(-s * 0.2, -s * 0.4); g.lineTo(0, -s * 0.75); g.lineTo(s * 0.2, -s * 0.4); g.closePath(); g.fill();
      g.fillStyle = flash > 0 ? "rgba(255,71,87,0.5)" : stung ? "rgba(162,155,254,0.5)" : "rgba(56,170,255,0.5)";
      g.beginPath(); g.moveTo(-s * 0.2, s * 0.4); g.lineTo(0, s * 0.75); g.lineTo(s * 0.2, s * 0.4); g.closePath(); g.fill();

      // Belly shine
      g.fillStyle = "rgba(255,255,255,0.15)";
      g.beginPath(); g.ellipse(0, -s * 0.15, s * 0.6, s * 0.15, 0, 0, Math.PI * 2); g.fill();

      // Eye
      g.fillStyle = "#04111f";
      g.beginPath(); g.arc(s * 0.55, -s * 0.18, s * 0.1, 0, Math.PI * 2); g.fill();
      g.fillStyle = "#fff";
      g.beginPath(); g.arc(s * 0.58, -s * 0.2, s * 0.04, 0, Math.PI * 2); g.fill();

      // Mouth
      g.fillStyle = "rgba(4,17,31,0.5)";
      g.beginPath(); g.arc(s * 0.92, s * 0.05, s * 0.08, 0, Math.PI * 2); g.fill();

      g.shadowBlur = 0;
      g.restore();

      hurtFlash = Math.max(0, hurtFlash - 0.04);
      if (stungTimer > 0) stungTimer--;
    }

    function drawParticles() {
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life += 16;
        if (p.life >= p.maxLife) { particles.splice(i, 1); continue; }
        p.pos.x += p.vel.x; p.pos.y += p.vel.y;
        p.vel.x *= 0.96; p.vel.y *= 0.96; p.vel.y += 0.1;
        g.fillStyle = p.color;
        g.globalAlpha = 1 - p.life / p.maxLife;
        g.beginPath(); g.arc(p.pos.x, p.pos.y, p.size, 0, Math.PI * 2); g.fill();
      }
      g.globalAlpha = 1;
    }

    function drawPopups(now: number) {
      for (let i = popups.length - 1; i >= 0; i--) {
        const p = popups[i];
        if (now < p.born) continue;
        const elapsed = now - p.born;
        if (elapsed > POPUP_DURATION) { popups.splice(i, 1); continue; }
        const t = elapsed / POPUP_DURATION;
        const alpha = 1 - t;
        const yOffset = -t * 45;
        const fontSize = p.text === "BOOM!" ? 28 : p.text.startsWith("STUNG") ? 16 : p.text === "+8" ? 24 : p.text === "+5" ? 22 : p.text === "+4" ? 20 : p.text === "+3" ? 18 : 16;
        g.font = `bold ${fontSize}px Inter, sans-serif`;
        g.fillStyle = p.color;
        g.globalAlpha = alpha;
        g.textAlign = "center";
        g.fillText(p.text, p.x, p.y + yOffset);
      }
      g.globalAlpha = 1; g.textAlign = "left";
    }

    function drawBoom(now: number) {
      if (!boomActive) return;
      const elapsed = now - boomActive.born;
      if (elapsed > BOOM_DURATION) { boomActive = null; return; }
      const t = elapsed / BOOM_DURATION;
      const radius = t * 120;
      const alpha = 1 - t;

      g.strokeStyle = `rgba(255, 71, 87, ${alpha * 0.8})`;
      g.lineWidth = 6 * (1 - t);
      g.beginPath(); g.arc(boomActive.x, boomActive.y, radius, 0, Math.PI * 2); g.stroke();

      const grad = g.createRadialGradient(boomActive.x, boomActive.y, 0, boomActive.x, boomActive.y, radius * 0.7);
      grad.addColorStop(0, `rgba(255, 213, 61, ${alpha * 0.4})`);
      grad.addColorStop(0.5, `rgba(255, 107, 107, ${alpha * 0.2})`);
      grad.addColorStop(1, "rgba(255, 71, 87, 0)");
      g.fillStyle = grad;
      g.beginPath(); g.arc(boomActive.x, boomActive.y, radius * 0.7, 0, Math.PI * 2); g.fill();
    }

    function checkCollisions(now: number) {
      const eatRadius = playerSize * EAT_RADIUS_FACTOR;
      for (let i = creatures.length - 1; i >= 0; i--) {
        const c = creatures[i];
        const dx = c.pos.x - playerX;
        const dy = c.pos.y - playerY;
        const dist = Math.hypot(dx, dy);
        const cRadius = c.size * 0.5;

        if (dist < eatRadius + cRadius) {
          // Clam that's hiding can't be eaten
          if (c.kind === "clam" && c.hiding) continue;

          if (c.size < playerSize * 0.85) {
            // Can eat
            if (c.kind === "jellyfish") {
              // Jellyfish stings even when eaten (if player is small enough to eat)
              eatCreature(c, now);
              stingPlayer(c, now);
            } else {
              eatCreature(c, now);
            }
            creatures.splice(i, 1);
          } else if (c.size > playerSize * 1.1) {
            // Bigger — BOOM or sting
            if (c.kind === "jellyfish") {
              // Jellyfish stings instead of boom
              stingPlayer(c, now);
              creatures.splice(i, 1);
            } else {
              triggerBoom(c, now);
              creatures.splice(i, 1);
            }
          }
        }
      }
    }

    function render() {
      g.clearRect(0, 0, width, height);
      const now = performance.now();

      if (now - lastSpawn > SPAWN_INTERVAL) {
        spawnCreature();
        lastSpawn = now;
      }

      for (let i = creatures.length - 1; i >= 0; i--) {
        if (!drawCreature(creatures[i], now)) {
          creatures.splice(i, 1);
        }
      }

      checkCollisions(now);
      drawPlayerFish();
      drawParticles();
      drawBoom(now);
      drawPopups(now);

      rafId = requestAnimationFrame(render);
    }

    resize();
    updateSizeDisplay();
    rafId = requestAnimationFrame(render);

    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <>
      <canvas ref={canvasRef} className="fish-game-canvas" aria-hidden />
      <div className="fish-game-score" aria-hidden>
        <div className="fish-game-score-row">
          <span className="fish-game-score-icon">🐟</span>
          <span ref={scoreRef}>{score}</span>
        </div>
        <div className="fish-game-size">
          <span className="fish-game-size-label">SIZE</span>
          <span ref={sizeRef}>TINY</span>
        </div>
      </div>
    </>
  );
}
