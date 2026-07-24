// MagicCursor.jsx
// A drop-in React component that adds a "magic" particle trail to your cursor.
// Five moods included: leaves, dust, stars, fireflies, and Ghibli-style soot sprites
// (soot sprites are special: instead of following the cursor, they scatter AWAY from it).
//
// HOW TO USE:
//   import MagicCursor from "./MagicCursor";
//   <MagicCursor mode="fireflies" />   // put it once, near the root of your app
//
// It renders a full-screen, click-through canvas layered on top of your page.
// It does NOT block clicks or scrolling (pointer-events: none).

import React, { useEffect, useRef } from "react";

// ---- Tunable presets for each mood ------------------------------------
// Each preset tells the particle system how to spawn, move, and fade.
const PRESETS = {
  leaves: {
    color: () => `hsl(${25 + Math.random() * 40}, 65%, ${40 + Math.random() * 15}%)`, // autumn oranges/browns
    size: () => 6 + Math.random() * 6,
    spawnPerMove: 1,       // how many particles spawn per mouse-move event
    gravity: 0.03,         // gentle downward pull
    drag: 0.995,           // slows velocity over time (air resistance)
    sway: 0.02,            // side-to-side swaying as they fall
    life: 90,              // frames before fully faded
    behavior: "fall",
  },
  dust: {
    color: () => `rgba(255,255,255,${0.15 + Math.random() * 0.2})`,
    size: () => 1 + Math.random() * 2,
    spawnPerMove: 2,
    gravity: -0.002,       // dust drifts up ever so slightly
    drag: 0.98,
    sway: 0.01,
    life: 70,
    behavior: "float",
  },
  stars: {
    color: () => `hsl(${45 + Math.random() * 20}, 90%, 75%)`, // warm gold/white
    size: () => 1.5 + Math.random() * 2.5,
    spawnPerMove: 2,
    gravity: 0,
    drag: 0.99,
    sway: 0,
    life: 60,
    behavior: "twinkle",
  },
  fireflies: {
    color: () => `hsl(${55 + Math.random() * 20}, 100%, 65%)`, // yellow-green glow
    size: () => 2 + Math.random() * 2,
    spawnPerMove: 1,
    gravity: 0,
    drag: 0.96,
    sway: 0.08,             // lots of wandering wobble
    life: 120,
    behavior: "wander",
  },
  sootSprites: {
    color: () => "#1a1a1a",
    size: () => 5 + Math.random() * 3,
    spawnPerMove: 1,
    gravity: 0,
    drag: 0.9,
    sway: 0,
    life: 100,
    behavior: "flee",        // these run AWAY from the cursor instead of trailing it
  },
};

