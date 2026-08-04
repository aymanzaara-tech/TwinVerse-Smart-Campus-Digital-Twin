import React, { useEffect, useState } from 'react';
import { Activity, Gauge, HardDrive, ShieldCheck, Thermometer, Users, Volume2, Wind, X, Zap } from 'lucide-react';

export const TelemetryDashboard = ({ isOpen, onClose }) => {
  const [data, setData] = useState({
    occupancy: 48,
    maxCapacity: 144,
    temperature: 22.4,
    humidity: 48,
    co2Level: 455,
    noiseLevel: 42,
    powerUsage: 3.8,
    airQualityScore: 94,
  });

  // Simulated live sensor ticking
  useEffect(() => {
    if (!isOpen) return;

    const interval = setInterval(() => {
      setData((prev) => ({
        ...prev,
        temperature: Number((prev.temperature + (Math.random() * 0.2 - 0.1)).toFixed(1)),
        co2Level: Math.floor(prev.co2Level + (Math.random() * 6 - 3)),
        noiseLevel: Math.floor(Math.max(35, Math.min(85, prev.noiseLevel + (Math.random() * 4 - 2)))),
        powerUsage: Number((3.8 + Math.random() * 0.4 - 0.2).toFixed(2)),
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-3xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-emerald-400">
              <Zap className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                Seminar Hall IoT Telemetry
                <span className="px-2 py-0.5 text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-700/50 rounded-full font-mono">
                  LIVE SYNC
                </span>
              </h2>
              <p className="text-xs text-slate-400">Real-Time Spatial Sensor Metrics & Digital Twin Environmental Engine</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[80vh]">
          {/* Top Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Occupancy */}
            <div className="p-4 bg-slate-800/60 border border-slate-700/60 rounded-2xl space-y-2">
              <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
                <span>Occupancy Ratio</span>
                <Users className="w-4 h-4 text-blue-400" />
              </div>
              <div className="text-2xl font-bold text-white">
                {data.occupancy}
                <span className="text-xs text-slate-400 font-normal ml-1">/ {data.maxCapacity} Seats</span>
              </div>
              <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-blue-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${(data.occupancy / data.maxCapacity) * 100}%` }}
                />
              </div>
            </div>

            {/* Temperature */}
            <div className="p-4 bg-slate-800/60 border border-slate-700/60 rounded-2xl space-y-2">
              <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
                <span>Room Temperature</span>
                <Thermometer className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-2xl font-bold text-white">
                {data.temperature} <span className="text-sm font-normal text-slate-400">°C</span>
              </div>
              <p className="text-[10px] text-emerald-400 flex items-center gap-1 font-medium">
                <ShieldCheck className="w-3 h-3" /> Optimal Comfort Range
              </p>
            </div>

            {/* CO2 Air Quality */}
            <div className="p-4 bg-slate-800/60 border border-slate-700/60 rounded-2xl space-y-2">
              <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
                <span>CO2 Level</span>
                <Wind className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl font-bold text-white">
                {data.co2Level} <span className="text-sm font-normal text-slate-400">PPM</span>
              </div>
              <p className="text-[10px] text-emerald-400 font-medium">Score: {data.airQualityScore}/100 (Fresh Air)</p>
            </div>

            {/* Sound Level */}
            <div className="p-4 bg-slate-800/60 border border-slate-700/60 rounded-2xl space-y-2">
              <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
                <span>Acoustic Noise</span>
                <Volume2 className="w-4 h-4 text-purple-400" />
              </div>
              <div className="text-2xl font-bold text-white">
                {data.noiseLevel} <span className="text-sm font-normal text-slate-400">dB</span>
              </div>
              <p className="text-[10px] text-purple-300 font-medium">Auditorium Ambient Ambient</p>
            </div>
          </div>

          {/* Detailed Power & HVAC Panel */}
          <div className="p-5 bg-slate-800/40 border border-slate-700/50 rounded-2xl space-y-4">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-400" /> Energy & Lighting Power Grid
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 space-y-1">
                <span className="text-slate-400">Current Load</span>
                <div className="text-lg font-bold text-white">{data.powerUsage} kW</div>
              </div>

              <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 space-y-1">
                <span className="text-slate-400">Stage Lighting Draw</span>
                <div className="text-lg font-bold text-amber-400">1.20 kW</div>
              </div>

              <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 space-y-1">
                <span className="text-slate-400">HVAC Ventilation</span>
                <div className="text-lg font-bold text-cyan-400">2.60 kW</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/60 flex justify-between items-center text-xs text-slate-400">
          <span>Telemetry Protocol: MQTT over WebSockets | Sensor Node ID: TH-2026-HALL</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl transition"
          >
            Close Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};
