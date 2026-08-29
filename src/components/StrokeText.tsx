"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";

interface StrokeTextProps {
  text: string;
  strokeColor?: string;
  fillColor?: string;
  strokeWidth?: number;
  drawDuration?: number;
  fillDelay?: number;
  stagger?: number;
  ease?: string;
  trigger?: "mount" | "hover";
  fillMode?: "wipe" | "fade";
  fontSize?: number;
  fontWeight?: number | string;
  letterSpacing?: number;
  reverse?: boolean;
  repeat?: boolean;
  repeatDelay?: number;
  className?: string;
}

interface CharData {
  char: string;
  x: number;
  width: number;
}

// Map GSAP-style ease names to CSS cubic-bezier
const EASE_MAP: Record<string, string> = {
  "power2.out":   "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
  "power2.in":    "cubic-bezier(0.55, 0.055, 0.675, 0.19)",
  "power2.inOut": "cubic-bezier(0.455, 0.03, 0.515, 0.955)",
  "power3.out":   "cubic-bezier(0.215, 0.61, 0.355, 1)",
  "linear":       "linear",
  "ease":         "ease",
  "ease-out":     "ease-out",
};

const DASH = 6000; // large enough to cover any glyph outline

export default function StrokeText({
  text,
  strokeColor    = "#A78BFA",
  fillColor      = "#F8FAFC",
  strokeWidth    = 1.4,
  drawDuration   = 1.6,
  fillDelay      = 0.2,
  stagger        = 0.05,
  ease           = "power2.out",
  trigger        = "mount",
  fillMode       = "wipe",
  fontSize       = 128,
  fontWeight     = 800,
  letterSpacing  = -4,
  reverse        = false,
  repeat         = false,
  repeatDelay    = 3,
  className      = "",
}: StrokeTextProps) {
  const [mounted, setMounted] = useState(false);
  const [remountKey, setRemountKey] = useState(0);
  const [charData, setCharData] = useState<CharData[]>([]);
  const [viewW, setViewW]   = useState(800);
  const containerRef = useRef<HTMLDivElement>(null);

  const chars = useMemo(() => [...text], [text]);
  const cssEase      = EASE_MAP[ease] ?? "ease-out";
  const svgHeight    = fontSize * 1.4;
  const baseline     = fontSize * 1.05;
  // total stagger duration before fill starts
  const fillStart    = chars.length * stagger + fillDelay;

  // ── Measure characters on an offscreen canvas ──────────────────────
  useEffect(() => {
    const canvas = document.createElement("canvas");
    const ctx    = canvas.getContext("2d");
    if (!ctx) return;

    ctx.font = `${fontWeight} ${fontSize}px system-ui,-apple-system,sans-serif`;

    let x = 0;
    const data: CharData[] = [];

    for (const char of chars) {
      const m = ctx.measureText(char);
      // treat spaces with at least 0.3em width
      const w = char === " " ? fontSize * 0.3 : m.width;
      data.push({ char, x, width: w });
      x += w + letterSpacing;
    }

    const totalW = Math.max(x - letterSpacing, 100);
    setCharData(data);
    setViewW(totalW);
    setMounted(true);
  }, [text, fontSize, fontWeight, letterSpacing, chars]);

  // ── Trigger on mount ───────────────────────────────────────────────
  useEffect(() => {
    if (trigger !== "mount" || !mounted) return;
    // animations start via CSS `animation-fill-mode: both` + delay
  }, [trigger, mounted]);

  // ── Repeat logic ───────────────────────────────────────────────────
  useEffect(() => {
    if (!repeat || !mounted) return;
    const totalAnimTime = (fillStart + drawDuration * 0.85 + repeatDelay) * 1000;
    const interval = setInterval(() => {
      setRemountKey((prev) => prev + 1);
    }, totalAnimTime);
    return () => clearInterval(interval);
  }, [repeat, mounted, fillStart, drawDuration, repeatDelay]);

  // ── Keyframes injected once ────────────────────────────────────────
  const keyframes = `
    @keyframes stk-draw {
      from { stroke-dashoffset: ${DASH}; }
      to   { stroke-dashoffset: 0; }
    }
    @keyframes stk-wipe {
      from { clip-path: inset(0 100% 0 0); }
      to   { clip-path: inset(0 0%   0 0); }
    }
    @keyframes stk-fade {
      from { opacity: 0; }
      to   { opacity: 1; }
    }
  `;

  return (
    <div
      ref={containerRef}
      className={`w-full overflow-visible ${className}`}
      style={{ userSelect: "none" }}
      aria-label={text}
      role="img"
    >
      <svg
        key={remountKey}
        width="100%"
        viewBox={`0 0 ${viewW} ${svgHeight}`}
        preserveAspectRatio="xMidYMid meet"
        overflow="visible"
      >
        <style>{keyframes}</style>

        {/* ── STROKE LAYER ─ per character, staggered ── */}
        {charData.map(({ char, x }, i) => {
          const delay = reverse
            ? (chars.length - 1 - i) * stagger
            : i * stagger;

          return (
            <text
              key={`s-${i}`}
              x={x}
              y={baseline}
              fontSize={fontSize}
              fontWeight={fontWeight}
              fontFamily="system-ui,-apple-system,sans-serif"
              fill="transparent"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray={DASH}
              strokeDashoffset={DASH}
              style={{
                animation: mounted
                  ? `stk-draw ${drawDuration}s ${cssEase} ${delay}s both`
                  : "none",
              }}
            >
              {char}
            </text>
          );
        })}

        {/* ── FILL LAYER ─ same positions, wipe / fade reveal ── */}
        {charData.length > 0 && (
          <g
            style={
              fillMode === "wipe"
                ? {
                    clipPath: "inset(0 100% 0 0)",
                    animation: mounted
                      ? `stk-wipe ${drawDuration * 0.85}s ${cssEase} ${fillStart}s both`
                      : "none",
                  }
                : {
                    opacity: 0,
                    animation: mounted
                      ? `stk-fade ${drawDuration * 0.5}s ease-out ${fillStart}s both`
                      : "none",
                  }
            }
          >
            {charData.map(({ char, x }, i) => (
              <text
                key={`f-${i}`}
                x={x}
                y={baseline}
                fontSize={fontSize}
                fontWeight={fontWeight}
                fontFamily="system-ui,-apple-system,sans-serif"
                fill={fillColor}
              >
                {char}
              </text>
            ))}
          </g>
        )}
      </svg>
    </div>
  );
}