export default function MagicCursor({ mode = "fireflies", maxParticles = 150 }) {
  // canvasRef points at the actual <canvas> DOM element so we can draw on it
  const canvasRef = useRef(null);
  // particlesRef holds the live particle array. We use a ref (not state) because
  // this array changes every animation frame - putting it in React state would
  // cause a re-render 60 times a second, which would be very slow.
  const particlesRef = useRef([]);
  // mouseRef tracks the latest cursor position without triggering re-renders
  const mouseRef = useRef({ x: -9999, y: -9999 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const preset = PRESETS[mode] || PRESETS.fireflies;

    // Make the canvas always match the current window size
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // --- Spawn a new particle at (or near) the cursor ---
    const spawnParticle = (x, y) => {
      particlesRef.current.push({
        x: x + (Math.random() - 0.5) * 20, // slight random offset so they don't stack perfectly
        y: y + (Math.random() - 0.5) * 20,
        vx: (Math.random() - 0.5) * 1.5,   // random starting horizontal speed
        vy: (Math.random() - 0.5) * 1.5,   // random starting vertical speed
        size: preset.size(),
        color: preset.color(),
        age: 0,
        life: preset.life,
        angle: Math.random() * Math.PI * 2, // used for sway/twinkle/wobble math
      });
      // Keep the array from growing forever - drop the oldest particles first
      if (particlesRef.current.length > maxParticles) {
        particlesRef.current.splice(0, particlesRef.current.length - maxParticles);
      }
    };

    // --- Mouse move handler: update position + spawn new particles ---
    const handleMove = (e) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      for (let i = 0; i < preset.spawnPerMove; i++) {
        spawnParticle(e.clientX, e.clientY);
      }
    };
    window.addEventListener("mousemove", handleMove);

    // --- The animation loop: runs every frame (~60 times per second) ---
    let animationId;
    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach((p) => {
        p.age++;
        p.angle += 0.05;

        // Movement rules differ per mood:
        if (preset.behavior === "fall") {
          // Leaves: drift down, swaying side to side like a falling leaf
          p.vy += preset.gravity;
          p.vx += Math.sin(p.angle) * preset.sway * 0.1;
        } else if (preset.behavior === "float") {
          // Dust: barely moves, gentle upward drift
          p.vy += preset.gravity;
        } else if (preset.behavior === "twinkle") {
          // Stars: mostly stay put, just fade in/out (movement is minimal)
          p.vx *= 0.9;
          p.vy *= 0.9;
        } else if (preset.behavior === "wander") {
          // Fireflies: wobble around randomly, like they're exploring
          p.vx += Math.cos(p.angle) * preset.sway * 0.3;
          p.vy += Math.sin(p.angle * 1.3) * preset.sway * 0.3;
        } else if (preset.behavior === "flee") {
          // Soot sprites: push directly away from the current cursor position
          const dx = p.x - mouseRef.current.x;
          const dy = p.y - mouseRef.current.y;
          const dist = Math.max(Math.hypot(dx, dy), 1); // avoid divide-by-zero
          const fleeStrength = Math.max(0, 3 - dist / 40); // stronger push when cursor is close
          p.vx += (dx / dist) * fleeStrength;
          p.vy += (dy / dist) * fleeStrength;
        }

        // Apply velocity + drag (drag = friction, slows things down over time)
        p.vx *= preset.drag;
        p.vy *= preset.drag;
        p.x += p.vx;
        p.y += p.vy;

        // --- Draw the particle ---
        const lifeRatio = 1 - p.age / p.life; // 1 = freshly spawned, 0 = about to disappear
        ctx.save();
        ctx.globalAlpha = Math.max(0, lifeRatio);

        if (preset.behavior === "twinkle") {
          // Stars pulse in size to look like they're sparkling
          const pulse = 0.6 + Math.sin(p.angle * 2) * 0.4;
          drawStar(ctx, p.x, p.y, p.size * pulse, p.color);
        } else if (mode === "fireflies") {
          // Fireflies get a soft glow behind the solid dot
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 12;
          drawDot(ctx, p.x, p.y, p.size, p.color);
        } else if (mode === "sootSprites") {
          drawSootSprite(ctx, p.x, p.y, p.size);
        } else {
          drawDot(ctx, p.x, p.y, p.size, p.color);
        }
        ctx.restore();
      });

      // Remove particles that have finished their lifespan
      particlesRef.current = particlesRef.current.filter((p) => p.age < p.life);

      animationId = requestAnimationFrame(tick);
    };
    tick();

    // Cleanup when the component unmounts or mode changes
    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMove);
      cancelAnimationFrame(animationId);
      particlesRef.current = [];
    };
  }, [mode, maxParticles]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none", // lets clicks/scrolls pass through to the page underneath
        zIndex: 9999,
      }}
    />
  );
}

// ---- Small drawing helpers -------------------------------------------

function drawDot(ctx, x, y, size, color) {
  ctx.beginPath();
  ctx.fillStyle = color;
  ctx.arc(x, y, size, 0, Math.PI * 2);
  ctx.fill();
}

function drawStar(ctx, x, y, size, color) {
  // Draws a simple 4-point sparkle (plus-shaped) rather than a circle
  ctx.strokeStyle = color;
  ctx.lineWidth = Math.max(1, size / 3);
  ctx.beginPath();
  ctx.moveTo(x - size, y);
  ctx.lineTo(x + size, y);
  ctx.moveTo(x, y - size);
  ctx.lineTo(x, y + size);
  ctx.stroke();
}

function drawSootSprite(ctx, x, y, size) {
  // Round black body
  ctx.beginPath();
  ctx.fillStyle = "#1a1a1a";
  ctx.arc(x, y, size, 0, Math.PI * 2);
  ctx.fill();
  // Two tiny white eyes so it reads as a "creature" fleeing from you
  ctx.fillStyle = "#fff";
  ctx.beginPath();
  ctx.arc(x - size * 0.35, y - size * 0.15, size * 0.22, 0, Math.PI * 2);
  ctx.arc(x + size * 0.35, y - size * 0.15, size * 0.22, 0, Math.PI * 2);
  ctx.fill();
}
