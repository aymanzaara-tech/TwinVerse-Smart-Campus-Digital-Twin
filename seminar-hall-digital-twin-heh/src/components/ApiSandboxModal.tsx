import React, { useState } from 'react';
import { Check, Code2, Copy, Play, Terminal, X } from 'lucide-react';
import { sampleApiSnippet } from '../utils/digitalTwinApi';

interface ApiSandboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRunLightingTest: () => void;
  onRunSlideTest: () => void;
  onRunCameraTest: () => void;
}

export const ApiSandboxModal: React.FC<ApiSandboxModalProps> = ({
  isOpen,
  onClose,
  onRunLightingTest,
  onRunSlideTest,
  onRunCameraTest,
}) => {
  const [copied, setCopied] = useState(false);
  const [consoleLogs, setConsoleLogs] = useState<string[]>([
    '[INIT] DigitalTwinClient SDK initialized v2.4.0',
    '[READY] Connected to WebGL Scene Endpoint @ 60 FPS',
  ]);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(sampleApiSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const addLog = (msg: string) => {
    setConsoleLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-4xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-500/10 border border-indigo-500/30 rounded-2xl text-indigo-400">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">JavaScript / Web Digital Twin API Sandbox</h2>
              <p className="text-xs text-slate-400">
                Programmatic Web API & Interactive Command Execution Console
              </p>
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
        <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6 overflow-y-auto max-h-[75vh]">
          {/* Left: Sample SDK Code */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300">SDK Usage Example (JS / TS)</span>
              <button
                onClick={handleCopy}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium flex items-center gap-1.5 transition"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy SDK'}</span>
              </button>
            </div>
            <pre className="p-4 bg-slate-950 border border-slate-800 rounded-2xl font-mono text-[11px] text-indigo-200 overflow-x-auto max-h-[45vh] leading-relaxed">
              {sampleApiSnippet}
            </pre>
          </div>

          {/* Right: Live Execution Buttons & Console */}
          <div className="space-y-4">
            <span className="text-xs font-semibold text-slate-300 block">Test API Methods in Active Scene</span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                onClick={() => {
                  onRunLightingTest();
                  addLog('API CALL: hall.setLighting({ stageSpotlightsEnabled: true, spotlightColor: "#38bdf8" })');
                }}
                className="p-3 bg-indigo-950/60 hover:bg-indigo-900/80 border border-indigo-700/50 rounded-xl text-xs font-semibold text-indigo-300 flex items-center justify-center gap-2 transition"
              >
                <Play className="w-3.5 h-3.5 text-indigo-400" /> Test Spotlights
              </button>

              <button
                onClick={() => {
                  onRunSlideTest();
                  addLog('API CALL: hall.setSlide(nextIndex)');
                }}
                className="p-3 bg-purple-950/60 hover:bg-purple-900/80 border border-purple-700/50 rounded-xl text-xs font-semibold text-purple-300 flex items-center justify-center gap-2 transition"
              >
                <Play className="w-3.5 h-3.5 text-purple-400" /> Next Slide
              </button>

              <button
                onClick={() => {
                  onRunCameraTest();
                  addLog('API CALL: hall.moveCamera("podium")');
                }}
                className="p-3 bg-blue-950/60 hover:bg-blue-900/80 border border-blue-700/50 rounded-xl text-xs font-semibold text-blue-300 flex items-center justify-center gap-2 transition"
              >
                <Play className="w-3.5 h-3.5 text-blue-400" /> Focus Podium
              </button>
            </div>

            {/* Interactive Terminal Log */}
            <div className="space-y-1">
              <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-emerald-400" /> Real-time API Event Log
              </span>
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl font-mono text-[10px] text-emerald-400 space-y-1 h-44 overflow-y-auto">
                {consoleLogs.map((log, i) => (
                  <div key={i}>{log}</div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/60 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl text-xs transition"
          >
            Close Sandbox
          </button>
        </div>
      </div>
    </div>
  );
};
