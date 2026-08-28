"use client";

import React, { useEffect, useRef, useCallback } from "react";

interface ParticleTextProps {
  text: string;
  particleSize?: number;
  density?: number;
  color?: string;
  highlightColor?: string;
  scatter?: number;
  gatherDuration?: number;
  stagger?: number;
  pointerRepel?: number;
  repelRadius?: number;
  idleDrift?: number;
  trigger?: "mount" | "hover";
  fontSize?: string;
  fontWeight?: number | string;
  fontFamily?: string;
  glow?: boolean;
  className?: string;
}

interface Particle {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  originX: number;
  originY: number;
  vx: number;
  vy: number;
  alpha: number;
  highlight: boolean;
  driftOffsetX: number;
  driftOffsetY: number;
  driftSpeed: number;
  driftPhase: number;
  delay: number;
  gathered: boolean;
  size: number;
}

export default function ParticleText({
  text,
  particleSize = 2.2,
  density = 4,
  color = "#f8fafc",
  highlightColor = "#14b8a6",
  scatter = 190,
  gatherDuration = 1600,
  stagger = 420,
  pointerRepel = 42,
  repelRadius = 120,
  idleDrift = 0.8,
  trigger = "mount",
  fontSize = "clamp(3.5rem, 13vw, 9rem)",
  fontWeight = 800,
  fontFamily = "inherit",
  glow = false,
  className = "",
}: ParticleTextProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef<{ x: number; y: number } | null>(null);
  const rafRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);
  const gatheredRef = useRef<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const sampleTextPixels = useCallback(
    (width: number, height: number): { x: number; y: number; isHighlight: boolean }[] => {
      const offscreen = document.createElement("canvas");
      offscreen.width = width;
      offscreen.height = height;
      const ctx = offscreen.getContext("2d");
      if (!ctx) return [];

      // Resolve font size (clamp CSS may not work on offscreen, estimate)
      let resolvedFontSize = fontSize;
      if (resolvedFontSize.startsWith("clamp")) {
        // Parse clamp(min, preferred, max) and use width-based calculation
        const vwMatch = resolvedFontSize.match(/([\d.]+)vw/);
        const maxMatch = resolvedFontSize.match(/([\d.]+)rem/);
        if (vwMatch) {
          const vwPx = (parseFloat(vwMatch[1]) / 100) * width;
          const maxPx = maxMatch ? parseFloat(maxMatch[1]) * 16 : 144;
          resolvedFontSize = `${Math.min(vwPx, maxPx)}px`;
        } else {
          resolvedFontSize = `${Math.min(Math.max(56, width * 0.13), 144)}px`;
        }
      }

      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "#ffffff";
      ctx.font = `${fontWeight} ${resolvedFontSize} ${fontFamily === "inherit" ? "system-ui, sans-serif" : fontFamily}`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(text, width / 2, height / 2);

      const imageData = ctx.getImageData(0, 0, width, height);
      const pixels: { x: number; y: number; isHighlight: boolean }[] = [];
      const step = Math.max(1, Math.round(density));

      for (let y = 0; y < height; y += step) {
        for (let x = 0; x < width; x += step) {
          const i = (y * width + x) * 4;
          if (imageData.data[i + 3] > 128) {
            pixels.push({
              x,
              y,
              isHighlight: Math.random() < 0.12,
            });
          }
        }
      }
      return pixels;
    },
    [text, density, fontSize, fontWeight, fontFamily]
  );

  const buildParticles = useCallback(
    (width: number, height: number) => {
      const pixels = sampleTextPixels(width, height);
      gatheredRef.current = false;
      startTimeRef.current = performance.now();

      particlesRef.current = pixels.map((p, i) => {
        const angle = Math.random() * Math.PI * 2;
        const dist = scatter * (0.5 + Math.random() * 0.5);
        return {
          x: p.x + Math.cos(angle) * dist,
          y: p.y + Math.sin(angle) * dist,
          targetX: p.x,
          targetY: p.y,
          originX: p.x + Math.cos(angle) * dist,
          originY: p.y + Math.sin(angle) * dist,
          vx: 0,
          vy: 0,
          alpha: 0,
          highlight: p.isHighlight,
          driftOffsetX: Math.random() * 2 - 1,
          driftOffsetY: Math.random() * 2 - 1,
          driftSpeed: 0.3 + Math.random() * 0.7,
          driftPhase: Math.random() * Math.PI * 2,
          delay: (i / pixels.length) * stagger,
          gathered: false,
          size: particleSize * (0.8 + Math.random() * 0.5),
        };
      });
    },
    [sampleTextPixels, scatter, stagger, particleSize]
  );

  const draw = useCallback(
    (timestamp: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const elapsed = timestamp - startTimeRef.current;
      const mouse = mouseRef.current;
      const t = timestamp * 0.001;

      particlesRef.current.forEach((p) => {
        const particleElapsed = elapsed - p.delay;
        if (particleElapsed < 0) return;

        const progress = Math.min(1, particleElapsed / gatherDuration);
        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);

        if (!p.gathered && progress >= 1) {
          p.gathered = true;
        }

        // Base position: lerp from origin to target
        let tx = p.originX + (p.targetX - p.originX) * eased;
        let ty = p.originY + (p.targetY - p.originY) * eased;

        // Once gathered, apply mouse repulsion + idle drift
        if (p.gathered || progress > 0.85) {
          // Idle drift
          const driftT = t * p.driftSpeed + p.driftPhase;
          const idleX = Math.sin(driftT) * idleDrift * p.driftOffsetX;
          const idleY = Math.cos(driftT * 1.3) * idleDrift * p.driftOffsetY;

          let repelX = 0;
          let repelY = 0;
          if (mouse) {
            const dx = tx - mouse.x;
            const dy = ty - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < repelRadius && dist > 0) {
              const force = ((repelRadius - dist) / repelRadius) * pointerRepel;
              repelX = (dx / dist) * force;
              repelY = (dy / dist) * force;
            }
          }

          p.vx += (repelX - p.vx) * 0.08;
          p.vy += (repelY - p.vy) * 0.08;

          tx = p.targetX + p.vx + idleX;
          ty = p.targetY + p.vy + idleY;
        }

        p.alpha = Math.min(1, progress * 2);

        const particleColor = p.highlight ? highlightColor : color;

        if (glow) {
          ctx.shadowBlur = p.highlight ? 12 : 4;
          ctx.shadowColor = p.highlight ? highlightColor : color;
        }

        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = particleColor;
        ctx.beginPath();
        ctx.arc(tx, ty, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      ctx.globalAlpha = 1;
      rafRef.current = requestAnimationFrame(draw);
    },
    [color, highlightColor, glow, gatherDuration, repelRadius, pointerRepel, idleDrift]
  );

  const startAnimation = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const { width, height } = canvas;
    buildParticles(width, height);
    startTimeRef.current = performance.now();
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(draw);
  }, [buildParticles, draw]);

  // Setup resize observer + initial build
  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const applySize = () => {
      // Use getBoundingClientRect for accurate post-layout size
      const rect = container.getBoundingClientRect();
      const w = Math.round(rect.width) || container.offsetWidth || 600;
      const h = Math.round(rect.height) || container.offsetHeight || 340;
      if (w > 0 && h > 0) {
        canvas.width = w;
        canvas.height = h;
        if (trigger === "mount") {
          startAnimation();
        }
      }
    };

    // Delay first read until after paint so layout is stable
    const rafId = requestAnimationFrame(() => {
      applySize();
    });

    const ro = new ResizeObserver(() => {
      requestAnimationFrame(applySize);
    });
    ro.observe(container);

    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, fontSize]);

  // Trigger on mount with generous delay
  useEffect(() => {
    if (trigger === "mount") {
      const timeout = setTimeout(() => startAnimation(), 200);
      return () => clearTimeout(timeout);
    }
  }, [trigger, startAnimation]);

  // Mouse tracking
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      mouseRef.current = {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY,
      };
    };

    const handleMouseLeave = () => {
      mouseRef.current = null;
    };

    const handleTouchMove = (e: TouchEvent) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      mouseRef.current = {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top) * scaleY,
      };
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);
    canvas.addEventListener("touchmove", handleTouchMove, { passive: true });
    canvas.addEventListener("touchend", handleMouseLeave);

    return () => {
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
      canvas.removeEventListener("touchmove", handleTouchMove);
      canvas.removeEventListener("touchend", handleMouseLeave);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full ${className}`}
      style={{ userSelect: "none", minHeight: "100%" }}
    >
      <canvas
        ref={canvasRef}
        style={{ display: "block", width: "100%", height: "100%" }}
        aria-label={text}
        role="img"
      />
    </div>
  );
}
