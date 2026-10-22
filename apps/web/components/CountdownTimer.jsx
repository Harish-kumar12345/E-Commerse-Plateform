'use client';

import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';






export function CountdownTimer({ variant = 'card', className = '' }) {
  const [timeLeft, setTimeLeft] = useState



({ hours: 14, minutes: 22, seconds: 45 });

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);

    function calculateTimeUntilMidnight() {
      const now = new Date();
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);

      const diff = Math.max(0, endOfDay.getTime() - now.getTime());
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      return { hours, minutes, seconds };
    }

    // Set initial real-time difference
    setTimeLeft(calculateTimeUntilMidnight());

    // Tick every 1 second
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeUntilMidnight());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formattedHours = String(timeLeft.hours).padStart(2, '0');
  const formattedMinutes = String(timeLeft.minutes).padStart(2, '0');
  const formattedSeconds = String(timeLeft.seconds).padStart(2, '0');

  // Variant 1: Card view for /deals banner
  if (variant === 'card') {
    return (
      <div className={`p-4 rounded-2xl bg-[#0D1017] border border-[#23293B] space-y-1 text-center min-w-[200px] shadow-lg shadow-black/40 ${className}`}>
        <span className="text-[11px] text-slate-400 flex items-center justify-center gap-1.5 font-medium">
          <Clock className="w-3.5 h-3.5 text-amber-400 animate-spin-slow" /> Sale Ends In:
        </span>
        <div className="flex items-center justify-center gap-1 font-mono text-xl font-extrabold text-amber-400 tracking-wider">
          <span>{isClient ? formattedHours : '14'}h</span>
          <span className="text-amber-500/70 animate-pulse">:</span>
          <span>{isClient ? formattedMinutes : '22'}m</span>
          <span className="text-amber-500/70 animate-pulse">:</span>
          <span className="text-amber-300">{isClient ? formattedSeconds : '45'}s</span>
        </div>
      </div>
    );
  }

  // Variant 2: Badge view for Home page banner
  if (variant === 'badge') {
    return (
      <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700/80 text-xs text-slate-300 font-mono shadow-sm ${className}`}>
        <span className="text-slate-500 flex items-center gap-1">
          <Clock className="w-3 h-3 text-amber-400" />
          Ends in:
        </span>
        <span className="text-amber-400 font-bold">
          {isClient ? formattedHours : '14'}h : {isClient ? formattedMinutes : '22'}m : {isClient ? formattedSeconds : '45'}s
        </span>
      </div>
    );
  }

  // Variant 3: Inline view
  return (
    <span className={`font-mono text-amber-400 font-bold ${className}`}>
      {isClient ? formattedHours : '14'}h : {isClient ? formattedMinutes : '22'}m : {isClient ? formattedSeconds : '45'}s
    </span>
  );
}
