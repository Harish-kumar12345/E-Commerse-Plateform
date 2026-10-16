'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  RotateCcw,
  Play,
  Pause,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  Layers,
  Sparkles,
  Info,
  CheckCircle2,
  Compass,
} from 'lucide-react';

interface Hotspot {
  id: string;
  title: string;
  subtitle: string;
  minAngle: number;
  maxAngle: number;
  baseX: number; // 0 to 1 percentage of canvas
  baseY: number; // 0 to 1 percentage of canvas
  specs: string[];
}

interface Interactive360ViewerProps {
  productTitle: string;
  productBrand: string;
  colorHex?: string;
  initialMode?: 'studio' | 'wireframe' | 'xray';
}

export function Interactive360Viewer({
  productTitle,
  productBrand,
  colorHex = '#1A1C23',
  initialMode = 'studio',
}: Interactive360ViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [angle, setAngle] = useState(45);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startAngle, setStartAngle] = useState(0);
  const [autoRotate, setAutoRotate] = useState(true);
  const [renderMode, setRenderMode] = useState<'studio' | 'wireframe' | 'xray'>(initialMode);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [activeHotspot, setActiveHotspot] = useState<Hotspot | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const hotspots: Hotspot[] = [
    {
      id: 'driver',
      title: '30mm Carbon Fiber Composite Dome',
      subtitle: 'Acoustic Transducer Unit',
      minAngle: 20,
      maxAngle: 120,
      baseX: 0.35,
      baseY: 0.45,
      specs: [
        'Frequency: 4 Hz - 40,000 Hz Hi-Res LDAC',
        'Edge damping for high-frequency clarity',
        'Direct gold-plated voice coil wiring',
      ],
    },
    {
      id: 'microphones',
      title: 'Beamforming AI Noise Sensing Array',
      subtitle: '4 Dual-Precision Transducers per ear',
      minAngle: 140,
      maxAngle: 240,
      baseX: 0.65,
      baseY: 0.52,
      specs: [
        'V1 + QN1 dual processing chips',
        'Automated barometric pressure optimizer',
        'AI deep neural network voice pickup',
      ],
    },
    {
      id: 'cushion',
      title: 'Ultra-Soft Protein Leather Cushion',
      subtitle: 'Zero-Pressure Ergonomic Fit',
      minAngle: 250,
      maxAngle: 350,
      baseX: 0.5,
      baseY: 0.62,
      specs: [
        'Shape-memory acoustic foam padding',
        'Stepless slider with silent dampeners',
        '250g featherlight chassis weight',
      ],
    },
  ];

  // Auto-rotation loop
  useEffect(() => {
    if (!autoRotate || isDragging) return;
    const interval = setInterval(() => {
      setAngle((prev) => (prev + 0.5) % 360);
    }, 30);
    return () => clearInterval(interval);
  }, [autoRotate, isDragging]);

  // Canvas drawing routine
  const drawScene = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const rad = (angle * Math.PI) / 180;

    // Clear background
    ctx.clearRect(0, 0, width, height);

    // Floor shadow ellipse
    ctx.save();
    const shadowGrad = ctx.createRadialGradient(
      width / 2,
      height * 0.82,
      20 * zoomLevel,
      width / 2,
      height * 0.82,
      140 * zoomLevel
    );
    shadowGrad.addColorStop(0, 'rgba(0, 0, 0, 0.6)');
    shadowGrad.addColorStop(0.5, 'rgba(0, 0, 0, 0.25)');
    shadowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = shadowGrad;
    ctx.beginPath();
    ctx.ellipse(width / 2, height * 0.82, 160 * zoomLevel, 38 * zoomLevel, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Center origin
    ctx.save();
    ctx.translate(width / 2, height * 0.48);
    ctx.scale(zoomLevel, zoomLevel);

    const cosA = Math.cos(rad);
    const sinA = Math.sin(rad);

    // Render 3D Model Representation
    if (renderMode === 'studio') {
      // 1. Headband Arch
      ctx.beginPath();
      ctx.arc(0, -50, 110, Math.PI * 0.9, Math.PI * 0.1, true);
      ctx.lineWidth = 18;
      const bandGrad = ctx.createLinearGradient(-100, -160, 100, -160);
      bandGrad.addColorStop(0, '#1E2330');
      bandGrad.addColorStop(0.5, '#333A4D');
      bandGrad.addColorStop(1, '#1A1D27');
      ctx.strokeStyle = bandGrad;
      ctx.lineCap = 'round';
      ctx.stroke();

      // Headband inner cushion
      ctx.beginPath();
      ctx.arc(0, -48, 102, Math.PI * 0.85, Math.PI * 0.15, true);
      ctx.lineWidth = 8;
      ctx.strokeStyle = '#0F1219';
      ctx.stroke();

      // Sliders & pivots
      const leftX = -95 * Math.cos(rad * 0.1);
      const rightX = 95 * Math.cos(rad * 0.1);

      // Left Ear Cup
      drawEarCup(ctx, leftX - 10 * sinA, 30, cosA, '#181A20', '#2B3242', '#F59E0B');

      // Right Ear Cup
      drawEarCup(ctx, rightX + 10 * sinA, 30, -cosA, '#14161C', '#222834', '#06B6D4');
    } else if (renderMode === 'wireframe') {
      // Cyber CAD Grid Matrix
      ctx.strokeStyle = '#06B6D4';
      ctx.lineWidth = 1.5;

      // Arc slices
      for (let i = 0; i < 6; i++) {
        ctx.beginPath();
        ctx.arc(0, -50 + i * 2, 106 + i * 2, Math.PI * 0.9, Math.PI * 0.1, true);
        ctx.stroke();
      }

      // Wireframe ear cups
      drawWireframeCup(ctx, -90, 30, cosA);
      drawWireframeCup(ctx, 90, 30, -cosA);

      // Coordinate axes
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.4)';
      ctx.beginPath();
      ctx.moveTo(-140, 90);
      ctx.lineTo(140, 90);
      ctx.stroke();
    } else if (renderMode === 'xray') {
      // Internal acoustic driver view
      ctx.strokeStyle = '#10B981';
      ctx.lineWidth = 1.5;

      // Transparent exterior shell
      ctx.fillStyle = 'rgba(6, 182, 212, 0.08)';
      ctx.beginPath();
      ctx.ellipse(-90, 30, 48, 75, rad * 0.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Visible internal neodymium magnet coil
      ctx.fillStyle = 'rgba(245, 158, 11, 0.4)';
      ctx.beginPath();
      ctx.arc(-90, 30, 24, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#F59E0B';
      ctx.stroke();

      // Internal circuit lines
      ctx.beginPath();
      ctx.moveTo(-90, 30);
      ctx.lineTo(-90, -10);
      ctx.lineTo(-70, -30);
      ctx.strokeStyle = '#34D399';
      ctx.stroke();

      // Right Cup X-Ray
      ctx.fillStyle = 'rgba(6, 182, 212, 0.08)';
      ctx.beginPath();
      ctx.ellipse(90, 30, 48, 75, -rad * 0.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = 'rgba(245, 158, 11, 0.4)';
      ctx.beginPath();
      ctx.arc(90, 30, 24, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#F59E0B';
      ctx.stroke();
    }

    ctx.restore();
  }, [angle, renderMode, zoomLevel]);

  // Ear Cup drawing helper with specular highlights
  const drawEarCup = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    depthOffset: number,
    baseColor: string,
    specularColor: string,
    accentColor: string
  ) => {
    ctx.save();
    ctx.translate(x, y);

    // Cup rotation tilt
    const tilt = depthOffset * 0.25;
    ctx.rotate(tilt);

    // Outer Cup Body
    ctx.beginPath();
    ctx.ellipse(0, 0, 48, 76, 0, 0, Math.PI * 2);
    const grad = ctx.createLinearGradient(-40, -60, 40, 60);
    grad.addColorStop(0, specularColor);
    grad.addColorStop(0.4, baseColor);
    grad.addColorStop(1, '#090A0F');
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = '#2A3040';
    ctx.stroke();

    // Metallic Rim Accent Ring
    ctx.beginPath();
    ctx.ellipse(0, 0, 42, 70, 0, 0, Math.PI * 2);
    ctx.strokeStyle = accentColor;
    ctx.lineWidth = 1.2;
    ctx.stroke();

    // Soft Leather Cushion Inner Cavity
    ctx.beginPath();
    ctx.ellipse(depthOffset * 6, 0, 28, 52, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#090A0E';
    ctx.fill();

    // Center Brand Logo / Acoustic Mesh
    ctx.beginPath();
    ctx.arc(depthOffset * 6, 0, 10, 0, Math.PI * 2);
    ctx.fillStyle = '#181C26';
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.restore();
  };

  const drawWireframeCup = (ctx: CanvasRenderingContext2D, x: number, y: number, depthOffset: number) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(depthOffset * 0.25);

    // Multiple wireframe concentric ellipses
    for (let r = 10; r <= 48; r += 8) {
      ctx.beginPath();
      ctx.ellipse(0, 0, r, (r / 48) * 76, 0, 0, Math.PI * 2);
      ctx.stroke();
    }
    // Radial spokes
    for (let a = 0; a < Math.PI * 2; a += Math.PI / 4) {
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(Math.cos(a) * 48, Math.sin(a) * 76);
      ctx.stroke();
    }
    ctx.restore();
  };

  useEffect(() => {
    drawScene();
  }, [drawScene]);

  // Resize listener
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current && canvasRef.current) {
        canvasRef.current.width = containerRef.current.clientWidth;
        canvasRef.current.height = Math.max(380, containerRef.current.clientHeight);
        drawScene();
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [drawScene]);

  // Drag interaction handlers
  const onMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.clientX);
    setStartAngle(angle);
    setAutoRotate(false);
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - startX;
    const newAngle = (startAngle + deltaX * 0.6 + 3600) % 360;
    setAngle(newAngle);
  };

  const onMouseUp = () => {
    setIsDragging(false);
  };

  // Touch support
  const onTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setStartX(e.touches[0].clientX);
      setStartAngle(angle);
      setAutoRotate(false);
    }
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    const deltaX = e.touches[0].clientX - startX;
    const newAngle = (startAngle + deltaX * 0.6 + 3600) % 360;
    setAngle(newAngle);
  };

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!isFullscreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  // Check visible hotspots based on angle
  const currentHotspots = hotspots.filter(
    (h) => angle >= h.minAngle && angle <= h.maxAngle
  );

  return (
    <div
      ref={containerRef}
      className={`relative w-full rounded-2xl bg-[#090A0F] border border-[#1F2433] overflow-hidden select-none shadow-2xl transition-all ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none' : 'min-h-[440px]'
      }`}
    >
      {/* Top HUD Bar */}
      <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2 pointer-events-auto">
          <div className="px-3 py-1 rounded-lg bg-[#12151E]/90 border border-[#1F2433] backdrop-blur-md text-[11px] font-mono text-cyan-400 flex items-center gap-2 shadow-lg">
            <Compass className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
            <span>AZIMUTH: {Math.round(angle)}°</span>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#12151E]/90 border border-[#1F2433] backdrop-blur-md text-[11px] font-medium text-slate-300 shadow-lg">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>STUDIO 360° ENGINE</span>
          </div>
        </div>

        {/* Render Mode Switcher */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-[#12151E]/90 border border-[#1F2433] backdrop-blur-md pointer-events-auto shadow-lg">
          <button
            onClick={() => setRenderMode('studio')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
              renderMode === 'studio'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Studio
          </button>
          <button
            onClick={() => setRenderMode('wireframe')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
              renderMode === 'wireframe'
                ? 'bg-cyan-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            CAD Wireframe
          </button>
          <button
            onClick={() => setRenderMode('xray')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
              renderMode === 'xray'
                ? 'bg-emerald-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Acoustic X-Ray
          </button>
        </div>
      </div>

      {/* Main HTML5 3D Canvas */}
      <canvas
        ref={canvasRef}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onMouseUp}
        className="w-full h-full block cursor-grab active:cursor-grabbing"
      />

      {/* Interactive Hotspot Buttons Overlay */}
      <div className="absolute inset-0 pointer-events-none">
        {currentHotspots.map((h) => (
          <div
            key={h.id}
            style={{
              left: `${h.baseX * 100}%`,
              top: `${h.baseY * 100}%`,
            }}
            className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto group"
          >
            <button
              onClick={() => setActiveHotspot(activeHotspot?.id === h.id ? null : h)}
              className="relative flex items-center justify-center w-8 h-8 rounded-full bg-cyan-500/20 border-2 border-cyan-400 text-cyan-300 shadow-lg shadow-cyan-500/50 hover:scale-110 active:scale-95 transition-transform"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping absolute" />
              <Sparkles className="w-3.5 h-3.5 text-cyan-200" />
            </button>

            {/* Hover Tooltip Preview */}
            <div className="absolute left-10 top-0 hidden sm:group-hover:flex flex-col bg-[#12151E] border border-cyan-500/40 rounded-xl p-3 w-56 shadow-2xl backdrop-blur-md z-30 pointer-events-none animate-in fade-in zoom-in-95">
              <span className="text-xs font-bold text-white">{h.title}</span>
              <span className="text-[10px] text-cyan-400 font-mono mt-0.5">{h.subtitle}</span>
              <span className="text-[10px] text-slate-400 mt-1">Click to view full acoustic specs</span>
            </div>
          </div>
        ))}
      </div>

      {/* Hotspot Drawer / Card Detail Modal */}
      {activeHotspot && (
        <div className="absolute bottom-16 left-4 right-4 sm:left-auto sm:right-4 sm:w-80 bg-[#12151E]/95 border border-cyan-500/50 rounded-2xl p-4 shadow-2xl backdrop-blur-md z-30 space-y-3 animate-in fade-in slide-in-from-bottom-4">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest block">
                {activeHotspot.subtitle}
              </span>
              <h4 className="text-sm font-bold text-white mt-0.5">{activeHotspot.title}</h4>
            </div>
            <button
              onClick={() => setActiveHotspot(null)}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              ✕
            </button>
          </div>

          <div className="space-y-1.5 pt-1 border-t border-[#1F2433]">
            {activeHotspot.specs.map((spec, idx) => (
              <div key={idx} className="flex items-center gap-2 text-xs text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                <span>{spec}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bottom Floating Control Center */}
      <div className="absolute bottom-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
        {/* Hint text */}
        <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400 bg-[#12151E]/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-[#1F2433]">
          <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
          <span>Click & drag horizontally to rotate 360°</span>
        </div>

        {/* Action button cluster */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#12151E]/90 border border-[#1F2433] backdrop-blur-md pointer-events-auto ml-auto shadow-xl">
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`p-2 rounded-lg text-xs transition-colors ${
              autoRotate ? 'text-amber-400 bg-amber-500/10' : 'text-slate-400 hover:text-white'
            }`}
            title={autoRotate ? 'Pause Rotation' : 'Auto Rotate'}
          >
            {autoRotate ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>

          <button
            onClick={() => setZoomLevel((prev) => Math.min(1.8, prev + 0.15))}
            className="p-2 rounded-lg text-slate-400 hover:text-white transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>

          <button
            onClick={() => setZoomLevel((prev) => Math.max(0.7, prev - 0.15))}
            className="p-2 rounded-lg text-slate-400 hover:text-white transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              setZoomLevel(1);
              setAngle(45);
            }}
            className="p-2 rounded-lg text-slate-400 hover:text-white transition-colors"
            title="Reset View"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-lg text-slate-400 hover:text-white transition-colors"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}
