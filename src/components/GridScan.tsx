"use client";

import React, { useEffect, useRef, useCallback } from "react";

interface GridScanProps {
  sensitivity?: number;
  lineThickness?: number;
  linesColor?: string;
  gridScale?: number;
  scanColor?: string;
  scanOpacity?: number;
  enablePost?: boolean;
  bloomIntensity?: number;
  chromaticAberration?: number;
  noiseIntensity?: number;
  lineJitter?: number;
  scanGlow?: number;
  scanSoftness?: number;
  enableWebcam?: boolean;
  showPreview?: boolean;
  className?: string;
}

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ];
}

export default function GridScan({
  lineThickness = 1,
  linesColor = "#2F293A",
  gridScale = 0.1,
  scanColor = "#FF9FFC",
  scanOpacity = 0.4,
  enablePost = true,
  bloomIntensity = 0.6,
  chromaticAberration = 0.002,
  noiseIntensity = 0.01,
  lineJitter = 0.1,
  scanGlow = 0.5,
  scanSoftness = 2,
  className = "",
}: GridScanProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const startRef = useRef<number>(0);
  // Pre-built noise canvas (rebuilt on resize, not every frame)
  const noiseCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const noiseFrameRef = useRef<number>(0);

  const buildNoise = useCallback((w: number, h: number) => {
    const nc = document.createElement("canvas");
    nc.width = w;
    nc.height = h;
    const nctx = nc.getContext("2d");
    if (!nctx) return nc;
    const imgData = nctx.createImageData(w, h);
    const data = imgData.data;
    const amp = noiseIntensity * 255 * 6;
    for (let i = 0; i < data.length; i += 4) {
      const n = (Math.random() - 0.5) * amp;
      data[i] = 128 + n;
      data[i + 1] = 128 + n;
      data[i + 2] = 128 + n;
      data[i + 3] = Math.abs(n) * 1.5;
    }
    nctx.putImageData(imgData, 0, 0);
    noiseCanvasRef.current = nc;
    return nc;
  }, [noiseIntensity]);

  const draw = useCallback((timestamp: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (!startRef.current) startRef.current = timestamp;
    const elapsed = (timestamp - startRef.current) * 0.001; // seconds

    const { width, height } = canvas;

    // --- Clear ---
    ctx.clearRect(0, 0, width, height);

    // --- Grid ---
    const cellSize = Math.max(20, Math.round(Math.min(width, height) * gridScale * 10));
    const [lr, lg, lb] = hexToRgb(linesColor);

    ctx.globalAlpha = 1;
    ctx.strokeStyle = `rgb(${lr},${lg},${lb})`;
    ctx.lineWidth = lineThickness;

    for (let x = 0; x <= width; x += cellSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y <= height; y += cellSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // --- Scan line position ---
    const scanY = ((elapsed * 0.35) % 1) * height;

    // Jitter: slight vertical wobble along X axis
    const jitter = lineJitter * 3 * Math.sin(elapsed * 18);

    const [sr, sg, sb] = hexToRgb(scanColor);

    // --- Glow zone (soft gradient before/after scan) ---
    const softH = scanSoftness * 60;
    const glowGrad = ctx.createLinearGradient(0, scanY - softH, 0, scanY + softH);
    glowGrad.addColorStop(0,    `rgba(${sr},${sg},${sb},0)`);
    glowGrad.addColorStop(0.35, `rgba(${sr},${sg},${sb},${scanOpacity * 0.15})`);
    glowGrad.addColorStop(0.5,  `rgba(${sr},${sg},${sb},${scanOpacity * 0.5})`);
    glowGrad.addColorStop(0.65, `rgba(${sr},${sg},${sb},${scanOpacity * 0.15})`);
    glowGrad.addColorStop(1,    `rgba(${sr},${sg},${sb},0)`);
    ctx.fillStyle = glowGrad;
    ctx.globalAlpha = 1;
    ctx.fillRect(0, scanY - softH, width, softH * 2);

    // --- Bloom layers ---
    if (enablePost && bloomIntensity > 0) {
      const layers = Math.ceil(bloomIntensity * 4);
      for (let i = layers; i >= 1; i--) {
        const blur = i * scanGlow * 12;
        const a = (scanOpacity * bloomIntensity * 0.3) * (1 - i / (layers + 1));
        ctx.shadowBlur = blur;
        ctx.shadowColor = scanColor;
        ctx.strokeStyle = `rgba(${sr},${sg},${sb},${a})`;
        ctx.lineWidth = lineThickness * (1 + i * 0.5);
        ctx.globalAlpha = 1;
        ctx.beginPath();
        ctx.moveTo(0, scanY + jitter);
        ctx.lineTo(width, scanY - jitter);
        ctx.stroke();
      }
      ctx.shadowBlur = 0;
    }

    // --- Main scan line ---
    ctx.shadowBlur = enablePost ? scanGlow * 22 : 0;
    ctx.shadowColor = scanColor;
    ctx.strokeStyle = scanColor;
    ctx.lineWidth = lineThickness * 1.5;
    ctx.globalAlpha = scanOpacity;
    ctx.beginPath();
    ctx.moveTo(0, scanY + jitter);
    ctx.lineTo(width, scanY - jitter);
    ctx.stroke();
    ctx.shadowBlur = 0;

    // --- Chromatic aberration ---
    if (enablePost && chromaticAberration > 0) {
      const ca = chromaticAberration * width * 1.5;
      ctx.lineWidth = lineThickness;

      ctx.globalAlpha = scanOpacity * 0.45;
      ctx.strokeStyle = `rgba(255,80,80,0.9)`;
      ctx.beginPath();
      ctx.moveTo(0, scanY + jitter + ca);
      ctx.lineTo(width, scanY - jitter + ca);
      ctx.stroke();

      ctx.strokeStyle = `rgba(80,120,255,0.9)`;
      ctx.beginPath();
      ctx.moveTo(0, scanY + jitter - ca);
      ctx.lineTo(width, scanY - jitter - ca);
      ctx.stroke();
    }

    ctx.globalAlpha = 1;

    // --- Noise (refresh every 2 frames for perf) ---
    if (enablePost && noiseIntensity > 0) {
      noiseFrameRef.current++;
      if (noiseFrameRef.current % 2 === 0 || !noiseCanvasRef.current) {
        buildNoise(width, height);
      }
      if (noiseCanvasRef.current) {
        ctx.globalAlpha = noiseIntensity * 3;
        ctx.drawImage(noiseCanvasRef.current, 0, 0);
        ctx.globalAlpha = 1;
      }
    }

    rafRef.current = requestAnimationFrame(draw);
  }, [
    linesColor, lineThickness, gridScale, scanColor, scanOpacity,
    enablePost, bloomIntensity, chromaticAberration, noiseIntensity,
    lineJitter, scanGlow, scanSoftness, buildNoise,
  ]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const parent = canvas.parentElement;

    const applySize = () => {
      const rect = (parent ?? canvas).getBoundingClientRect();
      const w = Math.round(rect.width) || 800;
      const h = Math.round(rect.height) || 600;
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        buildNoise(w, h);
      }
    };

    const ro = new ResizeObserver(() => requestAnimationFrame(applySize));
    ro.observe(parent ?? canvas);
    requestAnimationFrame(() => {
      applySize();
      startRef.current = 0;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(draw);
    });

    return () => {
      ro.disconnect();
      cancelAnimationFrame(rafRef.current);
    };
  }, [draw, buildNoise]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`block w-full h-full ${className}`}
    />
  );
}
